const { getComments } = require('../tools/xueqiuapi');

module.exports = async ctx => {
  const symbol = ctx.request.body.symbol;
  try {
    ctx.body = await getComments(symbol);
  } catch (error) {
    ctx.body = [];
  }
};
