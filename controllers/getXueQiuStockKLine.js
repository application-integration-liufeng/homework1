const { getKLine } = require('../tools/xueqiuapi');

module.exports = async ctx => {
  const symbol = ctx.request.body.symbol;
  const period = ctx.request.body.period || '1m';
  const count = ctx.request.body.count || '-100';
  try {
    ctx.body = await getKLine(symbol, period, count);
  } catch (error) {
    ctx.body = [];
  }
};
