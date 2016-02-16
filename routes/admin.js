var express = require('express');
var Book = require('../models/book');
var User = require('../models/user');
var multiparty = require("multiparty");
var util = require("util");
var xlsx = require('node-xlsx');
var router = express.Router();

// 管理
router.get('/', function (req, res) {
    res.render('admin/book');
});

// 添加图书
router.post('/addbook', function (req, res) {
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

    // 存储数据，返回存储状态
    book.save(function (err) {
        if (err) throw err;
        res.json( {"status": "ok"} );
    });
});

// excel导入
router.post('/excelimport', function (req, res) {
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
                        'title': item[0],
                        'author': item[1],
                        'intro': item[2],
                        'read': 0,
                        'last': item[3],
                        'count': item[3],
                        'category': item[4] || [],
                        'press': item[5],
                        'barcode': item[6],
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
});

module.exports = router;