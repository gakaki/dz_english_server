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
import {Aggregate, Count, Insert, Query, QueryAll, Update, Value} from "../../nnt/manager/dbmss";
import {DateTime} from "../../nnt/core/time";
import {configs} from "../model/xlsconfigs";
import {Delta} from "../model/item";
import {Acquire} from "../../nnt/server/mq";
import {AppConfig} from "../model/appconfig";
import {async} from "../../nnt/core/proto";
import * as fs from "fs";
import {logger} from "../../nnt/core/logger";
import {AbstractCronTask} from "../../nnt/manager/crons";
import {CURRENT_HOUR_RANGE} from "../../nnt/component/today";
import {StatisOnlineUsersCount, StatisUserOnlineCount} from "../model/statis";





export class Guessnum implements IRouter {
    action :string = "guessnum";
    //发送红包
    @action(PackInfo)
    async sendpack(trans: Trans){
        let m: PackInfo = trans.model;
        console.log("发送红包");
        console.log(m.money);
        let ui:UserInfo=await User.FindUserBySid(trans.sid);

        if(ui==null){
            trans.status = Code.USER_NOT_FOUND;
            trans.submit();
            return
        }
        if(m.money<1){
            trans.status = Code.NEED_MONEY;
            m.needmoney = 1;
            trans.submit();
            return;
        }



        //计算扣除
        let cost = new Delta();
        if (m.useTicket) {
            if(ui.itemCount(configs.Item.CASHCOUPON)<0){
                trans.status=Code.NEED_COUPON;
                trans.submit();
                return;
            }
           // m.money -= 100;//代金券抵1元
            //扣代金券
            cost.addkv(configs.Item.CASHCOUPON, -1);
        }
        //扣钱数
        cost.addkv(configs.Item.MONEY, m.money*100*-1);
        //获得加速卡

        cost.addkv(configs.Item.ACCELERATION,2);



        let need = Delta.NeedItems(cost.items, ui.items);

        console.log(need);
        //钱数不足，客户端根据错误码跳支付
        if (need.size) {
            trans.status = Code.NEED_MONEY;
            m.needmoney = m.money;
            trans.submit();
            return;
        }

        //钱数OK,
        let pid = DateTime.Current();
        //创建消息通道
        // await Acquire(AppConfig.MQSRV).open("pack." + m.pid, {transmitter: true});//websocket无法使用，改用客户端定时轮询

        //生成红包

        //应用扣除
        await User.ApplyDelta(ui, cost);


        //存库
        m.pid = DateTime.Current();
        m.uid=ui.uid;
      //  m.uid="123";
        m.password = Guessnum.getCode();
        m.remain = m.money;
        m.status = Code.PACK_Fighing;


        await Insert(PackInfo, m);
        m.userInfo=ui;


        setTimeout(async function () {
            console.log("红包要过期了");
            let pack = await Guessnum.getGuessPack(m.pid);
            console.log(pack);
            pack.status=Code.PACK_EXPIRED;
            await Guessnum.updatePack(pack);
            let cost = new Delta();
            cost.addkv(configs.Item.MONEY, pack.remain);
            await User.ApplyDelta(ui, cost);

        },Number(configs.Parameter.Get("expire").value)*60*60*1000);

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
        let pack=await Guessnum.getGuessPack(m.pid);
        if(pack == null){
            trans.status = Code.PACK_EMPTY;
            trans.submit();
            return
        }

        let time= new Date(pack.createTime);

        if(time.getTime() +Number(configs.Parameter.Get("expire").value)*60*60*1000 <= new Date().getTime()){
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
            if(pack.CDList[trans.sid]){
                if(pack.CDList[trans.sid]+Number(configs.Parameter.Get("waitcd").value)*1000 >= new Date().getTime()){
                    trans.status = Code.PACK_ISCD;
                    m.restTime=new Date(pack.CDList[trans.sid]+Number(configs.Parameter.Get("waitcd").value)*1000-new Date().getTime()).toTimeString();
                    trans.submit();
                    return
                }else{
                    delete pack.CDList[trans.sid];
                }
            }
        }else{
            pack.CDList={};
        }


        let result=Guessnum.guessCompare(m.guessNum,pack.password);
       let A = result.A;
       let B = result.B;
       let probability=0;

        switch (A+B){
           case 4:
               let cfgAAAA= configs.Distribution.Get(4);
               if(pack.AAAA){
                   probability = Random.Rangef(cfgAAAA.min,cfgAAAA.max);
               }else{
                   probability = Random.Rangef(cfgAAAA.firstmin,cfgAAAA.firstmax);
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
                   probability = Random.Rangef(cfgA.min,cfgA.max);
               }else{
                   probability = Random.Rangef(cfgA.firstmin,cfgA.firstmax);
                   pack.A=true;
               }
               break;
           case 0:
               let cfg= configs.Distribution.Get(5);
               if(pack.miss){
                   probability = Random.Rangef(cfg.min,cfg.max);
               }else{
                   probability = Random.Rangef(cfg.firstmin,cfg.firstmax);
                   pack.miss=true;
               }
               break;

       }
        console.log("概率");
        console.log(probability);
        console.log("剩余金额");
        console.log(pack.remain);
        let get = Math.floor(pack.money*100*probability);
        m.moneyGeted =get/100;
        console.log("获取的金额");
        console.log(get);
        if(A == 4){
            pack.status=Code.PACK_FINSH;
            m.moneyGeted=(pack.remain)*100/100;
        }


       m.mark=A+"A"+B+"B";
        m.markId=Guessnum.getMarkId(m.mark);
        let cid=Random.Rangei(1,4);
        switch (cid){
            case 1:
                m.commit=configs.Evaluate.Get(Number(m.markId)).iqwored1;
                break;
            case 2:
                m.commit=configs.Evaluate.Get(Number(m.markId)).iqwored2;
                break;
            case 3:
                m.commit=configs.Evaluate.Get(Number(m.markId)).iqwored3;
                break;
        }
        let remain =pack.remain;
        let moneyGeted=m.moneyGeted;
        console.log(remain);
        console.log(moneyGeted);
        pack.remain =(remain*100-moneyGeted*100)/100;

        console.log("红包剩余");
        console.log(pack.remain);

        pack.CDList[trans.sid] = new Date().getTime();
        pack.guessCount -= 1;
        await Guessnum.updatePack(pack);

        await Guessnum.saveUserGuessRecord(ui.uid,m.guessNum,m.moneyGeted,m.mark,m.pid,m.commit);
      //  await Guessnum.saveUserGuessRecord("123",m.guessNum,m.moneyGeted,m.mark,m.pid,m.commit);

        let delta = new Delta();
        delta.addkv(configs.Item.MONEY,m.moneyGeted*100);
        await User.ApplyDelta(ui,delta);

        trans.submit();
    }
    //清除等待CD
    @action(ClearCD)
    async clearcd(trans:Trans){
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
            if(pack.CDList[trans.sid]+Number(configs.Parameter.Get("waitcd").value)*1000 >= new Date().getTime()){
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
        m.originator=await User.FindUserInfoByUid(pack.uid);
        m.packPassword=pack.password;
        m.packInfo=pack;
        let records=await Guessnum.getPackGuessRecords(m.pid);
        m.records=records;
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
        m.answer=pack.password;
        let result=await Guessnum.getPackRankingList(m.pid);
        m.rank=result;

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
        console.log(ui);
        let sendPackage:SendPackage = new SendPackage();
        let receivePackage:ReceivePackage = new ReceivePackage();

        let p= await Guessnum.getPackSumByUid(ui.uid);
        if(p == null){
            sendPackage.sum=0;
        }else{
            sendPackage.sum=Number((p.sum).toFixed(2));
        }

        sendPackage.num=await Guessnum.getPackCountByUid(ui.uid);
        sendPackage.record=await Guessnum.getPacksByUid(ui.uid,m.sendLimit,(m.sendPage-1)*m.sendLimit,{"createTime":-1});

        let r =await Guessnum.getReceivePackageRecordsMoneyByUid(ui.uid);
        if(r == null){
            receivePackage.sum=0;
        }else{
            receivePackage.sum=Number((r.moneyGot).toFixed(2));
        }

        receivePackage.num=await Guessnum.getReceivePackageRecordsCountByUid(ui.uid);
        receivePackage.record=await Guessnum.getReceivePackageRecordsByUid(ui.uid,m.receiveLimit,(m.receivePage-1)*m.receiveLimit,{"createTime":-1});

        m.sendPackages=sendPackage;
        m.receivePackages=receivePackage;

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
       let localData=new Date().toLocaleDateString();
       let rootPath="./minAPPShare/";
       let firstPth=rootPath+ui.uid+"/";
       let secondPath=firstPth+localData+"/";
       try{
           if(!await fs.existsSync(rootPath)){
               await fs.mkdirSync(rootPath);
           }
           if(!await fs.existsSync(firstPth)){
               await fs.mkdirSync(firstPth);
           }
           if(!await fs.existsSync(secondPath)){
               //每日首次分享
               let delta = new Delta();
               delta.addkv(configs.Item.ACCELERATION,1);
               await User.ApplyDelta(ui,delta);
               await fs.mkdirSync(secondPath);
           }else{
               trans.status=Code.PACK_ISSHARED;
           }
       }catch (err){
           logger.warn("文件IO异常: "+err);
       }

       trans.submit();
   }

    protected static getCode(){
        let psw=new Set();
        while (psw.size < 4) {
            psw.add(Random.Rangei(0, 9, true))
        }
        return Array.from(psw).join('');
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



    protected static async getGuessPack(pid:number):Promise<PackInfo>{
        return await Query(PackInfo,{pid:pid});
    }
    protected static async updatePack(pack:PackInfo){
        await Update(PackInfo,null,[{pid:pack.pid},pack])
    }
    protected static async updatePackStatus(pid:number,status:number){
        await Update(PackInfo,null,[{pid:pid},{$set:{status:status}}])
    }

    protected static async getPacksByUid(uid:string,limit:number,skip:number,sort:any){
        return await QueryAll(PackInfo,{uid:uid},limit,skip,sort);
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

        if(r &&r.length>0){
            return  r[0]
        }else{
            return null;
        }

    }

    protected static async saveUserGuessRecord(uid:string,userAnswerWord:string,userGetMoney:number,userMark:string,pid:number,commit:string){
        await Insert(PackGuessRecord,{
            uid:uid,
            pid:pid,
            userAnswerWord:userAnswerWord,
            userGetMoney:userGetMoney,
            userMark:userMark,
            createTime:new Date().toLocaleString(),
            commit:commit
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

        let rankInfos :RankInfo[] = [];
        for(let record of r){
            console.log(record.moneyGot);
            let rankInfo:RankInfo = new RankInfo();
            rankInfo.uid=record._id;
            rankInfo.userInfo=await User.FindUserInfoByUid(record._id);
            rankInfo.moneyGot=record.moneyGot;
            let records:Array<PackGuessRecord>=await QueryAll(PackGuessRecord,{pid:pid,uid:record._id});
            rankInfo.guessRecords=records;
            rankInfo.maxRecord=Guessnum.getMaxGuessRecord(records);
            rankInfos.push(rankInfo);
        }

        return rankInfos;
    }

    protected static getMaxGuessRecord(records:Array<PackGuessRecord>){
        let recordsSort=records.sort(function(object1:PackGuessRecord, object2:PackGuessRecord) {
            let value1 = object1["userMark"];
            let value2 = object2["userMark"];
            return value2.localeCompare(value1);
        });

        return recordsSort[0];
    }

    protected static getMarkId(mark:string){
        for(let i of configs.evaluates){
            if(i[1]==mark){
                return i[0];
            }
        }
        return 0;
    }

    protected static async getReceivePackageRecordsCountByUid(uid:string){
        return await Count(PackGuessRecord,{uid:uid});
    }

    protected static async getReceivePackageRecordsByUid(uid:string,limit:number,skip:number,sort:any){
        let ps= await QueryAll(PackGuessRecord,{uid:uid},limit,skip,sort);
        let getPacks:GetPack[]=[];
        for(let p of ps){
            let getPack:GetPack = new GetPack();
            let pack=await Guessnum.getGuessPack(p.pid);
            if(pack!=null){
                getPack.userInfo=await User.FindUserInfoByUid(pack.uid);
                getPack.guessInfo = p;
                p.packInfo=pack;
                getPacks.push(getPack);
            }
        }

        return getPacks
    }

    protected static async getReceivePackageRecordsMoneyByUid(uid:string){
        let r = await Aggregate<PackGuessRecord>(PackGuessRecord, {
            $match: {uid: uid,},
            $group:{_id:"$uid",moneyGot:{$sum:"$userGetMoney"}},
            $limit:1,
        });
        if(r && r.length>0){
            return r[0];
        }else{
            return null;
        }

    }


}

class PackExpireCheckTask extends AbstractCronTask {
    async main() {
        //待优化，使用计划任务处理过期红包

    }
}
