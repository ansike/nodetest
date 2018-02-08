var pool = require('../conf/conn');
var cateModel = require('../model/cateModel');
var querystring = require('querystring');
var fs = require("fs");
var muilter = require('./multerUtil');
var callback = function(res, ret) {
    if (ret === 'undefined') {
        res.json({
            code: '-1',
            msg: '操作失败！'
        })
    } else {
        res.json(ret);
    }
}

module.exports = {
    addTop: function(req, res) {
        pool.getConnection(function(err, connection) {
            var param = req.query || req.params;
            var data = req.body['items[]'],
                resDate;
            console.log(data);
            if (data != 'undefined' && typeof data != 'undefined') {
                if (typeof data == 'string') {
                    connection.query(cateModel.insert, [data, 0], function(err, result) {
                        if (result) {
                            resDate = {
                                code: 200,
                                data: '插入成功！'
                            }
                        }
                        callback(res, resDate);
                        connection.release();
                    })
                } else {
                    for (var i = 0; i < data.length; i++) {
                        var name = data[i];
                        connection.query(cateModel.insert, [name, 0], function(err, result) {

                        });
                        if (i == data.length - 1) {
                            resDate = {
                                code: 200,
                                data: '插入成功！'
                            }
                            callback(res, resDate);
                            connection.release();
                        }
                    }
                }
            } else {
                resDate = {
                    code: 101,
                    data: '参数为空！'
                }
                callback(res, resDate);
            }
        })
    },
    query: function(req, res) {
        var qs = querystring.parse(req.url.split('?')[1]);
        if (qs.callback) {
            pool.getConnection(function(err, connection) {
                var param = req.query || req.params;
                var queryString;
                if (param.id) {
                    queryString = cateModel.queryById;
                } else {
                    queryString = cateModel.queryAll;

                }
                connection.query(queryString, [param.id], function(err, result) {
                    if (result) {
                        resDate = {
                            code: 200,
                            data: result
                        }
                    }
                    var data = resDate;

                    data = JSON.stringify(data);
                    var callback = data;

                    res.jsonp(callback);
                    connection.release();
                })

            })
        } else {
            res.end('Hell World\n');
        }



    },
    uploadImg: function(req, res) {
        //multer有single()中的名称必须是表单上传字段的name名称。
        var upload = muilter.single('file');
        upload(req, res, function(err) {
            //添加错误处理
            if (err) {
                return console.log(err);
            }
            //文件信息在req.file或者req.files中显示。
            var file=req.file;
            res.send({code:200,"msg":"上传成功","path":"http://localhost:8090/uploads/"+file.filename});
        });
    }
}
