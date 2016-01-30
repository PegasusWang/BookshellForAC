var WXBizMsgCrypt = require('wechat-crypto');
var wechat = require('wechat-enterprise');
var db = require('../models/db');
var Book = db.Book;

var hostName = "https://dev-edwardnevermind.c9users.io";

var config= {
    token: 'ZkL5k3qliiw6m',
    encodingAESKey: 'P6IJtwbkkRhaHfDSgRnhKtM0ARAY9kWR1EBCujwnoq1',
    corpId: 'wx174acac3b42f6d2f',
}

var help = {
    title: "使用帮助",
    content: "回复数字'1'查看书目\n回复数字'5+购买信息'向大管家要书\n回复数字'9+你想说的话'给我提意见或者鼓励我\n点击菜单'别说话点'扫码借/还书"
}
var empty = "你在说什么，我还是个孩子，我什么都不知道";

// url 验证
exports.validate = function (req, res) {
    var msg_signature = req.query.msg_signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
    var cryptor = new WXBizMsgCrypt(config.token, config.encodingAESKey, config.corpId)
    var s = cryptor.decrypt(echostr);
    res.send(s.message);
}

// 搜索
// '/search'
function search(q, callback) {
    if (!q) {return []}
    var re = '.*?' + q + '.*?';
    var re = new RegExp(re);
    var query = [];
    var feilds = ['title', 'author', 'intro', 'category', 'press', 'barcode'];
    for (var i = 0; i < feilds.length; i++) {
        var s = {};
        s[feilds[i]] = re;
        query.push(s);
    }
    query = {'$or':query};
    Book.find(query, function (err, data) {
        if (err) throw err;
        callback(data);
    });
};

// 微信
exports.wechatservice = wechat(config, 
    wechat.text(function (message, req, res, next) {
        // 按照用户回复给企业号的信息进行不同的处理
        var content = message.Content.trim();
        if (content === '1') {
            res.reply([
                {
                    title: "点击查看图书书目",
                    url: hostName
                }
            ]);
        }
        
    })
    .event(function (message, req, res, next) {
        //console.log(message);
        // 点击事件
        if (message.Event === 'click') {
            // 获取帮助
            if (message.EventKey === 'ac-help') {
                res.reply([{
                  title: help.title,
                  description: help.content
                }]);                
            }
        }
        // 扫一扫事件
        else if (message.Event === 'scancode_waitmsg') {
            // 获取扫描信息
            var fromUserName = message.FromUserName; // 当前用户
            var scanResult = message.ScanCodeInfo.ScanResult; // 扫描结果
            
            // 借书
            if (message.EventKey === 'ac-scan') {
                // 条形码
                var barcode = scanResult.split(',')[1];
                // 查找信息
                search(barcode, function (data) {
                    if (data[0]) {
                        var rTitle ="《" + data[0].title + "》";
                        
                        var rAuthor = data[0].author;
                        if (!rAuthor || rAuthor.length == 0)
                            rAuthor = "无";
                            
                        var rPress = data[0].press;
                        if (!rPress || rPress.length == 0)
                            rPress = "未知";
                            
                        var rIntro = data[0].intro;
                        if (!rIntro || rIntro.length == 0)
                            rIntro = "暂无";
                            
                        var rState = "可借阅";
                        if (data[0].last == 0) {
                            rState = "已借完";
                        }
                        
                        var rLocate = data[0].locate.join(",")
                        if (data[0].last > 0)
                            rLocate = "书架";
                        
                        var rContent = "" 
                                + "作者: " + rAuthor + "\n"
                                + "出版社: " + rPress + "\n"
                                + "简介: " + rIntro + "\n"
                                + "当前状态: " + rState + "\n"
                                + "定位:" + rLocate + "\n\n"
                                + "点击『阅读原文』进行 借/还书 操作 ";
                    
                        var info = {
                            'title': rTitle,
                            'author': rAuthor,
                            'press': rPress,
                            'intro': rIntro,
                            'state': rState,
                            'locate': rLocate
                        }
                        
                        res.reply([
                            {
                                title: rTitle,
                                description: rContent,
                                url: hostName + '/book?user=' + fromUserName + '&info=' + JSON.stringify(info)
                            }
                        ]);
                    }
                });
            }
        }
    })
);