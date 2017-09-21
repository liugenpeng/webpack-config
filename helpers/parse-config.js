const fs = require("fs");
const path = require("path");
const {
    appRoot,
    languageJs,
    port,
    host,
    defaultEngines,
    switchOn,
    switchOff
} = require("../constants");
module.exports = options => {
    let { entry } = options;
    if (!entry) {
        console.warn("你没有提供应用的入口文件，默认指[向moduleScope]下的index.js文件");
        entry = "./index.js";
    }
    let moduleScope = path.resolve(appRoot, options.moduleScope || ".");

    //从环境变量中取配置
    let { analysis, friendly, asset_path, dev_server } = process.env;

    var config = {
        // 是否启用analysis
        analysis: analysis === switchOn,
        //是否开启友好输出
        friendly: friendly !== switchOff,
        //静态资源路径
        publicPath: asset_path || "",
        //是否启用dev_server
        devServer: dev_server === switchOn,
        // 入口文件
        entry,
        // dll 列表，数组 || undefined
        dllList: require("./parse-dll")(options.dllList),
        //代码目录
        moduleScope,
        //别名：
        alias: Object.assign(
            {
                "&": moduleScope
            },
            options.alias
        ),
        //自定义承载页
        hostPage: options.hostPage,
        //是否启用代码检查
        useLint: options.useLint === undefined ? true : !!options.useLint,
        // env的浏览器配置
        targetBrowsers: options.targetBrowsers,
        //env的目标配置
        targets: options.targets,
        //是否启用commonChunk
        useCommonChunk:
            options.useCommonChunk === undefined
                ? true
                : options.useCommonChunk,
        //包含的babel polyfill或者plugin
        transformInclude: options.transformInclude || [],
        //排除的babel polyfill或者plugin
        transformExclude: options.transformExclude || [],
        //服务器端口
        port: options.port || port,
        //服务器地址
        host: options.host || host,
        //支持的视图库
        engines: options.engines || defaultEngines,
        // js ts mixed //使用开发语言，js或者ts，或者混着用
        language: options.language || languageJs
    };
    return config;
};
