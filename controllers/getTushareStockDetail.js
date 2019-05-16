const mysql = require('../middleware/mysql');

module.exports = async (ctx) =>{

    const symbol = ctx.request.body.symbol;

    let results = await mysql('tushare')
        .select('*')
        .where('symbol', symbol);

    ctx.body = results[0];
};
