const { app, assert, mock } = require('egg-mock/bootstrap');

describe('app/extend/request.js', () => {
    it('test isChrome', async () => {
        let cxt = app.mockContext({
            headers: { 'User-Agent': 'chrome' }
        })
        assert(cxt.request.isChrome === true);
    })
})