let moment = require('moment');
moment.locale('zh-cn');

exports.fromNow = dateTime => {
    return moment(dateTime).fromNow();
}