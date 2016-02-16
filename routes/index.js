var express = require('express');
var Book = require('../models/book');
var User = require('../models/user');
var router = express.Router();

// 首页
router.get('/', function (req, res) {
    // 查询图书列表，首次加载30
    Book.find().skip(0).limit(30).exec(function (err, books) {
        if (err) throw err;
        res.render('index/index', {data_books: JSON.stringify(books)});  
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

    // 查询结果已json格式返回
    Book.find(querySet, function (err, books) {
        if (err) throw err;
        res.json( {data_books: books} );
    });
});

// 关于
router.get('/about', function (req, res) {
    res.render('about/about');
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
    
});

// 注销
router.get('/logout', function(req, res, next) {
    
});

module.exports = router;