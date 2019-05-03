/**
 * Created by DongWang on 2019/4/5.
 * 应用程序的启动（入口）文件
 */
//加载express模块
var express = require('express');

//加载模板引擎
var swig = require('swig');

//加载数据库模块
var mongoose = require('mongoose');

//加载body-parser，用来处理post提交过来的数据
var bodyParser = require('body-parser');

//加载cookies模块
var Cookies = require('cookies');

//创建app应用 => NodeJS Http.createServer();
var app = express();

//加载数据模型，操作数据库
var User = require('./models/User');

//设置静态文件托管,所有的静态资源全放在public目录下
app.use('/public',express.static(__dirname+'/public'));


//配置应用模板
//定义当前应用所使用的模板引擎
//第一个参数：模板引擎的名称，同时也是模板文件的后缀。第二个参数：表示用于解析处理模板内容的方法;
app.engine('html',swig.renderFile);
//设置模板文件存放的目录,第一个参数必须是views，第二个参数是html文件的目录
app.set('views','./views');
//注册所使用的模板引擎，第一个参数必须是view engine，第二个参数和app.engine方法中定义的模板引擎的名称（即第一个参数）是一致的
app.set('view engine','html');
//在开发过程中，需要取消模板的缓存机制
swig.setDefaults({cache:false});

//bodyparser设置
app.use(bodyParser.urlencoded({extended:true}));

//设置cookies
app.use(function(req,res,next){
    req.cookies = new  Cookies(req,res);

    req.userInfo = {};

    if(!req.cookies.get('userInfor')){
        try{
            req.userInfo = JSON.parse(req.cookies.get('userIfor'));

            User.findById(req.userInfo._id).then(function(userInfor){
                req.userInfo.isAdmin = Boolean(userInfor.isAdmin);
                next();
            });
        }catch (e) {
            next();
        }
    }else{
        next();
    }
});

/**
 *根据不同的功能划分模块
 */
//后台管理路由
app.use('/admin',require('./routers/admin'));
//api路由
app.use('/api',require('./routers/api'));
//用户页面访问路由
app.use('/',require('./routers/main'));

//连接数据库
mongoose.connect('mongodb://localhost:27017/blog', {useNewUrlParser:true},function(err){
    if(err){
        console.log("连接失败");
    }else{
        //必须能连接上数据库，才能开启网站监听
        console.log("连接成功");
        //监听请求
        app.listen(8082);
    }
});

/**
 * 用户发送http请求 -> url -> 解析路由 -> 找到匹配的规则 -> 执行指定的绑定函数，返回对应内容至用户端
 * /public -> 静态文件 -> 直接读取指定目录下的文件，返回给用户
 * html -> 动态 -> 处理业务逻辑，加载模板，解析模板 -> 返回数据给用户端
 */

