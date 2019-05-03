/**
 * Created by DongWang on 2019/4/5.
 */
//加载express模块
var express = require('express');

//加载路由模块
var router = express.Router();

//加载数据库模型
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');

//入口检测，判断用户是否拥有管理权限
router.use(function(req,res,next){
    if(!req.userInfo.isAdmin){
        res.send('对不起，您没有管理权限！');
        return;
    }
    next();
});

//首页
router.get('/',function(req,res,next){
    res.render('admin/index',{
        userInfo:req.userInfo
    });
});

//用户管理
router.get('/user',function(req,res,next){
    //查询数据库中的用户数据
    //limit(Number):限制后去的数据条数

    var page = Number(req.query.page || 1);
    var limit = 2;
    var pages = 0;
    var url='/admin/user?';

    User.count().then(function(count){
        //计算总页数
        pages = Math.ceil(count/limit);
        //限制取值，大于pages。page为pages
        page = Math.min(page,pages);
        //小于1时，page为1
        page = Math.max(page,1);
        //skip(Number);忽略数据条数
        var skip = (page-1)*limit;

        User.find().limit(limit).skip(skip).then(function(users){
            res.render('admin/user_index',{
                userInfo:req.userInfo,
                users:users,
                page:page,
                count:count,
                pages:pages,
                limit:limit,
                url:url
            });
        });
    });
});

//分类首页
router.get('/category',function(req,res,next){
    //查询数据库中的用户数据
    //limit(Number):限制后去的数据条数

    var page = Number(req.query.page || 1);
    var limit = 2;
    var pages = 0;
    var url='/admin/category?';

    Category.count().then(function(count){
        //计算总页数
        pages = Math.ceil(count/limit);
        //限制取值，大于pages。page为pages
        page = Math.min(page,pages);
        //小于1时，page为1
        page = Math.max(page,1);
        //skip(Number);忽略数据条数
        var skip = (page-1)*limit;

        //sort():取值1和-1 ；1为升序 -1为降序
        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function(categories){
            res.render('admin/category_index',{
                userInfo:req.userInfo,
                categories:categories,
                page:page,
                count:count,
                pages:pages,
                limit:limit,
                url:url
            });
        });
    });
});

//分类添加
router.get('/category/add',function(req,res,next){
    res.render('admin/category_add',{
        userInfo:req.userInfo
    });
});

//分类保存
router.post('/category/add',function(req,res,next){
    var name = req.body.name || '';

    if(name == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'名称不能为空'
        });
        return;
    }

    Category.findOne({
        name:name
    }).then(function(rs){
        if(rs){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类已经存在'
            });
            return Promise.reject();
        }else{
           return new Category({
               name:name
           }).save();
        }
    }).then(function(newCategory){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'分类保存成功',
            url:'/admin/category',
            urlName:'分类列表'
        })
    });
});

//分类修改
router.get('/category/edit',function(req,res,next){
    var id = req.query.id || '';
    Category.findOne({
        _id:id
    }).then(function(category){
        if(!category){
            res.render('admin/error',{
               userInfo:req.userInfo,
               message:'分类信息不存在'
            });
        }else{
            res.render('admin/category_edit',{
                userInfo:req.userInfo,
                category:category
            });
        }
    });
});

//分类修改保存
router.post('/category/edit',function(req,res,next){
    var id = req.query.id || '';
    var name = req.body.name || '';

    Category.findOne({
        _id:id
    }).then(function(category){
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在'
            });
            return Promise.reject();
        }else{
            if(name == category.name){
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    message:'分类修改成功',
                    url:'/admin/category',
                    urlName:'分类列表'
                });
                return Promise.reject();
            }else{
                return Category.findOne({
                    _id:{$ne:id},
                    name:name
                });
            }
        }
    }).then(function(sameCategory){
        if(sameCategory){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类名称已存在'
            });
            return Promise.reject();
        }else{
            return Category.updateOne({
               _id:id
            },{
                name:name
            });
        }
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'分类修改成功',
            url:'/admin/category',
            urlName:'分类列表'
        });
    })
});

//分类删除
router.get('/category/delete',function(req,res,next){
    var id = req.query.id || '';
    Category.remove({
        _id:id
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'分类删除成功',
            url:'/admin/category',
            urlName:'分类列表'
        });
    });
});

//内容首页
router.get('/content',function(req,res,next){
    //查询数据库中的用户数据
    //limit(Number):限制后去的数据条数

    var page = Number(req.query.page || 1);
    var limit = 2;
    var pages = 0;
    var url='/admin/content?';

    Content.count().then(function(count){
        //计算总页数
        pages = Math.ceil(count/limit);
        //限制取值，大于pages。page为pages
        page = Math.min(page,pages);
        //小于1时，page为1
        page = Math.max(page,1);
        //skip(Number);忽略数据条数
        var skip = (page-1)*limit;

        //sort():取值1和-1 ；1为升序 -1为降序
        Content.find().sort({_id:-1}).limit(limit).skip(skip).populate(['category','user']).then(function(contents){
            res.render('admin/content_index',{
                userInfo:req.userInfo,
                contents:contents,
                page:page,
                count:count,
                pages:pages,
                limit:limit,
                url:url
            });
        });
    });
});

//内容添加
router.get('/content/add',function(req,res,next){

    Category.find().sort({_id:-1 }).then(function(categories){
        res.render('admin/content_add',{
            userInfo:req.userInfo,
            categories:categories
        });

    });
});

//内容保存
router.post('/content/add',function(req,res,next){
    if(req.body.category == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'分类不能为空'
        });
        return;
    }
    if(req.body.title == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'标题不能为空'
        });
        return;
    }
    if(req.body.description == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'简介不能为空'
        });
        return;
    }
    if(req.body.content == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容不能为空'
        });
        return;
    }

    new Content({
        category: req.body.category,
        title: req.body.title,
        user:req.userInfo._id.toString(),
        description:req.body.description,
        content: req.body.content
    }).save().then(function(rs){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'内容保存成功',
            url:'/admin/content',
            urlName:'内容列表'
        });
    });

});

//内容修改
router.get('/content/edit',function(req,res,next){
   var id = req.query.id || '';
   var categories = [];

    Category.find().sort({_id:-1 }).then(function(rs){
        categories = rs;
        return Content.findOne({
            _id:id
        }).populate('category');
    }).then(function(content){
        if(!content){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'内容存在'
            });
            return Promise.reject();
        }else{
            res.render('admin/content_edit',{
                userInfo:req.userInfo,
                categories:categories,
                content:content
            });
        }
    });
});

//保存修改内容
router.post('/content/edit',function(req,res,next){
    var id = req.query.id || '';

    if(req.body.category == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'分类不能为空'
        });
        return;
    }
    if(req.body.title == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'标题不能为空'
        });
        return;
    }
    if(req.body.description == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'简介不能为空'
        });
        return;
    }
    if(req.body.content == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容不能为空'
        });
        return;
    }

    Content.update({
        _id:id
    },{
        category: req.body.category,
        title: req.body.title,
        description:req.body.description,
        content: req.body.content
    }).then(function(rs){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'内容保存成功',
            url:'/admin/content',
            urlName:'内容列表'
        });
    });
});

//内容删除
router.get('/content/delete',function(req,res,next){
    var id = req.query.id || '';
    Content.remove({
        _id:id
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'内容删除成功',
            url:'/admin/content',
            urlName:'内容列表'
        });
    });
});

module.exports = router;