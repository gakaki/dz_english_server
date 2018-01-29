import {output, string} from "../../nnt/core/proto";
import {colstring} from "../../nnt/store/proto";

export class PackInfo {
    @string(1, [output], "红包id")
    @colstring()
    pid: string;

    money: number;
}
