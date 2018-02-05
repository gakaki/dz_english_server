import {
    array, boolean, double, input, integer, json, model, optional, output, string,
    type
} from "../../nnt/core/proto";
import { colboolean, coldouble, colinteger, coljson, colstring, table} from "../../nnt/store/proto";
import {UserInfo} from "./user";
import {configs} from "./xlsconfigs";




@model()
@table('kv', 'packInfo',{ttl:Number(configs.Parameter.Get("expire").value)*60*1000})
export class PackInfo {
    @integer(1, [output], "红包id")
    @colinteger()
    pid: number;

    @double(2, [input,output], "钱数")
    @coldouble()
    money: number;

    @double(3, [output], "缺少钱数")
    needmoney: number;

    @double(9,[output],"剩余金额")
    @coldouble()
    remain:number;

    @type(3, UserInfo, [output], "用户信息")
    userInfo:UserInfo;

    @colstring()
    uid:string;

    @string(4,[output],"创建时间")
    @colstring()
    createTime:string =new Date().toLocaleString();

    @colstring()
    password:string;

    @integer(6,[output],"剩余竞猜次数")
    @colinteger()
    guessCount=Number(configs.Parameter.Get("timeslimit").value);

    @boolean(7,[input,output],"是否使用红包券")
    @colboolean()
    useTicket:boolean;

    @colboolean()
    AAAA:boolean =false;

    @colboolean()
    AAA:boolean =false;

    @colboolean()
    AA:boolean =false;

    @colboolean()
    A:boolean =false;

    @colboolean()
    miss:boolean = false;

    @integer(8,[output],"红包状态")
    @colinteger()
    status:number;

    @coljson()
    CDList:any ={};

    @string(10,[input,output,optional],"红包标题")
    @colstring()
    title:string
}

@model()
export class Guess{
    @string(1,[input],"竞猜数字")
    guessNum:string;

    @integer(2,[input],"红包id")
    pid:number;

    @string(5,[output])
    markId:string;

    @string(6,[output],"评语")
    commit:string;

    @string(3,[output],"用户竞猜答案")
    mark:string;

    @double(4,[output],"用户获得的金钱")
    moneyGeted:number;

    @string(8,[output])
    restTime:string;

}

@model()
export class ClearCD{
    @integer(1,[input],"红包id")
    pid:number;
}




@model()
@table('kv','packGuess_records')
export class PackGuessRecord{
    @colstring()
    uid:string;

    @type(9,UserInfo,[output],"用户信息")
    userInfo:UserInfo;

    // @integer(2,[output],"红包id")
    @colinteger()
    pid:number;

    @type(10,PackInfo,[output],"红包信息")
    packInfo:PackInfo;

    @string(3,[output],"用户回答答案")
    @colstring()
    userAnswerWord:string;

    @double(4,[output],"用户获得的金钱")
    @coldouble()
    userGetMoney:number;

    @string(5,[output],"用户回答的结果")
    @colstring()
    userMark:string;

    @string(6,[output],"评语")
    @colstring()
    commit:string;

    @colstring()
    createTime:string;

}



@model()
export class PackRecords{
    @integer(1,[input,output],"红包id")
    pid:number;

    @type(5,UserInfo,[output],"发起人用户信息")
    originator:UserInfo;

    @string(2,[output],"红包竞猜答案")
    packPassword:string;

    @type(3,PackInfo,[output],"红包详情")
    packInfo:PackInfo;

    @array(4,Object,[output],"抢红包记录")
    records:any[];
}
@model()
export class RankInfo{
    @string(1,[output],"用户id")
    uid:string;

    @type(2,UserInfo,[output],"用户信息")
    userInfo:UserInfo;

    @double(3,[output],"获取的总金额")
    moneyGot:number;

    @type(5,PackGuessRecord,[output])
    maxRecord:PackGuessRecord;

    @array(4,PackGuessRecord,[output],"竞猜记录")
    guessRecords:PackGuessRecord[];


}

@model()
export class PackRankingList{
    @integer(1,[input],"红包id")
    pid:number;

    @string(4,[output],"红包口令答案")
    answer:string;

    @type(2,PackInfo,[output],"红包信息")
    packInfo:PackInfo;

    @array(3,RankInfo,[output],"排行信息")
    rank:RankInfo[]
}
@model()
export class SendPackage{
    @double(1,[output],"发送的总金额")
    sum:number;
    @integer(2,[output],"发送的数量")
    num:number;
    @array(3,PackInfo,[output],"发送记录")
    record:PackInfo[]
}

export class GetPack{
    @type(1,UserInfo,[output],"红包的主人")
    userInfo:UserInfo;
    @type(2,PackGuessRecord,[output],"红包信息")
    guessInfo:PackGuessRecord;
}


@model()
export class ReceivePackage{
    @double(1,[output],"接收的总金额")
    sum:number;
    @integer(2,[output],"接收的数量")
    num:number;
    @array(3,GetPack,[output],"发送记录")
    record:GetPack[]
}


@model()
export class UserPackRecord{

    @type(1,SendPackage,[output],"发送红包")
    sendPackages:SendPackage;


    @type(2,ReceivePackage,[output],"收到的红包")
    receivePackages:ReceivePackage;

    @integer(3,[input,optional])
    sendPage:number =1;

    @integer(4,[input,optional])
    sendLimit:number =20;

    @integer(5,[input,optional])
    receivePage:number =1;

    @integer(6,[input,optional])
    receiveLimit:number =20;


}
@model()
export class Acceleration{

    @integer(1,[output])
    num:number;


}