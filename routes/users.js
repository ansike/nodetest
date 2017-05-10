var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth');//token的中间件


var user_controller = require('../controller/userCtr');
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/queryUser', function(req, res, next) {
    user_controller.queryUser(req, res, next);
})
router.post('/register', function(req, res, next) {
    user_controller.register(req, res, next);
})
router.post('/deleteUser', function(req, res, next) {
    user_controller.deleteUser(req, res, next);
})
router.post('/updateUser', function(req, res, next) {
    user_controller.updateUser(req, res, next);
})
router.post('/login', function(req, res, next) {
    user_controller.login(req, res, next);
})
router.get('/checkLogin', auth,function(req, res, next) {
    user_controller.checkLogin(req, res, next);
})
router.get('/getRandomCode',function(req, res, next) {
    user_controller.getRandomCode(req, res, next);
})
module.exports = router;
