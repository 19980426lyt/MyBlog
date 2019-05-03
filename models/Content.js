/**
 * Created by DongWang on 2019/4/5.
 */
//引入数据库模块
var mongoose = require('mongoose');

//创建数据模型
var contentsSchema = require('../schemas/contents');

//将数据模型暴露出去
module.exports = mongoose.model('Content',contentsSchema)