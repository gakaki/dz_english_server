import {action, debug, develop, frqctl, IRouter} from "../../nnt/core/router";
import {ClearCD, Guess, PackInfo} from "../model/guessnum";
import {Trans} from "../../contrib/manager/trans";
import {UserInfo} from "../model/user";
import {User} from "./user";
import {Code} from "../model/code";
import {Random} from "../../nnt/core/kernel";
import {Insert, Query, Update} from "../../nnt/manager/dbmss";
import {DateTime} from "../../nnt/core/time";
import {colarray, coldouble, colinteger, colstring, coltype} from "../../nnt/store/proto";
import {double, integer, string, type} from "../../nnt/core/proto";
import uuid = require("uuid");




export class Guessnum implements IRouter {
    action :string = "guessnum";

    @action(PackInfo)
    async sendpack(trans: Trans){
        let m: PackInfo = trans.model;
        let ui:UserInfo=await User.FindUserBySid(trans.sid);
        if(ui==null){
            trans.status = Code.USER_NOT_FOUND;
            trans.submit();
            return
        }
       m.userInfo=ui;
       //m.userInfo=null;
       let psw =Guessnum.getPack();
       let pss="";
       for(let i of psw){
           pss += i;
       }
       m.password=pss;
        m=await Guessnum.savePack(m);
        trans.submit();
    }

    @action(Guess)
    async guesspack(trans:Trans){
        let m:Guess=trans.model;
        let pack=await Guessnum.getGuessNum(m.pid);
        if(pack == null){
            trans.status = Code.PACK_EMPTY;
            trans.submit();
            return
        }
        let ui:UserInfo=await User.FindUserBySid(trans.sid);
        if(ui==null){
            trans.status = Code.USER_NOT_FOUND;
            trans.submit();
            return
        }
        if(pack.status != Code.PACK_Fighing){
            trans.status = pack.status;
            trans.submit();
            return
        }

       console.log("进来");
        console.log(pack.CDList);
        console.log(pack.CDList.length);
        if(pack.CDList){
            console.log("111111");
        }
        if(pack.CDList){
            console.log("存在cd列表");
            if(pack.CDList[trans.sid]){
                console.log(pack.CDList[trans.sid]);
                console.log(pack.CDList[trans.sid]+3*60*1000);
                console.log(new Date().getTime());
                if(pack.CDList[trans.sid]+3*60*1000 >= new Date().getTime()){
                    trans.status = Code.PACK_ISCD;
                    trans.submit();
                    return
                }else{
                    console.log("删除");
                    delete pack.CDList[trans.sid];
                }
            }
        }else{
            console.log("不存在CD列表");
            pack.CDList={};
        }



        let result=Guessnum.guessCompare(m.guessNum,pack.password);
       let A = result.A;
       let B = result.B;
       let probability=1;
       if(A==4){
           pack.status=Code.PACK_FINSH;
       }
       switch (A+B){
           case 4:
               if(pack.AAAA){
                   probability = Random.Rangef(0.03,0.04);
               }else{
                   probability = Random.Rangef(0.08,0.1);
                   pack.AAAA=true;
               }
               break;
           case 3:
               if(pack.AAA){
                   probability = Random.Rangef(0.02,0.03);
               }else{
                   probability = Random.Rangef(0.06,0.08);
                   pack.AAA=true;
               }
               break;
           case 2:
               if(pack.AA){
                   probability = Random.Rangef(0.01,0.02);
               }else{
                   probability = Random.Rangef(0.04,0.06);
                   pack.AA=true;
               }
               break;
           case 1:
               if(pack.A){
                   probability = 0.01
               }else{
                   probability = Random.Rangef(0.03,0.04);
                   pack.A=true;
               }

       }
        m.moneyGeted =pack.money*probability;
       m.mark=A+"A"+B+"B";
       pack.remain -= m.moneyGeted;
        pack.CDList[trans.sid] = new Date().getTime();
        await Guessnum.updatePack(pack);
        console.log("结束");
        console.log(pack.CDList);
        trans.submit();
    }

    @action(ClearCD)
    async clearcd(trans:Trans){
        console.log("没有进来？");
        let m:ClearCD = trans.model;
        let ui:UserInfo=await User.FindUserBySid(trans.sid);
        if(ui==null){
            trans.status = Code.USER_NOT_FOUND;
            trans.submit();
            return
        }
        let pack=await Guessnum.getGuessPack(m.pid);
        if(pack == null){
            trans.status = Code.PACK_EMPTY;
            trans.submit();
            return
        }
        if(pack.status != Code.PACK_Fighing){
            trans.status = pack.status;
            trans.submit();
            return
        }

        if(pack.CDList[trans.sid]){
            console.log(pack.CDList[trans.sid]);
            console.log(pack.CDList[trans.sid]+3*60*1000);
            console.log(new Date().getTime());
            if(pack.CDList[trans.sid]+3*60*1000 >= new Date().getTime()){
                delete pack.CDList[trans.sid];
                await Guessnum.updatePack(pack);
            }else{
                trans.status = Code.PACK_Fighing;
            }
        }else{
            trans.status = Code.PACK_Fighing;
        }
        trans.submit();
    }

    protected static getPack(){
        let psw=new Set();
        return getPsw(psw);
        function getPsw(setList:Set<string>):Set<string>{
            if(setList.size<4){
                let p=Random.Rangei(0,9,true);
                setList.add(p.toString());
                return getPsw(setList);
            }else{
                return setList;
            }
        }
    }

    protected static guessCompare(guessNum:string,answer:string){
        let guessA=[...guessNum];
        let answerA=[...answer];
        let A=0;
        let B=0;
        for(let i=0;i<answerA.length;i++){
            for(let j=0;j<guessA.length;j++){
              if(guessA[j]== answerA[i] && j == i){
                  A += 1;
                  break;
              }else if(guessA[j]== answerA[i]){
                  B += 1;
              }
            }
        }

        return {
            A:A,
            B:B
        };
    }

    protected static async savePack(pack:PackInfo):Promise<PackInfo>{
        return await Insert(PackInfo, {
            pid: DateTime.Current(),
            money:pack.money,
            remain:pack.money,
            password:pack.password,
            createTime:new Date().toLocaleString(),
            guessCount:pack.guessCount,
            useTicket:pack.useTicket,
            AAAA:false,
            AAA:false,
            AA:false,
            A:false,
            status:Code.PACK_Fighing,
            CDList:{}
        });
    }


    protected static async getGuessNum(pid:number):Promise<PackInfo>{
        let pack=await Query(PackInfo,{pid:pid});
        if(pack&&pack.guessCount>0&& pack.status == Code.PACK_Fighing){
            await Update(PackInfo,null,[{pid:pid},{$inc:{guessCount:-1}}]);
        }else{
            await Update(PackInfo,null,[{pid:pid},{$set:{status:Code.PACK_FINSH}}])
        }
        return await Query(PackInfo,{pid:pid});
    }

    protected static async getGuessPack(pid:number):Promise<PackInfo>{
        return await Query(PackInfo,{pid:pid});
    }
    protected static async updatePack(pack:PackInfo){
        await Update(PackInfo,null,[{pid:pack.pid},pack])
    }

}
