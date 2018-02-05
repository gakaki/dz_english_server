import {action, debug, develop, frqctl, IRouter} from "../../nnt/core/router";
import {
    AuthInfo, ChaneItem, ItemQuery, ItemRecord, ItemRecordType, LoginInfo, Mail, Mails, MinAppPay, MinAppShare,
    MinAppWithdraw,
    PictureInfo,
    QueryUser,
    QueryUserVipInfo, ShareCode,
    UserActionRecord, UserActionRecordType, UserInfo, UserPicture, UserPictures, UserShare, UserShareCounter,
    UserShareDailyCounter, UserSid, UserTili, UserType, UserVipGiftCounter
} from "../model/user";
import {AutoInc, Delete, Get, Insert, Iterate, Query, QueryAll, Set, Update} from "../../nnt/manager/dbmss";
import {GetInnerId, Output} from "../../nnt/store/proto";
import {DateTime} from "../../nnt/core/time";
import {Trans} from "../server/trans";
import {AuthedNull, Null, STATUS} from "../../nnt/core/models";
import {Call} from "../../nnt/manager/servers";
import {static_cast} from "../../nnt/core/core";
import {UploadFile} from "../../nnt/server/imagestore";
import {Code} from "../model/code";
import {Config} from "../../nnt/manager/config";
import {GEN_SID} from "../../nnt/component/account";
import {IndexedObject, Instance, make_tuple, ObjectT, SyncArray, toNumber} from "../../nnt/core/kernel";
import {Delta, Item, UserItemCounter} from "../model/item";
import {logger} from "../../nnt/core/logger";
import {UserBriefInfo, UserVipInfo} from "../model/common";
import {IApiServer} from "../../nnt/server/apiserver";
import {AbstractCronTask, CronAdd, PerDay} from "../../nnt/manager/crons";
import {Auth, LoginMethod, Pay, PayMethod, Refund, SdkPayOrderId, SdkUserInfo, Withdraw} from "../../nnt/sdk/msdk";
import {REGEX_PHONE} from "../../nnt/component/pattern";
import {configs} from "../model/xlsconfigs";
import {Api} from "../server/api";
import {RechargeRecord} from "../model/shop";


export class User implements IRouter {
    action: string = "user";

    static PID_INIT = 160000;

    constructor() {
        CronAdd(PerDay(1), new TaskVipUserGift(), true);
    }

    static CheckAccount(str: string): boolean {
        return str.match(REGEX_PHONE) != null;
    }

    static CheckPassword(str: string): boolean {
        let pat = new RegExp(configs.Parameter.Get("user.passwordpattern").value);
        return str.match(pat) != null;
    }

    @action(AuthInfo)
    async auth(trans: Trans) {
        let m: AuthInfo = trans.model;

        let sdkAuth = new Auth();
        sdkAuth.payload = m.payload;
        sdkAuth.channel = 'wxminiapp';
        sdkAuth.method=LoginMethod.WECHAT_MINI_APP;


        let r =await Call('sdk', 'sdk.auth', sdkAuth);

        if (r.model) {
            m.uid = r.model.uid;
        }
        else {
            trans.status = Code.VERIFY_FAILED;
        }

        trans.submit();
        
    }


    @action(LoginInfo, [frqctl])
    async login(trans: Trans) {
        let m: LoginInfo = trans.model;

        // 没有输入账号，而且没有找到sid
        if (!m.sid &&
            !m.uid &&
            !trans.auth()) {
            trans.status = Code.LOGIN_FAILED;
            trans.submit();
            return;
        }

        // 老用户sid登陆
        if (trans.auth()) {
            m.info = trans.current;
            m.sid = trans.sid;
            logger.log("{{=it.user}}@{{=it.sid}} 登陆成功", {user: m.info.pid, sid: m.sid});
            trans.submit();
            return;
        }

        let ui: UserInfo;

        // 第三方登陆
        if (m.uid) {
            // 直接通过uid来查找账号，找到后生成对应sid
            let sdkui = await Query(make_tuple(SdkUserInfo, "kv.sdk_users"), {userid:m.uid});

            if (!sdkui) {
                trans.status = Code.LOGIN_FAILED;
                logger.warn("尝试无效的第三方登陆");
                trans.submit();
                return;
            }

            // 因为以后登陆仅仅通过sid，所以安全问题能得以提高
            ui = await Query(UserInfo, {
                uid: m.uid,
                third: true
            });

            if (!ui) {
                // 自动注册
                ui = await User.Register(
                    m.uid,
                    m.info.nickName,
                    m.info.avatarUrl,
                    true,
                    m.inviterpid,
                );
                logger.info("使用第三方凭据注册账号 " + ui.pid);
            }else{
                //更新一次userInfo
                await Update(UserInfo, null, [{pid: ui.pid}, {$set: {nickName: m.info.nickName, avatarUrl: m.info.avatarUrl}}]);
            }
            console.log(ui);

        }


        if (!ui) {
            trans.status = Code.LOGIN_FAILED;
            trans.submit();
            return;
        }

        // 如果是第三方账号，判断有没有过期
        // if (ui.third) {
        //     let srv = <Api>trans.server;
        //     let t = await Call(srv.sdksrv, "sdk.checkexpire", {
        //         uid: ui.uid
        //     });
        //     if (t.status != STATUS.OK) {
        //         logger.warn("第三方登录失败 " + t.status);
        //         trans.status = t.status;
        //         trans.submit();
        //         return;
        //     }
        // }




        // 更新其他信息
        await User.PrepareInfo(ui);

        // 刷新sid
        let ses = await Get(UserSid, {pid: ui.pid});
        if (ses) {
            let now = DateTime.Now();
            if (ses.expire < now)
                ses.sid = GEN_SID(); // 过期重新生成
            ses.expire = DateTime.Now() + Config.SID_EXPIRE;
            Set(UserSid, {pid: ses.pid}, ses);
            Set(UserSid, {sid: ses.sid}, ses);
        }
        else {
            // 首次登陆
            ses = new UserSid();
            ses.pid = ui.pid;
            ses.sid = GEN_SID();
            ses.expire = DateTime.Now() + Config.SID_EXPIRE;
            Set(UserSid, {pid: ses.pid}, ses);
            Set(UserSid, {sid: ses.sid}, ses);
        }

        m.sid = ses.sid;
        m.info=ui;
        logger.log("{{=it.user}}@{{=it.sid}} 登陆成功", {user: m.info.pid, sid: m.sid});

        // 日志
        Insert(UserActionRecord, Instance(UserActionRecord, obj => {
            obj.pid = ui.pid;
            obj.type = UserActionRecordType.LOGIN;
            obj.data = trans.info;
        }));

        trans.submit();
    }
    @action(ChaneItem)
   async chaneitem(trans:Trans){
        let m:ChaneItem = trans.model;
        let cost = new Delta();

        cost.addkv(m.itemId,m.num);
        let ui=await Query(UserInfo,{"uid":m.uid});
        if(ui == null){
            trans.status=Code.USER_NOT_FOUND;
            trans.submit();
            return;
        }
        if(ui.itemCount(m.itemId) +m.num >=0){
            await User.ApplyDelta(ui, cost);
        }else{
            trans.status=Code.NEED_ITEMS;
        }

        m.userInfo=await Query(UserInfo,{"uid":m.uid});
        trans.submit();


   }
   @action(MinAppPay)
   async minapppay(trans:Trans){
       let m:MinAppPay = trans.model;
       let ui=await User.FindUserBySid(trans.sid);
       if(ui == null){
           trans.status=Code.USER_NOT_FOUND;
           trans.submit();
           return;
       }
       let srv = static_cast<Api>(trans.server);
       let payInfo:RechargeRecord = new RechargeRecord();
       payInfo.price = m.payCount*100;
       //payInfo.price = 1;
       payInfo.time = DateTime.Current();
       payInfo.pid=ui.pid;
      // payInfo.pid = "123";
       payInfo.type = "recharge";
       let t = await Call(srv.sdksrv, "sdk.payorderid", trans.params);

       if (t.status != STATUS.OK) {
           logger.warn("获取订单号失败");
           trans.status = t.status;
           trans.submit();
           return;
       }

       payInfo.orderid = (<SdkPayOrderId>t.model).orderid;

       payInfo.desc = "豆子网络-游戏";

       await Insert(RechargeRecord, payInfo);

       let pay:Pay = new Pay();
       pay.method=PayMethod.WECHAT_MINAPP;
       pay.orderid=payInfo.orderid;
       pay.price=payInfo.price;
       pay.channel="wxminiapp";
       pay.desc=payInfo.desc;
       pay.uid=ui.uid;
       pay.IP=m.IP;

       let a=await  Call("sdk", 'sdk.pay', pay);

       if(a.status != 0){
           trans.status=STATUS.THIRD_FAILED;
           trans.submit();
           return
       }
       m.payload=a.model.payload;
       trans.submit();
   }
   @action(Refund)
   async refund(trans:Trans){
        let m:Refund=trans.model;
        let pid="160031";
       console.log("进来");
       console.log(m);
       //  let orderId="201802050000000153";
     //   let price=1;
     //   let refund:Refund= new Refund();
     //   refund.total_fee=price;
      //  refund.orderId=orderId;
     //  refund.channel="wxminiapp";
       let a=await  Call("sdk", 'sdk.refund', m);
       trans.submit();
   }

   @action(MinAppWithdraw)
   async minappwithdraw(trans:Trans){
       let m:MinAppWithdraw = trans.model;
       let ui=await User.FindUserBySid(trans.sid);
       if(ui == null){
           trans.status=Code.USER_NOT_FOUND;
           trans.submit();
           return;
       }
       let withdraw:Withdraw = new Withdraw();
       withdraw.money = m.money;
       withdraw.channel="wxminiapp";
       withdraw.uid=ui.uid;
      // withdraw.uid="123";

       let a=await  Call("sdk", 'sdk.withdraw', withdraw);

       m.data=a.model.data;
       console.log("返回");
       console.log(m);
       let cost = new Delta();
       cost.addkv(configs.Item.MONEY, m.money*100);
       await User.ApplyDelta(ui, cost);
       trans.submit();
   }

    @action(ShareCode)
    async minappshare(trans: Trans) {
        let m:ShareCode = trans.model;
        /*  let ui:UserInfo=await User.FindUserBySid(trans.sid);
          if(ui==null){
              trans.status = Code.USER_NOT_FOUND;
              trans.submit();
              return
          }*/
        //m.uid=ui.uid;
        //m.uid="123";
        let min:MinAppShare=new MinAppShare();
        min.channel = 'wxminiapp';
        min.uid="123";
        min.width=m.width;
        min.page=m.page;
        min.scene=m.scene;
        console.log(m);
        let a=await  Call("sdk", 'sdk.minappshare', min);


        trans.submit();

    }

    // 清除该SID的登陆信息
    static ClearSid(sid: string) {
        Delete(UserSid, null, {sid: sid});
    }

    static async CreateSid(uid: string): Promise<string> {
        let ses = new UserSid();
        ses.pid = uid;
        ses.sid = GEN_SID();
        ses.expire = DateTime.Now() + Config.SID_EXPIRE;
        await Update(UserSid, null,[{pid: ses.pid}, {$set: {sid: ses.sid, expire: ses.expire}}, {$upsert: true}]);
        return ses.sid;
    }

    // @third 是否是第三方登陆
    protected static async Register(uid: string, nickname: string, avatar: string, third: boolean, inviterpid?: string): Promise<UserInfo> {
        // 新建用户
        let ui = await Insert(UserInfo, {
            uid: uid,
            nickName: nickname,
            avatarUrl: avatar,
            registertime: DateTime.Now(),
            third: third,
            inviterpid: inviterpid,
        });

        // 从innerId 直接生成uid
        let iid = GetInnerId(ui);
        // 生成pid
        let pid = await AutoInc(UserInfo, "pid");
        ui.pid = (toNumber(User.PID_INIT + pid)).toString();
        // if (ui.inviterpid) {
        //     Friend.ChangeRelation(ui.inviterpid, ui.pid, true);
        // }

        // 更新pid
        await Update(UserInfo, iid, {$set: {pid: ui.pid}});

        // 初始化新用户背包
        let delta = new Delta();
         delta.addkv(configs.Item.MONEY, 0);
         delta.addkv(configs.Item.ACCELERATION, 0);
         delta.addkv(configs.Item.CASHCOUPON, 0);
        // delta.addkv(configs.Item.SHENJIA, toInt(configs.Parameter.Get("user.initialshenjia").value));
        // delta.addkv(configs.Item.GOLD, toInt(configs.Parameter.Get("user.initialgold").value));
        // delta.addkv(configs.Item.PHYSICAL, toInt(configs.Parameter.Get("user.initialtili").value));
        // delta.addkv(configs.Item.CARD, toInt(configs.Parameter.Get("user.initialcard").value));

        //如果是从合作渠道来的用户，默认给账户里充1个代金券


        // 初始化背包
        await User.ApplyDelta(ui, delta);

        // 日志
        Insert(UserActionRecord, Instance(UserActionRecord, obj => {
            obj.pid = ui.pid;
            obj.type = UserActionRecordType.REGISTER;
        }));

        return ui;
    }

    @action(AuthedNull)
    logout(trans: Trans) {
        let cur = trans.current;
        Delete(UserSid, null, {pid: cur.pid});
        Delete(UserSid, null, {sid: trans.sid});

        // 日志
        Insert(UserActionRecord, Instance(UserActionRecord, obj => {
            obj.pid = cur.pid;
            obj.type = UserActionRecordType.LOGOUT;
        }));

        trans.submit();
    }

    @action(ItemQuery)
    async getiteminfo(trans:Trans){
        let m:ItemQuery = trans.model;
        let ui:UserInfo=await User.FindUserBySid(trans.sid);
        if(ui==null){
            trans.status = Code.USER_NOT_FOUND;
            trans.submit();
            return
        }
        m.stock=ui.itemCount(m.itemId);
        trans.submit();
    }


    // @action(ApplyCode, [], "提交验证码")
    // async applycode(trans: Trans) {
    //     let m: ApplyCode = trans.model;
    //     let uc = await Change(UserCode, m.key, {});
    //     if (!uc || uc.pass != m.pass) {
    //         trans.status = Code.VERIFY_FAILED;
    //         trans.submit();
    //         return;
    //     }
    //
    //     // 发送短信，重新设置一下验证码
    //     let rcd = new UserCode();
    //     rcd.key = m.key;
    //     rcd.pass = format("%04d", Random.Rangei(0, 10000));
    //     Set(UserCode, m.key, rcd);
    //
    //     // 电话号码才真正发短信，上线版本model中会加上参数校验
    //     if (m.phone.match(REGEX_PHONE)) {
    //         let phone = [m.phone];
    //         let content = "您的验证码是：" + rcd.pass;
    //         Call("sms", "hangyuan.sms", {
    //             phone: phone,
    //             content: content
    //         }).then(t => {
    //             // 纪录短信
    //             Insert(Sms, {phone: phone, content: content, time: DateTime.Now(), status: t.status});
    //         });
    //     }
    //
    //     trans.submit();
    // }

    // 通过sid查找user
    static async FindUserBySid(sid: string): Promise<UserInfo> {
        // 通过sid查找pid，再通过pid查找info
        let ses = await Get(UserSid, {sid: sid});
        if (ses == null)
            return null;
        let ui = await Query(UserInfo, {pid: ses.pid});
        await User.PrepareInfo(ui);
        return ui;
    }

    static async PrepareInfo(ui: UserBriefInfo) {
        if (!ui)
            return;
    }

    // 续约sid
    static RecruitSid(sid: string, pid: string) {
        let ses = new UserSid();
        ses.pid = pid;
        ses.sid = sid;
        ses.expire = DateTime.Now() + Config.SID_EXPIRE;
        Set(UserSid, {pid: ses.pid}, ses);
        Set(UserSid, {sid: ses.sid}, ses);
    }

    // 根据pid查找用户信息
    @action(QueryUser)
    async query(trans: Trans) {
        let m: QueryUser = trans.model;
        let cur = trans.current;
        let ui = await User.FindUserBriefInfo(m.pid);
        if (ui) {
            // 查找双方的关系
            // let fi = await Friend.Find(cur.pid, m.pid);
            // ui.isfriend = fi && fi.status == FriendStatus.NORMAL;
            m.info = ui;
            trans.submit();
        }
        else {
            trans.status = STATUS.FAILED;
            trans.submit();
        }
    }

    @action(QueryUserVipInfo)
    async vipinfo(trans: Trans) {
        let cur = trans.current;
        let m: QueryUserVipInfo = trans.model;
        trans.submit();
    }

    @action(Item, [debug, develop], "测试环境下修改用户背包里的物品")
    additem(trans: Trans) {
        let cur = trans.current;
        let m: Item = trans.model;
        if (m.count < 0) {
            let n = cur.item(m.index).count + m.count;
            if (n < 0)
                m.count = -cur.item(m.index).count;
        }
        let d = Delta.Item(m).record(ItemRecordType.ADMIN);
        User.ApplyDelta(cur, d);
        trans.submit();
    }


    @action(Mail, [], "拾取邮件")
    async pickupmail(trans: Trans) {
        let m: Mail = trans.model;
        let cur = trans.current;
        let mi = await Query(Mail, m.mid);
        if (!mi || mi.pid != cur.pid || !mi.delta.items.size) {
            trans.status = STATUS.TARGET_NOT_FOUND;
            trans.submit();
            return trans;
        }

        if (mi.got) {
            trans.status = Code.PICKED;
            trans.submit();
            return trans;
        }

        // 设置为已读
        Update(Mail, GetInnerId(mi), {$set: {got: true}});

        // 应用
        mi.delta.record(ItemRecordType.REWARD);
        User.ApplyDelta(cur, mi.delta);

        m.delta = mi.delta;
        trans.submit();
    }

    @action(Mails, [], "所有邮件")
    async mails(trans: Trans) {
        let m: Mails = trans.model;
        let arr = await QueryAll(Mail, {pid: trans.current.pid});
        arr.forEach(e => {
            e.mid = GetInnerId(e);
        });
        m.items = arr;
        trans.submit();
    }

    // 通过PID查找用户
    static async FindUserInfo(pid: string): Promise<UserInfo> {
        let ui = await Query(UserInfo, {pid: pid});
        await User.PrepareInfo(ui);
        return ui;
    }

    static async FindUserInfoByUid(uid:string):Promise<UserInfo>{
        let ui = await Query(UserInfo, {uid: uid});
        await User.PrepareInfo(ui);
        return ui;
    }

    static async FindUserBriefInfo(pid: string): Promise<UserBriefInfo> {
        let ui = await Query(UserBriefInfo, {pid: pid});
        await User.PrepareInfo(ui);
        return ui;
    }

    static async FindUser(u: UserType): Promise<UserInfo> {
        if (u instanceof UserInfo)
            return u;
        else if (u instanceof UserBriefInfo)
            return await User.FindUserInfo(u.pid);
        return await User.FindUserInfo(u);
    }

    static async SetItem(user: UserType, it: Item[] | Item, from?: UserType): Promise<boolean> {
        let ui = await User.FindUser(user);
        let delta = new Delta();
        if (it instanceof Array) {
            it.forEach(e => {
                let cnt = ui.itemCount(e.index);
                delta.addkv(e.index, e.count - cnt);
            });
        }
        else {
            let cnt = ui.itemCount(it.index);
            delta.addkv(it.index, it.count - cnt);
        }
        return User.ApplyDelta(ui, delta, from);
    }

    // 应用道具
    // @msg 通知变动
    // @user 谁发生变动
    // @cur 当前是谁，可以为null
    // @delta 增量
    // @vip 是否需要vip经验加成
    static async ApplyDelta(user: UserType, delta: Delta, from?: UserType): Promise<boolean> {
        if (!delta.items.size)
            return false;

        let ui = await User.FindUser(user);
        if (ui == null) {
            logger.warn("没有找到ApplyDelta传入的user " + user);
            return false;
        }

        let cur: UserBriefInfo;
        if (from) {
            cur = await User.FindUser(from);
            if (cur == null) {
                logger.warn("没有找到ApplyDelta传入的from " + from);
                return false;
            }
        }

        let rcds = new Array<ItemRecord>();

        // 更新user身上的items
        let set: IndexedObject = {};
        delta.items.forEach((v, k) => {
            // 不处理0的更新
            if (v == 0)
                return;

            set["items." + k] = v;
            rcds.push(new ItemRecord(k, v));

            let old = ui.itemCount(k);
            ui.items.set(k, old + v);

        });

        // 没有有效的更新
        if (rcds.length == 0)
            return false;

        // 更新到背包数据
        Update(UserInfo, GetInnerId(ui),
            {$inc: set}).then(ui => {
            // 增加计数器数据
            SyncArray(rcds).forEach(async rcd => {
                let daddup = rcd.delta > 0 ? rcd.delta : 0;
                let dcost = rcd.delta > 0 ? 0 : -rcd.delta;  // cost统计时按照正数统计
                await Update(UserItemCounter, null, [{
                    pid: ui.pid, index: rcd.index
                }, {
                    $set: {total: ui.item(rcd.index).count, delta: rcd.delta},
                    $inc: {addup: daddup, cost: dcost}
                }, {upsert: true}]);
            }).then(() => {
            });
        });

        // 更新记录表
        let now = DateTime.Now();
        rcds.forEach(e => {
            if (!e.pid)
                e.pid = ui.pid;
            e.time = now;
            e.type = delta.type;
            Insert(ItemRecord, e);
        });

        return true;
    }

    static MakeCouple(pid: string, pid2: string): string {
        return ObjectT.Max(pid, pid2) + "," + ObjectT.Min(pid, pid2);
    }


    @action(UserPicture, [], "上传照片")
    async uploadpicture(trans: Trans) {
        let m: UserPicture = trans.model;
        let cur = trans.current;

        let srv = static_cast<IApiServer>(trans.server);
        // 先保存到图片服务中
        let t = await Call(srv.imgsrv, "imagestore.upload", {file: m.image});
        if (t.status != STATUS.OK) {
            trans.status = t.status;
            trans.submit();
            return;
        }

        let uf: UploadFile = t.model;
        m.pid = cur.pid;
        m.image = uf.path;
        m.time = DateTime.Current();
        await Insert(UserPicture, Output(m));
        trans.submit();
    }

    @action(UserPictures, [], "用户照片")
    async pictures(trans: Trans) {
        let cur = trans.current;
        let m: UserPictures = trans.model;
        if (m.pid) {
            if (m.pid != cur.pid) {
                // let fnd = await Friend.Find(m.pid, cur.pid);
                // if (!fnd) {
                //     trans.status = STATUS.TARGET_NOT_FOUND;
                //     trans.submit();
                //     return trans;
                // }
                trans.status = STATUS.TARGET_NOT_FOUND;
                trans.submit();
            }
        }
        else {
            m.pid = cur.pid;
        }
        m.items = await QueryAll(UserPicture, {pid: m.pid});
        trans.submit();
    }

    @action(PictureInfo, [], "删除照片")
    async removepicture(trans: Trans) {
        let m: PictureInfo = trans.model;
        let cur = trans.current;
        let s = await Delete(UserPicture, null, {pid: cur.pid, image: m.image});
        if (s.remove == 0)
            trans.status = STATUS.TARGET_NOT_FOUND;
        trans.submit();
    }

    @action(Null, [debug], "执行用户送礼的任务")
    taskusergift(trans: Trans) {
        new TaskVipUserGift().main();
        trans.submit();
    }

    @action(UserTili, [], "上次恢复体力的时间")
    async tilitime(trans: Trans) {
        let m: UserTili = trans.model;
        let cur = trans.current;
        let fnd = await Query(UserTili, {pid: cur.pid});
        if (!fnd) {
            m.time = DateTime.Now();
            Insert(UserTili, {pid: cur.pid, time: m.time});
        }
        else {
            m.time = fnd.time;
        }
        trans.submit();
    }


    @action(UserShare, [], "请求分享信息")
    async share(trans: Trans) {
        let cur = trans.current;
        let m: UserShare = trans.model;

        // let cfg = configs.Share.Get(m.index);
        // if (!m.title)
        //     m.title = cfg.title;
        // if (!m.desc)
        //     m.desc = cfg.desc;
        // if (!m.link)
        //     m.link = cfg.link;
        // if (!m.image)
        //     m.image = cfg.image;


        trans.submit();
    }

    @action(UserShare, [], "分享成功")
    async sharedone(trans: Trans) {
        let cur = trans.current;
        let m: UserShare = trans.model;
        m.pid = cur.pid;
        m.time = DateTime.Now();
        console.log("分享成功=========")
        console.log(m)
        Update(UserShareCounter, null, [{
            pid: cur.pid
        }, {$inc: {count: 1}},
            {upsert: true}]).then(() => {
        });

        Update(UserShareDailyCounter, null, [{
            pid: cur.pid,
            time: new DateTime().dayRange().from
        }, {$inc: {count: 1}},
            {upsert: true}]).then(() => {
        });

        Insert(UserShare, m);
        trans.submit();
    }

    @action(UserInfo, [], "获得当前登录账号的信息")
    async info(trans: Trans) {
        let cur = trans.current;
        trans.model = cur;
        trans.submit();
    }

}

// 用户送礼的任务
export class TaskVipUserGift extends AbstractCronTask {

    // 每日礼包通过每日任务发放
    main() {
        let now = new DateTime();
        let dr = now.dayRange();
        // 遍历每一个VIP，增加礼品
        Iterate(UserVipInfo, {expire: {$gt: dr.from}}, (vi, next) => {
            if (!vi)
                return;
            TaskVipUserGift.GiveToday(vi, dr.from);
        });
    }

    // 发放月卡当天的礼品
    static GiveToday(vi: UserVipInfo, dayfrom: number) {
        Insert(UserVipGiftCounter, {
            pid: vi.pid, type: vi.type, time: dayfrom
        }).then(() => {
        });
    }
}
