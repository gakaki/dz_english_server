import url = require("url");
import {Channel} from "../../channel";
import {RegisterChannel, Sdk} from "../../sdk";
import {
    AsyncArray, getServerIp, IndexedObject, make_tuple, ObjectT, StringT, toJson,
    toJsonObject
} from "../../../core/kernel";
import {
    Auth, CompletePay, Environment, GetRemoteMedia, Info, Login, Pay, PayMethod, SdkUserInfo, Share, Support,
    Withdraw
} from "../../msdk";
import {Fast} from "../../../component/encode";
import {AuthType, WechatGetWxaCode, WechatRefreshToken, WechatToken, WechatUserProfile, WxminiappToken} from "./model";
import {RestSession} from "../../../session/rest";
import {DateTime} from "../../../core/time";
import {Insert, Query, Update} from "../../../manager/dbmss";
import {GetInnerId, Output} from "../../../store/proto";
import {Call} from "../../../manager/servers";
import {NonceAlDig} from "../../../component/nonce";
import {Format, StringDigest} from "../../../core/string";
import {Transaction} from "../../../server/transaction";
import {WechatPayResult, WechatUnifiedOrder, WxappPaytoUser} from "./paymodel";
import {Decode, Encode, Output as ApiOutput} from "../../../core/proto";
import {STATUS} from "../../../core/models";
import {logger} from "../../../core/logger";
import {MediaSupport} from "../../../server/mediastore";
import {S2SWechatTicket, S2SWechatToken} from "./s2smodel";
import {ACROOT} from "../../../acl/acl";
import {MinAppShare} from "../../../../app/model/user";
import * as fs from "fs";
import {User} from "../../../../app/router/user";
import xml = require("xmlbuilder");
import xml2js = require("xml2js");
import request = require("request");
import moment = require("moment");
import * as https from "https";




export class WxMiniApp extends Channel {


    constructor(sdk: Sdk) {
        super(sdk);
    }

    config(c: IndexedObject): boolean {
        if (!c.appid ||
            !c.appsecret)
            return false;

        this.appid = c.appid;
        this.appsecret = c.appsecret;
        this.pubid = c.pubid;
        this.pubsecret = c.pubsecret;
        this.pubmchid = c.pubmchid;
        this.pubkey = c.pubkey;
        this.payid = c.payid;
        this.paykey = c.paykey;
        this.paymchid = c.paymchid;
        this.noticeurl = c.noticeurl;
        return true;
    }

    // 小程序申请的
    appid: string;
    appsecret: string;

    // 公众号参数申请的
    pubid: string;
    pubsecret: string;
    pubmchid: string;
    pubkey: string;

    // 支付相关
    payid: string;
    paykey: string;
    paymchid: string;
    noticeurl: string; // 支付成功后的回调地址

    // 加密
    private _fast = new Fast("ljre39&*");

    // 获得token
    protected async doReqToken(authcode: string, appid: string, appsecret: string, authtype: AuthType): Promise<WxminiappToken> {
        logger.log("微信小程序：用户授权通过，获取 token");

        let m = new WxminiappToken();
        m.authcode = authcode;
        m.appid = appid;
        m.appsecret = appsecret;

        m = await RestSession.Get(m);

        if (!m) {
            logger.log("微信小程序：用户授权通过，获取 token 失败");
            return null;
        }

        // 保存token
        await Update(make_tuple(this._sdk.dbsrv, WxminiappToken),
            null,
            [{unionid: m.unionid},
                {$set: Output(m)},
                {upsert: true}]);
        return m;
    }

    // 获得玩家信息
    protected async doReqProfile(access: string, openid: string): Promise<WechatUserProfile> {
        logger.log("微信：获取用户信息 " + openid);
        let m = new WechatUserProfile();
        m.access_token = access;
        m.openid = openid;
        m = await RestSession.Get(m);
        if (!m) {
            logger.log("微信：获取用户信息 " + openid + " 失败");
            return null;
        }

        // 添加到微信用户数据表
        Update(make_tuple(this._sdk.dbsrv, WechatUserProfile),
            null,
            [{unionid: m.unionid},
                {$set: Output(m)},
                {upsert: true}]);

        // 使用图片服务器抓取头像
        let t = await Call(this._sdk.imgsrv, "imagestore.download", {
            source: m.headimgurl
        });

        // 转换成sdk
        let ui = new SdkUserInfo();
        ui.channel = "wechat";
        ui.userid = m.unionid;
        ui.deviceid = m.openid;
        ui.nickname = m.nickname;
        ui.sex = m.sex;
        ui.avatar = t.model.path;
        m.info = ui;
        return m;
    }

    async doInfo(m: Info, sp: Support): Promise<void> {
        // 判断微信第二次刷新页面需要处理code等数据
        if (m.url) {
            let q = <IndexedObject>url.parse(m.url, true).query;
            let code = q["code"];
            let state = q["state"];
            if (code && state) {
                let obj: any = this._fast.decode(state);
                obj = toJsonObject(obj);
                if (obj) {
                    if (obj.wechat)
                        m.payload.wechatcode = code;
                    m.payload.login = obj.login;
                }
            }
        }
    }

    async doAuth(m: Auth): Promise<Auth> {
        //小程序里先通过sdk.auth传入code,然后此处生成uid，小程序用uid调用user.login(带回uid和微信用户信息），
        //之后在router/user.ts的login里完成登录、注册或更新用户信息、返回sid；
        //下次登录直接用sid登录，sid会自动续期

        logger.info("我要进行微信授权登陆");


        if (m.payload && m.payload.code) {
            let authcode = m.payload.code;
            let appid = this.appid.trim();
            let appsec = this.appsecret.trim();
            let authtype = AuthType.MINI;

            // 请求token
            let lg = await this.doReqToken(authcode, appid, appsec, authtype);

            if (lg) {
                // 请求个人信息
                // let pf = await this.doReqProfile(lg.session_key, lg.openid);
                // if (pf) {
                //     // 插入到数据库中
                //     let r = await Update(make_tuple(this._sdk.dbsrv, SdkUserInfo), null, [
                //         // 从openid修改成unionid
                //         {oid: lg.unionid},
                //         {$set: pf.info},
                //         {upsert: true}]);
                //     m.uid = GetInnerId(r);
                //     return true;
                // }

                //暂时用空信息，后面根据客户端汇报的信息再更新进来
                // 插入到数据库中
                let r = await Update(make_tuple(this._sdk.dbsrv, SdkUserInfo), null, [
                    // 从openid修改成unionid
                    {userid: lg.openid},
                    {$set: {deviceid: lg.unionid,userid:lg.openid}},
                    {upsert: true}]);
                m.uid =lg.openid;//直接使用openid
                return m;
            }
            // 否则走重新授权的流程

        }

        return m;
    }

    async doLogin(m: Login, ui: SdkUserInfo): Promise<boolean> {
        return true;
    }

    async doCheckExpire(ui: SdkUserInfo): Promise<boolean> {
        let rcd = await Query(make_tuple(this._sdk.dbsrv, WechatToken), {
            unionid: ui.userid,
            openid: ui.deviceid,
            expiretime: {$gt: DateTime.Now() + DateTime.MINUTE_5}
        });
        if (!rcd) {
            logger.log("微信：" + ui.userid + " 授权过期");
            return false;
        }
        return true;
    }

    async doRenewal(ui: SdkUserInfo): Promise<boolean> {
        let rcd = await Query(make_tuple(this._sdk.dbsrv, WechatToken), {
            unionid: ui.userid,
            openid: ui.deviceid
        });
        if (!rcd)
            return false;
        let token = await this.renewalToken(rcd);
        return token != null;
    }

    protected async renewalToken(rcd: WechatToken): Promise<WechatToken> {
        logger.log("微信：" + rcd.unionid + " 刷新 accesstoken");
        let m = new WechatRefreshToken();
        m.appid = this.getAppid(rcd.authtype);
        m.refresh_token = rcd.refresh_token;
        m = await RestSession.Get(m);
        if (!m) {
            logger.log("微信：" + rcd.unionid + " 刷新 accesstoken 失败");
            return null;
        }
        rcd.access_token = m.access_token;
        rcd.refresh_token = m.refresh_token;
        rcd.openid = m.openid;
        rcd.expires_in = m.expires_in;
        rcd.scope = m.scope;
        rcd.scopes = m.scope.split(",");
        rcd.accesstime = DateTime.Current() + m.expires_in;
        return Update(make_tuple(this._sdk.dbsrv, WechatToken), GetInnerId(rcd), {$set: Output(rcd)});
    }

    protected async renewalS2SToken(appid: string, appsecret: string): Promise<S2SWechatToken> {
        logger.log("微信：" + appid + " 刷新服务端 accesstoken");
        let m = new S2SWechatToken();
        m.appid = appid;
        m.appsecret = appsecret;
        m = await RestSession.Get(m);
        if (!m) {
            logger.log("微信：" + appid + " 刷新服务端 accesstoken 失败");
            return null;
        }
        return Update(make_tuple(this._sdk.dbsrv, S2SWechatToken), null, [{
            appid: appid
        }, {
            $set: {
                access_token: m.access_token,
                accesstime: DateTime.Current() + m.expires_in
            }
        }, {upsert: true}]);
    }

    // 获得可用的accesstoken
    async doGetAccessToken(userid: string, deviceid: string): Promise<string> {
        logger.log("微信：" + userid + " 查找 accesstoken");
        let tk = await Query(make_tuple(this._sdk.dbsrv, WechatToken), {
            unionid: userid,
            openid: deviceid
        });
        if (!tk) {
            logger.log("微信：" + userid + " 查找 accesstoken 失败");
            return null;
        }
        if (tk.accesstime >= DateTime.Current() + DateTime.MINUTE)
            return tk.access_token;
        tk = await this.renewalToken(tk);
        return tk ? tk.access_token : null;
    }

    // 获取服务端的accesstoken
    async doGetS2SAccessToken(appid: string, appsecret: string): Promise<string> {
        logger.log("微信：" + appid + " 查找服务端 accesstoken");
        let tk = await Query(make_tuple(this._sdk.dbsrv, S2SWechatToken), {
            appid: appid
        });
        if (!tk) {
            // 刷新token
            tk = await this.renewalS2SToken(appid, appsecret);
            if (!tk) {
                logger.log("微信：" + appid + " 查找服务端 accesstoken 失败");
                return null;
            }
        }
        if (tk.accesstime >= DateTime.Current() + DateTime.MINUTE)
            return tk.access_token;
        logger.log("微信：" + appid + "服务端 accesstoken 过期");
        tk = await this.renewalS2SToken(appid, appsecret);
        return tk ? tk.access_token : null;
    }

    // 保证可用
    async doGetTicket(appid: string, appsecret: string): Promise<S2SWechatTicket> {
        logger.log("微信：" + appid + " 请求 ticket");
        let type = "jsapi";
        let rcd = await Query(make_tuple(this._sdk.dbsrv, S2SWechatTicket), {
            appid: appid,
            type: type,
            expiretime: {$gt: DateTime.Now()}
        });
        if (rcd)
            return rcd;

        // 重新请求ticket
        let accesstoken = await this.doGetS2SAccessToken(appid, appsecret);
        if (!accesstoken)
            return null;

        // 需要重新请求
        let m = new S2SWechatTicket();
        m.access_token = accesstoken;
        m.type = type;
        m = await RestSession.Get(m);
        if (!m) {
            logger.log("微信：" + appid + " 请求服务端 ticket 失败");
            return null;
        }
        m.expiretime = DateTime.Current() + m.expires_in;
        m.appid = appid;
        await Update(make_tuple(this._sdk.dbsrv, S2SWechatTicket), null, [{
            appid: appid,
            type: type
        }, {$set: Output(m)},
            {upsert: true}]);
        return m;
    }

    async doEnvironment(env: Environment, ui?: SdkUserInfo): Promise<boolean> {
        // 初始化jssdk的配置参数
        let cfg = await this.doMakeJSAPIConfig(env);
        if (!cfg)
            return false;
        env.payload.wechat_jsapicfg = cfg;
        return true;
    }

    // https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115
    protected async doMakeJSAPIConfig(env: Environment): Promise<IndexedObject> {
        let ticket = await this.doGetTicket(
            this.getAppid(AuthType.PUB),
            this.getAppSecret(AuthType.PUB)
        );
        if (!ticket)
            return null;

        let r: IndexedObject = {
            debug: false,
            appId: this.pubid,
            timestamp: DateTime.Current(),
            nonceStr: NonceAlDig(10),
            jsApiList: WECHAT_JSAPIS
        };

        let ps: IndexedObject = {};
        ps.jsapi_ticket = ticket.ticket;
        ps.timestamp = r.timestamp;
        ps.noncestr = r.nonceStr;

        // 参与签名的字段包括有效的 jsapi_ticket（获取方式详见微信 JSSDK 文档）， noncestr （随机字符串，由开发者随机生成），timestamp （由开发者生成的当前时间戳）， url（当前网页的URL，不包含#及其后面部分。注意：对于没有只有域名没有 path 的 URL ，浏览器会自动加上 / 作为 path，如打开 http://qq.com 则获取到的 URL 为 http://qq.com/
        ps.url = StringT.Split(env.href, "#")[0];

        // 合并成字符串用来加密
        let strs = new Array();
        let map = ObjectT.ToMap(ps);
        map.forEach((v, k) => {
            strs.push(k + "=" + v);
        });

        let plain = strs.join("&");
        r.signature = StringDigest.SHA1(plain, Format.HEX);

        logger.log("微信：JSAPI配置参数 " + toJson(r) + " 签名原文 " + plain);
        return r;
    }

    async doShare(sa: Share, ui: SdkUserInfo): Promise<boolean> {
        // 如果是ICON分享，则需要返回初始化微信分享用的数据
        return true;
    }

    async doMinAppShare(m: MinAppShare): Promise<any> {
       let accessToken=await this.doGetS2SAccessToken( this.getAppid(AuthType.MINI), this.getAppSecret(AuthType.MINI));
        let wechatGetWxaCode:WechatGetWxaCode= new WechatGetWxaCode();
        wechatGetWxaCode.accessToken=accessToken;
        wechatGetWxaCode.scene=m.scene;
        wechatGetWxaCode.page=m.page;
        wechatGetWxaCode.width=m.width;
        console.log("准备发请求了");
        console.log(wechatGetWxaCode);
        let result = await RestSession.Get(wechatGetWxaCode);
        console.log("返回值");
        console.log(result.reqBodyBytes);
        let localData=new Date().toLocaleDateString();
        let rootPath="./minAPPShare/";
        let firstPth=rootPath+m.uid+"/";
        let secondPath=firstPth+localData+"/";
        try{
            if(!await fs.existsSync(rootPath)){
                await fs.mkdirSync(rootPath);
            }
            if(!await fs.existsSync(firstPth)){
                await fs.mkdirSync(firstPth);
            }
            if(!await fs.existsSync(secondPath)){
                //每日首次分享

                await fs.mkdirSync(secondPath);
            }
            let fileName=new Date().getTime()+".jpg";
            await fs.writeFileSync(secondPath+fileName, result);
            m.url =secondPath;
            m.fileName=fileName;
            console.log("文件路径");
            console.log(secondPath);
            console.log("文件名字");
            console.log(fileName);
        }catch (err){
            logger.warn("文件或二维码创建失败"+err);
        }

        return m;
    }

    async doPay(m: Pay, ui: SdkUserInfo, trans: Transaction): Promise<boolean> {
        let wuo = new WechatUnifiedOrder();
        wuo.nonce_str = NonceAlDig(10);

        //wuo.sign
        wuo.body = m.desc;
        wuo.out_trade_no = m.orderid;
        wuo.total_fee = m.price; // 正式的价格
        wuo.time_start=moment(new Date()).format("YYYYMMDDHHMMSS");
        console.log("价格");
        console.log(m.price);
        // wuo.spbill_create_ip = trans.info.addr;
        wuo.spbill_create_ip = m.IP;
        if(!m.IP){
            wuo.spbill_create_ip = trans.info.addr;
        }

        wuo.notify_url = this.noticeurl + "/method/" + m.method + "/channel/wxminiapp"; // 会变成参数传递给completePay接口，用来判断是哪个渠道发来的回调

        if (m.method == PayMethod.WECHAT_PUB) {
            wuo.appid = this.pubid;
            wuo.mch_id = this.pubmchid;
            wuo.signkey = this.pubkey;
            wuo.openid = ui.deviceid;
            wuo.trade_type = "JSAPI";
        }
        else if (m.method == PayMethod.WECHAT_QRCODE) {
            wuo.appid = this.pubid;
            wuo.mch_id = this.pubmchid;
            wuo.signkey = this.pubkey;
            wuo.trade_type = "NATIVE";
        }
        else if (m.method == PayMethod.WECHAT_H5) {
            wuo.trade_type = "MWEB";
        }
        else if(m.method == PayMethod.WECHAT_MINAPP){
            wuo.appid=this.appid;
            wuo.mch_id=this.pubmchid;
            wuo.signkey = this.pubkey;
            wuo.openid = ui.userid;
            wuo.trade_type="JSAPI"
        }
        else {
            wuo.appid = this.payid;
            wuo.mch_id = this.paymchid;
            wuo.signkey = this.paykey;
            wuo.trade_type = "APP";
        }

        // 计算签名
        let fields = ObjectT.ToMap(Encode(wuo));

        wuo.sign = this.doSignaturePay(fields, wuo.signkey);
        wuo.created = DateTime.Now();

        let res = await RestSession.Get(wuo);

        if (!res) {
            wuo.success = false;
            Insert(make_tuple(this._sdk.dbsrv, WechatUnifiedOrder), Output(wuo));
            return false;
        }


        // 微信的每种方式产生的payload格式是不一样的
        if (m.method == PayMethod.WECHAT_PUB) {
            m.payload = {
                appId: this.pubid,
                timeStamp: DateTime.Current().toString(),
                nonceStr: NonceAlDig(10),
                package: "prepay_id=" + res.prepay_id,
                signType: "MD5",
            };
            fields = ObjectT.ToMap(m.payload);
            m.payload.paySign = this.doSignaturePay(fields, wuo.signkey);
        }else if(m.method == PayMethod.WECHAT_MINAPP){
            m.payload = {
                appId: this.appid,
                nonceStr: NonceAlDig(10),
                package: "prepay_id=" + res.prepay_id,
                signType: "MD5",
                timeStamp: DateTime.Current().toString(),
            };
            fields = ObjectT.ToMap(m.payload);
            m.payload.paySign = this.doSignaturePay(fields, wuo.signkey);
        }
        else if (m.method == PayMethod.WECHAT_QRCODE) {
            // 二维码需要包含的链接
            m.payload = {
                url: res.code_url
            };
        }
        else if (m.method == PayMethod.WECHAT_H5) {
            m.payload = {
                url: res.mweb_url
            };
        }
        else {
            // 组装返回的数据
            m.payload = {
                appid: this.payid,
                partnerid: this.paymchid,
                prepayid: res.prepay_id,
                package: "Sign=WXPay",
                noncestr: NonceAlDig(10),
                timestamp: DateTime.Current()
            };
            fields = ObjectT.ToMap(m.payload);
            m.payload.sign = this.doSignaturePay(fields, wuo.signkey);
        }

        // 保存纪录
        res.success = true;
        Insert(make_tuple(this._sdk.dbsrv, WechatUnifiedOrder), Output(res));

        return true;
    }

    genWithdrawTradeNO(uid:string): string {
        return `withdraw${DateTime.Current()}`;
    }

    protected static buildXML(json:any){
            var builder = new xml2js.Builder();
            return builder.buildObject(json);
    };
    protected static parseXML (xml:any, fn:any){
        var parser = new xml2js.Parser({ trim:true, explicitArray:false, explicitRoot:false });
        parser.parseString(xml, fn||function(err:Error, result:any){});
    };

    async doWithdraw(m: Withdraw, ui: SdkUserInfo): Promise<boolean> {
        let wtd: WxappPaytoUser = new WxappPaytoUser();
        wtd.nonce_str = NonceAlDig(10);

        //sign
        wtd.partner_trade_no = this.genWithdrawTradeNO(m.uid);
        wtd.amount = m.money*100; // 正式的价格
        //wtd.spbill_create_ip = getServerIp();
        wtd.spbill_create_ip = "192.168.0.1";
        wtd.mch_appid = this.appid;
        wtd.mchid = this.pubmchid;
        wtd.signkey = this.pubkey;
        wtd.check_name="NO_CHECK";
        //wtd.openid = ui.userid;
        wtd.openid = "oQq-J5XuO2NawkxByfpkMrOAPmLg";


        // 计算签名
        let fields = ObjectT.ToMap(Encode(wtd));
        wtd.sign = this.doSignaturePay(fields, wtd.signkey);
        wtd.created = DateTime.Now();


        let res = await RestSession.Get(wtd);
        console.log(res);
       if (!res) {
            wtd.success = false;
            logger.warn('企业支付到零钱出错,请求params为{{=it.url}}', {url: wtd.requestParams()});
            Insert(make_tuple(this._sdk.dbsrv, WxappPaytoUser), Output(wtd));
            return false;
        }

        //组装返回的数据
        // m.payload = {
        //     appId: this.pubid,
        //     timeStamp: DateTime.Current().toString(),
        //     nonceStr: NonceAlDig(10),
        //     package: "prepay_id=" + res.prepay_id,
        //     signType: "MD5"
        // };
        // fields = ObjectT.ToMap(m.payload);
        // m.payload.paySign = this.doSignaturePay(fields, wtd.signkey);

        // 保存纪录
        res.success = true;
        Insert(make_tuple(this._sdk.dbsrv, WxappPaytoUser), Output(res));
        return true;
    }

    protected doSignaturePay(fields: Map<string, any>, key: string): string {
        let argus = new Array();
        fields.forEach((v, k) => {
            argus.push(k + "=" + v);
        });
        argus.push("key=" + key);
        let plain = argus.join("&");

        console.log(plain);

        let sign = StringDigest.MD5(plain, Format.HEX).toUpperCase();
        return sign;
    }

    async doCompletePay(m: CompletePay, trans: Transaction): Promise<boolean> {
        console.log("支付回掉微信层+++++++++");
        // 重建数据模型
        let wpr = new WechatPayResult();
        Decode(wpr, trans.params);
        // 构造应答数据，由业务层应答
        m.respn = {
            contentType: "text/xml",
            content: "<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>"
        };

        // 判断微信发过来的支持情况
        if (wpr.result_code != "SUCCESS") {
            wpr.status = STATUS.FAILED;
            await Insert(make_tuple(this._sdk.dbsrv, WechatPayResult), wpr);
            return false;
        }

        let signkey: string;
        if (m.method == PayMethod.WECHAT_PUB) {
            signkey = this.pubkey;
        }
        else if(m.method ==PayMethod.WECHAT_MINAPP){
            signkey =this.pubkey;
        }
        else {
            signkey = this.paykey;
        }

        // 验证微信发起的签名
        let fields = ObjectT.ToMap(ApiOutput(wpr));
        let sign = this.doSignaturePay(fields, signkey);
        console.log("验证签名");
        console.log(sign);
        console.log(wpr.sign);
        if (sign != wpr.sign) {
            wpr.status = STATUS.SIGNATURE_ERROR;
            await Insert(make_tuple(this._sdk.dbsrv, WechatPayResult), wpr);
            return false;
        }

        wpr.status = STATUS.OK;
        await Insert(make_tuple(this._sdk.dbsrv, WechatPayResult), wpr);

        // 查询该订单的价格是否一致
        let rcd = await Query(make_tuple(this._sdk.dbsrv, Pay), {
            orderid: wpr.out_trade_no
        });

        if (!rcd) {
            logger.log("没有查找到该微信订单 " + wpr.out_trade_no);
            return false;
        }

        if (wpr.cash_fee != rcd.price) {
            logger.log("支付的金额和下单的金额不一致 " + wpr.out_trade_no);
            return false;
        }

        // 支付成功
        m.orderid = wpr.out_trade_no;
        console.log("支付成功！！！！！！！！！！！！");
        // 签名成功
        return true;
    }

    protected getAppid(at: AuthType): string {
        if (at != AuthType.MINI) {
            logger.fatal('授权AuthType错误，期望为小程序，但传入的是{{=it.type}}', {type: at})
        }

        return this.appid;
    }

    protected getAppSecret(at: AuthType): string {
        if (at != AuthType.MINI) {
            logger.fatal('授权AuthType错误，期望为小程序，但传入的是{{=it.type}}', {type: at})
        }

        return this.appsecret;
    }

    async doRemoteImages(m: GetRemoteMedia, ui?: SdkUserInfo): Promise<void> {
        let tk = await this.doGetS2SAccessToken(
            this.getAppid(AuthType.PUB),
            this.getAppSecret(AuthType.PUB)
        );
        if (!tk)
            return;
        logger.log("微信：下载远程图片 " + toJson(m));
        m.paths = await (AsyncArray(m.medias).convert<string>((e, done) => {
            let url = "https://api.weixin.qq.com/cgi-bin/media/get?access_token=" + tk + "&media_id=" + e;
            // 下载图片
            Call(this._sdk.imgsrv, "imagestore.download", {
                source: url
            }, ACROOT).then(t => {
                done(t.model.path);
            });
        }));
    }

    async doRemoteAudios(m: GetRemoteMedia, ui?: SdkUserInfo): Promise<void> {
        let tk = await this.doGetS2SAccessToken(
            this.getAppid(AuthType.PUB),
            this.getAppSecret(AuthType.PUB)
        );
        if (!tk)
            return;
        logger.log("微信：下载远程音频 " + toJson(m));
        m.paths = await (AsyncArray(m.medias).convert<string>((e, done) => {
            let url = "https://api.weixin.qq.com/cgi-bin/media/get?access_token=" + tk + "&media_id=" + e;
            // 下载图片
            Call(this._sdk.mediasrv, "mediastore.download", {
                source: url,
                type: MediaSupport.AMR
            }, ACROOT).then(t => {
                done(t.model.path);
            });
        }));
    }


}

RegisterChannel("wxminiapp", WxMiniApp);

// FEATURE对应api的列表
const WECHAT_JSAPIS = [

    // 分享
    "onMenuShareTimeline",
    "onMenuShareAppMessage",
    "onMenuShareQQ",
    "onMenuShareWeibo",
    "onMenuShareQZone",

    // 录音
    "startRecord",
    "stopRecord",
    "onVoiceRecordEnd",
    "playVoice",
    "pauseVoice",
    "stopVoice",
    "onVoicePlayEnd",
    "uploadVoice",
    "downloadVoice",

    // 图片相关
    "chooseImage",
    "previewImage",
    "uploadImage",
    "downloadImage"
];
