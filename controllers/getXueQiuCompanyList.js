const mysql = require('../middleware/mysql');
const date2string = require('../tools/date2string');

module.exports = async ctx => {
  const page = ctx.request.body.page || 1;
  const size = ctx.request.body.size || 30;
  const order_by = ctx.request.body.order_by || 'symbol';
  const order = ctx.request.body.order || 'asc';

  let results = await mysql
    .select()
    .from('xueqiu')
    .offset((page - 1) * size)
    .limit(size)
    .orderBy(order_by, order);
  ctx.body = results.map(stock => {
    return {
      symbol: stock.symbol,
      name: stock.name,
      industry_name: stock.industry_name,
      company_name: stock.company_name,
      established_date: date2string(stock.established_date),
      listed_date: date2string(stock.listed_date)
    };
  });
};
