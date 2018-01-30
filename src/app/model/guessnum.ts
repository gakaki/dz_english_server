import {double, input, model, output, string} from "../../nnt/core/proto";
import {coldouble, colstring, table} from "../../nnt/store/proto";

@model()
@table('kv', 'guess_packs')
export class PackInfo {
    @string(1, [output], "红包id")
    @colstring()
    pid: string;

    @double(2, [input], "钱数")
    @coldouble()
    money: number;
}
