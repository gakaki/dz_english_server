import {action, debug, develop, frqctl, IRouter} from "../../nnt/core/router";
import {
    Acceleration,
    ClearCD, GetPack, Guess, PackGuessRecord, PackInfo, PackRankingList, PackRecords, RankInfo, ReceivePackage,
    SendPackage,
    UserPackRecord,
} from "../model/guessnum";
import {Trans} from "../../contrib/manager/trans";
import {UserInfo} from "../model/user";
import {User} from "./user";
import {Code} from "../model/code";
import {ArrayT, Random} from "../../nnt/core/kernel";
import {Aggregate, Count, Insert, Query, QueryAll, Update} from "../../nnt/manager/dbmss";
import {DateTime} from "../../nnt/core/time";
import {configs} from "../model/xlsconfigs";
import {Delta} from "../model/item";





export class Guessnum implements IRouter {
    action :string = "guessnum";
    //发送红包
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

       // m.userInfo=null;

        let delta = new Delta();
        if(ui.itemCount(configs.Item.MONEY)<m.money){
            trans.status = Code.NEED_ITEMS;
            trans.submit();
            return;
        }

        delta.addkv(configs.Item.MONEY,m.money * -1);
       await User.ApplyDelta(ui,delta);
       if(m.useTicket){
           if(ui.itemCount(configs.Item.CASHCOUPON)<0){
               trans.status=Code.NEED_ITEMS;
               trans.submit();
               return;
           }
           delta.addkv(configs.Item.CASHCOUPON,-1);
           await User.ApplyDelta(ui,delta);
       }


       let psw =Guessnum.getPack();
       let pss="";
       for(let i of psw){
           pss += i;
       }
       m.password=pss;
        let pack=await Guessnum.savePack(m);
        m.remain=pack.remain;
        m.pid=pack.pid;
        m.createTime=pack.createTime;
        m.status=pack.status;
        trans.submit();
    }
    //竞猜数字
    @action(Guess)
    async guesspack(trans:Trans){
        let m:Guess=trans.model;
        let ui:UserInfo=await User.FindUserBySid(trans.sid);
        if(ui==null){
            trans.status = Code.USER_NOT_FOUND;
            trans.submit();
            return
        }
        let pack=await Guessnum.getGuessNum(m.pid);
        if(pack == null){
            trans.status = Code.PACK_EMPTY;
            trans.submit();
            return
        }
        console.log(pack);
        let time= new Date(pack.createTime);
        console.log("创建时间");
        console.log(time);
        if(time.getTime() +24*60*60*1000 <= new Date().getTime()){
            console.log(new Date().getTime());
            trans.status = Code.PACK_EXPIRED;
            await Guessnum.updatePackStatus(pack.pid,Code.PACK_EXPIRED);
            trans.submit();
            return
        }

        if(pack.status != Code.PACK_Fighing){
            trans.status = pack.status;
            trans.submit();
            return
        }

        if(pack.guessCount<=0){
            trans.status = Code.PACK_FINSH;
            trans.submit();
            return
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
       let probability=0;

       switch (A+B){
           case 4:
               let cfg= configs.Distribution.Get(4);
               if(pack.AAAA){
                   probability = Random.Rangef(cfg.min,cfg.max);
               }else{
                   probability = Random.Rangef(cfg.firstmin,cfg.firstmax);
                   pack.AAAA=true;
               }
               break;
           case 3:
               let cfgAAA= configs.Distribution.Get(3);
               if(pack.AAA){
                   probability = Random.Rangef(cfgAAA.min,cfgAAA.max);
               }else{
                   probability = Random.Rangef(cfgAAA.firstmin,cfgAAA.firstmax);
                   pack.AAA=true;
               }
               break;
           case 2:
               let cfgAA= configs.Distribution.Get(2);
               if(pack.AA){
                   probability = Random.Rangef(cfgAA.min,cfgAA.max);
               }else{
                   probability = Random.Rangef(cfgAA.firstmin,cfgAA.firstmax);
                   pack.AA=true;
               }
               break;
           case 1:
               let cfgA= configs.Distribution.Get(1);
               if(pack.A){
                   probability = Random.Rangef(cfgAA.min,cfgAA.max);
               }else{
                   probability = Random.Rangef(cfgA.firstmin,cfgA.firstmax);
                   pack.A=true;
               }

       }
        console.log("概率");
        console.log(probability);

        m.moneyGeted =Number((pack.money*probability).toFixed(2));

        if(A==4){
            pack.status=Code.PACK_FINSH;
            m.moneyGeted=pack.remain;
        }


       m.mark=A+"A"+B+"B";
       pack.remain -= m.moneyGeted;
        pack.CDList[trans.sid] = new Date().getTime();
        pack.guessCount -= 1;
        await Guessnum.updatePack(pack);
        console.log("结束");
        console.log(pack.CDList);
        await Guessnum.saveUserGuessRecord(ui.uid,m.guessNum,m.moneyGeted,m.mark,m.pid);

        let delta = new Delta();
        delta.addkv(configs.Item.MONEY,m.moneyGeted);
        await User.ApplyDelta(ui,delta);

        trans.submit();
    }
    //清除等待CD
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

        if(ui.itemCount(configs.Item.ACCELERATION)<0){
            trans.status=Code.NEED_ITEMS;
            trans.submit();
            return;
        }
        let delta = new Delta();
        delta.addkv(configs.Item.ACCELERATION,-1);
        await User.ApplyDelta(ui,delta);

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
    //红包竞猜记录
    @action(PackRecords)
    async getpackrecords(trans:Trans){
        let m:PackRecords=trans.model;
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

        m.packPassword=pack.password;
        m.packInfo={
            totalMoney:pack.money,
            restMoney:pack.remain
        };
        let records=await Guessnum.getPackGuessRecords(m.pid);
        console.log("查询的记录");
        console.log(records);
        m.records=records;
        console.log(m);
        trans.submit();

    }

    //红包竞猜排行榜
    @action(PackRankingList)
    async getpackrankinglist(trans:Trans){
        let m:PackRankingList=trans.model;
        let pack=await Guessnum.getGuessPack(m.pid);
        if(pack == null){
            trans.status = Code.PACK_EMPTY;
            trans.submit();
            return
        }
        pack.userInfo=await User.FindUserInfoByUid(pack.uid);
        m.packInfo=pack;
        let result=await Guessnum.getPackRankingList(m.pid);
        //console.log(result);

        m.rank=result;
       // console.log(m);
        trans.submit()
    }
    //用户红包记录
    @action(UserPackRecord)
    async getuserpackrecords(trans:Trans){
        let m:UserPackRecord = trans.model;
           let ui:UserInfo=await User.FindUserBySid(trans.sid);
       if(ui==null){
           trans.status = Code.USER_NOT_FOUND;
           trans.submit();
           return
       }
       let sendPackage:SendPackage = new SendPackage();
       let receivePackage:ReceivePackage = new ReceivePackage();

       let p= await Guessnum.getPackSumByUid(ui.uid);
        sendPackage.sum=p.sum;
       sendPackage.num=await Guessnum.getPackCountByUid(ui.uid);
       sendPackage.record=await Guessnum.getPacksByUid(ui.uid);

       let r =await Guessnum.getReceivePackageRecordsMoneyByUid(ui.uid);
       receivePackage.sum=r.moneyGot;
       receivePackage.num=await Guessnum.getReceivePackageRecordsCountByUid(ui.uid);
       receivePackage.record=await Guessnum.getReceivePackageRecordsByUid(ui.uid);

        m.sendPackages=sendPackage;
        m.receivePackages=receivePackage;
        console.log(m);
        trans.submit()
}
   //获取加速卡
   @action(Acceleration)
   async getacceleration(trans:Trans){
       let m:Acceleration = trans.model;
       let ui:UserInfo=await User.FindUserBySid(trans.sid);
       if(ui==null){
           trans.status = Code.USER_NOT_FOUND;
           trans.submit();
           return
       }

       let delta = new Delta();
       delta.addkv(configs.Item.ACCELERATION,m.num);
       await User.ApplyDelta(ui,delta);

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
            uid:pack.userInfo.uid,
            title:pack.title,
            //uid:"123",
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
        return await Query(PackInfo,{pid:pid});
    }

    protected static async getGuessPack(pid:number):Promise<PackInfo>{
        return await Query(PackInfo,{pid:pid});
    }
    protected static async updatePack(pack:PackInfo){
        await Update(PackInfo,null,[{pid:pack.pid},pack])
    }
    protected static async updatePackStatus(pid:number,status:number){
        await Update(PackInfo,null,[{pid:pid},{$set:{status:status}}])
    }


    protected static async getPacksByUid(uid:string){
        return await QueryAll(PackInfo,{uid:uid});
    }
    protected static async getPackCountByUid(uid:string){
        return await Count(PackInfo,{uid:uid});
    }
    protected static async getPackSumByUid(uid:string){
        let r = await Aggregate<PackInfo>(PackInfo, {
            $match: {uid: uid,},
            $group:{_id:"$uid",sum:{$sum:"$money"}},
            $limit:1,
        });
        console.log(r);
        return  r[0]
    }

    protected static async saveUserGuessRecord(uid:string,userAnswerWord:string,userGetMoney:number,userMark:string,pid:number){
        await Insert(PackGuessRecord,{
            uid:uid,
            pid:pid,
            userAnswerWord:userAnswerWord,
            userGetMoney:userGetMoney,
            userMark:userMark,
            createTime:new Date().toLocaleString()
        })
    }

    protected static async getPackGuessRecords(pid:number){
        let records:PackGuessRecord []= await QueryAll(PackGuessRecord,{pid:pid});
        for(let record of records){
            record.userInfo = await User.FindUserInfoByUid(record.uid);
        }
        return records;
    }

    protected static async getPackRankingList(pid:number){
        let r = await Aggregate<PackGuessRecord>(PackGuessRecord, {
            $match: {pid: pid,},
            $group:{_id:"$uid",moneyGot:{$sum:"$userGetMoney"}},
            $sort:{moneyGot: -1},
        });
        console.log(r);
        let rankInfos :RankInfo[] = [];
        for(let record of r){
            let rankInfo:RankInfo = new RankInfo();
            console.log(record._id);
            rankInfo.uid=record._id;
            rankInfo.userInfo=await User.FindUserInfoByUid(record._id);
            rankInfo.moneyGot=record.moneyGot;
            let records:Array<PackGuessRecord>=await QueryAll(PackGuessRecord,{pid:pid,uid:record._id});
            rankInfo.guessRecords=records;
            rankInfo.maxMarkId=Guessnum.getMaxGuessRecord(records);
            rankInfos.push(rankInfo);
        }

        return rankInfos;
    }

    protected static getMaxGuessRecord(records:Array<PackGuessRecord>):string{
        let recordsSort=records.sort(function(object1:PackGuessRecord, object2:PackGuessRecord) {
            let value1 = object1["userMark"];
            let value2 = object2["userMark"];
            return value2.localeCompare(value1);
        });
        let cf=configs.evaluates;
        let maxRecord=recordsSort[0];
        console.log(maxRecord);
        for(let i of cf){
            //console.log(i);
            if(i[1]==maxRecord.userMark){
                return i[0];
            }
        }
        //return "1"
    }

    protected static async getReceivePackageRecordsCountByUid(uid:string){
        return await Count(PackGuessRecord,{uid:uid});
    }
    protected static async getReceivePackageRecordsByUid(uid:string){
        let ps= await QueryAll(PackGuessRecord,{uid:uid});
        let getPacks:GetPack[]=[];
        for(let p of ps){
            let getPack:GetPack = new GetPack();
           let pack=await Guessnum.getGuessPack(p.pid);
            getPack.userInfo=await User.FindUserInfoByUid(pack.uid);
            getPack.moneyGot = p.userGetMoney;
            getPacks.push(getPack);
        }
        console.log("总记录");
        console.log(getPacks);
        return getPacks
    }

    protected static async getReceivePackageRecordsMoneyByUid(uid:string){
        let r = await Aggregate<PackGuessRecord>(PackGuessRecord, {
            $match: {uid: uid,},
            $group:{_id:"$uid",moneyGot:{$sum:"$userGetMoney"}},
            $limit:1,
        });
        console.log("获取的总金额");
        console.log(r);
        return r[0];
    }


}
