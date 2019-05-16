/**
 * ajax 服务路由集合
 */
const router = require('koa-router')();
const controllers = require('../controllers');
const { url: url } = require('../config');

router.post(url.prefix + '/tushare/detail', controllers.getTushareStockDetail);

router.post(url.prefix + '/tushare/list', controllers.getTushareStockList);


module.exports = router;
