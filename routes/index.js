/**
 * ajax 服务路由集合
 */
const router = require('koa-router')();
const controllers = require('../controllers');
const { url: url } = require('../config');

router.post(url.prefix + '/tushare/detail', controllers.getTushareStockDetail);
//
// router.get(url.prefix + '/getUserInfo', controllers.getUserInfo);


module.exports = router;
