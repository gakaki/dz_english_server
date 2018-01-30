import {Connector, Socket} from "../../nnt/server/socket";
import {Trans} from "./trans";
import {User} from "../router/user";
import {Acquire, IMQClient} from "../../nnt/server/mq";
import {Transaction} from "../../nnt/server/transaction";
import {Get, Inc, Insert, Set, Update} from "../../nnt/manager/dbmss";
import {UserBriefInfo} from "../model/common";
import {colinteger, colstring, GetInnerId, table} from "../../nnt/store/proto";
import {logger} from "../../nnt/core/logger";
import {ImConnector} from "../../nnt/server/rest/imservice";
import {DateTime} from "../../nnt/core/time";
import {Msg} from "../router/msg";
import {ImInternalMsgType, ImMsgType} from "../model/msg";
import {Message, STATUS} from "../../nnt/core/models";
import {Variant} from "../../nnt/core/object";
import {IndexedObject} from "../../nnt/core/kernel";
import {StatisUserOnline, StatisUserOnlineCount} from "../model/statis";
import {AppConfig} from "../model/appconfig";

@table("rd", "live_logins", {ttl: DateTime.DAY})
export class LiveLogins {

    @colstring()
    key: string;

    @colinteger()
    count: number = 0;
}

class LiveConnector extends ImConnector {

    // 当前用户的pid，logout时，sid会失效
    pid: string;

    // 可以收到历史消息
    longmq: IMQClient;

    // 仅收取在线消息
    onlinemq: IMQClient;

    // 多机登陆被踢掉
    kick: boolean;

    subscribe(pid: string, sid: string, cid: string) {
        // 创建该用户的监听
        Acquire(AppConfig.MQSRV).open("user." + pid).then(mq => {
            this.longmq = mq;
            mq.subscribe(data => {
                let msg = this.convert(data);
                this.doPost(msg, pid, sid, cid);
            });
        });

        // online的通道短线后自动就没了
        Acquire(AppConfig.MQSRV).open("user.online." + pid, {
            durable: false,
            longliving: true//原来是false,改为跟配置中一样为true
        }).then(mq => {
            this.onlinemq = mq;
            mq.subscribe(data => {
                let msg = this.convert(data);
                this.doPost(msg, pid, sid, cid);
            });
            // 自动断开连接，不需要手动处理，所以只有连接的代码
            mq.receiver("user.online", true);

            // 广播上线的消息
            Acquire(AppConfig.MQSRV).open("user.online", {
                passive: true
            }).then(mq => {
                mq.broadcast(new Variant({
                    type: ImMsgType.INTERNAL,
                    payload: {
                        subtype: ImInternalMsgType.LOGIN,
                        pid: pid, cid: cid, sid: sid
                    }
                }));
            });
        });
    }

    protected doPost(msg: Message, pid: string, sid: string, cid: string) {
        if (msg.type == ImMsgType.INTERNAL) {
            let pl: IndexedObject = msg.payload;
            if (pl.subtype == ImInternalMsgType.LOGIN) {
                if (pl.pid == pid && pl.cid != cid) {
                    this.kick = true;
                    // 取消当前的监听
                    this.unsubscribe(pid);
                    this.close(STATUS.MULTIDEVICE);
                }
            }
        }
        else {
            this.post(msg);
        }
    }

    unsubscribe(pid: string) {
        if (this.longmq) {
            this.longmq.unsubscribe();
            this.longmq.close();
            this.longmq = null;
        }

        if (this.onlinemq) {
            this.onlinemq.unsubscribe();
            this.onlinemq.close();
            this.onlinemq = null;
        }
    }
}

export class Live extends Socket {

    constructor() {
        super();
    }

    protected instanceTransaction(): Transaction {
        return new Trans();
    }

    protected instanceConnector(): Connector {
        return new LiveConnector();
    }

    protected async onConnectorAvaliable(connector: LiveConnector) {
        super.onConnectorAvaliable(connector);

        // 判断存不存在
        const sid = connector.sessionId;
        const cid = connector.clientId;
        const ui = await User.FindUserBySid(sid);
        if (!ui) {
            logger.warn("没有找到该 sid 对应的用户 " + sid);
            return;
        }

        logger.log("{{=it.pid}} 打开了长连接", ui);
        connector.pid = ui.pid;

        // 修改在线状态
        await Update(UserBriefInfo, GetInnerId(ui), {
            $set: {
                online: true
            }
        });

        // 监听mq中的 user.pid 消息
        connector.subscribe(ui.pid, sid, cid);

        // 连接时需要检查是否发送初始的数据
        Live.Login(cid, ui.pid);


        // 上线纪录
        Insert(StatisUserOnline, {
            pid: ui.pid,
            online: true,
            time: DateTime.Now()
        });

        // 在线人数
        Inc(StatisUserOnlineCount, "online_users");
    }

    protected async onConnectorUnavaliable(connector: LiveConnector) {
        super.onConnectorUnavaliable(connector);
        if (!connector.pid)
            return;

        let ui = await User.FindUser(connector.pid);
        logger.log("{{=it.pid}} 断开了长连接", ui);

        // 修改在线状态
        if (!connector.kick) {
            Update(UserBriefInfo, GetInnerId(ui), {
                $set: {
                    online: false,
                    playing: null
                }
            });
        }


        // 清除消息监听
        connector.unsubscribe(ui.pid);

        // 下线纪录
        Insert(StatisUserOnline, {
            pid: ui.pid,
            online: false,
            time: DateTime.Now()
        });

        // 在线人数-1
        Inc(StatisUserOnlineCount, "online_users", -1);
    }

    protected static async Login(cid: string, pid: string) {
        let key = pid + "." + cid;
        let rcd = await Get(LiveLogins, key);
        if (!rcd) {
            rcd = new LiveLogins();
            rcd.key = key;

            // 首次登陆到live中，认为是全新的连接
            Msg.SendSystemMsgsToUser(pid);
        }

        // 加一保存
        rcd.count += 1;
        Set(LiveLogins, rcd.key, rcd);
    }
}