/**
 * Created by DongWang on 2019/4/5.
 */
//引入数据库模块
var mongoose = require('mongoose');

//分类的表结构
module.exports = new mongoose.Schema({

    category:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Category'
    },

    title: String,

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },

    addTime:{
        type:Date,
        default:new Date()
    },

    views:{
        type:Number,
        default:0
    },

    description:{
        type: String,
        default:''
    },

    content:{
        type: String,
        default:''
    }
});