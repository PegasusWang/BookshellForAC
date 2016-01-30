var mongoose = require('mongoose');
var multiparty = require("multiparty");
var util = require("util");
var xlsx = require('node-xlsx');
var db = require('../models/db');
var Book = db.Book;

// '/' 首页
exports.index = function (req, res) {
    Book.find().skip(0).limit(30).exec(function(err, books) {
        if (err) throw err;
        res.render('index/index', {data_books: JSON.stringify(books)});
    });
};

// '/loadmore' 滚动加载
exports.loadMore = function (req, res) {
    var skip = 0;

    if(req.body.skip) {
        skip = parseInt(req.body.skip);
    }

    Book.find().skip(skip).limit(30).exec(function(err, books) {
        if (err) throw err;
        res.json( {data_books: books} );
    });
}

// '/admin' 管理
exports.admin = function (req, res) {
    res.render('admin/book', {});
};

// '/admin/addbook' 添加图书
exports.addBook = function (req, res) {
    // 生成数据obj
    var book = new Book({
        'title': req.body.title,
        'author': req.body.author,
        'intro': req.body.intro,
        'read': 0,
        'last': req.body.count,
        'count': req.body.count,
        'category': req.body.category,
        'press': req.body.press,
        'barcode': req.body.barcode,
        'locate': []
    });
    book.save(function (err) {
        if (err) throw err;
        res.json( {"status": "ok"} );
    });
};

// '/admin/excelimport' 通过excel导入
exports.importFromExcel = function (req, res) {
    var form = new multiparty.Form({ 'uploadDir': __dirname + '/../uploads' });
 
    // 返回录入结果
    res.writeHead(200, {'content-type': 'text/plain'});
    
    form.parse(req, function (err, fields, files) {
        if (err) throw err;
        // 清空原始数据
        Book.remove({}, function (err) {
            if (err) throw err;
            // 解析xlsx
            if (files.excel) {
                var path = files.excel[0].path;
                var excelJson = xlsx.parse(path);
                
                // 跳过第一行
                for (var i = 1; i < excelJson[0].data.length; i++) {
                    var item = excelJson[0].data[i];
                    //console.log(item);
                    var book = new Book({
                        'title': item[1],
                        'author': item[2],
                        'intro': item[3],
                        'read': 0,
                        'last': item[4],
                        'count': item[4],
                        'category': item[5] || [],
                        'press': item[6],
                        'barcode': item[7],
                        'locate': []
                    });
                    book.save(function (err) {
                        if (err) throw err;
                    });
                    res.write( item[0] + ' ' + item[1] + ' successfully saved!\n\n');
                }
            }
            res.end(util.inspect({fields: fields, files: files}));
        });
    });
};

// '/search' 搜索
exports.search = function (req, res) {
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

    Book.find(querySet, function(err, books) {
        if (err) throw err;
        res.json( {data_books: books} );
    });
}

// '/about' 关于
exports.about = function (req, res) {
    res.render('about/about', {});
};
