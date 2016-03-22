var mongoose = require('mongoose');

// 创建模型
var Schema = mongoose.Schema;

// 用户模型
var User = new Schema({
    username: String,   // 用户名
    password: String,   // 密码
    nickname: String,   // 昵称
    position: String,   // 职位
    userLevel: 0        // 用户级别
});

module.exports = mongoose.model('users', User);