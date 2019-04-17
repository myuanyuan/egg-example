// exports.keys = 'news';  // 指定秘钥
// exports.view = {        // 配置模版引擎
//     defaultExtension: '.html', // 默认的后缀
//     defaultViewEngine: 'nunjucks',  // 默认的模版引擎
//     mapping: {          // 指定以什么样的模版文件后缀，使用什么模版引擎
//         '.html': 'nunjucks',
//     },
// };


module.exports = app => {
    let config = {};
    config.keys = 'news';
    config.view = {
        defaultExtension: '.html',
        defaultViewEngine: 'nunjucks',
        mapping: {
            '.html': 'nunjucks',
        },
    };
    config.news = {
        newsUrl: 'http://127.0.0.1:3000/news',
    };
    config.httpclient = {
        httpAgent: {
            timeout: 200000, // 设置超时时间
        },
    };
    config.security = {
        csrf: false,
    };
    // 指定启用哪些中间件
    config.middleware = ['robot'];
    config.robot = {    // robot中间件的options
        // ua: [/Chrome/]
        ua: []
    };
    config.session = {
        renew: true, // 每次请求服务器，是否重新生成session
    };

    return config;
}