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