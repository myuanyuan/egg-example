const { app, mock, assert } = require('egg-mock/bootstrap');

describe('app/controller/user.js', () => {
    it('test get /user/add', async () => {
        let result = await app.httpRequest().get('/user/add');
        assert(result.status === 200);
        assert(result.text.indexOf('username') !== -1);
    })
    it('test get /user/list', async () => {
        let result = await app.httpRequest().get('/user');
        assert(result.status === 200);
    })
    it('test post /user/doAdd', async () => {
        let result = await app.httpRequest().post('/user/doAdd').send(`username=mmmm`);
        assert(result.status === 200);
        assert(result.body.id === 1);
    })
})