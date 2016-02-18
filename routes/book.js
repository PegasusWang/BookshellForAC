var express = require('express');
var Book = require('../models/book');
var User = require('../models/user');
var Log = require('../models/log');
var Buy = require('../models/buy');
var auth = require('../midwares/auth');
var router = express.Router();

// 验证是否登录
router.use(auth.isLogin);

// 借阅
router.post('/borrow', function (req, res, next) {
    var bid = req.body.bid;
    var uid = req.session.uid;

    if (bid && uid) {
        Book.findOne({_id: bid}).exec(function (err, book) {
            if (err) throw err;
            if (book) {
                if (book.locate.indexOf(uid) >= 0) {
                    res.json({'err': '别闹，小婊砸！'});
                }
                else {
                    if (book.count - book.locate.length == 0) {
                        res.json({'err': '来晚啦，已经没有了~'});
                    }
                    else {
                        // 将用户id加入到locate中并保存
                        book.locate.push(uid);
                        book.save();

                        // 添加借阅记录
                        var log = new Log({
                            uid: uid,
                            bid: bid,
                            bname: book.title,
                            date: new Date()
                        });
                        // 存储数据，返回存储状态
                        log.save(function (err) {
                            if (err) throw err;
                        });

                        res.json({'status': 'ok', 'locate': book.locate});
                    }
                }
            }
            else {
                res.json({'err': '没有这本书，你是要上天么？'});
            }
        });
    }
    else {
        res.json({'err': '不要随便惹怒赵日天！'})
    }
});

// 归还
router.post('/giveback', function (req, res, next) {
    var bid = req.body.bid;
    var uid = req.session.uid;

    if (bid && uid) {
        Book.findOne({_id: bid}).exec(function (err, book) {
            if (err) throw err;
            if (book) {
                if (book.locate.indexOf(uid) < 0) {
                    res.json({'err': '别闹，小婊砸！'});
                }
                else {
                    var lindex = book.locate.indexOf(uid);
                   
                    book.locate.splice(lindex, 1);
                    book.save();

                    Log.findOne({uid: uid, bid: bid}).exec(function (err, log) {
                        if (log) {
                            log.remove();
                            log.save();
                        }
                    });

                    res.json({'status': 'ok', 'locate': book.locate});
                }
            }
            else {
                res.json({'err': '没有这本书，你是要上天么？'});
            }
        });
    }
    else {
        res.json({'err': '不要随便惹怒赵日天！'})
    }
});

// 求购
router.post('/buy', function (req, res, next) {
    res.end();
});

module.exports = router;