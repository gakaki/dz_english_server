import {IndexedObject} from "../core/kernel";
import {Sdk} from "./sdk";
import {
    Auth, CompletePay, Environment, GetRemoteMedia, Info, Login, Pay, PaytoUser, SdkUserInfo, Share,
    Support, Withdraw
} from "./msdk";
import {Transaction} from "../server/transaction";
import {MinAppShare} from "../../app/model/user";

export abstract class Channel {

    constructor(sdk: Sdk) {
        this._sdk = sdk;
    }

    config(cfg: IndexedObject): boolean {
        return true;
    }

    // 提供信息处理
    abstract doInfo(m: Info, sp: Support): Promise<void>;

    // 处理授权
    abstract doAuth(m: Auth): Promise<Auth>;

    // 检查授权是否过期
    abstract doCheckExpire(ui: SdkUserInfo): Promise<boolean>;

    // 对账号续约
    abstract doRenewal(ui: SdkUserInfo): Promise<boolean>;

    // 登陆平台
    abstract doLogin(m: Login, ui: SdkUserInfo): Promise<boolean>;

    // 分享
    abstract doShare(m: Share, ui: SdkUserInfo): Promise<boolean>;

    // 生成支付数据
    abstract doPay(m: Pay, ui: SdkUserInfo, trans: Transaction): Promise<boolean>;

    // 处理支付回调
    abstract doCompletePay(m: CompletePay, trans: Transaction): Promise<boolean>;

    // 准备环境参数
    abstract doEnvironment(m: Environment, ui: SdkUserInfo): Promise<boolean>;

    // 服务端获取远端图片
    abstract doRemoteImages(m: GetRemoteMedia, ui?: SdkUserInfo): Promise<void>;

    // 服务端获取远端语音
    abstract doRemoteAudios(m: GetRemoteMedia, ui?: SdkUserInfo): Promise<void>;

    //提现（从豆子账号通过企业付款给用户）
    abstract doWithdraw(m: Withdraw, ui?: SdkUserInfo): Promise<boolean>;

    //微信小程序分享二维码
    abstract doMinAppShare(m: MinAppShare, ui?: SdkUserInfo):Promise<any>;

    protected _sdk: Sdk;
}