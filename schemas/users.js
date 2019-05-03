/**
 * Created by DongWang on 2019/4/5.
 */
//引入数据库模块
var mongoose = require('mongoose');

//用户的表结构
module.exports = new mongoose.Schema({
    //用户名
    username: String,
    //密码
    password: String,
    //是否为管理员
    isAdmin:{
        type:Boolean,
        default:false
    }
});