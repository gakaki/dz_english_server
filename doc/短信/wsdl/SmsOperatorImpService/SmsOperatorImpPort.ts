/* tslint:disable:max-line-length */
export interface IgetReportInput {
    /** xsd:string(undefined) */
    arg0: xsd:string;
    /** xsd:string(undefined) */
    arg1: xsd:string;
}

export interface IgetReportOutput {
    return: {
        /** xs:complexType(undefined) */
        nsName: xs:complexType;
        /** tns(undefined) */
        prefix: tns;
        /** complexType(undefined) */
        name: complexType;
        children: {
            0: {
                /** xs:sequence(undefined) */
                nsName: xs:sequence;
                /** xs(undefined) */
                prefix: xs;
                /** sequence(undefined) */
                name: sequence;
                children: {
                    0: {
                        /** xs:element(undefined) */
                        nsName: xs:element;
                        /** xs(undefined) */
                        prefix: xs;
                        /** element(undefined) */
                        name: element;
                        children: {};
                        xmlns: SmsOperatorImpPortTypes.Ixmlns;
                        /** $value(undefined) */
                        valueKey: $value;
                        /** $xml(undefined) */
                        xmlKey: $xml;
                        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
                        /** unbounded(undefined) */
                        $maxOccurs: unbounded;
                        /** 0(undefined) */
                        $minOccurs: 0;
                        /** resDetail(undefined) */
                        $name: resDetail;
                        /** true(undefined) */
                        $nillable: true;
                        /** tns:reportMessageResDetail(undefined) */
                        $type: tns:reportMessageResDetail;
                    };
                    1: {
                        /** xs:element(undefined) */
                        nsName: xs:element;
                        /** xs(undefined) */
                        prefix: xs;
                        /** element(undefined) */
                        name: element;
                        children: {};
                        xmlns: SmsOperatorImpPortTypes.Ixmlns;
                        /** $value(undefined) */
                        valueKey: $value;
                        /** $xml(undefined) */
                        xmlKey: $xml;
                        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
                        /** 0(undefined) */
                        $minOccurs: 0;
                        /** subStat(undefined) */
                        $name: subStat;
                        /** xs:string(undefined) */
                        $type: xs:string;
                    };
                    2: {
                        /** xs:element(undefined) */
                        nsName: xs:element;
                        /** xs(undefined) */
                        prefix: xs;
                        /** element(undefined) */
                        name: element;
                        children: {};
                        xmlns: SmsOperatorImpPortTypes.Ixmlns;
                        /** $value(undefined) */
                        valueKey: $value;
                        /** $xml(undefined) */
                        xmlKey: $xml;
                        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
                        /** 0(undefined) */
                        $minOccurs: 0;
                        /** subStatDes(undefined) */
                        $name: subStatDes;
                        /** xs:string(undefined) */
                        $type: xs:string;
                    };
                };
                xmlns: SmsOperatorImpPortTypes.Ixmlns;
                /** $value(undefined) */
                valueKey: $value;
                /** $xml(undefined) */
                xmlKey: $xml;
                ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
            };
        };
        /** http://sms.jwsserver.server.ema.ctc.com/(undefined) */
        xmlns: http://sms.jwsserver.server.ema.ctc.com/;
        /** $value(undefined) */
        valueKey: $value;
        /** $xml(undefined) */
        xmlKey: $xml;
        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
        /** reportMessageRes(undefined) */
        $name: reportMessageRes;
    };
}

export interface IsendSmsInput {
    /** xsd:string(undefined) */
    arg0: xsd:string;
    /** xsd:string(undefined) */
    arg1: xsd:string;
    /** xsd:string(undefined) */
    arg2: xsd:string;
    arg3: {
        /** xs:complexType(undefined) */
        nsName: xs:complexType;
        /** tns(undefined) */
        prefix: tns;
        /** complexType(undefined) */
        name: complexType;
        children: {
            0: {
                /** xs:sequence(undefined) */
                nsName: xs:sequence;
                /** xs(undefined) */
                prefix: xs;
                /** sequence(undefined) */
                name: sequence;
                children: {
                    0: {
                        /** xs:element(undefined) */
                        nsName: xs:element;
                        /** xs(undefined) */
                        prefix: xs;
                        /** element(undefined) */
                        name: element;
                        children: {};
                        xmlns: SmsOperatorImpPortTypes.Ixmlns;
                        /** $value(undefined) */
                        valueKey: $value;
                        /** $xml(undefined) */
                        xmlKey: $xml;
                        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
                        /** 0(undefined) */
                        $minOccurs: 0;
                        /** sendTime(undefined) */
                        $name: sendTime;
                        /** xs:string(undefined) */
                        $type: xs:string;
                    };
                    1: {
                        /** xs:element(undefined) */
                        nsName: xs:element;
                        /** xs(undefined) */
                        prefix: xs;
                        /** element(undefined) */
                        name: element;
                        children: {};
                        xmlns: SmsOperatorImpPortTypes.Ixmlns;
                        /** $value(undefined) */
                        valueKey: $value;
                        /** $xml(undefined) */
                        xmlKey: $xml;
                        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
                        /** 0(undefined) */
                        $minOccurs: 0;
                        /** content(undefined) */
                        $name: content;
                        /** xs:string(undefined) */
                        $type: xs:string;
                    };
                    2: {
                        /** xs:element(undefined) */
                        nsName: xs:element;
                        /** xs(undefined) */
                        prefix: xs;
                        /** element(undefined) */
                        name: element;
                        children: {};
                        xmlns: SmsOperatorImpPortTypes.Ixmlns;
                        /** $value(undefined) */
                        valueKey: $value;
                        /** $xml(undefined) */
                        xmlKey: $xml;
                        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
                        /** 0(undefined) */
                        $minOccurs: 0;
                        /** demo(undefined) */
                        $name: demo;
                        /** xs:string(undefined) */
                        $type: xs:string;
                    };
                    3: {
                        /** xs:element(undefined) */
                        nsName: xs:element;
                        /** xs(undefined) */
                        prefix: xs;
                        /** element(undefined) */
                        name: element;
                        children: {};
                        xmlns: SmsOperatorImpPortTypes.Ixmlns;
                        /** $value(undefined) */
                        valueKey: $value;
                        /** $xml(undefined) */
                        xmlKey: $xml;
                        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
                        /** unbounded(undefined) */
                        $maxOccurs: unbounded;
                        /** 0(undefined) */
                        $minOccurs: 0;
                        /** phoneNumber(undefined) */
                        $name: phoneNumber;
                        /** true(undefined) */
                        $nillable: true;
                        /** xs:string(undefined) */
                        $type: xs:string;
                    };
                    4: SmsOperatorImpPortTypes.I4;
                    5: SmsOperatorImpPortTypes.I5;
                };
                xmlns: SmsOperatorImpPortTypes.Ixmlns;
                /** $value(undefined) */
                valueKey: $value;
                /** $xml(undefined) */
                xmlKey: $xml;
                ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
            };
        };
        /** http://sms.jwsserver.server.ema.ctc.com/(undefined) */
        xmlns: http://sms.jwsserver.server.ema.ctc.com/;
        /** $value(undefined) */
        valueKey: $value;
        /** $xml(undefined) */
        xmlKey: $xml;
        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
        /** mtMessage(undefined) */
        $name: mtMessage;
    };
}

export interface IsendSmsOutput {
    return: {
        /** xs:complexType(undefined) */
        nsName: xs:complexType;
        /** tns(undefined) */
        prefix: tns;
        /** complexType(undefined) */
        name: complexType;
        children: {
            0: {
                /** xs:sequence(undefined) */
                nsName: xs:sequence;
                /** xs(undefined) */
                prefix: xs;
                /** sequence(undefined) */
                name: sequence;
                children: {
                    0: {
                        /** xs:element(undefined) */
                        nsName: xs:element;
                        /** xs(undefined) */
                        prefix: xs;
                        /** element(undefined) */
                        name: element;
                        children: {};
                        xmlns: SmsOperatorImpPortTypes.Ixmlns;
                        /** $value(undefined) */
                        valueKey: $value;
                        /** $xml(undefined) */
                        xmlKey: $xml;
                        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
                        /** unbounded(undefined) */
                        $maxOccurs: unbounded;
                        /** 0(undefined) */
                        $minOccurs: 0;
                        /** resDetail(undefined) */
                        $name: resDetail;
                        /** true(undefined) */
                        $nillable: true;
                        /** tns:mtMessageResDetail(undefined) */
                        $type: tns:mtMessageResDetail;
                    };
                    1: {
                        /** xs:element(undefined) */
                        nsName: xs:element;
                        /** xs(undefined) */
                        prefix: xs;
                        /** element(undefined) */
                        name: element;
                        children: {};
                        xmlns: SmsOperatorImpPortTypes.Ixmlns;
                        /** $value(undefined) */
                        valueKey: $value;
                        /** $xml(undefined) */
                        xmlKey: $xml;
                        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
                        /** 0(undefined) */
                        $minOccurs: 0;
                        /** smsId(undefined) */
                        $name: smsId;
                        /** xs:string(undefined) */
                        $type: xs:string;
                    };
                    2: {
                        /** xs:element(undefined) */
                        nsName: xs:element;
                        /** xs(undefined) */
                        prefix: xs;
                        /** element(undefined) */
                        name: element;
                        children: {};
                        xmlns: SmsOperatorImpPortTypes.Ixmlns;
                        /** $value(undefined) */
                        valueKey: $value;
                        /** $xml(undefined) */
                        xmlKey: $xml;
                        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
                        /** 0(undefined) */
                        $minOccurs: 0;
                        /** subStat(undefined) */
                        $name: subStat;
                        /** xs:string(undefined) */
                        $type: xs:string;
                    };
                    3: {
                        /** xs:element(undefined) */
                        nsName: xs:element;
                        /** xs(undefined) */
                        prefix: xs;
                        /** element(undefined) */
                        name: element;
                        children: {};
                        xmlns: SmsOperatorImpPortTypes.Ixmlns;
                        /** $value(undefined) */
                        valueKey: $value;
                        /** $xml(undefined) */
                        xmlKey: $xml;
                        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
                        /** 0(undefined) */
                        $minOccurs: 0;
                        /** subStatDes(undefined) */
                        $name: subStatDes;
                        /** xs:string(undefined) */
                        $type: xs:string;
                    };
                };
                xmlns: SmsOperatorImpPortTypes.Ixmlns;
                /** $value(undefined) */
                valueKey: $value;
                /** $xml(undefined) */
                xmlKey: $xml;
                ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
            };
        };
        /** http://sms.jwsserver.server.ema.ctc.com/(undefined) */
        xmlns: http://sms.jwsserver.server.ema.ctc.com/;
        /** $value(undefined) */
        valueKey: $value;
        /** $xml(undefined) */
        xmlKey: $xml;
        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
        /** mtMessageRes(undefined) */
        $name: mtMessageRes;
    };
}

export interface IgetSmsInput {
    /** xsd:string(undefined) */
    arg0: xsd:string;
    /** xsd:string(undefined) */
    arg1: xsd:string;
}

export interface IgetSmsOutput {
    return: {
        /** xs:complexType(undefined) */
        nsName: xs:complexType;
        /** tns(undefined) */
        prefix: tns;
        /** complexType(undefined) */
        name: complexType;
        children: {
            0: {
                /** xs:sequence(undefined) */
                nsName: xs:sequence;
                /** xs(undefined) */
                prefix: xs;
                /** sequence(undefined) */
                name: sequence;
                children: {
                    0: {
                        /** xs:element(undefined) */
                        nsName: xs:element;
                        /** xs(undefined) */
                        prefix: xs;
                        /** element(undefined) */
                        name: element;
                        children: {};
                        xmlns: SmsOperatorImpPortTypes.Ixmlns;
                        /** $value(undefined) */
                        valueKey: $value;
                        /** $xml(undefined) */
                        xmlKey: $xml;
                        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
                        /** unbounded(undefined) */
                        $maxOccurs: unbounded;
                        /** 0(undefined) */
                        $minOccurs: 0;
                        /** resDetail(undefined) */
                        $name: resDetail;
                        /** true(undefined) */
                        $nillable: true;
                        /** tns:moMessageResDetail(undefined) */
                        $type: tns:moMessageResDetail;
                    };
                    1: {
                        /** xs:element(undefined) */
                        nsName: xs:element;
                        /** xs(undefined) */
                        prefix: xs;
                        /** element(undefined) */
                        name: element;
                        children: {};
                        xmlns: SmsOperatorImpPortTypes.Ixmlns;
                        /** $value(undefined) */
                        valueKey: $value;
                        /** $xml(undefined) */
                        xmlKey: $xml;
                        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
                        /** 0(undefined) */
                        $minOccurs: 0;
                        /** revStat(undefined) */
                        $name: revStat;
                        /** xs:string(undefined) */
                        $type: xs:string;
                    };
                    2: {
                        /** xs:element(undefined) */
                        nsName: xs:element;
                        /** xs(undefined) */
                        prefix: xs;
                        /** element(undefined) */
                        name: element;
                        children: {};
                        xmlns: SmsOperatorImpPortTypes.Ixmlns;
                        /** $value(undefined) */
                        valueKey: $value;
                        /** $xml(undefined) */
                        xmlKey: $xml;
                        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
                        /** 0(undefined) */
                        $minOccurs: 0;
                        /** revStatDes(undefined) */
                        $name: revStatDes;
                        /** xs:string(undefined) */
                        $type: xs:string;
                    };
                };
                xmlns: SmsOperatorImpPortTypes.Ixmlns;
                /** $value(undefined) */
                valueKey: $value;
                /** $xml(undefined) */
                xmlKey: $xml;
                ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
            };
        };
        /** http://sms.jwsserver.server.ema.ctc.com/(undefined) */
        xmlns: http://sms.jwsserver.server.ema.ctc.com/;
        /** $value(undefined) */
        valueKey: $value;
        /** $xml(undefined) */
        xmlKey: $xml;
        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
        /** moMessageRes(undefined) */
        $name: moMessageRes;
    };
}

export interface IgetBalanceInput {
    /** xsd:string(undefined) */
    arg0: xsd:string;
    /** xsd:string(undefined) */
    arg1: xsd:string;
}

export interface IgetBalanceOutput {
    return: {
        /** xs:complexType(undefined) */
        nsName: xs:complexType;
        /** tns(undefined) */
        prefix: tns;
        /** complexType(undefined) */
        name: complexType;
        children: {
            0: {
                /** xs:sequence(undefined) */
                nsName: xs:sequence;
                /** xs(undefined) */
                prefix: xs;
                /** sequence(undefined) */
                name: sequence;
                children: {
                    0: {
                        /** xs:element(undefined) */
                        nsName: xs:element;
                        /** xs(undefined) */
                        prefix: xs;
                        /** element(undefined) */
                        name: element;
                        children: {};
                        xmlns: SmsOperatorImpPortTypes.Ixmlns;
                        /** $value(undefined) */
                        valueKey: $value;
                        /** $xml(undefined) */
                        xmlKey: $xml;
                        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
                        /** 0(undefined) */
                        $minOccurs: 0;
                        /** demo(undefined) */
                        $name: demo;
                        /** xs:string(undefined) */
                        $type: xs:string;
                    };
                    1: {
                        /** xs:element(undefined) */
                        nsName: xs:element;
                        /** xs(undefined) */
                        prefix: xs;
                        /** element(undefined) */
                        name: element;
                        children: {};
                        xmlns: SmsOperatorImpPortTypes.Ixmlns;
                        /** $value(undefined) */
                        valueKey: $value;
                        /** $xml(undefined) */
                        xmlKey: $xml;
                        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
                        /** 0(undefined) */
                        $minOccurs: 0;
                        /** revStat(undefined) */
                        $name: revStat;
                        /** xs:string(undefined) */
                        $type: xs:string;
                    };
                    2: {
                        /** xs:element(undefined) */
                        nsName: xs:element;
                        /** xs(undefined) */
                        prefix: xs;
                        /** element(undefined) */
                        name: element;
                        children: {};
                        xmlns: SmsOperatorImpPortTypes.Ixmlns;
                        /** $value(undefined) */
                        valueKey: $value;
                        /** $xml(undefined) */
                        xmlKey: $xml;
                        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
                        /** 0(undefined) */
                        $minOccurs: 0;
                        /** revStatDes(undefined) */
                        $name: revStatDes;
                        /** xs:string(undefined) */
                        $type: xs:string;
                    };
                };
                xmlns: SmsOperatorImpPortTypes.Ixmlns;
                /** $value(undefined) */
                valueKey: $value;
                /** $xml(undefined) */
                xmlKey: $xml;
                ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
            };
        };
        /** http://sms.jwsserver.server.ema.ctc.com/(undefined) */
        xmlns: http://sms.jwsserver.server.ema.ctc.com/;
        /** $value(undefined) */
        valueKey: $value;
        /** $xml(undefined) */
        xmlKey: $xml;
        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
        /** balanceRes(undefined) */
        $name: balanceRes;
    };
}

export interface IbathSendSmsInput {
    /** xsd:string(undefined) */
    arg0: xsd:string;
    /** xsd:string(undefined) */
    arg1: xsd:string;
    /** xsd:string(undefined) */
    arg2: xsd:string;
    arg3: {
        /** xs:complexType(undefined) */
        nsName: xs:complexType;
        /** tns(undefined) */
        prefix: tns;
        /** complexType(undefined) */
        name: complexType;
        children: {
            0: {
                /** xs:sequence(undefined) */
                nsName: xs:sequence;
                /** xs(undefined) */
                prefix: xs;
                /** sequence(undefined) */
                name: sequence;
                children: {
                    0: {
                        /** xs:element(undefined) */
                        nsName: xs:element;
                        /** xs(undefined) */
                        prefix: xs;
                        /** element(undefined) */
                        name: element;
                        children: {};
                        xmlns: SmsOperatorImpPortTypes.Ixmlns;
                        /** $value(undefined) */
                        valueKey: $value;
                        /** $xml(undefined) */
                        xmlKey: $xml;
                        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
                        /** unbounded(undefined) */
                        $maxOccurs: unbounded;
                        /** 0(undefined) */
                        $minOccurs: 0;
                        /** item(undefined) */
                        $name: item;
                        /** true(undefined) */
                        $nillable: true;
                        /** tns:mtMessage(undefined) */
                        $type: tns:mtMessage;
                    };
                };
                xmlns: SmsOperatorImpPortTypes.Ixmlns;
                /** $value(undefined) */
                valueKey: $value;
                /** $xml(undefined) */
                xmlKey: $xml;
                ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
            };
        };
        /** http://sms.jwsserver.server.ema.ctc.com/(undefined) */
        xmlns: http://sms.jwsserver.server.ema.ctc.com/;
        /** $value(undefined) */
        valueKey: $value;
        /** $xml(undefined) */
        xmlKey: $xml;
        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
        /** #all(undefined) */
        $final: #all;
        /** mtMessageArray(undefined) */
        $name: mtMessageArray;
    };
}

export interface IbathSendSmsOutput {
    return: {
        /** xs:complexType(undefined) */
        nsName: xs:complexType;
        /** tns(undefined) */
        prefix: tns;
        /** complexType(undefined) */
        name: complexType;
        children: {
            0: {
                /** xs:sequence(undefined) */
                nsName: xs:sequence;
                /** xs(undefined) */
                prefix: xs;
                /** sequence(undefined) */
                name: sequence;
                children: {
                    0: {
                        /** xs:element(undefined) */
                        nsName: xs:element;
                        /** xs(undefined) */
                        prefix: xs;
                        /** element(undefined) */
                        name: element;
                        children: {};
                        xmlns: SmsOperatorImpPortTypes.Ixmlns;
                        /** $value(undefined) */
                        valueKey: $value;
                        /** $xml(undefined) */
                        xmlKey: $xml;
                        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
                        /** unbounded(undefined) */
                        $maxOccurs: unbounded;
                        /** 0(undefined) */
                        $minOccurs: 0;
                        /** resDetail(undefined) */
                        $name: resDetail;
                        /** true(undefined) */
                        $nillable: true;
                        /** tns:mtMessageResDetail(undefined) */
                        $type: tns:mtMessageResDetail;
                    };
                    1: {
                        /** xs:element(undefined) */
                        nsName: xs:element;
                        /** xs(undefined) */
                        prefix: xs;
                        /** element(undefined) */
                        name: element;
                        children: {};
                        xmlns: SmsOperatorImpPortTypes.Ixmlns;
                        /** $value(undefined) */
                        valueKey: $value;
                        /** $xml(undefined) */
                        xmlKey: $xml;
                        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
                        /** 0(undefined) */
                        $minOccurs: 0;
                        /** smsId(undefined) */
                        $name: smsId;
                        /** xs:string(undefined) */
                        $type: xs:string;
                    };
                    2: {
                        /** xs:element(undefined) */
                        nsName: xs:element;
                        /** xs(undefined) */
                        prefix: xs;
                        /** element(undefined) */
                        name: element;
                        children: {};
                        xmlns: SmsOperatorImpPortTypes.Ixmlns;
                        /** $value(undefined) */
                        valueKey: $value;
                        /** $xml(undefined) */
                        xmlKey: $xml;
                        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
                        /** 0(undefined) */
                        $minOccurs: 0;
                        /** subStat(undefined) */
                        $name: subStat;
                        /** xs:string(undefined) */
                        $type: xs:string;
                    };
                    3: {
                        /** xs:element(undefined) */
                        nsName: xs:element;
                        /** xs(undefined) */
                        prefix: xs;
                        /** element(undefined) */
                        name: element;
                        children: {};
                        xmlns: SmsOperatorImpPortTypes.Ixmlns;
                        /** $value(undefined) */
                        valueKey: $value;
                        /** $xml(undefined) */
                        xmlKey: $xml;
                        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
                        /** 0(undefined) */
                        $minOccurs: 0;
                        /** subStatDes(undefined) */
                        $name: subStatDes;
                        /** xs:string(undefined) */
                        $type: xs:string;
                    };
                };
                xmlns: SmsOperatorImpPortTypes.Ixmlns;
                /** $value(undefined) */
                valueKey: $value;
                /** $xml(undefined) */
                xmlKey: $xml;
                ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
            };
        };
        /** http://sms.jwsserver.server.ema.ctc.com/(undefined) */
        xmlns: http://sms.jwsserver.server.ema.ctc.com/;
        /** $value(undefined) */
        valueKey: $value;
        /** $xml(undefined) */
        xmlKey: $xml;
        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
        /** mtMessageRes(undefined) */
        $name: mtMessageRes;
    };
}

export interface ISmsOperatorImpPortSoap {
    getReport: (input: IgetReportInput, cb: (err: any | null, result: IgetReportOutput, raw: string,  soapHeader: {[k: string]: any}) => any) => void;
    sendSms: (input: IsendSmsInput, cb: (err: any | null, result: IsendSmsOutput, raw: string,  soapHeader: {[k: string]: any}) => any) => void;
    getSms: (input: IgetSmsInput, cb: (err: any | null, result: IgetSmsOutput, raw: string,  soapHeader: {[k: string]: any}) => any) => void;
    getBalance: (input: IgetBalanceInput, cb: (err: any | null, result: IgetBalanceOutput, raw: string,  soapHeader: {[k: string]: any}) => any) => void;
    bathSendSms: (input: IbathSendSmsInput, cb: (err: any | null, result: IbathSendSmsOutput, raw: string,  soapHeader: {[k: string]: any}) => any) => void;
}

export namespace SmsOperatorImpPortTypes {
    export interface I4 {
        /** xs:element(undefined) */
        nsName: xs:element;
        /** xs(undefined) */
        prefix: xs;
        /** element(undefined) */
        name: element;
        children: {};
        xmlns: SmsOperatorImpPortTypes.Ixmlns;
        /** $value(undefined) */
        valueKey: $value;
        /** $xml(undefined) */
        xmlKey: $xml;
        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
        /** 0(undefined) */
        $minOccurs: 0;
        /** smsId(undefined) */
        $name: smsId;
        /** xs:string(undefined) */
        $type: xs:string;
    }
    export interface I5 {
        /** xs:element(undefined) */
        nsName: xs:element;
        /** xs(undefined) */
        prefix: xs;
        /** element(undefined) */
        name: element;
        children: {};
        xmlns: SmsOperatorImpPortTypes.Ixmlns;
        /** $value(undefined) */
        valueKey: $value;
        /** $xml(undefined) */
        xmlKey: $xml;
        ignoredNamespaces: SmsOperatorImpPortTypes.IignoredNamespaces;
        /** 0(undefined) */
        $minOccurs: 0;
        /** subCode(undefined) */
        $name: subCode;
        /** xs:string(undefined) */
        $type: xs:string;
    }
    export interface Ixmlns {}
    export interface IignoredNamespaces {
        /** tns(undefined) */
        0: tns;
        /** targetNamespace(undefined) */
        1: targetNamespace;
        /** typedNamespace(undefined) */
        2: typedNamespace;
    }
}
