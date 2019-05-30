const mysql = require('../middleware/mysql');
const tushare = require('../middleware/tushare');
const { tushare: tushare_config } = require('../config');

module.exports = async (ctx) =>{

    const symbol = ctx.request.body.symbol;

    let results = await mysql('tushare')
        .select('*')
        .where('symbol', symbol);

    let stockDetail = results[0];

    let today = new Date();
    let year = today.getFullYear().toString();
    let month = today.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    } else {
        month = month.toString();
    }
    let day = '01';

    let data = {
        api_name : 'daily',
        token : tushare_config.token,
        params : {
            ts_code : stockDetail.ts_code,
            start_date: year + month + day
        },
        fields : ''
    };

    stockDetail.daily = (await tushare(data)).data;

    data = {
        api_name : 'namechange',
        token : tushare_config.token,
        params : {
            ts_code : stockDetail.ts_code,
            //start_date: year + month + day
        },
        fields : ''
    };

    stockDetail.namechange = (await tushare(data)).data;

    data = {
        api_name : 'suspend',
        token : tushare_config.token,
        params : {
            ts_code : stockDetail.ts_code,
            //start_date: year + month + day
        },
        fields : ''
    };

    stockDetail.suspend = (await tushare(data)).data;

    ctx.body = stockDetail;
};
