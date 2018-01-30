import {action, IRouter} from "../../nnt/core/router";
import {PackInfo} from "../model/guessnum";
import {Trans} from "../../contrib/manager/trans";

export class Guessnum implements IRouter {
    action = "guessnum";

    @action(PackInfo)
    async sendpk(trans: Trans) {
        let m: PackInfo = trans.model;

        // xxx
        trans.submit();
    }

}