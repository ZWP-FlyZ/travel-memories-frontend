// 开发跨域配置
const proxy = require('http-proxy-middleware')
module.exports = function(app) {
    app.use(proxy('/api', {
            target: "http://localhost:8080",
            secure: false,
            changeOrigin: true,
            pathRewrite: {
                "^/api": "/"
            },
        })
    );
    app.use(proxy('/baiduapi', {
            target: "http://api.map.baidu.com",
            secure: false,
            changeOrigin: true,
            pathRewrite: {
                "^/baiduapi": "/"
            },
        })
    );

};

