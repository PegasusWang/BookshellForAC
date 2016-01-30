var mongoose = require('mongoose');

// 连接数据库
var db = mongoose.connect('mongodb://localhost/ac');

// 创建模型
var Schema = mongoose.Schema;

// 书籍模型
var bookSchema = new Schema({
    title: String,      // 标题
    author: String,     // 作者
    intro: String,      // 简介
    read: Number,       // 阅读量
    last: Number,       // 剩余量
    count: Number,      // 总数
    category: String,   // 分类
    press: String,      // 书名
    barcode: String,    // 条形码
    locate: []          // 定位
});

exports.Book = db.model('books', bookSchema);