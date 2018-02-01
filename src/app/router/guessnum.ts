import {action, debug, develop, frqctl, IRouter} from "../../nnt/core/router";
import {PackInfo} from "../model/guessnum";
import {Trans} from "../../contrib/manager/trans";
import {UserInfo} from "../model/user";
import {User} from "./user";
import {Code} from "../model/code";
import {Random} from "../../nnt/core/kernel";
import {Aggregate, Insert} from "../../nnt/manager/dbmss";
import {DateTime} from "../../nnt/core/time";
import {colarray, coldouble, colinteger, colstring, coltype} from "../../nnt/store/proto";
import {double, integer, string, type} from "../../nnt/core/proto";
import uuid = require("uuid");




export class Guessnum implements IRouter {
    action :string = "guessnum";

    @action(PackInfo)
    async sendpack(trans: Trans){
        let m: PackInfo = trans.model;
        console.log("+++++++++++++++++++++++++++++++");
        console.log(m);
        if(!m.sid){
            trans.status = Code.USER_NOT_FOUND;
            trans.submit();
            return
        }
        let ui:UserInfo=await User.FindUserBySid(m.sid);
        if(ui==null){
            trans.status = Code.USER_NOT_FOUND;
            trans.submit();
            return
        }
       m.userInfo=ui;
        m.password=  Guessnum.getPack();
        let pi:PackInfo=await Guessnum.savePack(m);
        trans.submit();
    }

   /* @action()
    async guesspack(trans:Trans){

    }*/

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

    protected static async savePack(pack:PackInfo):Promise<PackInfo>{
        return await Insert(PackInfo, {
            pid: uuid.v4(),
            money:pack.money,
            sid:pack.sid,
            password:pack.password
        });
    }

}
