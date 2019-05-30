const { getStockList } = require('../tools/xueqiuapi');

module.exports = async ctx => {
  const page = ctx.request.body.page || 1;
  const size = ctx.request.body.size || 30;
  const order_by = ctx.request.body.order_by || 'symbol';
  const order = ctx.request.body.order || 'asc';
  try {
    ctx.body = await getStockList({ page, size, order_by, order });
  } catch (error) {
    ctx.body = [];
  }
};
