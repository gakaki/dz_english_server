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
        //随机智商
        get iqwored():unknown { return this.cfg[2]; } 
        
        static INDEX_ID = 0;
        static INDEX_SCORE = 1;
        static INDEX_IQWORED = 2;
        
        
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


    export const guessstarts:Array<any> = [
        [1,1],[2,5],[3,10]
        ];

    export const parameters:Array<any> = [
        ["timeslimit","20"],["waitcd","180"],["expire","24"]
        ];

    export const messages:Array<any> = [
        [1,"红包已过期"],[2,"请输入0-9不重复4位数"],[3,"赏金至少100金币"],[4,"赏金至少1元"],[5,"答错了"],[6,"恭喜答对"]
        ];

    export const evaluates:Array<any> = [
        [1,"0A0B",],[2,"0A1B",],[3,"0A2B",],[4,"0A3B",],[5,"0A4B",],[6,"1A0B",],[7,"1A1B",],[8,"1A2B",],[9,"1A3B",],[10,"2A0B",],[11,"2A1B",],[12,"2A2B",],[13,"3A0B",],[14,"3A1B",],[15,"4A0B",]
        ];

    export const items:Array<any> = [
        [1,"现金"],[2,"代金券"],[3,"加速卡"]
        ];


        t = guessstarts;
        let _guessstartMap:any = {
        1:t[0],2:t[1],3:t[2]
        };

        t = parameters;
        let _parameterMap:any = {
        "timeslimit":t[0],"waitcd":t[1],"expire":t[2]
        };

        t = messages;
        let _messageMap:any = {
        1:t[0],2:t[1],3:t[2],4:t[3],5:t[4],6:t[5]
        };

        t = evaluates;
        let _evaluateMap:any = {
        1:t[0],2:t[1],3:t[2],4:t[3],5:t[4],6:t[5],7:t[6],8:t[7],9:t[8],10:t[9],11:t[10],12:t[11],13:t[12],14:t[13],15:t[14]
        };

        t = items;
        let _itemMap:any = {
        1:t[0],2:t[1],3:t[2]
        };


}
