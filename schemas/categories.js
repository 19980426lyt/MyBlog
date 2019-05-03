/**
 * Created by DongWang on 2019/4/5.
 */
//引入数据库模块
var mongoose = require('mongoose');

//分类的表结构
module.exports = new mongoose.Schema({
    //分类名称
    name: String
});