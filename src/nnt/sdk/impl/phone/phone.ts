import {Channel} from "../../channel";
import {IndexedObject} from "../../../core/kernel";
import {
    Auth, CompletePay, Environment, GetRemoteMedia, Info, Login, Pay, SdkUserInfo, Share, Support,
    Withdraw
} from "../../msdk";
import {RegisterChannel, Sdk} from "../../sdk";
import {Transaction} from "../../../server/transaction";
import {MinAppShare} from "../../../../app/model/user";

export class Phone extends Channel {


    constructor(sdk: Sdk) {
        super(sdk);
    }

    config(cfg: IndexedObject): boolean {
        return true;
    }
    async doMinAppShare(m: MinAppShare, ui?: SdkUserInfo): Promise<any> {
        return false;
    }
    async doInfo(m: Info, sp: Support): Promise<void> {
    }

    async doAuth(m: Auth): Promise<Auth> {
        return m;
    }

    async doCheckExpire(ui: SdkUserInfo): Promise<boolean> {
        return false;
    }

    async doRenewal(ui: SdkUserInfo): Promise<boolean> {
        return true;
    }

    async doLogin(m: Login, ui: SdkUserInfo): Promise<boolean> {
        return true;
    }

    async doShare(m: Share, ui: SdkUserInfo): Promise<boolean> {
        return false;
    }

    async doPay(m: Pay, ui: SdkUserInfo, trans: Transaction): Promise<boolean> {
        return true;
    }

    async doCompletePay(m: CompletePay, trans: Transaction): Promise<boolean> {
        return true;
    }

    async doEnvironment(m: Environment, ui: SdkUserInfo): Promise<boolean> {
        return true;
    }

    async doRemoteImages(m: GetRemoteMedia, ui: SdkUserInfo): Promise<void> {

    }

    async doRemoteAudios(m: GetRemoteMedia, ui: SdkUserInfo): Promise<void> {

    }

    async doWithdraw(m: Withdraw, ui: SdkUserInfo): Promise<void> {

    }
}

RegisterChannel("phone", Phone);