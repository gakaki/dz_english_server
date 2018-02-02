import {boolean, file, input, integer, integer_t, map, model, output, string, type} from "../../nnt/core/proto";
import {colboolean, colinteger, colmap, colstring, coltype, table} from "../../nnt/store/proto";
import {Item} from "./item";

@model()
@table("kv", "banner")
export class Banner {

    @string(1, [output], "文字")
    @colstring()
    content: string;

    @string(2, [output], "图片地址，不包含host的部分")
    @colstring()
    image: string;

    @string(3, [output], "链接")
    @colstring()
    link: string;
}

@model()
@table("kv", "game_instances")
export class GameBriefInfo {

    @string(1, [input, output], "模板id")
    @colstring()
    tid: string;

    @string(2, [input, output], "实例id")
    @colstring()
    iid: string;

    @file(3, [input, output], "游戏图标")
    @colstring()
    icon: File | string;

    @string(4, [input, output], "游戏名称")
    @colstring()
    name: string;

    @boolean(5, [output], "是否支持购买房间")
    @colboolean()
    buyroom: boolean;

    @colinteger()
    index: number;
}

@model()
export class RoomBriefInfo {

    @string(1, [input, output], "模板id")
    @colstring()
    tid: string;

    @string(2, [input, output], "实例id")
    @colstring()
    iid: string;

    @string(3, [input, output], "房间id")
    @colstring()
    rid: string;
}

@model()
@table("kv", "user_vips")
export class UserVipInfo {

    @colstring()
    pid: string;

    @integer(1, [output], "vip的类型，对应vip的配表id")
    @colinteger()
    type: number;

    @integer(2, [output])
    @colinteger()
    expire: number;
}

// 平台中用户的简要信息
@model()
@table('kv', 'users')
export class UserBriefInfo {
    @string(1, [input, output], "平台号")
    @colstring()
    pid: string;

    @string(2, [input, output], "如果是第三方登陆，则返回UID")
    @colstring()
    uid: string; // 第三方登陆的id, 对小微信小程序，就是用户在微信的openid

    @string(1, [input, output], '用户名')
    @colstring()
    nickName: string;

    @string(2, [input, output], '头像url')
    @colstring()
    avatarUrl:string;

    @string(3, [input, output], '用户的性别，值为1时是男性，值为2时是女性，值为0时是未知')
    @colstring()
    gender:string;

    @string(4, [input, output], '城市')
    @colstring()
    city:string;

    @string(5, [input, output], '省')
    @colstring()
    province:string;

    @string(6, [input, output], '国家')
    @colstring()
    country:string;

    @string(6, [input, output], '用户的语言，简体中文为zh_CN')
    @colstring()
    language:string;

    @boolean(16, [output], "是否在线")
    @colboolean()
    online: boolean;

    @map(18, integer_t, integer_t, [output], "拥有得道具数据，Item表里获得得都在这里面")
    @colmap(integer_t, integer_t)
    items = new Map<number, number>();
    // 获得道具
    item(id: number, ava: boolean = true): Item {
        if (this.items.has(id))
            return Item.FromIndex(id, this.items.get(id));
        return !ava ? null : Item.FromIndex(id);
    }

    itemCount(id: number, def: number = 0): number {
        let fnd = this.item(id, false);
        return fnd ? fnd.count : def;
    }

}