import {
    auth,
    boolean,
    enumerate,
    enumm,
    file,
    FileType,
    input,
    integer,
    model,
    optional,
    output,
    string,
    type
} from "../../nnt/core/proto";
import {colinteger, colstring, coltype, table} from "../../nnt/store/proto";
import {Message} from "../../nnt/core/models";
import {Delta} from "./item";
import {MailType} from "./user";
import {DateTime} from "../../nnt/core/time";

@model([enumm])
export class NoticeType {
    static SYSTEM = 1; // 系统通知
}

// 通知消息
@model()
@table("kv", "notice_msgs")
export class NoticeMsg {

    @string(1, [input, output], "模板内容")
    @colstring()
    template: string;

    @type(2, Object, [input, output, optional], "填充字段")
    @coltype(Object)
    params: Object;

    @integer(3, [input, output, optional], "播放次数, -1代表无限循环")
    @colinteger()
    loop: number = 1;

    @integer(4, [input, output, optional], "模板id")
    @colinteger()
    templateid: number;

    @enumerate(5, NoticeType, [input, output], "消息类型")
    @colinteger()
    type: number;

    @integer(6, [input, optional], "过期时间, 单位为s, 不填则永远不过期")
    lifetime: number;

    @colinteger() // 过期时间
    expire: number;

    @colinteger()
    create = DateTime.Current();
}

// im通道的消息
@model([enumm])
export class ImMsgType {
    static CHAT = 0; // 普通聊天 payload: ImChatMsg
    static DELTA = 1; // 背包或者其他变化 payload: Delta
    static GAME = 2; // 游戏消息，独立出来后可以为游戏提供互相隔离的定义域
    static MAIL = 3; // 邮件消息，比如发奖励之类的
    static NOTICE = 4; // 通知消息，比如跑马灯
    static INTERNAL = 9; // 内部消息
};

// im通道的子消息类型
@model([enumm])
export class ImMsgSubType {

    static CHAT = 0x00; // 普通消息
    static OFFLINE = 0x01; // 离线
    static ONLINE = 0x02; // 在线
    static QUICK_CHAT = 0x03; // 快速聊天
    static PAY_DONE = 0x04; // 购买完成

    static GROUP_JOINED = 0x10; // 加入群 gid@groups/who/invitor
    static GROUP_EXIT = 0x11; // 退出群 gid@groups/who
    static GROUP_DISMISS = 0x12; // 解散群
    static GROUP_CREATED = 0x13; // 创建群

    static FRIEND_APPLY = 0x20; // 好友请求 uid@users
    static FRIEND_AGREE = 0x21; // 成为好友 uid@users
    static FRIEND_EXIT = 0x22; // 删除好友关系

    static TEAM_APPLY = 0x30; // 组队请求
    static TEAM_AGREE = 0x31; // 组队成功
    static TEAM_DISAGREE = 0x32; // 组队被拒绝
    static TEAM_EXIT = 0x33; // 组队解散

    static DATING_APPLY = 0x40; // 约会邀请
    static DATING_DONE = 0x41; // 约会完成可以领奖
    static DATING_FAILED = 0x42; // 约会失败
    static DATING_DISAGREE = 0x43; // 约会拒绝
    static DATING_EXIT = 0x44; // 解除约会
    static DATING_INCOMPLETE = 0x45; // 约会半途而废
    static DATING_AGREE = 0x46; // 同意约会
    static DATING_TASKCHANGED = 0x47; // 约会的任务产生变化
    static DATING_TASKEND = 0x48; // 约会的任务产生变化

    static ROOM_JOINED = 0x50; // 加入房间 rid@rooms/tid/iid/who
    static ROOM_EXIT = 0x51; // 谁退出了房间 rid@rooms/tid/iid/who
    static ROOM_INVITED = 0x52; // 谁邀请我加入房间 rid@rooms/tid/iid/who
    static ROOM_READY = 0x53; // 谁的状态产生变化
    static ROOM_LEAVE = 0x54; // 谁离开了房间
    static ROOM_COMEBACK = 0x55; // 谁又回来了
    static ROOM_MODIFIED = 0x56; // 修改了房间

    static GAME_START = 0x60; // 开始游戏
    static GAME_COMPLETE = 0x61; // 游戏结束

    static BANG_GRABED = 0xf0; // 我被谁抢到后宫
    static GOT_GIFT = 0xf1; // 收到一份礼物
    static SAVE_GIFT = 0xf3; // 对方收下礼物
    static OPENURL = 0xf4; // 打开链接
    static ACHIEVE_COMPLETE = 0xf5; // 成就达成
};

// im系统内部使用的消息
export enum ImInternalMsgType {
    LOGIN = 0,
}

@model()
export class ImMsg {

    @string(1, [output], "文本消息")
    @colstring()
    plain: string;

    @file(2, [output], "图片消息")
    @colstring()
    image: FileType;

    @file(3, [output], "语音消息")
    @colstring()
    audio: FileType;

    @type(4, Delta, [output], "该消息附带道具变动（真正道具变动的消息会走ImMsgType大通知，所以此处的变更不要更新背包）")
    @coltype(Delta)
    delta: Delta;
}

// 普通消息
@model([], ImMsg)
export class ImChatMsg extends ImMsg {

    constructor(subtype: number, plain?: string, delta?: Delta) {
        super();
        this.subtype = subtype;
        this.plain = plain;
        this.delta = delta;
    }

    @enumerate(1, ImMsgSubType, [output], "子类型")
    @colinteger()
    subtype: number;

    @boolean(2, [output], "可用状态")
    valid: boolean;

    @integer(3, [output], "带出来的配置索引")
    index: number;
}

@model([], ImMsg)
export class ImMailMsg extends ImMsg {

    constructor(mid: string, type: number, delta: Delta) {
        super();
        this.mid = mid;
        this.type = type;
        this.delta = delta;
    }

    @string(1, [output], "邮件的id")
    @colstring()
    mid: string;

    @enumerate(2, MailType, [output], "邮件的类型")
    @colinteger()
    type: number;
}

@model([auth])
export class ImSendChat {

    @string(1, [input], "对方的mid")
    to: string;

    @enumerate(2, ImMsgType, [input], "主消息类型")
    type: number;

    @enumerate(3, ImMsgSubType, [input], "子消息类型")
    subtype: number;

    @string(4, [input, optional], "文本消息")
    plain: string;

    @file(5, [input, optional], "图片消息")
    image: FileType;

    @file(6, [input, optional], "语音消息")
    audio: FileType;

    @type(7, Message, [output], "发送出去的消息")
    message: Message;
}