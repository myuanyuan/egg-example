module.exports = {
    get isChrome() { // 前加get可以通过直接访问属性的方式取值
        let userAgent = this.get('User-Agent').toLowerCase();
        return userAgent.includes('chrome');
    }
}