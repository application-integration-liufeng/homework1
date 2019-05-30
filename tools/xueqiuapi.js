const request = require('../tools/request');
const ProgressBar = require('progress');
const { date2stringtime } = require('../tools/date2string');

request.setUseCookie('xq_a_token', 'https://xueqiu.com');

async function getStockCount (market, type) {
  let count = await request({
    url: 'https://xueqiu.com/service/v5/stock/screener/quote/list',
    method: 'GET',
    params: { order_by: 'percent', market, type }
  });
  return count.data.count;
}

async function getCommentCount (stockSymbol) {
  let count = await request({
    url: 'https://xueqiu.com/statuses/search.json',
    method: 'GET',
    params: { count: 1, symbol: stockSymbol, source: 'user', sort: 'time' }
  });
  return count.count;
}

async function getComments (stockSymbol) {
  try {
    var size = await getCommentCount(stockSymbol);
  } catch (error) {
    return Promise.reject();
  }

  let list = [];

  for (let i = 1; i <= Math.ceil(size / 10); i++) {
    let subList = await request({
      url: 'https://xueqiu.com/statuses/search.json',
      method: 'GET',
      params: { count: 10, symbol: stockSymbol, source: 'user', sort: 'time', page: i }
    });
    subList.list.filter(comment => { return !comment.title }).forEach(comment => {
      list.push({
        name: comment.user.screen_name,
        time: date2stringtime(new Date(comment.created_at)),
        content: comment.text
      })
    })
    if (list.length >= 5) {
      break;
    }
  }

  return list;
}

async function getAllStocks ({ market = 'CN', type = 'sh_sz' }) {
  try {
    var size = await getStockCount(market, type);
  } catch (error) {
    return Promise.reject();
  }
  return getStockList({ market, type, size });
}

async function getStockList (
  { market = 'CN', type = 'sh_sz', page, size = 30, order_by = 'symbol', order = 'asc' }
) {
  let result = await request({
    url: 'https://xueqiu.com/service/v5/stock/screener/quote/list',
    method: 'GET',
    params: { page, size, order, order_by, market, type }
  });

  return result.data.list.map(stock => {
    return {
      symbol: stock.symbol,
      chg: stock.chg,
      percent: stock.percent,
      current: stock.current,
      name: stock.name,
      market_capital: stock.market_capital
    };
  });
}

async function getIndustries (category = 'CN') {
  return await request({
    url: 'https://xueqiu.com/service/screener/industries',
    method: 'GET',
    params: { category }
  });
}

async function getKLine (stockSymbol, period, count) {
  let result = await request({
    url: 'https://stock.xueqiu.com/v5/stock/chart/kline.json',
    method: 'GET',
    params: { symbol: stockSymbol, begin: Date.now(), period, count }
  });

  return result.data.item.map(arr => {
    return {
      time: arr[0],
      open: arr[2],
      high: arr[3],
      low: arr[4],
      close: arr[5],
    };
  });
}

async function getCompanyInfo (stockSymbol) {
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

  try {
    var { platename } = await industryInfo;
    var { data: { company: { established_date, listed_date, org_name_cn } } } = await companyInfo;
  } catch (error) {

  }

  return {
    industry_name: platename,
    established_date: established_date ? new Date(established_date) : null,
    listed_date: listed_date ? new Date(listed_date) : null,
    company_name: org_name_cn
  };
}

async function getAllCompany ({ market = 'CN', type = 'sh_sz' }) {
  try {
    var size = await getStockCount(market, type);
  } catch (error) {
    return Promise.reject();
  }
  return getCompanyList({ market, type, size });
}

async function getCompanyList (
  { market = 'CN', type = 'sh_sz', page, size = 30, order_by = 'symbol', order = 'asc' }
) {
  let result = await request({
    url: 'https://xueqiu.com/service/v5/stock/screener/quote/list',
    method: 'GET',
    params: { page, size, order, order_by, market, type }
  });

  let companyList = [];
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

  companyList = await Promise.all(
    list.map(async stock => {
      let info = await getCompanyInfo(stock.symbol);
      bar.tick(1);
      return Object.assign({ symbol: stock.symbol, name: stock.name }, info);
    })
  );

  return companyList;
}
module.exports = { getAllCompany, getStockList, getAllStocks, getIndustries, getKLine, getComments };
