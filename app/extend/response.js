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