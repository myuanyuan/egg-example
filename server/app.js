let express = require('express');
let app = express();

app.get('/news', (req, res) => {
    const list = [
        { id: '0', image: '', title: '00000', message: '000000000000000000000000000000', createAt: 132424355545454 },
        { id: '1', image: '', title: '11111', message: '111111111111111111111111111111', createAt: 13245453254545 },
        { id: '2', image: '', title: '22222', message: '222222222222222222222222222222', createAt: 13245353254545 },
        { id: '3', image: '', title: '33333', message: '333333333333333333333333333333', createAt: 132454254545 },
        { id: '4', image: '', title: '44444', message: '444444444444444444444444444444', createAt: 132454254545 },
        { id: '5', image: '', title: '55555', message: '555555555555555555555555555555', createAt: 1325444254545 },
        { id: '6', image: '', title: '66666', message: '666666666666666666666666666666', createAt: 13254544254545 },
    ];
    res.json(list);
})

app.listen(3000);