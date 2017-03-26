var mysql=require('mysql');
var conf=require('./db');

module.exports=mysql.createPool(conf.mysql);