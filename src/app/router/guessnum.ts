import {action, debug, develop, frqctl, IRouter} from "../../nnt/core/router";
import {Guess, PackInfo} from "../model/guessnum";
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
        if(pack.guessCount <= 0){
            trans.status = Code.COUNT_OVER;
            trans.submit();
            return
        }

        let result=Guessnum.guessCompare(m.guessNum,pack.password);
       let A = result.A;
       let B = result.B;
       let probability=0;
       switch (A){
           case 4:
               pack.AAAA =true;
               return
           case 3:
               if(pack.AAA){
                   return
               }else{
                   return
               }
           case 2:
               if(pack.AA){
                   return
               }else{
                   return
               }
           case 1:
               if(pack.A){
                   return
               }else{
                   return
               }
       }

        m.moneyGeted =1;
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
        let result={
            A:A,
            B:B
        }
        return result;
    }

    protected static async savePack(pack:PackInfo):Promise<PackInfo>{
        return await Insert(PackInfo, {
            pid: DateTime.Current(),
            money:pack.money,
            password:pack.password,
            createTime:new Date().toLocaleString(),
            guessCount:pack.guessCount,
            useTicket:pack.useTicket,
            AAAA:false,
            AAA:false,
            AA:false,
            A:false,
        });
    }

    protected static async getGuessNum(pid:number):Promise<PackInfo>{
        let pack=await Query(PackInfo,{pid:pid});
        if(pack&&pack.guessCount>0){
            await Update(PackInfo,null,[{pid:pid},{$inc:{guessCount:-1}}]);
        }
        return await Query(PackInfo,{pid:pid});
    }

}
