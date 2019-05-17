const mysql = require('../middleware/mysql');
const xueqiuapi = require('../tools/xueqiuapi');

(async () => {
  console.log('开始获取股票数据...');
  try {
    let list = xueqiuapi.getAllStockList();

    let exists = mysql.schema.hasTable('xueqiu');
    if (await exists) {
      await mysql.schema.dropTable('xueqiu');
    }
    let create = mysql.schema.createTable('xueqiu', function(table) {
      table.string('symbol', 20).primary();
      table.string('name');
      table.float('current');
      table.float('chg');
      table.float('percent');
      table.bigInteger('market_capital');
    });

    let result = await list;
    console.log('股票数据获取成功！');
    await create;
    console.log('开始写入数据库...');

    await mysql('xueqiu').insert(result);
    console.log('数据写入完成！');
  } catch (err) {
    console.log('Fail');
  } finally {
    mysql.destroy();
  }
})();
