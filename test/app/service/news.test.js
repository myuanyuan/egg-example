const { app, mock, assert } = require('egg-mock/bootstrap');
describe('test app/service/news.js', () => {
    it('test news service', async () => {
        let ctx = app.mockContext();
        let { code, data } = await ctx.service.news.list();
        assert(code === 0);
        assert(data.length === 7);
    })
})