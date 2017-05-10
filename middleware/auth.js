var jwt = require('jsonwebtoken');
module.exports = function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // 解析 token
    if (token) {
        // 确认token
        jwt.verify(token, 'zhiyuJS', function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'token信息错误' });
            } else {
                // 如果没问题就把解码后的信息保存到请求中，供后面的路由使用
                req.userinfo = decoded;
                next();
            }
        });
    } else {
        // 如果没有token，则返回错误
        return res.status(403).send({
            success: false,
            message: '没有token！'
        });
    }
};
