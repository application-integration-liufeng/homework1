const request = require('../tools/request');

async function getStockCount(market, type) {
  let count = await request({
    url: 'https://xueqiu.com/service/v5/stock/screener/quote/list',
    method: 'GET',
    params: {
      order_by: 'percent',
      market,
      type
    }
  });
  return count.data.count;
}

async function getStockInfo(stockSymbol) {
  let industryInfo = request({
    url: 'https://xueqiu.com/stock/industry/stockList.json',
    method: 'GET',
    headers: { Cookie: 'xq_a_token=f2b320bcd98bf47d2e8bfe8ea8120eb0f326a07a' },
    params: {
      code: stockSymbol,
      type: 1
    }
  });

  let companyInfo = request({
    url: 'https://stock.xueqiu.com/v5/stock/f10/cn/company.json',
    method: 'GET',
    headers: { Cookie: 'xq_a_token=f2b320bcd98bf47d2e8bfe8ea8120eb0f326a07a' },
    params: {
      symbol: stockSymbol
    }
  });

  let { industryname } = await industryInfo;
  let {
    data: {
      company: { established_date, listed_date, org_name_cn }
    }
  } = await companyInfo;

  return {
    industry_name: industryname,
    established_date: established_date ? new Date(established_date) : null,
    listed_date: listed_date ? new Date(listed_date) : null,
    company_name: org_name_cn
  };
}

module.exports = {
  getAllStockList: async function({ market = 'CN', type = 'sh_sz' }) {
    let size = await getStockCount(market, type);
    return this.getStockList({ market, type, size });
  },
  getStockList: async function({
    market = 'CN',
    type = 'sh_sz',
    page = 1,
    size = 30,
    order_by = 'symbol',
    order = 'asc'
  }) {
    let result = await request({
      url: 'https://xueqiu.com/service/v5/stock/screener/quote/list',
      method: 'GET',
      headers: {
        Cookie: 'xq_a_token=f2b320bcd98bf47d2e8bfe8ea8120eb0f326a07a'
      },
      params: {
        page,
        size,
        order,
        order_by,
        market,
        type
      }
    });

    let stockList = [];
    let list = result.data.list;
    const cacheSize = 5;

    for (let i = 0; i < list.length; i += cacheSize) {
      let subList;
      subList = await Promise.all(
        list.slice(i, i + cacheSize).map(async stock => {
          let info = await getStockInfo(stock.symbol);
          return Object.assign(
            { symbol: stock.symbol, name: stock.name },
            info
          );
        })
      );
      for (let stock of subList) {
        stockList.push(stock);
      }
      console.log(`${i + subList.length}/${list.length}`);
    }

    return stockList;
  }
};
