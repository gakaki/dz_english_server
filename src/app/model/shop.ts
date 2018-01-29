import {auth, double, input, integer, model, optional, output, string, type} from "../../nnt/core/proto";
import {Delta} from "./item";
import {coldouble, colinteger, colstring, table} from "../../nnt/store/proto";
import {configs} from "./xlsconfigs";
import {PayOrder} from "../../nnt/core/models";

@model([auth], PayOrder)
@table("kv", "recharge_records")
export class RechargeRecord extends PayOrder {

    @colstring()
    pid: string;

}


@model([auth])
export class BuyItem {

    @integer(1, [input], "配表ID")
    index: number;

    @integer(2, [input, optional], "购买的数量，默认为 1", inp => inp > 0)
    count: number = 1;

    @type(4, Delta, [output])
    delta: Delta;
}

// 兑换item
@model([auth])
export class ExchangeItem {

    @integer(1, [input], "目标")
    index: number;

    @integer(2, [input, optional], "数量，默认为1", cnt => cnt > 0)
    count: number = 1;

    @type(3, Delta, [output])
    delta: Delta;
}

@model([auth])
export class TestOrder {

    @string(1, [input])
    orderid: string;
}