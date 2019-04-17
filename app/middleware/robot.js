
module.exports = (options, app) => {    // options 为本中间件的配置对象
    // 判断是否是chrome访问，如果是则返回403
    return async function (ctx, next) { // next 表示调用下一个中间件
        let userAgent = ctx.get('user-agent') || '';
        let mached = options.ua.some(ua => {
            return ua.test(userAgent);
        });
        if (mached) {
            ctx.body = '403';
        } else {
            await next();
        }
    }
}