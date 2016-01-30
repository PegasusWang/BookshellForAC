var express     = require('express');
var site        = require('./controllers/site');
var wechat      = require('./controllers/wechat');
var bodyParser  = require('body-parser');

// 创建express实例
var app = express();

// 指定静态文检目录
app.use('/static', express.static(__dirname + '/views'));

// 设置模板引擎
app.set('views', './views');
app.set('view engine', 'jade');

// 使用bodyParser中间件
// url encode
app.use(bodyParser.urlencoded({extended: false}));
// json 解析
app.use(bodyParser.json());

// 路由 http://www.expressjs.com.cn/guide/routing.html
// '/' 
app.get('/', site.index);

// 'loadmore'
app.post('/loadmore', site.loadMore);

// 'search'
app.post('/search', site.search);

// 'admin'
app.get('/admin', site.admin);
app.post('/admin/addbook', site.addBook);
app.post('/admin/excelimport', site.importFromExcel);

// '/about'
app.get('/about', site.about);

// 启动服务并从指定端口监听连接请求
app.listen('8080', function () {
    console.log(' listening at http://%s:%s', '127.0.0.1', '8080');
});