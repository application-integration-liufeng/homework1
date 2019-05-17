const xml2JSON = require('../middleware/xml2JSON');
const xmlPath = './xml/stock.xml';

module.exports = async (ctx) => {

    const offset = ctx.request.body.offset;

    let stocks = await xml2JSON(xmlPath);
    stocks = stocks.stocks;

    console.log(stocks);

    let list = [];
    for (let key in stocks) {
        let stock = stocks[key];
        stock.name = key;
        list.push(stock);
    }

    if (offset >= list.length) {
        return;
    }
    let end = offset + 20;
    if (end > list.length) {
        end = list.length;
    }
    ctx.body = list.slice(offset, end);

};
