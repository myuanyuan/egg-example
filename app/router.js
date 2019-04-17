

module.exports = app => {
    const { router, controller } = app;
    // constroller是目录对象
    router.get('/', controller.home.index);
    router.get('/home', controller.home.index);
    router.get('/news', controller.news.index);
    router.get('/counter', controller.news.counter)

    router.get('/user', controller.user.list)
    router.get('/user/add', controller.user.add)
    router.post('/user/doAdd', controller.user.doAdd)
}