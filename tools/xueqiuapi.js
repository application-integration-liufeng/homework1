const request = require('../tools/request');
const ProgressBar = require('progress');

request.setUseCookie('xq_a_token');

async function getStockCount (market, type) {
  let count = await request({
    url: 'https://xueqiu.com/service/v5/stock/screener/quote/list',
    method: 'GET',
    params: { order_by: 'percent', market, type }
  });
  return count.data.count;
}

async function getStockInfo (stockSymbol) {
  let industryInfo = request({
    url: 'https://xueqiu.com/stock/industry/stockList.json',
    method: 'GET',
    params: { code: stockSymbol, type: 1 }
  });

  let companyInfo = request({
    url: 'https://stock.xueqiu.com/v5/stock/f10/cn/company.json',
    method: 'GET',
    params: { symbol: stockSymbol }
  });

  let { platename } = await industryInfo;
  let { data: { company: { established_date, listed_date, org_name_cn } } } = await companyInfo;

  return {
    industry_name: platename,
    established_date: established_date ? new Date(established_date) : null,
    listed_date: listed_date ? new Date(listed_date) : null,
    company_name: org_name_cn
  };
}

async function getAllStockList ({ market = 'CN', type = 'sh_sz' }) {
  let size = await getStockCount(market, type);
  return getStockList({ market, type, size });
}

async function getStockList (
  { market = 'CN', type = 'sh_sz', page = 1, size = 30, order_by = 'symbol', order = 'asc' }
) {
  let result = await request({
    url: 'https://xueqiu.com/service/v5/stock/screener/quote/list',
    method: 'GET',
    params: { page, size, order, order_by, market, type }
  });

  let stockList = [];
  let list = result.data.list;
  var bar = new ProgressBar(
    '  downloading [:bar] :percent :current/:total :etas ',
    {
      complete: '■',
      incomplete: ' ',
      width: 30,
      total: list.length
    }
  );

  stockList = await Promise.all(
    list.map(async stock => {
      let info = await getStockInfo(stock.symbol);
      bar.tick(1);
      return Object.assign({ symbol: stock.symbol, name: stock.name }, info);
    })
  );

  return stockList;
}
module.exports = { getAllStockList };
