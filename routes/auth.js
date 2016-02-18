var express = require('express');
var Book = require('../models/book');
var User = require('../models/user');
var router = express.Router();

// 登录
router.get('/login', function(req, res) {
    // 如果已经登录则直接跳转到首页
    if (req.session.uid) {
        res.redirect('/');
    }
    else {
        res.render('login/login', {});
    }
});

router.post('/login', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    User.find({username: username}).exec(function (err, users) {
        if (err) throw err;

        if (users.length && users[0].password === password) {
            req.session.uid = users[0]._id;
            req.session.user = users[0].username;
            if (users[0].userLevel < 5) {
                res.json({status: 'user'});
            }
            else {
                req.session.isadmin = true;
                res.json({status: 'admin'});
            }
        }
        else {
            res.status(401);
            res.end();
        }
    });
});

// 注销
router.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.redirect('/auth/login');
});

module.exports = router;