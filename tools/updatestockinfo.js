const mysql = require('../middleware/mysql');
const { getAllStocks } = require('../tools/xueqiuapi');

(async () => {
  console.log('开始获取股票数据...');
  try {
    let list = getAllStocks({});

    let exists = mysql.schema.hasTable('xueqiu_stocks');
    if (await exists) {
      await mysql.schema.dropTable('xueqiu_stocks');
    }
    let create = mysql.schema.createTable('xueqiu_stocks', function (table) {
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

    await mysql('xueqiu_stocks').insert(result);
    console.log('数据写入完成！');
  } catch (err) {
    console.log('Fail');
  } finally {
    mysql.destroy();
  }
})();
