var pool = require('../conf/conn');
var user_model = require('../model/userModel');
var crypto = require('crypto'); //md5加密工具
var jwt = require('jsonwebtoken');
var captchapng = require('captchapng'); //base64的二进制流小文件

var hash = crypto.createHash("md5");

//向前台返回json
var callback = function(res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code: '-1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
}
module.exports = {
    queryUser: function(req, res) {
        pool.getConnection(function(err, connection) {
            //获取前端传过来的参数
            var param = req.query || req.params;
            var queryString;
            if (param.id != null && param.id != undefined && param.id != '') {
                queryString = user_model.queryById;
            } else {
                queryString = user_model.queryAll;

            }
            connection.query(queryString, [param.id], function(err, result) {
                if (result) {
                    var resData = {
                        code: 200,
                        data: result
                    }
                }
                //返回结果
                callback(res, resData);
                //释放链接
                connection.release();
            })

        })
    },

    deleteUser: function(req, res) {
        pool.getConnection(function(err, connection) {
            var param = req.query || req.params;
            connection.query(user_model.delete, [param.id], function(err, result) {
                if (result.affectedRows == 1) {
                    var resData = {
                        code: 200,
                        msg: '删除成功！'
                    }
                }
                //返回结果
                callback(res, resData);
                //释放链接
                connection.release();
            })
        })
    },
    updateUser: function(req, res) {
        pool.getConnection(function(err, connection) {
            var param = req.query || req.params;
            var queryString = user_model.update;
            var array = [];
            for (key in param) {
                if (key != 'id') {
                    queryString += key + '=?,'
                    array.push(param[key]);

                }
            }
            array.push(param.id);
            queryString = queryString.substr(0, queryString.length - 1);
            queryString += ' where id=?'
            connection.query(queryString, array, function(err, result) {
                if (result.affectedRows == 1) {
                    var resData = {
                        code: 200,
                        msg: '更新成功！'
                    }
                }
                //返回结果
                callback(res, resData);
                //释放链接
                setTimeout(function() {
                    connection.release();

                }, 300)
            })
        })
    },
    register: function(req, res) {
        pool.getConnection(function(err, connection) {
            var param = req.body;

            connection.query(user_model.queryByName, [param.name], function(err, result) {
                if (!result[0]) {

                    hash.update(new Buffer(param.pwd, "binary"));
                    param.pwd = hash.digest('hex');

                    connection.query(user_model.insert, [param.name, param.pwd], function(err, result) {
                        if (result) {
                            var resData = {
                                code: 200,
                                msg: '插入成功！'
                            }
                        }
                        //返回结果
                        callback(res, resData);
                    })
                } else {
                    var resData = {
                        code: 202,
                        msg: '用户已经存在！'
                    }
                    callback(res, resData);
                }

                //释放链接
                connection.release();
            })
        })
    },
    login: function(req, res) {
        var params = req.body;
        if (params.name) {
            if (params.randomCode == req.session.code) {
                pool.getConnection(function(err, connection) {
                    connection.query("select * from user_t where name=?", [params.name], function(err, result) {
                        if (err) {
                            res.json({
                                code: "400",
                                msg: err
                            })
                        }
                        if (result) {


                            hash.update(new Buffer(params.pwd, "binary"));
                            params.pwd = hash.digest('hex');
                            if (params.pwd == result[0].pwd) {

                                //---------------------------1使用session和cookie
                                // //写到session中
                                // req.session.user = params;

                                //---------------------------2使用token
                                //秘钥
                                var jwtTokenSecret = 'zhiyuJS';
                                //生成token
                                var token = jwt.sign(params, jwtTokenSecret, {
                                    expiresIn: 3600 // 设置过期时间,单位是秒
                                });

                                res.json({
                                    code: "200",
                                    msg: "success！",
                                    token: token
                                })
                            } else {
                                res.json({
                                    code: "201",
                                    msg: "账号或者密码错误！"
                                })
                            }
                        }
                        connection.release();
                    })
                })
            }else{
                res.json({
                code: "202",
                msg: "验证码错误！"
            })
            }

        } else {
            res.json({
                code: "201",
                msg: "字段或者方法出错！"
            })
        }
    },
    checkLogin: function(req, res) {
        // //------------------------1session
        // //验证是否有了session
        // var userInfo = req.session.user;

        //------------------------2token
        var userInfo = req.userinfo;
        callback(res, { code: 200, user: userInfo });
    },
    //验证码
    getRandomCode: function(req, res) {
        var code = parseInt(Math.random() * 9000 + 1000);
        //将code存到session
        req.session.code = code;

        var ctx = new captchapng(80, 30, code);
        ctx.color(0, 0, 0, 0);
        ctx.color(80, 80, 80, 255);
        var img = ctx.getBase64();

        var imgbase64 = new Buffer(img, 'base64');
        res.writeHead(200, {
            'Content-Type': 'image/png'
        });
        res.end(imgbase64); //输出图片的二进制流
    }
}
