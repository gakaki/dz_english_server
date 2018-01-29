import {action, IRouter} from "../../nnt/core/router";
import {
    AdminActionRecord, AdminActionRecordType, AdminAddBanner, AdminAddItem, AdminBanner, AdminBanners,
    AdminPushMessage, AdminRmBanner, AdminServerStatus, AdminUploadImage, InstanceGame, ModifyGameInstance
} from "../model/admin";
import {static_cast} from "../../nnt/core/core";
import {Call} from "../../nnt/manager/servers";
import {UploadFile} from "../../nnt/server/imagestore";
import {Delete, Insert, Query, QueryAll, Update, Value} from "../../nnt/manager/dbmss";
import {GetInnerId, Output} from "../../nnt/store/proto";
import {InstanceTemplate} from "../../nnt/container/container";
import {AuthedNull, Null, STATUS} from "../../nnt/core/models";
import {IndexedObject, Self} from "../../nnt/core/kernel";
import {Clusters} from "../../nnt/manager/clusters";
import {configs} from "../model/xlsconfigs";
import {Banner, GameBriefInfo} from "../model/common";
import {Manager} from "../../contrib/manager/manager";
import {admin, Trans} from "../../contrib/manager/trans";
import {User} from "./user";
import {Delta, Item} from "../model/item";
import {ACROOT} from "../../nnt/acl/acl";
import {AbstractCronTask, CronAdd, PerMinute} from "../../nnt/manager/crons";
import {StatisOnlineUsersCount, StatisUserOnlineCount} from "../model/statis";
import {CURRENT_HOUR_RANGE} from "../../nnt/component/today";
import {ItemRecordType} from "../model/user";

export class Admin implements IRouter {
    action: string = "admin";

    constructor() {
        CronAdd(PerMinute(10), new TaskUserOnlineCount(), true);
    }

    @action(AdminBanners)
    async banners(trans: Trans) {
        let m: AdminBanners = trans.model;
        let banners = await QueryAll(AdminBanner, {});
        banners.forEach(e => {
            e.bid = GetInnerId(e);
        });
        m.items = banners;
        trans.submit();
    }

    @action(AdminBanner, [admin])
    async setbanner(trans: Trans) {
        let m: AdminBanner = trans.model;
        let cur = trans.current;
        await Update(AdminBanner, m.bid, {$set: m});

        Insert(AdminActionRecord, Self(new AdminActionRecord(), t => {
            t.type = AdminActionRecordType.BANNER_MODIFY;
            t.uid = cur.id;
            t.payload = trans.params;
        }));
        trans.submit();
    }

    @action(AdminAddBanner, [admin])
    async addbanner(trans: Trans) {
        let m: AdminAddBanner = trans.model;
        let srv = static_cast<Manager>(trans.server);
        let cur = trans.current;

        let params = {file: m.image};
        let t = await Call(srv.imgsrv, "imagestore.upload", params);
        if (t.status != STATUS.OK) {
            trans.status = t.status;
            trans.submit();
            return;
        }

        // 上传成功后，拿到图片地址组装banner的数据结构，再写入数据库中
        let uf: UploadFile = t.model;
        // 添加到数据库
        let bn = await Insert(Banner, {
            content: m.content,
            image: uf.path,
            link: m.link
        });
        let iid = GetInnerId(bn);
        m.bid = iid;
        m.banner = bn;

        Insert(AdminActionRecord, Self(new AdminActionRecord(), t => {
            t.type = AdminActionRecordType.BANNER_ADD;
            t.uid = cur.id;
            t.payload = trans.params;
        }));

        trans.submit();
    }

    @action(AdminRmBanner, [admin])
    async rmbanner(trans: Trans) {
        let cur = trans.current;
        let m: AdminRmBanner = trans.model;
        await Delete(Banner, m.id, null);

        Insert(AdminActionRecord, Self(new AdminActionRecord(), t => {
            t.type = AdminActionRecordType.BANNER_RM;
            t.uid = cur.id;
            t.payload = trans.params;
        }));

        trans.submit();
    }


    @action(ModifyGameInstance, [admin], "修改游戏实例")
    async modifyinstance(trans: Trans) {
        let m: ModifyGameInstance = trans.model;
        let cur = trans.current;
        let rcd = await Query(GameBriefInfo, {tid: m.tid, iid: m.iid});
        await Update(GameBriefInfo, GetInnerId(rcd), {$set: Output(m)});

        Insert(AdminActionRecord, Self(new AdminActionRecord(), t => {
            t.type = AdminActionRecordType.GAME_INSTANCE_MODIFY;
            t.uid = cur.id;
            t.payload = trans.params;
        }));

        // 发送实例变化的通知
        // manager.server.post(ServerMsgType.GAME_INSTANCE_CHANGED);

        trans.submit();
    }

    @action(AdminServerStatus, [], "服务器运行状态")
    async status(trans: Trans) {
        let m: AdminServerStatus = trans.model;
        let obj: IndexedObject = {};
        obj.cluster = await Clusters.Status();
        m.status = obj;
        trans.submit();
    }

    @action(AuthedNull, [admin], "强行设置当前为master")
    forcemaster(trans: Trans) {
        Clusters.ForceMaster();
        trans.submit();
    }

    @action(AdminUploadImage, [], "上传图片")
    async uploadimage(trans: Trans) {
        let m: AdminUploadImage = trans.model;
        let cur = trans.current;
        let srv = static_cast<Manager>(trans.server);
        let t = await Call(srv.imgsrv, "imagestore.upload", {file: m.image});
        if (t.status != STATUS.OK) {
            trans.status = t.status;
            trans.submit();
            return;
        }
        let uf: UploadFile = t.model;
        m.path = uf.path;

        Insert(AdminActionRecord, Self(new AdminActionRecord(), t => {
            t.type = AdminActionRecordType.UPLOAD_IMAGE;
            t.uid = cur.id;
            t.payload = trans.params;
        }));

        trans.submit();
    }

    @action(AdminAddItem, [admin], "给用户加道具")
    async additem(trans: Trans) {
        let m: AdminAddItem = trans.model;
        let cur = trans.current;
        let ui = await User.FindUser(m.pid);
        if (!ui) {
            trans.status = STATUS.TARGET_NOT_FOUND;
            trans.submit();
            return;
        }

        if (m.count < 0) {
            let n = ui.item(m.index).count + m.count;
            if (n < 0)
                m.count = -ui.item(m.index).count;
        }

        let d = Delta.Item(Item.FromIndex(m.index, m.count)).record(ItemRecordType.ADMIN);
        User.ApplyDelta(ui, d, null);

        Insert(AdminActionRecord, Self(new AdminActionRecord(), t => {
            t.type = AdminActionRecordType.USER_ADDITEM;
            t.uid = cur.id;
            t.payload = trans.params;
        }));

        trans.submit();
    }


    @action(AdminPushMessage, [admin], "推送消息")
    async pushmessage(trans: Trans) {
        let m: AdminPushMessage = trans.model;
        let t = await Call("push", "jpush.push", {
            android: m.android,
            ios: m.ios,
            message: m.message
        }, ACROOT);
        trans.status = t.status;
        trans.submit();
    }

    @action(Null)
    test(trans: Trans) {
        trans.submit();
    }
}

class TaskUserOnlineCount extends AbstractCronTask {
    async main() {
        // 从redis中抓出来
        let val = await Value(StatisUserOnlineCount, "online_users");
        Insert(StatisOnlineUsersCount, {
            time: CURRENT_HOUR_RANGE.from,
            count: val ? val.value : 0
        });
    }
}