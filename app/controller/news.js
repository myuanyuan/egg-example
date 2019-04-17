const { Controller } = require('egg');
const crypto = require('crypto');

class NewsConstroller extends Controller {
    async index() {
        let { ctx, service } = this;
        const { code, data } = await service.news.list();
        if (code == 0) {
            await ctx.render('news', { list: data }); // 查找文件路径 读取文件内容 把模版和数据混合为html list可在html里访问到
        } else {
            ctx.body = '失败';
        }
    }

    async counter() {
        let { ctx } = this;
        let count = ctx.cookies.get('count');
        count = count ? Number(count) : 0;
        ++count;
        let res = crypto.createHmac('sha256', this.config.keys).update(count + '1');
        ctx.cookies.set('count', res.digest('hex'));
        ctx.body = ctx.cookies.get('count');
    }
}

module.exports = NewsConstroller;