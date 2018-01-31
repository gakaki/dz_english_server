import {array, boolean, double, input, integer, model, output, required, string, type} from "../../nnt/core/proto";
import {colarray, colboolean, coldouble, colinteger, coljson, colstring, coltype, table} from "../../nnt/store/proto";
import {DateTime} from "../../nnt/core/time";
import {UserInfo} from "./user";



@model()
@table('kv', 'packInfo',{ttl:24*60*1000})
export class PackInfo {
    @integer(1, [output], "红包id")
    @colinteger()
    pid: string;

    @double(2, [input,output], "钱数")
    @coldouble()
    money: number;

    @double(9,[output],"剩余金额")
    @coldouble()
    remain:number;

    @type(3, UserInfo, [output], "用户信息")
    userInfo:UserInfo;

    @string(4,[output],"创建时间")
    @colstring()
    createTime:string;

    @string(5,[output],"数字密码")
    @colstring()
    password:string;

    @integer(6,[output],"剩余竞猜次数")
    @colinteger()
    guessCount=20;

    @boolean(7,[input,output],"是否使用红包券")
    @colboolean()
    useTicket:boolean;

    @colboolean()
    AAAA:boolean;

    @colboolean()
    AAA:boolean;

    @colboolean()
    AA:boolean;

    @colboolean()
    A:boolean;

    @integer(8,[output],"红包状态")
    @colinteger()
    status:number;

    @coljson()
    CDList:any;
}

@model()
export class Guess{
    @string(1,[input],"竞猜数字")
    guessNum:string;

    @integer(2,[input],"红包id")
    pid:number;

    @string(3,[output],"用户竞猜答案")
    mark:string;

    @double(4,[output],"用户获得的金钱")
    moneyGeted:number;

}

@model()
export class ClearCD{
    @integer(1,[input],"红包id")
    pid:number;
}


@model()
@table('kv','packGuess_records')
export class PackGuessRecord{
    @string(1,[output],"红包竞猜记录id")
    @colstring()
    pid:string;

    @type(2, UserInfo, [input], "用户信息")
    userInfo:UserInfo;

    @string(3,[output],"红包竞猜数字")
    @colstring()
    numberWord:string;

    @double(4,[output],"获取的钱数")
    @coldouble()
    money:number;
}