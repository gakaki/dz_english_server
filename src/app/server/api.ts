import {Rest} from "../../nnt/server/rest"
import {Trans} from "./trans";
import {User} from "../router/user";
import {Shop} from "../router/shop";
import {Transaction} from "../../nnt/server/transaction";
import {Update} from "../../nnt/manager/dbmss";
import {StatisAction} from "../model/statis";
import {TODAY_RANGE} from "../../nnt/component/today";
import {Node} from "../../nnt/config/config";
import {static_cast} from "../../nnt/core/core";

interface ApiCfg {
    sdksrv: string;
}

export class Api extends Rest {

    constructor() {
        super();

        // 注册api
        let routers = this.routers;
        routers.register(new User());
        routers.register(new Shop());
    }

    config(cfg: Node): boolean {
        if (!super.config(cfg))
            return false;
        let c = static_cast<ApiCfg>(cfg);
        this.sdksrv = c.sdksrv;
        return true;
    }

    sdksrv: string;

    protected instanceTransaction(): Transaction {
        return new Trans();
    }

    protected onBeforeInvoke(trans: Trans) {
        super.onBeforeInvoke(trans);
        Update(StatisAction, null, [{
            router: trans.action,
            time: TODAY_RANGE.from
        },
            {$inc: {count: 1}},
            {upsert: true}]);
    }
}
