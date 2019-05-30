/**
 * ajax 服务路由集合
 */
const router = require('koa-router')();
const controllers = require('../controllers');
const { url: url } = require('../config');

router.post(url.prefix + '/tushare/detail', controllers.getTushareStockDetail);

router.post(url.prefix + '/tushare/list', controllers.getTushareStockList);

router.post(url.prefix + '/list', controllers.getStockList);

router.post(url.prefix + '/xueqiu/stocklist', controllers.getXueQiuStockList);

router.post(url.prefix + '/xueqiu/stockcomment', controllers.getXueQiuStockComment);

router.post(url.prefix + '/xueqiu/stockkline', controllers.getXueQiuStockKLine);

router.post(url.prefix + '/xueqiu/companylist', controllers.getXueQiuCompanyList);

module.exports = router;
