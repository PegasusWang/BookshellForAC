var express = require('express');
var Book = require('../models/book');
var User = require('../models/user');
var Log = require('../models/log');
var auth = require('../midwares/auth');
var router = express.Router();

// 首页
router.get('/', function (req, res) {
    // 查询图书列表，首次加载30
    Book.find().skip(0).limit(30).exec(function (err, books) {
        if (err) throw err;
        res.render('index/index', {
            data_books: JSON.stringify(books),
            uid: req.session.uid,
            user: req.session.user, 
            isadmin: req.session.isadmin
        });  
    });
});

// 加载更多
router.post('/loadmore', function (req, res) {
    // 起点
    var skip = 0;
    if(req.body.skip) {
        skip = parseInt(req.body.skip);
    }
 
    // 再加载30个已json格式返回
    Book.find().skip(skip).limit(30).exec(function (err, books) {
        if (err) throw err;
        res.json( {data_books: books} );
    });
});

// 搜索
router.post('/search', function (req, res) {
    // 查询内容
    var query = req.body.q;
    var querySet = [];
    var queryRegExp = new RegExp(".*?" + query + ".*?");
    var feilds = ['title', 'author', 'intro', 'category', 'press'];

    for (var i = 0; i < feilds.length; i++) {
        var s = {};
        s[feilds[i]] = queryRegExp;
        querySet.push(s);
    }

    querySet = {'$or': querySet};

    // 查询结果以json格式返回
    Book.find(querySet, function (err, books) {
        if (err) throw err;
        res.json( {data_books: books} );
    });
});

// 日志
router.get('/giveback', auth.isLogin, function (req, res) {
    Log.find({'uid': req.session.uid}).exec(function (err, logs) {
        if (err) throw err;
        res.render('giveback/giveback', {user: req.session.user, isadmin: req.session.isadmin, logs: JSON.stringify(logs)});
    });
});

// 求购
router.get('/buy', function (req, res) {
    res.render('buy/buy', {user: req.session.user, isadmin: req.session.isadmin});
});

// 关于
router.get('/about', function (req, res) {
    res.render('about/about', {user: req.session.user, isadmin: req.session.isadmin});
});


module.exports = router;