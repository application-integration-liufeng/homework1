const mysql = require('../middleware/mysql');
const xueqiuapi = require('../tools/xueqiuapi');

(async () => {
  try {
    let exists = mysql.schema.hasTable('xueqiu');
    if (await exists) {
      await mysql.schema.dropTable('xueqiu');
    }
    let create = mysql.schema.createTable('xueqiu', function(table) {
      table.increments().primary();
      table.string('symbol', 20);
      table.string('name');
      table.string('industry_name');
      table.string('company_name');
      table.date('established_date');
      table.date('listed_date');
      table.index('symbol');
    });
    await create;
    console.log('开始获取股票数据...');
    let list = xueqiuapi.getAllStockList({ type: 'sh_sz' });

    let result = await list;
    console.log('股票数据获取成功！');
    console.log('开始写入数据库...');

    await mysql('xueqiu').insert(result);
    console.log('数据写入完成！');
  } catch (err) {
    process.exitCode = 1;
  } finally {
    mysql.destroy();
    process.exit();
  }
})();
