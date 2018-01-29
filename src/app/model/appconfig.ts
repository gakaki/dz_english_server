export module AppConfig {

    // 聊天服务器的id，admin使用来直接发消息
    export let IMSRV: string;

    // MQ服务器的id，socket需要通过mq来交换用户状态数据
    export let MQSRV: string;
}