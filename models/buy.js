var mongoose = require('mongoose');

// 创建模型
var Schema = mongoose.Schema;

// 历史模型
var Buy = new Schema({
    uid: String,
    bname: String,
    extra: String,
    date: Date
});

module.exports = mongoose.model('buys', Buy);