import {colboolean, colinteger, colstring, table} from "../../nnt/store/proto";

// 统计埋点

@table("ss", "server_starts")
export class ServerStart {

    @colinteger()
    time: number;

    @colstring()
    host: string;
}

@table("ss", "actions")
export class StatisAction {

    @colstring()
    router: string;

    @colinteger()
    count: number;

    @colinteger()
    time: number;
}

@table("ss", "user_actions")
export class StatisUserAction {

    @colstring()
    pid: string;

    @colstring()
    router: string;

    @colinteger()
    count: number;

    @colinteger()
    time: number;
}

@table("ss", "user_onlines")
export class StatisUserOnline {

    @colstring()
    pid: string;

    @colboolean()
    online: boolean;

    @colinteger()
    time: number;
}

@table("rd", "statis")
export class StatisUserOnlineCount {

    @colinteger()
    count: number;
}

@table("ss", "online_users_count")
export class StatisOnlineUsersCount {

    @colinteger()
    time: number; // 每十分钟

    @colinteger()
    count: number; // 数量
}