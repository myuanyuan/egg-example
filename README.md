#### 安装项目依赖
```sh
$ npm init
$ npm i egg --save
$ npm i egg-bin --save-dev
```

添加 npm scripts 到 package.json：
```json
{
  "scripts": {
    "dev": "egg-bin dev"
  }
}
```

####  编写Controller

```js
// app/controller/home.js
const { Controller } = require('egg');

class HomeConstroller extends Controller {
    async index() {
        let { ctx } = this;
        ctx.body = 'home';
    }
}

module.exports = HomeConstroller;
```

####  配置路由映射
```js
// app/router.js
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
};
```

####  配置文件
```js
// config/config.default.js
exports.keys = '<此处改为你自己的 Cookie 安全字符串>';
// 写法2
module.exports = app => {
    let config = {};
    config.keys = '<此处改为你自己的 Cookie 安全字符串>';
    return config;
}
```

启动

```sh
$ npm run dev
$ open localhost:7001
```

####  静态文件

Egg 内置了 static 插件，线上环境建议部署到 CDN，无需该插件。

static 插件默认映射 /public/* -> app/public/* 目录

此处，我们把静态资源都放到 app/public 目录即可：
app/public
├── css
│   └── news.css
└── js
    ├── lib.js
    └── news.js

静态文件中间件：用来拦截对静态文件的请求，如果是静态文件的话，直接把文件从硬盘上读出来，返回给客户端。


####  模板渲染

安装模版引擎插件

```sh
$ yarn add egg-view-nunjucks --save
```

启用插件

```js

// config/plugin.js
exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks'
};
```

添加 view 配置
```js
// config/config.default.js
exports.keys = '<此处改为你自己的 Cookie 安全字符串>';
// 添加 view 配置
exports.view = {
  defaultExtension: '.html',     // 注意是 .html 要记得point
  defaultViewEngine: 'nunjucks', // 和plugin配置对应
  mapping: {
    '.tpl': 'nunjucks',
  },
};
```

异步render 因为读文件readfile是异步的
```js
await ctx.render('news', { list });
// 查找文件路径 读取文件内容 把模版和数据混合为html
```

- 在egg中，默认支持防csrf， 在客户端请求服务器的时候，服务器会向客户端发送一个csrfToken
- 下次客户端再次访问服务端的时候，服务器会校验这个token

防csrf的token是如何下发的

场景：银行转账

csrf流程--生成链接诱导合法用户点击，点击后会发送请求

登陆--返回cookie放在客户端--客户端再次发送请求时携带cookie--客户端进行校验token

防止措施：登陆--返回cookie放在客户端--客户端再次发送请求获取token，再次发送请求时携带token进行转账--客户端进行校验token--token失效


cookie加密

```js
let count = ctx.cookies.get('count');
count = count ? Number(count) : 0;
++count;
let res = crypto.createHmac('sha256', this.config.keys).update(count + '1');
ctx.cookies.set('count', res.digest('hex'));
ctx.body = ctx.cookies.get('count');

```

#### 读取远程接口服务 service

在实际应用中，Controller 一般不会自己产出数据，也不会包含复杂的逻辑，复杂的过程应抽象为业务逻辑层 Service。
超时问题：curl超时，网上找到修改httpAgent.timeout的方法，但是试了还是不可以，后http://localhost换成 http://127.0.0.1解决

helper使用：app/extend/helper.js 文件名字是规定好的，不能随便写
可以在controler里通过ctx.helper调用，也可以在html模版里直接调用helper


#### 中间件编写
```js
// app/middleware/中间件文件名 注意规避关键字
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
```

配置开启的中间件 并配置对应的options

什么时候用中间件？

客户端-->中间件-->next()-->控制器, 所以，当有在控制器之前执行逻辑的需求时，我们使用中间件


#### 运行环境

两种指定方式：
1. config/env文件 local
2. 通过 EGG_SERVER_ENV 环境变量来指定，代码里通过app.config.env来读取该环境变量

支持config.prod.js / config.local.js写法，加载顺序，先加载config.default.js，再根据env读取对应的config文件

```json 
"scripts": {
    "dev": "SET EGG_SERVER_ENV=local egg-bin dev"
  },
```

#### 单元测试
单元测试的优点：
1. 代码质量持续有保障
2. 重构正确性保障
3. 增强自信心
4. 自动化运行

测试框架 官方推荐
mochajs  mocha教程请参考阮一峰老师的文章：http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html
power-assert


```json
{
  "scripts": {
    "test": "egg-bin test"
  }
}
```

```js
// test/app/controller/home/home.test.js
const assert = require('assert');

describe('加法函数的测试', function () {
    it('1 加 1 应该等于 2', function () {
        assert(1 + 1 == 2);
    });
});
```

#### mock

正常来说，如果要完整手写一个 app 创建和启动代码，还是需要写一段初始化脚本的， 并且还需要在测试跑完之后做一些清理工作，如删除临时文件，销毁 app。
常常还有模拟各种网络异常，服务访问异常等特殊情况。也就是快速编写一个单元测试；
egg单独为框架抽取了一个测试 mock 辅助模块：egg-mock， 有了它我们就可以非常快速地编写一个 app 的单元测试，并且还能快速创建一个 ctx 来测试它的属性、方法和 Service 等。

```js
const mock = require('egg-mock');
const assert = require('assert');
describe('加法函数的测试', function () {
    it('1 加 1 应该等于 2', function () {
        assert(1 + 1 == 2);
    });
});

```

钩子
Mocha 使用 before/after/beforeEach/afterEach 来处理前置后置任务，基本能处理所有问题。 每个用例会按 before -> beforeEach -> it -> afterEach -> after 的顺序执行，而且可以定义多个。
```js
describe('test/app/controller/home.test.js', () => {
    // 全部开始前
    before(() => {
        console.log('this is before')
    })
    // 每个开始前
    beforeEach(() => {
        console.log('this is beforeEach')
    })
    // 全部结束后
    after(() => {
        console.log('this is after')
    })
    // 每个结束后
    afterEach(() => {
        console.log('this is afterEach')
    })
    it('test1', () => {
        console.log('this is test1')
    })
    it('test2', () => {
        console.log('this is test2')
    })
    it('test3', () => {
        console.log('this is test2')
    })
    it('test4', () => {
        console.log('this is test2')
    })
})
```

#### 异步测试

异步测试有三种方式

1. promise 
2. callback
3. async await

```js
const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/home.test.js', () => {
    it('promise', () => {
        return app.httpRequest().get('/home').expect(200).expect('home');
    })
    it('callback', (done) => {
        app.httpRequest().get('/home').expect(200, done);
    })
    it('async&await', async function () {
        await app.httpRequest().get('/home').expect(200).expect('home');;
    })
})
```

```js
describe('test/app/controller/home.test.js', () => {
    it('async&await', async function () {
        let result = await app.httpRequest().get('/home');
        assert(result.status == 200);
        assert(result.text == 'home');
    })
})
```

如何测试控制器ctx

```js
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
})
```

#### session 和 cookie
框架内置了 Session 插件，给我们提供了 ctx.session 来访问或者修改当前用户 Session 。
如果要删除它，直接将它赋值为 null。
以下是防csrf的手动实现
```js
 //app/controller/user.js
 // 打开添加用户页面
    async add() {
        let { ctx } = this;
        let csrf = Date.now() + Math.random() + '';
        ctx.session.csrf = csrf;
        await ctx.render('user/add', { csrf });
    }
    // 确定添加用户
    async doAdd() {
        let { ctx } = this;
        const user = ctx.request.body; // 得到请求体对象
        if (user.csrf !== ctx.session.csrf) {
            ctx.body = 'csrf error';
            return;
        }
        delete user.csrf;
        ctx.session.csrf = null;
        user.id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
        users.push(user);
        ctx.body = user;
    }
```

```html
<!-- app/view/user/add.html -->
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>add</title>
</head>

<body>
    <form action="/user/doAdd" method="POST">
        用户名：<input type="text" name="username" />
        <input value="提交" type="submit">
        <input name="csrf" type="hidden" value="{{csrf}}" />
    </form>
</body>

</html>
```

```js
 config.session = {
        renew: true, // 每次请求服务器，是否重新生成session
    };
```
写入session时，注意两点：
- 不要以 _ 开头
- 不能为 isNew

Session 默认存放在 Cookie 中，但是如果我们的 Session 对象过于庞大，就会带来一些额外的问题：
1. 浏览器通常都有限制最大的 Cookie 长度，当设置的 Session 过大时，浏览器可能拒绝保存。
2. Cookie 在每次请求时都会带上，当 Session 过大时，每次请求都要额外带上庞大的 Cookie 信息。

框架提供了将 Session 存储到除了 Cookie 之外的其他存储的扩展方案，我们只需要设置 app.sessionStore 即可将 Session 存储到指定的存储中。


#### 测试controller user
```js
// test/app/controller/user.test.js
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
```


#### 测试service
```js
// test/app/service/news.test.js
const { app, mock, assert } = require('egg-mock/bootstrap');
describe('test app/service/news.js', () => {
    it('test news service', async () => {
        let ctx = app.mockContext();
        let { code, data } = await ctx.service.news.list();
        assert(code === 0);
        assert(data.length === 7);
    })
})
```

#### 测试扩展

application中exports 上挂载的变量可以直接通过app访问到
```js
// app/extend/application.js
// 实现一个全局缓存

let cacheData = {};
exports.cache = {
    get(key) {
        return cacheData[key];
    },
    set(key, value) {
        cacheData[key] = value;
    }
}
// app/extend/application.test.js
const { app, assert, mock } = require('egg-mock/bootstrap');

describe('app/extend/application.js', () => {
    it('test application/cache', async () => {
        app.cache.set('name', 'mmm');
        assert(app.cache.get('name') === 'mmm');
    })
})
```
context 中 exports 上挂载的变量可以直接通过ctx访问到
```js
// app/extend/context.js
// 向context添加一个方法，用来获取accept-language请求头
//  这里不要用箭头函数
exports.language = function () {
    return this.get('accept-language');
}
// app/extend/context.test.js
const { app, assert, mock } = require('egg-mock/bootstrap');

describe('app/extend/context.js', () => {
    it('test acceptlanguage', async () => {
        let cxt = app.mockContext({
            headers: { 'accept-language': 'zh-cn' }
        })
        assert(cxt.language() === 'zh-cn');
    })
})
```

request 中 exports 上挂载的变量可以直接通过ctx.request访问到
```js
// app/extend/request.js
module.exports = {
    get isChrome() {        // 前加get可以通过直接访问属性的方式取值
        let userAgent = this.get('User-Agent').toLowerCase();
        return userAgent.includes('chrome');
    }
}
// app/extend/request.test.js
const { app, assert, mock } = require('egg-mock/bootstrap');

describe('app/extend/request.js', () => {
    it('test isChrome', async () => {
        let cxt = app.mockContext({
            headers: { 'User-Agent': 'chrome' }
        })
        assert(cxt.request.isChrome === true);
    })
})
```


response 中 exports 上挂载的变量可以直接通过ctx.response 访问到
```js
// app/extend/response.js
module.exports = {
    get isSuccess() {
        return this.status === 200;
    },
    get notFond() {
        return this.status === 404;
    },
    get serverError() {
        return this.status === 500;
    }
}
// app/extend/response.test.js
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
```

helper 中 exports 上挂载的变量可以直接通过ctx.helper 访问到


#### nunjucks

