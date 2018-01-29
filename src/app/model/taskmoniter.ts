import {colboolean, colinteger, colstring, table} from "../../nnt/store/proto";
import {enumm, model} from "../../nnt/core/proto";

@model([enumm])
export class TaskRecord {
    static CHAT = 0x1; // 私聊
    static DATING_QUESTION = 0x20; // 约会回答问题
    static DRAWQUE_COMPLETE = 0x30; // 完成一局你猜我画
    static DRAWQUE_COMPLETE_TEAM = 0x31; // 组队完成一句你猜我画
};

export enum TaskCategory {
    DATING = 0x1, // 约会
}

@table("kv", "task_moniters")
export class TaskMoniter {

    @colinteger() // TaskRecord
    type: number;

    @colinteger()
    category: number; // TaskCategory

    @colstring() // 依赖的id
    id: string;

    @colboolean()
    done: boolean = false;

    @colinteger()
    priority: number = 0; // 同一批id中的优先级
}

export class TaskMoniter_Chat extends TaskMoniter {

    constructor() {
        super();
        this.type = TaskRecord.CHAT;
    }

    @colstring()
    from: string;

    @colstring()
    to: string;

    @colstring()
    couple: string;
}

// 约会答题
export class TaskMoniter_DateQuest extends TaskMoniter {

    constructor() {
        super();
        this.type = TaskRecord.DATING_QUESTION;
    }

    @colinteger()
    quest: number; // datequestion的id

    @colinteger()
    wrongs: number = 0;
}

// 组队画画
export class TaskMoniter_TeamDrawque extends TaskMoniter {

    constructor() {
        super();
        this.type = TaskRecord.DRAWQUE_COMPLETE_TEAM;
    }

    @colstring()
    from: string;

    @colstring()
    to: string;

    @colstring()
    couple: string;

    @colinteger()
    quest: number; // datequestion的id
}
