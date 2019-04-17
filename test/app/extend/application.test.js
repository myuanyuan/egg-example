const { app, assert, mock } = require('egg-mock/bootstrap');

describe('app/extend/application.js', () => {
    it('test application/cache', async () => {
        app.cache.set('name', 'mmm');
        assert(app.cache.get('name') === 'mmm');
    })
})