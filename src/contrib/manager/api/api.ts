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

    export enum FriendStatus {
    
        NORMAL = 0,
    
        WAITING = 1,
    
        APPLYING = 2,
    
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

    export class AddFriend extends Model {
    
        @Model.string(1, [Model.input], "平台id")
        pid:string;
    
        @Model.type(2, Delta, [Model.output], "加好友会消耗一朵鲜花")
        delta:Delta;
    
    }

    export class RemoveFriend extends Model {
    
        @Model.string(1, [Model.input], "平台id")
        pid:string;
    
    }

    export class Friends extends Model {
    
        @Model.string(1, [Model.input, Model.optional], "平台id，如果不传则查询的是自己的好友")
        pid?:string;
    
        @Model.array(2, Model.string_t, [Model.output], "好友列表")
        friends:Array<string>;
    
        @Model.enumerate(3, FriendStatus, [Model.input], "好友的状态")
        status:FriendStatus;
    
        @Model.boolean(4, [Model.input, Model.optional], "只列出最近添加的")
        recent?:boolean;
    
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

    export class AdminBanner extends Banner {
    
        @Model.string(1, [Model.input, Model.output], "bannerId")
        bid:string;
    
        @Model.boolean(2, [Model.input, Model.optional], "可用")
        enable?:boolean;
    
        @Model.boolean(3, [Model.input, Model.optional], "展示在首页中")
        home?:boolean;
    
        @Model.boolean(4, [Model.input, Model.optional], "轮播广告")
        carousel?:boolean;
    
    }

    export class AdminBanners extends Model {
    
        @Model.array(1, AdminBanner, [Model.output], "列表")
        items:Array<AdminBanner>;
    
    }

    export class AdminAddBanner extends Model {
    
        @Model.string(1, [Model.input], "文字内容")
        content:string;
    
        @Model.file(2, [Model.input], "图片")
        image:any;
    
        @Model.string(3, [Model.input], "链接地址")
        link:string;
    
        @Model.type(4, Banner, [Model.output], "添加的banner")
        banner:Banner;
    
        @Model.string(5, [Model.output], "bannerId")
        bid:string;
    
    }

    export class AdminRmBanner extends Model {
    
        @Model.string(1, [Model.input], "banner的数据库id")
        id:string;
    
    }

    export class InstanceGame extends GameBriefInfo {
    
        @Model.integer(1, [Model.input], "配表id")
        index:number;
    
    }

    export class InstancedGames extends Model {
    
        @Model.array(1, GameBriefInfo, [Model.output])
        items:Array<GameBriefInfo>;
    
    }

    export class ModifyGameInstance extends Model {
    
        @Model.string(1, [Model.input, Model.output], "模板id")
        tid:string;
    
        @Model.string(2, [Model.input, Model.output], "实例id")
        iid:string;
    
        @Model.file(3, [Model.input, Model.output, Model.optional], "游戏图标")
        icon?:any;
    
        @Model.string(4, [Model.input, Model.output, Model.optional], "游戏名称")
        name?:string;
    
    }

    export class AdminValidUserWord extends Model {
    
        @Model.string(1, [Model.input], "要设置的词汇")
        word:string;
    
        @Model.boolean(2, [Model.input, Model.optional], "是否设置为可用，不传则默认给true")
        valid?:boolean;
    
    }

    export class AdminServerStatus extends Model {
    
        @Model.json(1, [Model.output])
        status:Object;
    
    }

    export class AdminUploadImage extends Model {
    
        @Model.file(1, [Model.input], "图片")
        image:any;
    
        @Model.string(2, [Model.output])
        path:string;
    
    }

    export class AdminAddItem extends Model {
    
        @Model.string(1, [Model.input])
        pid:string;
    
        @Model.integer(2, [Model.input], "索引")
        index:number;
    
        @Model.integer(3, [Model.input], "数量")
        count:number;
    
    }

    export class AdminPushMessage extends Model {
    
        @Model.boolean(1, [Model.input])
        android:boolean;
    
        @Model.boolean(2, [Model.input])
        ios:boolean;
    
        @Model.string(3, [Model.input])
        message:string;
    
    }

    export class UserChangeVipLevel extends Model {
    
        @Model.string(1, [Model.input])
        pid:string;
    
        @Model.integer(2, [Model.input], "vip等级")
        index:number;
    
    }

    export class MgrInit extends Model {
    
        @Model.string(1, [Model.input])
        account:string;
    
        @Model.string(2, [Model.input])
        password:string;
    
    }

    export class MgrLogin extends Model {
    
        @Model.string(1, [Model.input, Model.optional])
        account?:string;
    
        @Model.string(2, [Model.input, Model.optional])
        password?:string;
    
        @Model.string(3, [Model.output])
        sid:string;
    
    }

    export class MgrAddUser extends Model {
    
        @Model.string(1, [Model.input])
        account:string;
    
        @Model.string(2, [Model.input])
        password:string;
    
        @Model.integer(3, [Model.input, Model.optional])
        gid?:number;
    
    }

}

export module routers {

    export let ManagerInit = ["manager.init", models.MgrInit, "初始化管理系统"];

    export let ManagerLogin = ["manager.login", models.MgrLogin, "登陆管理员"];

    export let ManagerAdduser = ["manager.adduser", models.MgrAddUser, "添加用户"];

    export let ManagerGenapi = ["manager.genapi", models.Null, "更新api"];

    export let ManagerGenconfig = ["manager.genconfig", models.Null, "更新配表"];

    export let ManagerGendbxls = ["manager.gendbxls", models.Null, "更新数据库字典"];

    export let AdminBanners = ["admin.banners", models.AdminBanners, ""];

    export let AdminSetbanner = ["admin.setbanner", models.AdminBanner, ""];

    export let AdminAddbanner = ["admin.addbanner", models.AdminAddBanner, ""];

    export let AdminRmbanner = ["admin.rmbanner", models.AdminRmBanner, ""];

    export let AdminInstancegame = ["admin.instancegame", models.InstanceGame, "实例化一个游戏"];

    export let AdminModifyinstance = ["admin.modifyinstance", models.ModifyGameInstance, "修改游戏实例"];

    export let AdminStatus = ["admin.status", models.AdminServerStatus, "服务器运行状态"];

    export let AdminForcemaster = ["admin.forcemaster", models.AuthedNull, "强行设置当前为master"];

    export let AdminUploadimage = ["admin.uploadimage", models.AdminUploadImage, "上传图片"];

    export let AdminAdditem = ["admin.additem", models.AdminAddItem, "给用户加道具"];

    export let AdminPushmessage = ["admin.pushmessage", models.AdminPushMessage, "推送消息"];

    export let AdminTest = ["admin.test", models.Null, ""];

}

export module api {

    export function ManagerInit():models.MgrInit {
    return Model.NewRequest(routers.ManagerInit);
    }

    export function ManagerLogin():models.MgrLogin {
    return Model.NewRequest(routers.ManagerLogin);
    }

    export function ManagerAdduser():models.MgrAddUser {
    return Model.NewRequest(routers.ManagerAdduser);
    }

    export function ManagerGenapi():models.Null {
    return Model.NewRequest(routers.ManagerGenapi);
    }

    export function ManagerGenconfig():models.Null {
    return Model.NewRequest(routers.ManagerGenconfig);
    }

    export function ManagerGendbxls():models.Null {
    return Model.NewRequest(routers.ManagerGendbxls);
    }

    export function AdminBanners():models.AdminBanners {
    return Model.NewRequest(routers.AdminBanners);
    }

    export function AdminSetbanner():models.AdminBanner {
    return Model.NewRequest(routers.AdminSetbanner);
    }

    export function AdminAddbanner():models.AdminAddBanner {
    return Model.NewRequest(routers.AdminAddbanner);
    }

    export function AdminRmbanner():models.AdminRmBanner {
    return Model.NewRequest(routers.AdminRmbanner);
    }

    export function AdminInstancegame():models.InstanceGame {
    return Model.NewRequest(routers.AdminInstancegame);
    }

    export function AdminModifyinstance():models.ModifyGameInstance {
    return Model.NewRequest(routers.AdminModifyinstance);
    }

    export function AdminStatus():models.AdminServerStatus {
    return Model.NewRequest(routers.AdminStatus);
    }

    export function AdminForcemaster():models.AuthedNull {
    return Model.NewRequest(routers.AdminForcemaster);
    }

    export function AdminUploadimage():models.AdminUploadImage {
    return Model.NewRequest(routers.AdminUploadimage);
    }

    export function AdminAdditem():models.AdminAddItem {
    return Model.NewRequest(routers.AdminAdditem);
    }

    export function AdminPushmessage():models.AdminPushMessage {
    return Model.NewRequest(routers.AdminPushmessage);
    }

    export function AdminTest():models.Null {
    return Model.NewRequest(routers.AdminTest);
    }

}

Model.BindImpl(api, models, routers);
