const xueqiuapi = require('../tools/xueqiuapi');
const mysql = require('../middleware/mysql');

module.exports = async ctx => {
  let results = await xueqiuapi.getStockList();
  results.map(async stock => {
    await mysql('xueqiu')
      .where('symbol', stock.symbol)
      .update(stock);
  });
  ctx.body = { results };
};
