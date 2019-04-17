const { app, assert, mock } = require('egg-mock/bootstrap');

describe('app/extend/context.js', () => {
    it('test acceptlanguage', async () => {
        let cxt = app.mockContext({
            headers: { 'accept-language': 'zh-cn' }
        })
        assert(cxt.language() === 'zh-cn');
    })
})