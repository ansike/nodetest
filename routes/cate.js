var express = require('express');
var router = express.Router();
var querystring = require('querystring');

var cate_controller = require('../controller/cateCtr');

router.get('/', function(req, res, next) {
    res.send('this is cate!');
})

router.post('/query', function(req, res, next) {
    cate_controller.query(req, res, next);
})

router.post('/addTop', function(req, res, next) {
    cate_controller.addTop(req, res, next);
})

router.post('/uploadImg', function(req, res, next) {
    console.log(req.body['items[]']);
    cate_controller.uploadImg(req, res, next);
})
module.exports = router;
