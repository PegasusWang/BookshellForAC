var User = require('../models/user');
var auth = {};

// 验证是否已经登录
auth.isLogin = function (req, res, next) {
    // 未登录 - 跳转到/login
    if (!req.session.uid) {
        res.redirect("/auth/login");
    }
    // 已登录 - next()
    else {
        next();
    }  
}

// 验证是否是管理员
auth.isAdmin = function (req, res, next) {
    var userid = req.session.uid;
    User.find({_id: userid}).exec(function (err, users) {
        var user = users[0];
        // 否 - 跳转到/
        if (user.userLevel < 5) {
            res.redirect('/');
        }
        // 是 - next()
        else {
            next();
        }
    });
}

module.exports = auth;