import {array, double, input, integer, model, output, required, string, type} from "../../nnt/core/proto";
import {colarray, coldouble, colinteger, colstring, coltype, table} from "../../nnt/store/proto";
import {DateTime} from "../../nnt/core/time";
import {UserInfo} from "./user";



@model()
@table('kv', 'packInfo',{ttl:24*60*1000})
export class PackInfo {
    @string(1, [output], "红包id")
    @colstring()
    pid: string;

    @double(2, [input,output], "钱数")
    @coldouble()
    money: number;

    @string(3, [input,output], "sid")
    @colstring()
    sid:string;

    @type(4, UserInfo, [output], "用户信息")
    userInfo:UserInfo;

    @type(6,DateTime,[output],"创建时间")
    @coltype(DateTime)
    createTime=DateTime.Now;

    @type(5,Set,[output],"数字密码")
    @colarray(Set)
    password=new Set();

    @integer(7,[output],"剩余竞猜次数")
    @colinteger()
    guessCount=20
}

@model()
export class Guess{
    
    guessNum=new Set()
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