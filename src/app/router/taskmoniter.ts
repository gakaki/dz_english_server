import {IRouter} from "../../nnt/core/router";
import {TaskCategory, TaskMoniter} from "../model/taskmoniter";
import {Aggregate, Delete, Insert, QueryAll, Update} from "../../nnt/manager/dbmss";
import {logger} from "../../nnt/core/logger";
import {IndexedObject} from "../../nnt/core/kernel";
import {Output} from "../../nnt/store/proto";

// task完成或者需要检查时，通过查找category对应的处理器，来启动处理
export interface ITaskCategoryProcessor {

    // complete =true 代表是完成所有task，否则只是检查
    process(id: string, complete: boolean, cb: () => void): void;
}

let processors = new Map<TaskCategory, ITaskCategoryProcessor>();

export function RegisterTaskCategoryProcessor(cate: TaskCategory, proc: ITaskCategoryProcessor) {
    processors.set(cate, proc);
}

export function RunTaskCategoryProcessor(cate: TaskCategory, id: string, complete: boolean): Promise<void> {
    let proc = processors.get(cate);
    return new Promise(resolve => {
        if (!proc) {
            logger.warn("没有找到 {{=it.cate}} 对应的处理器", {cate: cate});
            return;
        }
        proc.process(id, complete, resolve);
    });
}

export class Task implements IRouter {
    action = "task";

    // 设置某个task为结束
    static async Done(m: TaskMoniter): Promise<boolean> {
        if (!m)
            return false;
        let res = await Update(TaskMoniter, null, [Output(m), {$set: {done: true}}]);
        if (!res)
            return false;
        RunTaskCategoryProcessor(res.category, res.id, false);
        return true;
    }

    static async Query(id: string): Promise<TaskMoniter[]> {
        return QueryAll(TaskMoniter, {id: id});
    }

    // 查找没有完成的
    static async Incomplete(id: string): Promise<IndexedObject> {
        let r = await Aggregate(TaskMoniter, {
            $match: {id: id, done: {$ne: true}},
            $sort: {priority: 1},
            $limit: 1
        });
        return r[0];
    }

    static async Add(m: TaskMoniter): Promise<TaskMoniter> {
        if (!m)
            return;
        if (!m.id) {
            logger.warn("task缺少了 id 数据");
            return;
        }
        if (!m.category) {
            logger.warn("task缺少了 category 数据");
            return;
        }
        return Insert(TaskMoniter, m);
    }

    static async DeleteMoniter(id: string): Promise<boolean> {
        let res = await Delete(TaskMoniter, null, {id: id});
        return res.remove != 0;
    }

}