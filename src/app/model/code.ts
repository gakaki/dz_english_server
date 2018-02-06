import {enumm, model} from "../../nnt/core/proto";

@model([enumm])
export class Code {
    static LOGIN_FAILED = -100; // 登陆失败
    static USER_EXISTS = -101; // 用户已经存在
    static LOGIN_EXPIRED = -102; // 登陆过期需要重新登陆
    static ANNOYMOUS_DENY = -103; // 匿名无权
    static USER_NOT_FOUND = -104; // 没有找到用户
    static VERIFY_FAILED = -105; // 验证失败
    static ROOMID_FAILED = -106; // 分派房间id失败
    static FRIEND_WAIT = -107; // 正在等待好友通过
    static REQUIREMENT_FAILED = -108; // 不满足条件
    static ROOM_FULLED = -109; // 满员
    static ROOM_EXPIRED = -110; // 房间过期
    static ROOM_USER_EXISTS = -111; // 用户已经在房间内
    static GANG_FULLED = -112; // 宝宝列表已满
    static NEED_ITEMS = -113; // 道具不足
    static FRIEND_APPLY = -114; // 正在等待自己通过
    static FRIEND_DONE = -115; // 已经是好友
    static CANNOT_CHANGED = -116; // 性别已经修改过，不能再次修改
    static PICKED = -117; // 已经领取
    static REQUIRED_LOST = -118; // 条件未满足
    static USER_OFFLINE = -119; // 用户不在线
    static USER_INTEAM = -120; // 用户已经组队
    static ANSWER_WRONG = -121; // 回答错误
    static CANNOT_BE_SELF = -122; // 是自己
    static GANG_ALREADY_RECOMMAND = -123; // 已经自荐过了
    static NO_USING_PET = -124; // 没有佩戴中的宠物
    static ROOM_JOINING = -125; // 用户正在参与一个房间的活动
    static PHONE_BINDED = -126; // 手机已经绑定过其他账号
    static MUST_FRIEND = -127; // 必须是好友
    static PACKID_MQ_CREATE_FAILED = -128; // 红包消息通道失败
    static COUNT_OVER = -129; //竞猜次数用尽
    static PACK_EMPTY = -130; //红包不存在
    static PACK_EXPIRED = -131; //红包已过期
    static PACK_FINSH = -132; //红包竞猜结束
    static PACK_ISCD = -133; //红包竞猜CD中
    static PACK_ISSHARED=-134;//不是首次分享
    static NO_MONEY=-136;//企业没钱
    static EXCEED_COUNT=-137;//超过提现次数
    static PACK_Fighing = 168; //红包可竞猜
    static NEED_COUPON = 170; //代金券不足
    static NEED_MONEY = 171; //金额不足


}
