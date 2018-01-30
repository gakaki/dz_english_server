import {action, IRouter} from "../../nnt/core/router";
import {Trans} from "../server/trans";
import {ImChatMsg, ImMailMsg, ImMsg, ImMsgType, ImSendChat, NoticeMsg, NoticeType} from "../model/msg";
import {Insert, QueryAll} from "../../nnt/manager/dbmss";
import {mid_str, TemplatePayload} from "../../nnt/core/models";
import {static_cast} from "../../nnt/core/core";
import {Api} from "../server/api";
import {Call} from "../../nnt/manager/servers";
import {UploadFile} from "../../nnt/server/imagestore";
import {Delta} from "../model/item";
import {Mail} from "../model/user";
import {GetInnerId, Output} from "../../nnt/store/proto";
import {DOMAIN_USERS} from "../../nnt/server/im";
import {DateTime} from "../../nnt/core/time";
import {ImMessage} from "../../nnt/server/rest/imservice";
import {AppConfig} from "../model/appconfig";
import {ACROOT} from "../../nnt/acl/acl";
import {UploadMedia} from "../../nnt/server/mediastore";
import {logger} from "../../nnt/core/logger";

export class Msg implements IRouter {
    action: string = "msg";

    @action(ImSendChat, [], "发送聊天消息")
    async chat(trans: Trans) {
        let srv = static_cast<Api>(trans.server);
        let cur = trans.current;
        let m: ImSendChat = trans.model;
        // 构造message结构
        let msg = trans.instance(ImMessage);
        msg.from = mid_str(cur.pid, DOMAIN_USERS);
        msg.to = m.to;
        msg.type = m.type;
        m.message = msg;
        switch (m.type) {
            case ImMsgType.CHAT: {
                // 过滤敏感词
                let cm = new ImChatMsg(m.subtype, m.plain);
                // 传一下图片
                if (m.image) {
                    let t = await Call(srv.imgsrv, "imagestore.upload", {file: m.image});
                    let uf: UploadFile = t.model;
                    cm.image = uf.path;
                    msg.payload = cm;
                    logger.log("聊天上传图片 " + uf.path);
                    // 发送消息
                    t = await Call(AppConfig.IMSRV, "im.send", msg);
                    trans.status = t.status;
                    trans.submit();
                }
                else if (m.audio) {
                    let t = await Call(srv.mediasrv, "mediastore.upload", {file: m.audio});
                    let uf: UploadMedia = t.model;
                    cm.audio = uf.path;
                    msg.payload = cm;
                    logger.log("聊天上传语音 " + uf.path);
                    // 发送消息
                    t = await Call(AppConfig.IMSRV, "im.send", msg);
                    trans.status = t.status;
                    trans.submit();
                }
                else {
                    msg.payload = cm;
                    logger.log("普通聊天");
                    let t = await Call(AppConfig.IMSRV, "im.send", msg);
                    trans.status = t.status;
                    trans.submit();
                }
            }
                break;
        }
    }

    // 系统发送消息
    static async SysChat(msg: SysChat): Promise<number> {
        let t = await Call(AppConfig.IMSRV, "im.send", msg, ACROOT);
        return t.status;
    }

    // 发送邮件
    static async SendMail(pid: string, delta: Delta, type: number): Promise<string> {
        let m = await Insert(Mail, {
            pid: pid, delta: Output(delta)
        });
        let mid = GetInnerId(m);
        // 发送通知消息
        Msg.SysChat({
            from: mid_str(pid, DOMAIN_USERS),
            to: mid_str(pid, DOMAIN_USERS),
            type: ImMsgType.MAIL,
            payload: new ImMailMsg(mid, type, delta)
        });
        return mid;
    }

    // 给特定用户发送通知
    static async SendSystemMsgsToUser(pid: string) {
        // 系统消息-{没有过期时间， 没有过期}
        let msgs = await QueryAll(NoticeMsg, {
            type: NoticeType.SYSTEM,
            $or: [{
                expire: {$exists: false}
            }, {
                expire: {$gt: DateTime.Current()}
            }]
        });
        if (!msgs.length)
            return;
        Msg.SysChat({
            from: mid_str(pid, DOMAIN_USERS),
            to: mid_str(pid, DOMAIN_USERS),
            type: ImMsgType.NOTICE,
            payload: msgs
        });
    }
}

export type SysChatPayload = ImMsg | Delta | TemplatePayload | NoticeMsg[];

export interface SysChat {
    from: string; // 发送者
    to: string; // 接收者
    type: number; // 消息主类型
    payload: SysChatPayload; // 消息体
    online?: boolean;  // 是否只发送在线得，默认为false
}