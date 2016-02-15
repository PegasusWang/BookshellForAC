var gulp         = require('gulp');
var glob         = require("glob");
var path         = require("path");
var webpack      = require('webpack-stream');
var autoprefixer = require('autoprefixer');
var precss       = require('precss');
var nodemon      = require('gulp-nodemon');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var appRoot = __dirname;
var viewRoot = path.join(__dirname, '/views');
var nodeRoot = path.join(__dirname, '/node_modules');

/* 开发任务 */
gulp.task('webpack', function () {
    
    // 自动获取entrys
    var entries = {};

    var entryFiles = glob.sync('./views/**/*.entry.coffee');

    for(var i = 0; i < entryFiles.length; i++) {
        var filePath = entryFiles[i];
        key = '.' + filePath.substring(7, filePath.lastIndexOf('.'));
        entries[key] = path.join(__dirname, filePath);
    }

    return webpack({
        // 开发环境下监视文件改动，实时重新打包
        watch: true,
        // 入口配置
        entry: entries,  
        // 输出配置
        output: {
            filename: '[name].js',
            publicPath: 'static/'
        },
        // 模块配置
        module: {
            // 加载器
            loaders: [
                { test: /\.js$/, loader: 'babel-loader' },
                { test: /\.coffee$/, loader: 'coffee-loader'},
                { test: /\.css$/, loader: 'style-loader!css-loader!postcss-loader?pack=cleaner' },
                { test: /\.scss$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader!postcss-loader?pack=cleaner') },
                { test: /\.(png|jpg|gif)$/, loader: 'file-loader?name=lib/assets/[hash].[ext]'},
                { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff&name=lib/assets/[hash].[ext]' },
                { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader?name=lib/assets/[hash].[ext]' },
            ]
        },
        // css预处理
        postcss: function () {
            return {
                defaults: [autoprefixer, precss],
                cleaner:  [autoprefixer({ browsers: ['> 1% in CN'] })]
            };
        },
        externals: {
            'jquery':'jQuery'
        },
        resolve: {
            root: [appRoot, nodeRoot],
            modulesDirectories: [nodeRoot, viewRoot]
        },
        plugins: [
            new ExtractTextPlugin('[name].css')
        ],
        stats: {
            children: false  
        }
    // gulp 输出路径
    }).pipe(gulp.dest('./views'));
});

/* dev */
gulp.task('dev', function () {
    nodemon({
        script: 'app.js',
        ext: 'jade js',
        env: { 
            'NODE_ENV': 'development'
        }
    })
});

/* default */
gulp.task('default', ['webpack', 'dev'], function () {});