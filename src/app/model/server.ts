export enum ServerMsgType {

    // 游戏实例发生变化，每台服务器收到后需要重新从数据库中加载游戏实例
    GAME_INSTANCE_CHANGED = 0x1,
}