import {
    array, auth, boolean, file, input, integer, json, model, optional, output, string,
    type
} from "../../nnt/core/proto";
import {colboolean, colinteger, coljson, colstring, key, table} from "../../nnt/store/proto";
import {Banner, GameBriefInfo} from "./common";
import {DateTime} from "../../nnt/core/time";
import {IndexedObject} from "../../nnt/core/kernel";
import {configs} from "./xlsconfigs";

@model([auth], Banner)
@table("kv", "banner")
export class AdminBanner extends Banner {

    @string(1, [input, output], "bannerId")
    @colstring([key])
    bid: string;

    @boolean(2, [input, optional], "可用")
    @colboolean()
    enable: boolean;

    @boolean(3, [input, optional], "展示在首页中")
    @colboolean()
    home: boolean;

    @boolean(4, [input, optional], "轮播广告")
    @colboolean()
    carousel: boolean;
}

@model()
export class AdminBanners {

    @array(1, AdminBanner, [output], "列表")
    items: Array<AdminBanner>;
}

@model([auth])
export class AdminAddBanner {

    @string(1, [input], "文字内容")
    content: string;

    @file(2, [input], "图片")
    image: File;

    @string(3, [input], "链接地址")
    link: string;

    @type(4, Banner, [output], "添加的banner")
    banner: Banner;

    @string(5, [output], "bannerId")
    @colstring()
    bid: string;
}

@model([auth])
export class AdminRmBanner {

    @string(1, [input], "banner的数据库id")
    id: string;
}

// 实例化一个游戏
@model([auth], GameBriefInfo)
@table("kv", "game_instances")
export class InstanceGame extends GameBriefInfo {

    @integer(1, [input], "配表id")
    @colinteger()
    index: number;
}

// 所有游戏实例
@model([auth])
export class InstancedGames {

    @array(1, GameBriefInfo, [output])
    items: GameBriefInfo[];
}

@model([auth])
export class ModifyGameInstance {

    @string(1, [input, output], "模板id")
    @colstring()
    tid: string;

    @string(2, [input, output], "实例id")
    @colstring()
    iid: string;

    @file(3, [input, output, optional], "游戏图标")
    @colstring()
    icon: File | string;

    @string(4, [input, output, optional], "游戏名称")
    @colstring()
    name: string;
}

@model([auth])
export class AdminValidUserWord {

    @string(1, [input], '要设置的词汇')
    word: string

    @boolean(2, [input, optional], '是否设置为可用，不传则默认给true')
    valid: boolean = true
}

@model([auth])
export class AdminServerStatus {

    @json(1, [output])
    status: Object;
}

@model([auth])
export class AdminUploadImage {

    @file(1, [input], "图片")
    image: File;

    @string(2, [output])
    path: string;
}

export enum AdminActionRecordType {
    UPLOAD_IMAGE = 0x01,

    BANNER_MODIFY = 0x10,
    BANNER_ADD = 0x11,
    BANNER_RM = 0x12,

    GAME_INSTANCE = 0x20,
    GAME_INSTANCE_MODIFY = 0x21,

    NOTICE_ADD = 0x30,
    SEND_IM = 0x31,

    USER_ADDITEM = 0x10001,
    DRAWQUE_SETUSERWORD = 0x20001,
}

@table("kv", "admin_action_records")
export class AdminActionRecord {

    @colinteger()
    type: AdminActionRecordType;

    @colinteger()
    uid: number;

    @colinteger()
    time = DateTime.Now();

    @coljson()
    payload: IndexedObject;
}

@model([auth])
export class AdminAddItem {

    @string(1, [input])
    pid: string;

    @integer(2, [input], "索引", idx => configs.Item.Get(idx) != null)
    index: number;

    @integer(3, [input], "数量")
    count: number;
}

@model([auth])
export class AdminPushMessage {

    @boolean(1, [input])
    android: boolean;

    @boolean(2, [input])
    ios: boolean;

    @string(3, [input])
    message: string;
}

@model([auth])
export class UserChangeVipLevel {

    @string(1, [input])
    pid: string;

    @integer(2, [input], 'vip等级')
    index: number;
}