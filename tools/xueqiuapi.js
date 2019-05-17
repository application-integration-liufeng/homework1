const axios = require('axios');

let request = axios.create({
  baseURL: 'https://xueqiu.com/service/v5/stock/screener/quote'
});

request.interceptors.response.use(
  function(response) {
    return response.data;
  },
  function(error) {
    return Promise.reject(error);
  }
);

async function getStockCount(market, type) {
  let result = await request.get(
    `list?order=desc&order_by=percent&market=${market}&type=${type}`
  );
  return result.data.count;
}

function formatStocks(stockList) {
  console.log();
  return stockList.map(stock => {
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

module.exports = {
  getAllStockList: async function(market = 'CN', type = 'sh_sz') {
    let count = await getStockCount(market, type);
    let result = await request.get(
      `list?size=${count}&order=desc&order_by=percent&market=${market}&type=${type}`
    );
    return formatStocks(result.data.list);
  },
  getStockList: async function(
    market = 'CN',
    type = 'sh_sz',
    page = 1,
    size = 20,
    orderBy = 'symbol',
    order = 'asc'
  ) {
    let result = await request.get(
      `list?page=${page}&size=${size}&order=${order}&order_by=${orderBy}&market=${market}&type=${type}`
    );
    return formatStocks(result.data.list);
  }
};
