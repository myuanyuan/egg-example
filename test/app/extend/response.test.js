const { app, assert, mock } = require('egg-mock/bootstrap');

describe('app/extend/request.js', () => {
    it('test isSuccess', async () => {
        let cxt = app.mockContext({
            headers: { 'User-Agent': 'chrome' }
        })
        cxt.status = 200;
        assert(cxt.response.isSuccess === true);
    })
    it('test notFond', async () => {
        let cxt = app.mockContext({
            headers: { 'User-Agent': 'chrome' }
        })
        cxt.status = 404;
        assert(cxt.response.notFond === true);
    })
    it('test serverError', async () => {
        let cxt = app.mockContext({
            headers: { 'User-Agent': 'chrome' }
        })
        cxt.status = 500;
        assert(cxt.response.serverError === true);
    })
})