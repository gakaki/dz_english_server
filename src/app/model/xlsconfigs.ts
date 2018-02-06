export module configs {

type unknown = string;
type rowindex = number;
let t:any;

interface pair <K, V> {k:K;v:V;}


    export class Guessstart {
        //id
        get id():number { return this.cfg[0]; } 
        //消耗现金
        get consume():number { return this.cfg[1]; } 
        
        static INDEX_ID = 0;
        static INDEX_CONSUME = 1;
        
        
        static Get(key:number):Guessstart {return key in _guessstartMap ? new Guessstart(_guessstartMap[key]) : null;}
        constructor(d:any) { this.cfg = d; }
        cfg:any;
    }

    export class Parameter {
        //属性
        get id():string { return this.cfg[0]; } 
        //具体变量
        get value():string { return this.cfg[1]; } 
        
        static INDEX_ID = 0;
        static INDEX_VALUE = 1;
        
        
        static Get(key:string):Parameter {return key in _parameterMap ? new Parameter(_parameterMap[key]) : null;}
        constructor(d:any) { this.cfg = d; }
        cfg:any;
    }

    export class Message {
        //id
        get id():number { return this.cfg[0]; } 
        //文字
        get words():string { return this.cfg[1]; } 
        
        static INDEX_ID = 0;
        static INDEX_WORDS = 1;
        
        
        static Get(key:number):Message {return key in _messageMap ? new Message(_messageMap[key]) : null;}
        constructor(d:any) { this.cfg = d; }
        cfg:any;
    }

    export class Evaluate {
        //id
        get id():number { return this.cfg[0]; } 
        //得分形式
        get score():string { return this.cfg[1]; } 
        //智商评语1
        get iqwored1():string { return this.cfg[2]; } 
        //智商评语2
        get iqwored2():string { return this.cfg[3]; } 
        //智商评语3
        get iqwored3():string { return this.cfg[4]; } 
        
        static INDEX_ID = 0;
        static INDEX_SCORE = 1;
        static INDEX_IQWORED1 = 2;
        static INDEX_IQWORED2 = 3;
        static INDEX_IQWORED3 = 4;
        
        
        static Get(key:number):Evaluate {return key in _evaluateMap ? new Evaluate(_evaluateMap[key]) : null;}
        constructor(d:any) { this.cfg = d; }
        cfg:any;
    }

    export class Item {
        //id
        get id():number { return this.cfg[0]; } 
        //名称
        get name():string { return this.cfg[1]; } 
        
        static INDEX_ID = 0;
        static INDEX_NAME = 1;
        
        static MONEY = 1;
        static CASHCOUPON = 2;
        static ACCELERATION = 3;
        
        static Get(key:number):Item {return key in _itemMap ? new Item(_itemMap[key]) : null;}
        constructor(d:any) { this.cfg = d; }
        cfg:any;
    }

    export class Question {
        //id
        get id():number { return this.cfg[0]; } 
        //问题
        get question():string { return this.cfg[1]; } 
        //答案
        get answer():string { return this.cfg[2]; } 
        
        static INDEX_ID = 0;
        static INDEX_QUESTION = 1;
        static INDEX_ANSWER = 2;
        
        
        static Get(key:number):Question {return key in _questionMap ? new Question(_questionMap[key]) : null;}
        constructor(d:any) { this.cfg = d; }
        cfg:any;
    }

    export class Topic {
        //id
        get id():number { return this.cfg[0]; } 
        //标题
        get topic():string { return this.cfg[1]; } 
        
        static INDEX_ID = 0;
        static INDEX_TOPIC = 1;
        
        
        static Get(key:number):Topic {return key in _topicMap ? new Topic(_topicMap[key]) : null;}
        constructor(d:any) { this.cfg = d; }
        cfg:any;
    }

    export class Distribution {
        //id
        get id():number { return this.cfg[0]; } 
        //A+B数值
        get determine():number { return this.cfg[1]; } 
        //第一次猜到的最小比例
        get firstmin():number { return this.cfg[2]; } 
        //第一次猜到的最大比例
        get firstmax():number { return this.cfg[3]; } 
        //之后的最小比例
        get min():number { return this.cfg[4]; } 
        //之后猜到的最大的比例
        get max():number { return this.cfg[5]; } 
        
        static INDEX_ID = 0;
        static INDEX_DETERMINE = 1;
        static INDEX_FIRSTMIN = 2;
        static INDEX_FIRSTMAX = 3;
        static INDEX_MIN = 4;
        static INDEX_MAX = 5;
        
        
        static Get(key:number):Distribution {return key in _distributionMap ? new Distribution(_distributionMap[key]) : null;}
        constructor(d:any) { this.cfg = d; }
        cfg:any;
    }

    export class Share {
        //id
        get id():number { return this.cfg[0]; } 
        //分享标题
        get title():string { return this.cfg[1]; } 
        //链接
        get link():unknown { return this.cfg[2]; } 
        //图片
        get image():unknown { return this.cfg[3]; } 
        
        static INDEX_ID = 0;
        static INDEX_TITLE = 1;
        static INDEX_LINK = 2;
        static INDEX_IMAGE = 3;
        
        
        static Get(key:number):Share {return key in _shareMap ? new Share(_shareMap[key]) : null;}
        constructor(d:any) { this.cfg = d; }
        cfg:any;
    }


    export const guessstarts:Array<any> = [
        [1,1.68],[2,8.8],[3,28.8]
        ];

    export const parameters:Array<any> = [
        ["timeslimit","20"],["waitcd","180"],["expire","3"],["rewardmax","50000"],["withdrawalsmax","50000"],["withdrawalsnum","3"],["withdrawalsmin","2"]
        ];

    export const messages:Array<any> = [
        [1,"竞猜pk已过期"],[2,"赏金至少1元"],[3,"赏金上限50000元"],[4,"赏金已领取完毕"],[5,"竞猜次数达到上限"],[6,"每天最多提现3次"],[7,"提现金额上限50000元"],[8,"您目前没有加速卡，每日首次分享可获得加速卡"],[9,"提现成功，1-7个工作日到账。"],[10,"请输入0-9不重复的4位数"]
        ];

    export const evaluates:Array<any> = [
        [1,"0A0B","4位数字对你来说有点难。","4位数字对你来说有点难。","你很诚实，因为说谎总被识破。"],[2,"0A1B","新年了，你又长大了一岁。","你可能没看懂题目。","有脑子，就是懒得用。"],[3,"1A0B","你很努力，就是少点天赋。","总能在试题中蒙中正确答案。","总能在试题中蒙中正确答案。"],[4,"0A2B","小时候买不起PSP，终成学霸。","智商高不高完全看心情。","稍微动下脑子也是不明觉厉。"],[5,"1A1B","七岁时用石头砸自家水缸救人。","大智若愚。","勤能补拙，笨鸟先飞。"],[6,"2A0B","你拥有超强的记忆力。","你拥有超强的记忆力。","你拥有超强的记忆力。"],[7,"0A3B","懂得把握机会展现自己。","腰缠万贯，学富五车。","懂得把握机会展现自己。"],[8,"1A2B","智商碾压方圆十里的人。","天下才有一石，你独占八斗。","天下才有一石，你独占八斗。"],[9,"2A1B","你哥说七步成诗不然揍你，你赢了","加倍的勤奋成就了你的天才。","你哥说七步成诗不然揍你，你赢了"],[10,"3A0B","你智商一般，但颜值很高。","生而知之者上也，说的就是你。","你智商一般，但颜值很高。"],[11,"0A4B","五岁时喜欢玩10万片的拼图。","聪明且有想法，从不人云亦云。","五岁时喜欢玩10万片的拼图。"],[12,"1A3B","看似呆萌，实则精明。","六岁时牵大象至船上而知其重量。","六岁时牵大象至船上而知其重量。"],[13,"2A2B","与生俱来的超强领悟力。","天才都是怪人，你却是例外。","天才都是怪人，你却是例外。"],[14,"3A1B","地球的智商代表。","和爱因斯坦一个级别。","和爱因斯坦一个级别。"],[15,"4A0B","过高智商的你常常感觉到孤独。","外星球的智商。","过高智商的你常常感觉到孤独。"]
        ];

    export const items:Array<any> = [
        [1,"现金"],[2,"代金券"],[3,"加速卡"]
        ];

    export const questions:Array<any> = [
        [1,"旺猜怎么玩？","发起旺猜竞猜pk至好友或群聊中，好友猜中福利口令可领取到奖励。"],[2,"我支付了但没有发出去？","请在主页的【我的记录】中找到相应的记录，点击进入详情后点击【去转发】可把福利转发给好友或群。"],[3,"好友可以转发我的旺猜福利吗？","可以的，您分享给好友或者转发到微信群的旺猜福利，其他好友均可再次转发。"],[4,"发旺猜pk会收取服务费吗？","发起旺猜pk不会收取服务费。"],[5,"未领取的金额会怎样处理？","未领取的金额将于24小时后退至【小程序】余额"],[6,"如何提现到微信钱包？","在主页【余额提现】或详情页的【去提现】均可跳转至余额提现页面进行提现，提现金额每次至少2元，每天至多提现3次。"],[7,"提现会收取服务费吗？多久到账？","提现收取2%的服务费；申请提现后会在1-7个工作日内转账到您的微信钱包。"],[8,"如何联系客服？","您可以点击本页下方的联系客服按钮联系我们的在线客服（客服在线时间：9:00-18:00）；也可以拨打我们的客服电话：4000066363"]
        ];

    export const topics:Array<any> = [
        [1,"新年快乐！快来领福利"],[2,"新年快乐！你们的礼物在这里"],[3,"大家来拼智力领奖励"],[4,"我猜对了答案，你行吗？"],[5,"能猜出答案算你赢"],[6,"最最最难难难的猜题pk"]
        ];

    export const distributions:Array<any> = [
        [1,1,0.03,0.04,0.01,0.02],[2,2,0.04,0.06,0.01,0.03],[3,3,0.06,0.08,0.02,0.04],[4,4,0.08,0.1,0.03,0.04],[5,0,0.01,0.01,0.01,0.01]
        ];

    export const shares:Array<any> = [
        [1,"大家一起来拼智力领福利",,],[2,"大家一起来拼智力领福利",,],[3,"我领取到了s%元福利，快来看看我的战绩",,],[4,"大家一起来拼智力领福利",,],[5,"有人在这里领到s%元福利，快来围观啊",,]
        ];


        t = guessstarts;
        let _guessstartMap:any = {
        1:t[0],2:t[1],3:t[2]
        };

        t = parameters;
        let _parameterMap:any = {
        "timeslimit":t[0],"waitcd":t[1],"expire":t[2],"rewardmax":t[3],"withdrawalsmax":t[4],"withdrawalsnum":t[5],"withdrawalsmin":t[6]
        };

        t = messages;
        let _messageMap:any = {
        1:t[0],2:t[1],3:t[2],4:t[3],5:t[4],6:t[5],7:t[6],8:t[7],9:t[8],10:t[9]
        };

        t = evaluates;
        let _evaluateMap:any = {
        1:t[0],2:t[1],3:t[2],4:t[3],5:t[4],6:t[5],7:t[6],8:t[7],9:t[8],10:t[9],11:t[10],12:t[11],13:t[12],14:t[13],15:t[14]
        };

        t = items;
        let _itemMap:any = {
        1:t[0],2:t[1],3:t[2]
        };

        t = questions;
        let _questionMap:any = {
        1:t[0],2:t[1],3:t[2],4:t[3],5:t[4],6:t[5],7:t[6],8:t[7]
        };

        t = topics;
        let _topicMap:any = {
        1:t[0],2:t[1],3:t[2],4:t[3],5:t[4],6:t[5]
        };

        t = distributions;
        let _distributionMap:any = {
        1:t[0],2:t[1],3:t[2],4:t[3],5:t[4]
        };

        t = shares;
        let _shareMap:any = {
        1:t[0],2:t[1],3:t[2],4:t[3],5:t[4]
        };


}
