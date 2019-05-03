/**
 * Created by DongWang on 2019/4/5.
 */
//加载express模块
var express = require('express');

var Category = require('../models/Category');
var Content = require('../models/Content');


//加载路由模块
var router = express.Router();

var data;

router.use(function(req,res,next){
    data={
        userInfor: req.userInfo,
        categories:[],
    }
    Category.find().then(function(categories){
        data.categories = categories;
        next();
    });

});

router.get('/',function(req,res,next){

    data.category = req.query.category || '';
    data.contents = [];
    data.count = 0;
    data.page = Number(req.query.page || 1);
    data.limit = 10;
    data.pages = 0;

    var where = {};
    if(data.category){
        where.category = data.category;
    }

    Content.where(where).count().then(function(count){
        data.count = count;
        //计算总页数
        data.pages = Math.ceil(data.count/data.limit);
        //限制取值，大于pages。page为pages
        data.page = Math.min(data.page,data.pages);
        //小于1时，page为1
        data.page = Math.max(data.page,1);
        //skip(Number);忽略数据条数
        var skip = (data.page-1)*data.limit;

        return Content.where(where).find().sort({_id:-1}).limit(data.limit).skip(skip).populate(['category','user'])

    }).then(function(contents){
        data.contents = contents;
        res.render('main/index',data);
    });

});

router.get('/view',function(req,res,next){
    var contentId = req.query.contentid || '';

    Content.findOne({
        _id:contentId
    }).then(function(content){
        data.content=content;
        res.render('main/view',data);
    });
});


module.exports = router;