var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var route = require('./routes/index');
var admin_route = require('./routes/admin');
var auth_route = require('./routes/auth');
var book_route = require('./routes/book');

// 创建express实例
var app = express();

// favicon
app.use(favicon(__dirname + '/favicon.ico'));

// 指定静态文检目录
app.use('/static', express.static(__dirname + '/views'));

// 设置模板引擎
app.set('views', './views');
app.set('view engine', 'jade');

// 连接数据库
mongoose.connect('mongodb://localhost/ac');

// 使用bodyParser中间件
// url encode
app.use(bodyParser.urlencoded({extended: false}));
// json 解析
app.use(bodyParser.json());

// 开启cookie和session
app.use(cookieParser());
app.use(session({
    secret: "minilib.for.ac", 
    maxAge: new Date(Date.now() + 3600000), //1 Hour
    expires: new Date(Date.now() + 3600000), //1 Hour
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// 路由
app.use('/', route);
app.use('/admin', admin_route);
app.use('/auth', auth_route);
app.use('/book', book_route);

// 启动服务并从指定端口监听连接请求
app.listen('8080', function () {
    console.log(' listening at http://%s:%s', '127.0.0.1', '8080');
});