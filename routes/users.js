var express = require('express');
var router = express.Router();

var user_controller = require('../controller/userCtr');
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/queryUser', function(req, res, next) {
    user_controller.queryUser(req, res, next);
})
router.post('/addUser', function(req, res, next) {
    user_controller.addUser(req, res, next);
})
router.post('/deleteUser', function(req, res, next) {
    user_controller.deleteUser(req, res, next);
})
router.post('/updateUser', function(req, res, next) {
    user_controller.updateUser(req, res, next);
})
module.exports = router;
