import {action, debug, develop, IRouter} from "../../nnt/core/router";
import {RechargeRecord, TestOrder} from "../model/shop";
import {Trans} from "../server/trans";
import {Null, STATUS} from "../../nnt/core/models";
import {Insert, Update} from "../../nnt/manager/dbmss";
import {Delta, Item} from "../model/item";
import {User} from "./user";
import {configs} from "../model/xlsconfigs";
import {DateTime} from "../../nnt/core/time";
import {Call} from "../../nnt/manager/servers";
import {static_cast} from "../../nnt/core/core";
import {Api} from "../server/api";
import {CompletePay, SdkPayOrderId} from "../../nnt/sdk/msdk";
import {logger} from "../../nnt/core/logger";
import {ItemRecordType} from "../model/user";

export class Shop implements IRouter {
    action = "shop";

    // 调试充值价格，1分钱
    debugPrice = false;

    @action(RechargeRecord, [], "货币充值后直接用")
    async recharge(trans: Trans) {
        let m: RechargeRecord = trans.model;
        let cur = trans.current;
        let srv = static_cast<Api>(trans.server);
        // let sp = Support.Agent(trans.info.agent);

        // let item: Item;
        // if (sp.pay.inapp.apple) {
        //     let cfg = configs.Pay.Get(m.index);
        //     m.price = cfg.price * 100;
        //     item = Item.FromCfg(cfg.itemCount);
        //     m.prodid = cfg.productID;
        // }
        // else {
        //     let cfg = configs.Recharge.Get(m.index);
        //     m.price = cfg.price * 100;
        //     // 上线时需要屏蔽1分钱的价格
        //     if (this.debugPrice)
        //         m.price = 1;
        //     item = Item.FromCfg(cfg.itemCount);
        // }

        if (this.debugPrice) {
            m.price = 1;
        }

        m.time = DateTime.Current();
        m.pid = cur.pid;
        m.type = "recharge";

        // 请求sdk生成订单号
        let t = await Call(srv.sdksrv, "sdk.payorderid", trans.params);
        if (t.status != STATUS.OK) {
            logger.warn("获取订单号失败");
            trans.status = t.status;
            trans.submit();
            return;
        }

        m.orderid = (<SdkPayOrderId>t.model).orderid;
        // m.desc = "充值" + item.name + "共" + item.count + "个";

        m.desc = `发红包，金额:${m.price}`
        // 保存，然后让客户端使用sdk提交支付
        await Insert(RechargeRecord, m);

        trans.submit();
    }

    @action(Null, [], "支付成功回调")
    async done(trans: Trans) {
        let srv = static_cast<Api>(trans.server);
        let t = await Call(srv.sdksrv, "sdk.completepay", trans.params);
        if (t.status != STATUS.OK) {
            trans.status = t.status;
            trans.submit();
            return;
        }

        let m: CompletePay = t.model;

        // 处理充值
        this.doCompleteRecharge(m.orderid);

        // 回应外部
        if (m.respn)
            trans.output(m.respn.contentType, m.respn.content);
        else
            trans.submit();
    }


    protected async doCompleteRecharge(orderid: string) {
        let rcd = await Update(RechargeRecord, null, [{
            orderid: orderid,
            close: {$ne: true}
        }, {$set: {close: true}}]);
        if (!rcd)
            return;

        let ui = await User.FindUserInfo(rcd.pid);
        let delta = Delta.Item(Item.FromIndex(configs.Item.MONEY)).record(ItemRecordType.BUY);

        // 修改充值次数和金额
        delta.addkv(configs.Item.MONEY, rcd.price);

        // 添加到背包，并发出消息，客户端会自己调用userinfo来刷新
        User.ApplyDelta(ui, delta.record(ItemRecordType.BUY));

        // 发送到账消息
        // Msg.SysChat({
        //     from: mid_str(SYSTEM, DOMAIN_USERS),
        //     to: mid_str(ui.pid, DOMAIN_USERS),
        //     type: ImMsgType.CHAT,
        //     payload: new ImChatMsg(ImMsgSubType.PAY_DONE)
        // });

        //到账消息通过websocket通知。。

        logger.info("用户 " + ui.pid + " 订单 " + orderid + " 到账");
    }

    @action(TestOrder, [debug, develop], "测试收单")
    testpay(trans: Trans) {
        let m: TestOrder = trans.model;
        this.doCompleteRecharge(m.orderid);
        trans.submit();
    }
}