var express = require('express');
var router = express.Router();
var db = require('../models/db');
var User = require('../models/User');
var Project = require('../models/Project');
//统一返回格式
var responseData = {};
Project.belongsTo(User, {foreignKey: 'manager', as: 'managerObj'});

//初始化处理
router.use(function (req, res, next) {
    //这里需要进一步处理，到时候根据业务分几种角色来判断
    if (!req.userInfo.username) {
        res.send('对不起，只有管理员才能进入此页面');
        return;
    }
    responseData = {
        code: 0,
        message: ''
    };
    next();
});


//项目列表
router.get('/list', function (req, res) {
    //将项目经理的人选传入页面
    User.findAll().then(function (users) {
        res.render('manager/addProject', {
            userInfo: req.userInfo,
            managers: users
        });
    });
});


//项目列表
router.get('/all', function (req, res) {
    var page = req.query.page || 1;
    var limit = Number(req.query.limit || 10);
    var offset = (page - 1) * limit;
    Project.findAndCountAll({
        include: [{
            model: User,
            as: 'managerObj'
        }],
        limit: limit,
        offset: offset
    }).then(function (result) {
        res.json({
            code: 0,
            count: result.count,
            data: result.rows,
            message: ""
        });
    })
});

//项目查询接口
router.get('/find', function (req, res) {
    var page = req.query.page || 1;
    var limit = Number(req.query.limit || 10);
    var offset = (page - 1) * limit;
    var description = (req.query.description||'').trim();
    var name = (req.query.name||'').trim();
    var manager = (req.query.manager||'').trim();
    var state = (req.query.state||'').trim();

    var whereObj = {};
    if(description){
        whereObj.description={$like: '%'+description+'%'};
    }
    if(name){
        whereObj.name={$like: '%'+name+'%'};
    }
    if(manager){
        whereObj.manager=manager;
    }
    if(state){
        whereObj.state=state;
    }

    Project.findAndCountAll({
        where: whereObj,
        include: [{
            model: User,
            as: 'managerObj'
        }],
        limit: limit,
        offset: offset
    }).then(function (result) {
        res.json({
            code: 0,
            count: result.count,
            data: result.rows,
            message: ""
        });
    })
});

//项目查询接口
router.get('/isProjectManger', function (req, res) {
    var projectId = req.query.projectId;
    var userId = req.query.userId;
    var queryBody = {};
    if (projectId && userId) {
        queryBody._id = projectId;
        queryBody.manager = userId;
        Project.findOne(queryBody).then(function (project) {
            if (project) {
                res.json({
                    isProjectManger: true
                })
            }
        });
    }

});

//删除项目
router.get('/delete', function (req, res) {
    Project.destroy({where: req.query}).then(function (project) {
        if (project) {
            responseData.message = "删除成功";
        } else {
            responseData.code = 1;
            responseData.message = "删除失败";
        }
        res.json(responseData);
    })
});

//添加项目
router.get('/add', function (req, res) {
    //将项目经理的人选传入页面
    User.findAll().then(function (users) {
        res.render('manager/addProject', {
            userInfo: req.userInfo,
            managers: users
        });
    });
});


//添加项目
router.post('/add', function (req, res) {
    Project.findOne({where: {name: req.body.name}}).then(function (project) {
        if (project) {
            responseData.code = 1;
            responseData.message = "添加失败,项目名称已经存在";
            res.json(responseData);
        } else {

            req.body.startTime = req.body.startTime == '' ? null : req.body.startTime;
            req.body.endTime = req.body.endTime == '' ? null : req.body.endTime;
            req.body.preStartTime = req.body.preStartTime == '' ? null : req.body.preStartTime;
            req.body.preEndTime = req.body.preEndTime == '' ? null : req.body.preEndTime;
            Project.create(req.body).then(function (newProject) {
                if (newProject) {
                    responseData.message = "添加成功";
                } else {
                    responseData.code = 2;
                    responseData.message = "添加失败";
                }
                res.json(responseData);
            });
        }
    });
});

//更新用户
router.post('/update', function (req, res) {
    req.body.startTime = req.body.startTime == '' ? null : req.body.startTime;
    req.body.endTime = req.body.endTime == '' ? null : req.body.endTime;
    req.body.preStartTime = req.body.preStartTime == '' ? null : req.body.preStartTime;
    req.body.preEndTime = req.body.preEndTime == '' ? null : req.body.preEndTime;
    Project.update(req.body,{where: {id:req.body.id} }).then(function (project) {
        if (project) {
            responseData.message = "修改成功";
        } else {
            responseData.code = 1;
            responseData.message = "修改失败";
        }
        res.json(responseData);
    });
});

//编辑项目页面跳转
router.get('/edit', function (req, res) {
    User.findAll().then(function (users) {
        res.render('manager/editProject', {
            userInfo: req.userInfo,
            managers: users
        });
    });
});

//编辑项目页面跳转
router.get('/detail', function (req, res) {
    User.findAll().then(function (users) {
        res.render('manager/detailProject', {
            userInfo: req.userInfo,
            managers: users
        });
    });
});

//编辑项目页面跳转
router.get('/findOneById', function (req, res) {

    Project.findById(req.query.id).then(function (project) {
        res.json({
            project: project
        });
    });
});

module.exports = router;