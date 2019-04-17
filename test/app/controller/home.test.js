
// const mock = require('egg-mock');
// const assert = require('assert');
// describe('加法函数的测试', function () {
//     it('1 加 1 应该等于 2', function () {
//         assert(1 + 1 == 2);
//     });
// });


// describe('test/app/controller/home.test.js', () => {
//     // 全部开始前
//     before(() => {
//         console.log('this is before')
//     })
//     // 每个开始前
//     beforeEach(() => {
//         console.log('this is beforeEach')
//     })
//     // 全部结束后
//     after(() => {
//         console.log('this is after')
//     })
//     // 每个结束后
//     afterEach(() => {
//         console.log('this is afterEach')
//     })
//     it('test1', () => {
//         console.log('this is test1')
//     })
//     it('test2', () => {
//         console.log('this is test2')
//     })
//     it('test3', () => {
//         console.log('this is test2')
//     })
//     it('test4', () => {
//         console.log('this is test2')
//     })
// })


// const { app, mock, assert } = require('egg-mock/bootstrap');

// describe('test/app/controller/home.test.js', () => {
//     it('promise', () => {
//         return app.httpRequest().get('/home').expect(200).expect('home');
//     })
//     it('callback', (done) => {
//         app.httpRequest().get('/home').expect(200, done);
//     })
//     it('async&await', async function () {
//         await app.httpRequest().get('/home').expect(200).expect('home');
//     })
// })

const { app, mock, assert } = require('egg-mock/bootstrap');

// describe('test/app/controller/home.test.js', () => {
//     it('async&await', async function () {
//         let result = await app.httpRequest().get('/home');
//         assert(result.status == 200);
//         assert(result.text == 'home');
//     })
// })

describe('test/app/controller/home.test.js', () => {
    it('test ctx', async function () {
        // 通过app模拟创建出ctx  
        let ctx = await app.mockContext({
            session: { name: 'mmm' }
        })
        assert(ctx.method == 'GET')
        assert(ctx.url == '/')
        assert(ctx.session.name == 'mmm')
    })
    it('async&await', async function () {
        let result = await app.httpRequest().get('/home');
        assert(result.status == 200);
        assert(result.text == 'home');
    })
})