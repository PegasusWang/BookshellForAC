var mongoose = require('mongoose');

// 创建模型
var Schema = mongoose.Schema;

// 历史模型
var Log = new Schema({
    uid: String,
    bid: String,
    bname: String,
    date: Date
});

module.exports = mongoose.model('logs', Log);