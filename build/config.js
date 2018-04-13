//var Env = require('./env');

var  env = require('./env');

let config = {
    env: env.Env,
    dev: {
        assetsSubDirectory: 'static',
        assetsPublicPath: '/dist',
        proxyTable: {
            '/weekly':{
                target:'http://localhost:8003',  //后台服务器url
                changeOrigin:true,
                pathRewrite:{
                    '^/weekly':''
                }
            }
        },
        host: 'localhost',
        port: 8081,
        autoOpenBrowser: true,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false,
        devtool: 'cheap-module-eval-source-map',
        cacheBusting: true,
        cssSourceMap: true
    }
};
module.exports =  config;
