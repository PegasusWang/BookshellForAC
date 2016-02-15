var mongoose = require('mongoose');

// 创建模型
var Schema = mongoose.Schema;

// 用户模型
var User = new Schema({
    username: String,
    password: String
});

module.exports = mongoose.model('users', User);