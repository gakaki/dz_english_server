import {DOMAIN_GROUPS, DOMAIN_ROOMS, DOMAIN_USERS, DOMAIN_USERS_ONLINE, Im} from "../../nnt/server/im";
import {Message, MidInfo} from "../../nnt/core/models";
import {Trans} from "./trans";
import {asString} from "../../nnt/core/kernel";
import {User} from "../router/user";
import {Acquire} from "../../nnt/server/mq";
import {AppConfig} from "../model/appconfig";
import {Output} from "../../nnt/core/proto";
import {TaskMoniter_Chat} from "../model/taskmoniter";
import {Task} from "../router/taskmoniter";
import {Variant} from "../../nnt/core/object";
import {ImMsg} from "../model/msg";
import {Filter} from "../../nnt/component/maskword";

export class Chat extends Im {

    async isvalid(from: MidInfo, to: MidInfo): Promise<boolean> {
        return true;
    }

    mid(trans: Trans): MidInfo {
        return {
            user: asString(trans.current.pid),
            domain: "users"
        }
    }

    protected onPosted(msg: Message) {
        // 如果发现payload是ImMsg类型，则需要对plain进行敏感词过滤
        if (msg.payload instanceof ImMsg) {
            let pl: ImMsg = msg.payload;
            if (pl.plain)
                pl.plain = Filter(pl.plain);
        }

        // 如果是发送给user，则通过mq激活
        if (msg.toi.domain == DOMAIN_USERS) {
            if (msg.online)
                Acquire(AppConfig.MQSRV).open("user.online." + msg.toi.user, {passive: true}).then(mq => {
                    mq.produce(new Variant(Output(msg)))
                });
            else
                Acquire(AppConfig.MQSRV).open("user." + msg.toi.user, {passive: true}).then(mq => {
                    mq.produce(new Variant(Output(msg)))
                });

            // 如果是user发给user，则更新下任务记录
            if (msg.fromi.domain == DOMAIN_USERS) {
                let m = new TaskMoniter_Chat();
                m.from = msg.fromi.user;
                m.to = msg.toi.user;
                m.couple = User.MakeCouple(m.from, m.to);
                Task.Done(m);
            }
        }
        else if (msg.toi.domain == DOMAIN_USERS_ONLINE) {
            Acquire(AppConfig.MQSRV).open("user.online", {passive: true}).then(mq => {
                mq.broadcast(new Variant(Output(msg)))
            });
        }
        else if (msg.toi.domain == DOMAIN_GROUPS) {
            Acquire(AppConfig.MQSRV).open("group." + msg.toi.user, {passive: true}).then(mq => {
                mq.broadcast(new Variant(Output(msg)))
            });
        }
        else if (msg.toi.domain == DOMAIN_ROOMS) {
            Acquire(AppConfig.MQSRV).open("room." + msg.toi.user, {passive: true}).then(mq => {
                mq.broadcast(new Variant(Output(msg)))
            });
        }
    }
}