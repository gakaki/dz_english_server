import {App, BOOT, Hook, STARTED} from "../nnt/manager/app";
import {Clusters} from "../nnt/manager/clusters";
import {Config} from "../nnt/manager/config";
import {AppConfig} from "./model/appconfig";

export function launch() {
    let cfg = App.LoadConfig("~/app.json");
    AppConfig.IMSRV = cfg.config.imsrv;
    AppConfig.MQSRV = cfg.config.mqsrv;

    Clusters.Run(() => {
        let app = new App();
        app.entryDir = "~/bin/";
        app.assetDir = "~/assets/";
        app.start();
    }, Config.CLUSTER_PARALLEL);
}

Hook(BOOT, () => {
    // 初始化管理器
});

Hook(STARTED, () => {
    // 初始化集群自举依赖的redis连接
    Clusters.Listen("rd");
});