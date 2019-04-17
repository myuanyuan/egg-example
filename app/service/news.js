const { Service } = require('egg');

class NewsService extends Service {
    async list() {
        let { ctx, config } = this;
        const { newsUrl } = config.news;
        let result = await ctx.curl(newsUrl, {
            dataType: 'json',
        })
        return { code: 0, data: result.data };
    }
}

module.exports = NewsService;