const mysql = require('../middleware/mysql');
const { getAllCompany } = require('./xueqiuapi');

(async () => {
  try {
    console.log('开始获取公司数据...');
    let result = await getAllCompany({ type: 'sh_sz' });
    console.log('公司数据获取成功！');

    let exists = mysql.schema.hasTable('xueqiu_companies');
    if (await exists) {
      await mysql.schema.dropTable('xueqiu_companies');
    }
    await mysql.schema.createTable('xueqiu_companies', function (table) {
      table.string('symbol', 20).primary();
      table.string('name');
      table.string('industry_name');
      table.string('company_name');
      table.date('established_date');
      table.date('listed_date');
      table.index('symbol');
    });


    console.log('开始写入数据库...');
    await mysql('xueqiu_companies').insert(result);
    console.log('数据写入完成！');
  } catch (error) {
    process.exitCode = 1;
  } finally {
    mysql.destroy();
    process.exit();
  }
})();
