import {
    array, auth, boolean, enumm, file, FileType, input, integer, model, optional, output, string, string_t,
    type
} from "../../nnt/core/proto";
import {colarray, colboolean, colinteger, coljson, colstring, coltype, table} from "../../nnt/store/proto";
import {Delta, Item} from "./item";
import {DateTime} from "../../nnt/core/time";
import {UserBriefInfo, UserVipInfo} from "./common";
import {Check} from "../../nnt/component/maskword";
import {configs} from "./xlsconfigs";

@model([auth])
export class QueryUserVipInfo {

    @array(2, UserVipInfo, [output])
    items: UserVipInfo[];
}

@model([auth], UserBriefInfo)
@table("kv", "users")
export class UserInfo extends UserBriefInfo {

    @colboolean()
    third: boolean = false;

    @colinteger()
    registertime: number;

    @colstring()
    inviterpid: string;

}

// pid或者user对象，方便内部函数的调用
export type UserType = string | UserBriefInfo | UserInfo;

@table("rd", "sid")
export class UserSid {

    @colstring()
    pid: string;

    @colstring()
    sid: string;

    @colinteger()
    expire: number;
}

// 用户验证码得时效检测
@table("rd", "code", {ttl: 300})
export class UserCode {

    @colstring()
    key: string;

    @colstring()
    pass: string;
}

@table("kv", "smss")
export class Sms {

    @colarray(string_t)
    phone: string[];

    @colstring()
    content: string;

    @colinteger()
    time = DateTime.Now();

    @colinteger()
    status: number; // 发送的结果
}


@model()
export class LoginInfo {

    @type(3, UserInfo, [input], "用户信息")
    info: UserInfo;

    @string(4, [output])
    sid: string;

    @string(5, [input, optional], "第三方登陆的id")
    uid: string;

    @string(9, [output], "平台号")
    @colstring()
    pid: string;

    @integer(7, [output], "服务器的时间")
    time = DateTime.Current();

    @string(8, [input, optional], "邀请人")
    inviterpid: string;

}

// @model()
// export class ApplyCode {
//
//     @string(1, [input], "电话号码")//, ph => ph.match(REGEX_PHONE))
//     phone: string;
//
//     @string(2, [input], "GenCode时获得的key")
//     key: string;
//
//     @string(3, [input], "用户输入的图形验证码")
//     pass: string;
// }

@model([auth])
export class QueryUser {

    @string(1, [input], "平台号")
    pid: string;

    @type(2, UserBriefInfo, [output], "用户信息")
    info: UserBriefInfo;
}

export enum ItemRecordType {
    ADMIN,
    REWARD,
    BUY
}

// 道具变化历史
@table("kv", "item_records")
export class ItemRecord {

    constructor(index: number, delta: number, pid?: string) {
        this.index = index;
        this.delta = delta;
        this.pid = pid;
    }

    @colstring()
    pid: string;

    @colinteger()
    time: number;

    @colinteger()
    index: number;

    @colinteger()
    delta: number;

    @colinteger()
    type: number;
}


@model([auth])
@table("kv", "mails")
export class Mail {

    @string(1, [input, output], "邮件ID")
    mid: string;

    @colstring()
    pid: string; // 发给谁

    @colboolean()
    got: boolean; // 是否已经领取

    @type(2, Delta, [output], "邮件带的物品")
    @coltype(Delta)
    delta: Delta;
}

@model([auth])
export class Mails {

    @array(1, Mail, [output])
    items: Mail[];
}

@model([enumm])
export class MailType {
    static RANK_REWARDS = 0x10; // 排行榜奖励
}

@model([auth])
export class Redpoint {

    @integer(1, [output], "等待接受的约会数量")
    datingapplys: number;

    @integer(2, [output], "正在进行的约会数量")
    datings: number;
}

@model([auth])
@table("kv", "user_pictures")
export class UserPicture {

    @colstring()
    pid: string;

    @file(1, [input, output], "照片文件")
    @colstring()
    image: FileType;

    @integer(2, [output], "上传时间")
    @colinteger()
    time: number;
}

@model([auth])
export class PictureInfo {

    @string(1, [input], "照片路径")
    image: string;
}

@model([auth])
export class UserPictures {

    @string(1, [input, optional], "好友id,不传就是取自己的")
    pid: string;

    @array(2, UserPicture, [output], "所有照片")
    items: UserPicture[];
}

@model([auth])
@table("kv", "user_tilis")
export class UserTili {

    @colstring()
    pid: string;

    @integer(1, [output], "上次恢复的时间")
    @colinteger()
    time: number;
}

// 分享
@model([auth])
@table("kv", "user_shares")
export class UserShare {

    @string(1, [input, output, optional])
    @colstring()
    title: string;

    @string(2, [input, output, optional])
    @colstring()
    desc: string;

    @string(3, [input, output, optional])
    @colstring()
    link: string;

    @string(4, [input, output, optional])
    @colstring()
    image: string;

    @colstring()
    pid: string;

    @colinteger()
    time: number;
}

export enum UserActionRecordType {
    REGISTER,
    LOGIN,
    LOGOUT,
    MODIFY,
    BINDPHONE,
    CHGPASSWD
}

@table("kv", "user_action_records")
export class UserActionRecord {

    @colstring()
    pid: string;

    @colinteger()
    type: UserActionRecordType;

    @colinteger()
    time = DateTime.Now();

    @coljson()
    data: Object;
}

@table("kv", "user_share_counters")
export class UserShareCounter {

    @colstring()
    pid: string;

    @colinteger()
    count: number;
}

@table("kv", "user_sharedaily_counters")
export class UserShareDailyCounter {

    @colstring()
    pid: string;

    @colinteger()
    count: number;

    @colinteger()
    time: number;
}

@table("kv", "user_vipgift_counters")
export class UserVipGiftCounter {

    @colstring()
    pid: string;

    @colinteger()
    type: number; // vip等级

    @colinteger()
    time: number;
}