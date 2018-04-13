var express = require('express');
var router = express.Router();
var Role = require('../models/Role');
var User = require('../models/User');
var Project = require('../models/Project');
//统一返回格式
var responseData = {};

//初始化处理
router.use(function(req,res,next){
    responseData = {
        code:0,
        message:''
    };
    next();
});

router.use(function (req,res,next) {
    if(!req.userInfo.username){
        res.send('对不起，请返回登录页面进入系统！');
        return;
    }
    next();
});
/**
 * 首页
 */
router.get('/',function (req,res) {
    res.render('manager/index',{
        userInfo:{
            username:new Buffer(req.userInfo.username, 'base64').toString(),
            role:req.userInfo.role,
            id:req.userInfo.id,
            isAdmin:req.userInfo.isAdmin
        }
    });
});

/**
 * 首页
 */
/*router.get('/',function (req,res) {
    Project.findAll().then(function(projects){
        res.render('manager/weeklyList',{
            userInfo:{
                username:new Buffer(req.userInfo.username, 'base64').toString(),
                role:req.userInfo.role,
                id:req.userInfo.id,
                isAdmin:req.userInfo.isAdmin
            },
            projects:projects
        });
    });
});*/

/**
 * 用户管理页面跳转
 */
router.get('/userList',function (req,res) {
    Role.findAll().then(function(roles){
        res.render('manager/userList',{
            userInfo:{
                username:new Buffer(req.userInfo.username, 'base64').toString(),
                role:req.userInfo.role,
                id:req.userInfo.id,
                isAdmin:req.userInfo.isAdmin
            },
            roles:roles
        });
    });
});

/**
 *用户添加页面跳转
 */
router.get('/editUser',function (req,res) {
    res.render('manager/editUser',{
        userInfo:{
            username:new Buffer(req.userInfo.username, 'base64').toString(),
            role:req.userInfo.role,
            id:req.userInfo.id,
            isAdmin:req.userInfo.isAdmin
        }
    });
});


/**
 * 项目管理页面跳转
 */
router.get('/projectList',function (req,res) {
    User.findAll().then(function(users){
        res.render('manager/projectList',{
            userInfo:{
                username:new Buffer(req.userInfo.username, 'base64').toString(),
                role:req.userInfo.role,
                id:req.userInfo.id,
                isAdmin:req.userInfo.isAdmin
            },
            managers:users
        });
    });

});

/**
 *周报详情页面跳转
 */
router.get('/detailProject',function (req,res) {
    res.render('manager/detailProject',{
        userInfo:{
            username:new Buffer(req.userInfo.username, 'base64').toString(),
            role:req.userInfo.role,
            id:req.userInfo.id,
            isAdmin:req.userInfo.isAdmin
        }
    });
});


/**
 * 周报管理页面跳转
 */
router.get('/weeklyList',function (req,res) {
    User.findAll().then(function(users){
        Project.findAll().then(function(projects){
            res.render('manager/weeklyList',{
                userInfo:{
                    username:new Buffer(req.userInfo.username, 'base64').toString(),
                    role:req.userInfo.role,
                    id:req.userInfo.id,
                    isAdmin:req.userInfo.isAdmin
                },
                projects:projects,
                executors:users
            });
        });
    });

});

/**
 * 周报审批列表跳转
 */
router.get('/weeklyApproveList',function (req,res) {
    User.findAll().then(function(users) {
        Project.findAll().then(function (projects) {
            res.render('manager/weeklyApproveList', {
                userInfo: {
                    username: new Buffer(req.userInfo.username, 'base64').toString(),
                    role: req.userInfo.role,
                    id: req.userInfo.id,
                    isAdmin: req.userInfo.isAdmin
                },
                projects: projects,
                executors:users
            });
        });
    });
});

/**
 *周报审批页面跳转
 */
router.get('/approveWeekly',function (req,res) {
    res.render('manager/approveWeekly',{
        userInfo:{
            username:new Buffer(req.userInfo.username, 'base64').toString(),
            role:req.userInfo.role,
            id:req.userInfo.id,
            isAdmin:req.userInfo.isAdmin
        }
    });
});

/**
 *周报详情页面跳转
 */
router.get('/detailWeekly',function (req,res) {
    res.render('manager/detailWeekly',{
        userInfo:{
            username:new Buffer(req.userInfo.username, 'base64').toString(),
            role:req.userInfo.role,
            id:req.userInfo.id,
            isAdmin:req.userInfo.isAdmin
        }
    });
});
module.exports=router;