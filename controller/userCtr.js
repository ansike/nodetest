var pool = require('../conf/conn');
var user_model = require('../model/userModel');
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
            connection.query(queryString, [param.id],function(err, result) {
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
    addUser:function (req,res) {
    	pool.getConnection(function (err,connection) {
    		var param = req.query || req.params;
    		connection.query(user_model.insert,[param.name,param.age,param.sex,param.address,param.depart,param.worklen,param.wage],function (err,result) {
    			if (result) {
                    var resData = {
                        code: 200,
                        msg: '插入成功！'
                    }
                }
                //返回结果
                callback(res, resData);
                //释放链接
                connection.release();
    		})
    	})
    },
    deleteUser:function (req,res) {
    	pool.getConnection(function (err,connection) {
    		var param = req.query || req.params;
    		connection.query(user_model.delete,[param.id],function (err,result) {
    		console.log(param);
    		console.log(result);
    			if (result.affectedRows==1) {
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
    updateUser:function (req,res) {
    	pool.getConnection(function (err,connection) {
    		var param = req.query || req.params;
    		connection.query(user_model.update,[param.id,param.name,param.age,param.sex,param.address,param.depart,param.worklen,param.wage],function (err,result) {
    		console.log(param);
    		console.log(result);
    			if (result.affectedRows==1) {
                    var resData = {
                        code: 200,
                        msg: '更新成功！'
                    }
                }
                //返回结果
                callback(res, resData);
                //释放链接
                setTimeout(function () {
	                connection.release();
                	
                }, 300)
    		})
    	})
    }

}
