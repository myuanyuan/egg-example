// 向context添加一个方法，用来获取accept-language请求头
//  这里不要用箭头函数
exports.language = function () {
    return this.get('accept-language');
}