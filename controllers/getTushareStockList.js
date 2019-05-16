const mysql = require('../middleware/mysql');

module.exports = async (ctx) =>{

    const offset = ctx.request.body.offset;

    let results = await mysql('tushare')
        .select('*')
        .limit(20)
        .offset(parseInt(offset))
        .orderBy('stock_id','asc');

    ctx.body = results;
};
