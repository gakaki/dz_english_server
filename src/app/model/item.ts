import {MapT, pair, toNumber} from "../../nnt/core/kernel";
import {auth, boolean, input, integer, integer_t, map, model, output} from "../../nnt/core/proto";
import {colinteger, colmap, colstring, table} from "../../nnt/store/proto";
import {configs} from "./xlsconfigs";

@model([auth])
export class Item {

    @integer(1, [input, output], "配表索引")
    @colinteger()
    index: number;

    @integer(2, [input, output], "数量")
    @colinteger()
    count: number;

    multiply(n: number): this {
        this.count *= n;
        return this;
    }

    get name(): string {
        return this.cfg().name;
    }

    private _cfg: configs.Item;

    protected cfg(): configs.Item {
        if (this._cfg)
            return this._cfg;
        this._cfg = configs.Item.Get(this.index);
        return this._cfg;
    }

    static FromIndex(idx: number, count: number = 0): Item {
        let r = new Item();
        r.index = idx;
        r.count = count;
        return r;
    }

    static FromCfg(cfg: pair<number, number>): Item {
        if (!cfg)
            return null;
        let r = new Item();
        r.index = cfg.k;
        r.count = cfg.v;
        return r;
    }

    static FromCfgs(cfg: pair<number, number>[]): Item[] {
        let r = new Array<Item>();
        cfg && cfg.forEach(e => {
            r.push(this.FromCfg(e));
        });
        return r;
    }

    // 转换到map
    static ToMap(...items: Item[]): Map<number, number> {
        let r = new Map<number, number>();
        items.forEach(e => {
            r.set(e.index, e.count);
        });
        return r;
    }
}

@model()
export class Delta {

    static Item(...items: Item[]): Delta {
        return this.Items(items);
    }

    static Items(items: Item[]): Delta {
        let r = new Delta();
        items.forEach(e => {
            if (e && e.count) {
                r.items.set(e.index, e.count);
            }
        });
        return r;
    }

    static Map(items: Map<number, number>): Delta {
        let r = new Delta();
        items.forEach((v, k) => {
            if (v)
                r.items.set(k, v);
        });
        return r;
    }

    static Kvs(...p: any[]): Delta {
        let r = new Delta();
        for (let i = 0, l = p.length; i < l; i += 2) {
            if (p[i + 1])
                r.items.set(p[i], p[i + 1]);
        }
        return r;
    }

    @map(1, integer_t, integer_t, [output], "物品信息")
    @colmap(integer_t, integer_t)
    items = new Map<number, number>();

    // 应用vip得加成
    @boolean(2, [output], "是否应用VIP加成")
    vipAddition: boolean;

    get size(): number {
        return this.items.size;
    }

    add(...items: Item[]): this {
        if (!items || !items.length)
            return this;
        items.forEach(item => {
            if (item)
                this.addkv(item.index, item.count);
        });
        return this;
    }

    addkv(idx: number, count: number): this {
        if (count == 0)
            return this;
        if (this.items.has(idx)) {
            let now = this.items.get(idx);
            now += count;
            this.items.set(idx, now);
        }
        else {
            this.items.set(idx, count);
        }
        return this;
    }

    merge(r: Delta): this {
        if (!r)
            return this;
        r.items.forEach((v, k) => {
            this.addkv(k, v);
        });
        return this;
    }


    multiply(n: number): this {
        this.items.forEach((v, k) => {
            this.items.set(k, v * n);
        });
        return this;
    }

    // 变成cost
    asCost(): this {
        this.items.forEach((v, k) => {
            this.items.set(k, -v);
        });
        return this;
    }

    toString(): string {
        let ss = new Array();
        this.items.forEach((v, k) => {
            ss.push(k + ":" + v);
        });
        return ss.join(",");
    }

    // 计算缺少的数量，在into中计算from差多少
    static NeedItems(from: Map<number, number>, into: Map<number, number>): Map<number, number> {
        let m = new Map<number, number>();
        MapT.Foreach(from, (v, k) => {
            if (v > 0) {
                if (!into.has(k)) {
                    m.set(k, v);
                }
                else {
                    let hav = into.get(k);
                    if (hav < v)
                        m.set(k, v - hav);
                }
            }
            return true;
        });
        return m;
    }

    // 设置增量的类型，ItemRecord表
    record(typ: number): this {
        this.type = typ;
        return this;
    }

    // 查找某个道具的数量
    count(index: number): number {
        return this.items.has(index) ? this.items.get(index) : 0;
    }

    type: number;
}

@table("kv", "user_item_counters")
export class UserItemCounter {

    @colinteger()
    total: number; // 当前

    @colinteger()
    addup: number; // 历史总量

    @colinteger()
    cost: number; // 消耗

    @colinteger()
    delta: number; // 最近一次增量

    @colinteger()
    index: number;

    @colinteger()
    count: number;

    @colstring()
    pid: string;
}
