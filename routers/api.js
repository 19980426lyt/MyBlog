/**
 * Created by DongWang on 2019/4/5.
 */
//加载express模块
var express = require('express');

//加载路由模块
var router = express.Router();

//加载数据模型，操作数据库
var User = require('../models/User');

//统一返回格式
var responseData;

router.use(function(req,res,next){
    responseData = {
        code : 0,
        message : ''
    }
    next();
});

//用户注册
router.post('/user/regixter',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    if(username == ""){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }

    if(password == ""){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }

    if(repassword == ""){
        responseData.code = 3;
        responseData.message = '密码不一致';
        res.json(responseData);
        return;
    }

    //查询用户名是否已被注册
    User.findOne({
        username:username
    }).then(function(userInfo){
            if(userInfo){
                responseData.code = 4;
                responseData.message = '用户名已注册';
                res.json(responseData);
                return;
            }else{
                var user = new User({
                    username:username,
                    password:password
                });
                user.save().then(function(newUserInfo){
                    responseData.message = '验证通过';
                    res.json(responseData);
                });
            }
        });
});

//用户登录
router.post('/user/login',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;

    if(username == ""){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }

    if(password == ""){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }

    //查询用户是否存在
    User.findOne({
        username:username,
        password:password
    }).then(function(userInfo){
        if(!userInfo){
            responseData.code = 2;
            responseData.message = '用户名或者密码错误';
            res.json(responseData);
            return;
        }else{
            responseData.message = '登录成功';
            responseData.userInfo = {
                _id:userInfo._id,
                username:userInfo.username
            }
            req.cookies.set('userIfor',JSON.stringify({
                _id:userInfo._id,
                username:userInfo.username
            }));
            res.json(responseData);
            return;
        }
    });
});

router.get('/user/loginout',function(req,res){
    req.cookies.set('userIfor',null);
    res.json(responseData);
});

module.exports = router;