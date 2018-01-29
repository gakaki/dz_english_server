import {Model} from "./model-impl";

export module models {


    export enum ProviderContentType {
    
        RAW = 0,
    
        JAVASCRIPT = 1,
    
        STRING = 2,
    
    }

    export enum STATUS {
    
        UNKNOWN = -1000,
    
        EXCEPTION = -999,
    
        ROUTER_NOT_FOUND = -998,
    
        CONTEXT_LOST = -997,
    
        MODEL_ERROR = -996,
    
        PARAMETER_NOT_MATCH = -995,
    
        NEED_AUTH = -994,
    
        TYPE_MISMATCH = -993,
    
        FILESYSTEM_FAILED = -992,
    
        FILE_NOT_FOUND = -991,
    
        ARCHITECT_DISMATCH = -990,
    
        SERVER_NOT_FOUND = -989,
    
        LENGTH_OVERFLOW = -988,
    
        TARGET_NOT_FOUND = -987,
    
        PERMISSIO_FAILED = -986,
    
        WAIT_IMPLEMENTION = -985,
    
        ACTION_NOT_FOUND = -984,
    
        TARGET_EXISTS = -983,
    
        STATE_FAILED = -982,
    
        UPLOAD_FAILED = -981,
    
        MASK_WORD = -980,
    
        SELF_ACTION = -979,
    
        PASS_FAILED = -978,
    
        OVERFLOW = -977,
    
        AUTH_EXPIRED = -976,
    
        SIGNATURE_ERROR = -975,
    
        IM_CHECK_FAILED = -899,
    
        IM_NO_RELEATION = -898,
    
        THIRD_FAILED = -5,
    
        MULTIDEVICE = -4,
    
        HFDENY = -3,
    
        TIMEOUT = -2,
    
        FAILED = -1,
    
        OK = 0,
    
        DELAY_RESPOND = 10000,
    
        REST_NEED_RELISTEN = 10001,
    
    }

    export enum Code {
    
        LOGIN_FAILED = -100,
    
        USER_EXISTS = -101,
    
        LOGIN_EXPIRED = -102,
    
        ANNOYMOUS_DENY = -103,
    
        USER_NOT_FOUND = -104,
    
        VERIFY_FAILED = -105,
    
        ROOMID_FAILED = -106,
    
        FRIEND_WAIT = -107,
    
        REQUIREMENT_FAILED = -108,
    
        ROOM_FULLED = -109,
    
        ROOM_EXPIRED = -110,
    
        ROOM_USER_EXISTS = -111,
    
        GANG_FULLED = -112,
    
        NEED_ITEMS = -113,
    
        FRIEND_APPLY = -114,
    
        FRIEND_DONE = -115,
    
        CANNOT_CHANGED = -116,
    
        PICKED = -117,
    
        REQUIRED_LOST = -118,
    
        USER_OFFLINE = -119,
    
        USER_INTEAM = -120,
    
        ANSWER_WRONG = -121,
    
        CANNOT_BE_SELF = -122,
    
        GANG_ALREADY_RECOMMAND = -123,
    
        NO_USING_PET = -124,
    
        ROOM_JOINING = -125,
    
        PHONE_BINDED = -126,
    
        MUST_FRIEND = -127,
    
        ROOMID_MQ_CREATE_FAILED = -128,
    
    }

    export enum MailType {
    
        RANK_REWARDS = 16,
    
    }

    export enum TaskRecord {
    
        CHAT = 1,
    
        DATING_QUESTION = 32,
    
        DRAWQUE_COMPLETE = 48,
    
        DRAWQUE_COMPLETE_TEAM = 49,
    
    }





    export class Null extends Model {
    
    }

    export class AuthedNull extends Model {
    
    }

    export class RestUpdate extends Model {
    
        @Model.integer(1, [Model.output], "心跳间隔")
        heartbeatTime:number;
    
        @Model.json(2, [Model.output])
        models:Object;
    
    }

    export class Message extends Model {
    
        @Model.json(1, [Model.input, Model.output, Model.optional], "发送者mid对象")
        fromi?:Object;
    
        @Model.integer(2, [Model.input, Model.output, Model.optional], "消息类型，留给业务层定义，代表payload的具体数据结构")
        type?:number;
    
        @Model.json(3, [Model.input, Model.output, Model.optional], "消息体")
        payload?:Object;
    
        @Model.integer(4, [Model.output], "时间戳")
        timestamp:number;
    
    }

    export class Messages extends Model {
    
        @Model.array(1, Message, [Model.output], "消息列表")
        items:Array<Message>;
    
    }

    export class ProviderContent extends Model {
    
        @Model.enumerate(1, ProviderContentType, [Model.input], "输出类型")
        type:ProviderContentType;
    
        @Model.string(2, [Model.input], "请求返回的脚本id")
        id:string;
    
    }

    export class TemplateModel extends Model {
    
        @Model.string(1, [Model.input])
        tid:string;
    
        @Model.string(2, [Model.input])
        iid:string;
    
    }

    export class TemplatePayload extends Model {
    
        @Model.string(1, [Model.input, Model.output], "自定义的通知标记")
        channel:string;
    
    }

    export class Paged extends Model {
    
        @Model.integer(1, [Model.input, Model.output, Model.optional], "排序依赖的最大数值")
        last?:number;
    
        @Model.integer(2, [Model.input, Model.optional], "一次拉取多少个")
        limit?:number;
    
        @Model.array(3, Object, [Model.output], "接收到的对象")
        items:Array<Object>;
    
        @Model.array(4, Object, [Model.output], "所有对象")
        all:Array<Object>;
    
    }

    export class PayOrder extends Model {
    
        @Model.string(1, [Model.output], "订单号")
        orderid:string;
    
        @Model.string(2, [Model.output], "价格")
        price:string;
    
        @Model.string(3, [Model.output], "说明文字")
        desc:string;
    
        @Model.string(4, [Model.output], "部分渠道需要配置商品id")
        prodid:string;
    
    }

    export class Banner extends Model {
    
        @Model.string(1, [Model.output], "文字")
        content:string;
    
        @Model.string(2, [Model.output], "图片地址，不包含host的部分")
        image:string;
    
        @Model.string(3, [Model.output], "链接")
        link:string;
    
    }

    export class GameBriefInfo extends Model {
    
        @Model.string(1, [Model.input, Model.output], "模板id")
        tid:string;
    
        @Model.string(2, [Model.input, Model.output], "实例id")
        iid:string;
    
        @Model.file(3, [Model.input, Model.output], "游戏图标")
        icon:any;
    
        @Model.string(4, [Model.input, Model.output], "游戏名称")
        name:string;
    
        @Model.boolean(5, [Model.output], "是否支持购买房间")
        buyroom:boolean;
    
    }

    export class RoomBriefInfo extends Model {
    
        @Model.string(1, [Model.input, Model.output], "模板id")
        tid:string;
    
        @Model.string(2, [Model.input, Model.output], "实例id")
        iid:string;
    
        @Model.string(3, [Model.input, Model.output], "房间id")
        rid:string;
    
    }

    export class UserVipInfo extends Model {
    
        @Model.integer(1, [Model.output], "vip的类型，对应vip的配表id")
        type:number;
    
        @Model.integer(2, [Model.output])
        expire:number;
    
    }

    export class UserBriefInfo extends Model {
    
        @Model.string(1, [Model.input, Model.output], "平台号")
        pid:string;
    
        @Model.string(2, [Model.input, Model.output], "如果是第三方登陆，则返回UID")
        uid:string;
    
        @Model.string(1, [Model.input, Model.output], "用户名")
        nickName:string;
    
        @Model.string(2, [Model.input, Model.output], "头像url")
        avatarUrl:string;
    
        @Model.string(3, [Model.input, Model.output], "用户的性别，值为1时是男性，值为2时是女性，值为0时是未知")
        gender:string;
    
        @Model.string(4, [Model.input, Model.output], "城市")
        city:string;
    
        @Model.string(5, [Model.input, Model.output], "省")
        province:string;
    
        @Model.string(6, [Model.input, Model.output], "国家")
        country:string;
    
        @Model.string(6, [Model.input, Model.output], "用户的语言，简体中文为zh_CN")
        language:string;
    
        @Model.boolean(16, [Model.output], "是否在线")
        online:boolean;
    
        @Model.map(18, Model.integer_t, Model.integer_t, [Model.output], "拥有得道具数据，Item表里获得得都在这里面")
        items:Map<number, number>;
    
    }

    export class Item extends Model {
    
        @Model.integer(1, [Model.input, Model.output], "配表索引")
        index:number;
    
        @Model.integer(2, [Model.input, Model.output], "数量")
        count:number;
    
    }

    export class Delta extends Model {
    
        @Model.map(1, Model.integer_t, Model.integer_t, [Model.output], "物品信息")
        items:Map<number, number>;
    
        @Model.boolean(2, [Model.output], "是否应用VIP加成")
        vipAddition:boolean;
    
    }

    export class QueryUserVipInfo extends Model {
    
        @Model.array(2, UserVipInfo, [Model.output])
        items:Array<UserVipInfo>;
    
    }

    export class UserInfo extends UserBriefInfo {
    
        @Model.string(1, [Model.input, Model.output], "平台号")
        pid:string;
    
        @Model.string(2, [Model.input, Model.output], "如果是第三方登陆，则返回UID")
        uid:string;
    
        @Model.string(1, [Model.input, Model.output], "用户名")
        nickName:string;
    
        @Model.string(2, [Model.input, Model.output], "头像url")
        avatarUrl:string;
    
        @Model.string(3, [Model.input, Model.output], "用户的性别，值为1时是男性，值为2时是女性，值为0时是未知")
        gender:string;
    
        @Model.string(4, [Model.input, Model.output], "城市")
        city:string;
    
        @Model.string(5, [Model.input, Model.output], "省")
        province:string;
    
        @Model.string(6, [Model.input, Model.output], "国家")
        country:string;
    
        @Model.string(6, [Model.input, Model.output], "用户的语言，简体中文为zh_CN")
        language:string;
    
        @Model.boolean(16, [Model.output], "是否在线")
        online:boolean;
    
        @Model.map(18, Model.integer_t, Model.integer_t, [Model.output], "拥有得道具数据，Item表里获得得都在这里面")
        items:Map<number, number>;
    
    }

    export class LoginInfo extends Model {
    
        @Model.type(3, UserInfo, [Model.input], "用户信息")
        info:UserInfo;
    
        @Model.string(4, [Model.output])
        sid:string;
    
        @Model.string(5, [Model.input, Model.optional], "第三方登陆的id")
        uid?:string;
    
        @Model.string(9, [Model.output], "平台号")
        pid:string;
    
        @Model.integer(7, [Model.output], "服务器的时间")
        time:number;
    
        @Model.string(8, [Model.input, Model.optional], "邀请人")
        inviterpid?:string;
    
    }

    export class QueryUser extends Model {
    
        @Model.string(1, [Model.input], "平台号")
        pid:string;
    
        @Model.type(2, UserBriefInfo, [Model.output], "用户信息")
        info:UserBriefInfo;
    
    }

    export class Mail extends Model {
    
        @Model.string(1, [Model.input, Model.output], "邮件ID")
        mid:string;
    
        @Model.type(2, Delta, [Model.output], "邮件带的物品")
        delta:Delta;
    
    }

    export class Mails extends Model {
    
        @Model.array(1, Mail, [Model.output])
        items:Array<Mail>;
    
    }

    export class Redpoint extends Model {
    
        @Model.integer(1, [Model.output], "等待接受的约会数量")
        datingapplys:number;
    
        @Model.integer(2, [Model.output], "正在进行的约会数量")
        datings:number;
    
    }

    export class UserPicture extends Model {
    
        @Model.file(1, [Model.input, Model.output], "照片文件")
        image:any;
    
        @Model.integer(2, [Model.output], "上传时间")
        time:number;
    
    }

    export class PictureInfo extends Model {
    
        @Model.string(1, [Model.input], "照片路径")
        image:string;
    
    }

    export class UserPictures extends Model {
    
        @Model.string(1, [Model.input, Model.optional], "好友id,不传就是取自己的")
        pid?:string;
    
        @Model.array(2, UserPicture, [Model.output], "所有照片")
        items:Array<UserPicture>;
    
    }

    export class UserTili extends Model {
    
        @Model.integer(1, [Model.output], "上次恢复的时间")
        time:number;
    
    }

    export class UserShare extends Model {
    
        @Model.integer(1, [Model.input], "share表的id")
        index:number;
    
        @Model.string(1, [Model.input, Model.output, Model.optional])
        title?:string;
    
        @Model.string(2, [Model.input, Model.output, Model.optional])
        desc?:string;
    
        @Model.string(3, [Model.input, Model.output, Model.optional])
        link?:string;
    
        @Model.string(4, [Model.input, Model.output, Model.optional])
        image?:string;
    
    }

    export class RechargeRecord extends PayOrder {
    
        @Model.integer(1, [Model.input], "recharge中的配表ID")
        index:number;
    
    }

    export class BuyVipRecord extends PayOrder {
    
        @Model.integer(1, [Model.input], "vip的配表ID")
        index:number;
    
    }

    export class BuyItem extends Model {
    
        @Model.integer(1, [Model.input], "配表ID")
        index:number;
    
        @Model.integer(2, [Model.input, Model.optional], "购买的数量，默认为 1")
        count?:number;
    
        @Model.type(4, Delta, [Model.output])
        delta:Delta;
    
    }

    export class ExchangeItem extends Model {
    
        @Model.integer(1, [Model.input], "目标")
        index:number;
    
        @Model.integer(2, [Model.input, Model.optional], "数量，默认为1")
        count?:number;
    
        @Model.type(3, Delta, [Model.output])
        delta:Delta;
    
    }

    export class TestOrder extends Model {
    
        @Model.string(1, [Model.input])
        orderid:string;
    
    }

}

export module routers {

    export let UserLogin = ["user.login", models.LoginInfo, ""];

    export let UserLogout = ["user.logout", models.AuthedNull, ""];

    export let UserQuery = ["user.query", models.QueryUser, ""];

    export let UserVipinfo = ["user.vipinfo", models.QueryUserVipInfo, ""];

    export let UserAdditem = ["user.additem", models.Item, "测试环境下修改用户背包里的物品"];

    export let UserPickupmail = ["user.pickupmail", models.Mail, "拾取邮件"];

    export let UserMails = ["user.mails", models.Mails, "所有邮件"];

    export let UserUploadpicture = ["user.uploadpicture", models.UserPicture, "上传照片"];

    export let UserPictures = ["user.pictures", models.UserPictures, "用户照片"];

    export let UserRemovepicture = ["user.removepicture", models.PictureInfo, "删除照片"];

    export let UserTilitime = ["user.tilitime", models.UserTili, "上次恢复体力的时间"];

    export let UserShare = ["user.share", models.UserShare, "请求分享信息"];

    export let UserSharedone = ["user.sharedone", models.UserShare, "分享成功"];

    export let UserInfo = ["user.info", models.UserInfo, "获得当前登录账号的信息"];

    export let ShopRecharge = ["shop.recharge", models.RechargeRecord, "货币充值为平台内道具"];

    export let ShopBuyvip = ["shop.buyvip", models.BuyVipRecord, "平台内购买"];

    export let ShopBuyitem = ["shop.buyitem", models.BuyItem, ""];

    export let ShopDone = ["shop.done", models.Null, "支付成功回调"];

    export let ShopExchange = ["shop.exchange", models.ExchangeItem, "兑换"];

    export let ShopTestpay = ["shop.testpay", models.TestOrder, "测试收单"];

}

export module api {

    export function UserLogin():models.LoginInfo {
    return Model.NewRequest(routers.UserLogin);
    }

    export function UserLogout():models.AuthedNull {
    return Model.NewRequest(routers.UserLogout);
    }

    export function UserQuery():models.QueryUser {
    return Model.NewRequest(routers.UserQuery);
    }

    export function UserVipinfo():models.QueryUserVipInfo {
    return Model.NewRequest(routers.UserVipinfo);
    }

    export function UserAdditem():models.Item {
    return Model.NewRequest(routers.UserAdditem);
    }

    export function UserPickupmail():models.Mail {
    return Model.NewRequest(routers.UserPickupmail);
    }

    export function UserMails():models.Mails {
    return Model.NewRequest(routers.UserMails);
    }

    export function UserUploadpicture():models.UserPicture {
    return Model.NewRequest(routers.UserUploadpicture);
    }

    export function UserPictures():models.UserPictures {
    return Model.NewRequest(routers.UserPictures);
    }

    export function UserRemovepicture():models.PictureInfo {
    return Model.NewRequest(routers.UserRemovepicture);
    }

    export function UserTilitime():models.UserTili {
    return Model.NewRequest(routers.UserTilitime);
    }

    export function UserShare():models.UserShare {
    return Model.NewRequest(routers.UserShare);
    }

    export function UserSharedone():models.UserShare {
    return Model.NewRequest(routers.UserSharedone);
    }

    export function UserInfo():models.UserInfo {
    return Model.NewRequest(routers.UserInfo);
    }

    export function ShopRecharge():models.RechargeRecord {
    return Model.NewRequest(routers.ShopRecharge);
    }

    export function ShopBuyvip():models.BuyVipRecord {
    return Model.NewRequest(routers.ShopBuyvip);
    }

    export function ShopBuyitem():models.BuyItem {
    return Model.NewRequest(routers.ShopBuyitem);
    }

    export function ShopDone():models.Null {
    return Model.NewRequest(routers.ShopDone);
    }

    export function ShopExchange():models.ExchangeItem {
    return Model.NewRequest(routers.ShopExchange);
    }

    export function ShopTestpay():models.TestOrder {
    return Model.NewRequest(routers.ShopTestpay);
    }

}

Model.BindImpl(api, models, routers);
