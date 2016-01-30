var mongoose = require('mongoose');
var multiparty = require("multiparty");
var util = require("util");
var xlsx = require('node-xlsx');
var db = require('../models/db');
var Book = db.Book;

// '/'
exports.index = function (req, res) {
    Book.find(function(err, books) {
        if (err) throw err;
        console.log();
        res.render('index/index', {data_books: JSON.stringify(books)});
    });
};

// '/admin'
exports.admin = function (req, res) {
    res.render('admin/book', {});
};

// '/admin/addbook'
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

// '/admin/excelimport'
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
