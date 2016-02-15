var express = require('express');
var Book = require('../models/book');
var router = express.Router();

// 首页
router.get('/', function (req, res) {
    Book.find().skip(0).limit(30).exec(function (err, books) {
        if (err) throw err;
        res.render('index/index', {data_books: JSON.stringify(books)});  
    });
});

// 加载更多
router.post('/loadmore', function (req, res) {
    var skip = 0;

    if(req.body.skip) {
        skip = parseInt(req.body.skip);
    }

    Book.find().skip(skip).limit(30).exec(function (err, books) {
        if (err) throw err;
        res.json( {data_books: books} );
    });
});

// 注册
router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res, next) {
   
});

// 登录
router.get('/login', function(req, res) {
    res.render('login/login', {});
});

router.post('/login', function(req, res, next) {
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/logout', function(req, res, next) {
    req.logout();
});

// 搜索
router.post('/search', function (req, res) {
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

    Book.find(querySet, function (err, books) {
        if (err) throw err;
        res.json( {data_books: books} );
    });
});

// 关于
router.get('/about', function (req, res) {
    res.render('about/about', {});
});

module.exports = router;