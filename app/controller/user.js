const { Controller } = require('egg');

let users = [];

class UserController extends Controller {
    // 查看用户列表
    async list() {
        this.ctx.body = users;
    }
    // 打开添加用户页面
    async add() {
        let { ctx } = this;
        await ctx.render('user/add');
    }
    // 确定添加用户
    async doAdd() {
        let { ctx } = this;
        const user = ctx.request.body; // 得到请求体对象
        user.id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
        users.push(user);
        ctx.body = user;
    }
}

module.exports = UserController;