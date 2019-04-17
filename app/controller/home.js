const { Controller } = require('egg');

class HomeConstroller extends Controller {
    async index() {
        let { ctx } = this;
        ctx.body = 'home';
    }
}

module.exports = HomeConstroller;