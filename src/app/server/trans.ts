import {Transaction} from "../../nnt/server/transaction";
import {User} from "../router/user";
import {logger} from "../../nnt/core/logger";
import {UserInfo} from "../model/user";
import {Class, IndexedObject} from "../../nnt/core/kernel";
import {static_cast} from "../../nnt/core/core";
import {Delete, Get, Set, Update} from "../../nnt/manager/dbmss";
import {colstring, table} from "../../nnt/store/proto";
import {StatisUserAction} from "../model/statis";
import {TODAY_RANGE} from "../../nnt/component/today";

@table("rd", "frqctl", {ttl: 5})
class Frqctl {

    @colstring()
    action: string;
}

export class Trans extends Transaction {

    sid: string;
    current: UserInfo;

    async collect() {
        this.sid = this.params["_sid"];
        if (this.sid) {
            let ui = await User.FindUserBySid(this.sid);
            if (ui) {
                // 续约
                User.RecruitSid(this.sid, ui.pid);

                // 纪录访问
                Update(StatisUserAction, null, [
                    {
                        pid: ui.pid,
                        router: this.action,
                        time: TODAY_RANGE.from
                    },
                    {$inc: {count: 1}},
                    {upsert: true}]);

                if (ui.third)
                    ui.uid = ui.uid;
                this.current = ui;
            }
            else {
                logger.warn("提供了一个错误的sid {{=it.sid}}", {sid: this.sid});
            }
        }
    }

    auth(): boolean {
        return this.current != null;
    }

    sessionId(): string {
        return this.params["_sid"];
    }

    instance<T>(cls: Class<T>): T {
        let r = super.instance(cls);
        let io = static_cast<IndexedObject>(r);
        io["_sid"] = this.params["_sid"];
        io["_cid"] = this.params["_cid"];
        return r;
    }

    async lock(): Promise<boolean> {
        let sid = this.sessionId();
        if (!sid)
            return true;
        let d = await Get(Frqctl, sid);
        if (d)
            return false;
        let t = new Frqctl();
        t.action = this.action;
        await Set(Frqctl, sid, t);
        return d == null;
    }

    unlock() {
        let sid = this.sessionId();
        if (!sid)
            return true;
        Delete(Frqctl, null, sid);
    }
}