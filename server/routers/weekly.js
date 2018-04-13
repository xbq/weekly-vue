var express = require('express');
var router = express.Router();
var Project = require('../models/project');
var Weekly = require('../models/weekly');
var User = require('../models/user');
var db =require('../models/db');
Weekly.belongsTo(Project, {foreignKey: 'project', as: 'projectObj'});
Weekly.belongsTo(User, {foreignKey: 'executor', as: 'executorObj'});
Weekly.belongsTo(User, {foreignKey: 'approver', as: 'approverObj'});

//统一返回格式
var responseData = {};

//初始化处理
router.use(function (req, res, next) {
    //这里需要进一步处理，到时候根据业务分几种角色来判断
    if (!req.userInfo.username) {
        res.send('对不起，请先登录');
        return;
    }
    responseData = {
        code: 0,
        message: ''
    };
    next();
});

//周报列表
router.get('/list', function (req, res) {
    var page = req.query.page || 1;
    var limit = Number(req.query.limit || 10);
    var offset = (page - 1) * limit;
    var whereObj = {};
    if (!req.userInfo.isAdmin) {
        whereObj.executor = req.userInfo.id
    }
    Weekly.findAndCountAll({
        where: whereObj,
        include: [{model: User, as: 'executorObj'}, {model: User, as: 'approverObj'}, {
            model: Project,
            as: 'projectObj'
        }],
        limit: limit,
        offset: offset,
        order: [['endTime','DESC']]
    }).then(function (result) {
        res.json({
            code: 0,
            count: result.count,
            data: result.rows,
            message: ""
        });
    })
});


//周报审批列表
router.get('/approveList', function (req, res) {
    var page = req.query.page || 1;
    var limit = Number(req.query.limit || 10);
    var offset = (page - 1) * limit;

    Weekly.findAndCountAll({
        include: [{model: User, as: 'executorObj'}, {model: User, as: 'approverObj'}, {
            model: Project, as: 'projectObj', where: req.userInfo.isAdmin ? {} : {
                'manager': req.userInfo.id
            }
        }],
        limit: limit,
        offset: offset,
        order: [['endTime','DESC']]
    }).then(function (result) {
        res.json({
            code: 0,
            count: result.count,
            data: result.rows,
            message: ""
        });
    })
});

//周报查询接口
router.get('/find', function (req, res) {
    var page = req.query.page || 1;
    var limit = Number(req.query.limit || 10);
    var offset = (page - 1) * limit;
    var taskDesc = req.query.taskDesc || '';
    var project = req.query.project || '';
    var isApprove = req.query.isApprove || '';
    var process = req.query.process || '';
    var executor = req.query.executor || '';
    var whereObj = {};
    if (taskDesc) {
        whereObj.taskDesc = {$like: '%' + taskDesc.trim() + '%'};
    }
    if (project) {
        whereObj.project = project;
    }
    if (isApprove) {
        whereObj.isApprove = isApprove;
    }
    if (process) {
        whereObj.process = process;
    }
    if (!req.userInfo.isAdmin) {
        whereObj.executor = req.userInfo.id
    }else{
        if(executor){
            whereObj.executor = executor;
        }
    }
    Weekly.findAndCountAll({
        where: whereObj,
        include: [{model: User, as: 'executorObj'}, {model: User, as: 'approverObj'}, {
            model: Project,
            as: 'projectObj'
        }],
        limit: limit,
        offset: offset,
        order: [['endTime','DESC']]
    }).then(function (result) {
        res.json({
            code: 0,
            count: result.count,
            data: result.rows,
            message: ""
        });
    })
});


//周报查询接口
router.get('/approveFind', function (req, res) {
    var page = req.query.page || 1;
    var limit = Number(req.query.limit || 10);
    var offset = (page - 1) * limit;
    var taskDesc = req.query.taskDesc || '';
    var project = req.query.project || '';
    var isApprove = req.query.isApprove || '';
    var process = req.query.process || '';
    var executor = req.query.executor || '';
    var whereObj = {};
    if (taskDesc) {
        whereObj.taskDesc = {$like: '%' + taskDesc.trim() + '%'};
    }
    if (project) {
        whereObj.project = project;
    }
    if (isApprove) {
        whereObj.isApprove = isApprove;
    }
    if (process) {
        whereObj.process = process;
    }
    if (executor) {
        whereObj.executor = executor;
    }
    Weekly.findAndCountAll({
        where: whereObj,
        include: [{model: User, as: 'executorObj'}, {model: User, as: 'approverObj'}, {
            model: Project, as: 'projectObj', 'where': req.userInfo.isAdmin ? {} : {
                'manager': req.userInfo.id
            }
        }],
        limit: limit,
        offset: offset,
        order: [['endTime','DESC']]
    }).then(function (result) {
        res.json({
            code: 0,
            count: result.count,
            data: result.rows,
            message: ""
        });
    })
});


//周报列表
router.get('/add', function (req, res) {
    //将项目列表传入页面
    Project.findAll().then(function (projects) {
        res.render('manager/addWeekly', {
            userInfo: req.userInfo,
            projects: projects
        });
    });
});

//周报列表
router.post('/add', function (req, res, next) {
    req.body.startTime = req.body.startTime == '' ? null : req.body.startTime;
    req.body.endTime = req.body.endTime == '' ? null : req.body.endTime;
    Weekly.create(req.body).then(function (weekly) {
        if (weekly) {
            responseData.message = "添加成功";
        } else {
            responseData.code = 2;
            responseData.message = "添加失败";
        }
        res.json(responseData);
    }).catch(next);
});

//周报修改页面跳转
router.get('/edit', function (req, res) {
    Project.findAll().then(function (projects) {
        res.render('manager/editWeekly', {
            userInfo: req.userInfo,
            projects: projects
        });
    });
});

//根据id获取对应的周报记录并返回
router.get('/findById', function (req, res) {
    Weekly.findById(req.query.id).then(function (weekly) {
        res.json({
            weekly: weekly
        });
    })
});

//周报修改
router.post('/update', function (req, res) {
    Weekly.update(req.body, {where: {id: req.body.id}}).then(function (weekly) {
        if (weekly) {
            responseData.message = "修改成功";
        } else {
            responseData.code = 1;
            responseData.message = "修改失败";
        }
        res.json(responseData);
    });
});

//删除项目
router.get('/delete', function (req, res) {
    Weekly.destroy({where: req.query}).then(function (weekly) {
        if (weekly) {
            responseData.message = "删除成功";
        } else {
            responseData.code = 1;
            responseData.message = "删除失败";
        }
        res.json(responseData);
    })
});

//周报审批页面取值
router.get('/approve', function (req, res) {
    //将周报信息传入页面
    Weekly.findById(req.query.id, {
        include: [{model: User, as: 'executorObj'}, {model: User, as: 'approverObj'}, {
            model: Project,
            as: 'projectObj'
        }]
    }).then(function (weekly) {
        res.json({
            userInfo: req.userInfo,
            weekly: weekly
        });
    })
});

router.get('/statisticByProject&Type',function(req,res){
    var sql = "";
    if(req.userInfo.isAdmin===true){
         sql = "select  p.projectName," +
             " sum(IF(taskType = 'bug修改', taskTime, 0)) AS 'bug修改'," +
             " sum(IF(taskType = '方案设计', taskTime, 0)) AS '方案设计'," +
             " sum(IF(taskType = '项目实施', taskTime, 0)) AS '项目实施'," +
             " sum(IF(taskType = '功能测试', taskTime, 0)) AS '功能测试'," +
             " sum(IF(taskType = '模块开发', taskTime, 0)) AS '模块开发'," +
             " sum(IF(taskType = '数据处理', taskTime, 0)) AS '数据处理'" +
             " from (select sum(taskTime) as taskTime ,taskType ,project.name as projectName from weekly left JOIN project on project.id = weekly.project group by taskType,project) p GROUP BY projectName\n";
    }else{
        sql = "select  p.projectName," +
            " sum(IF(taskType = 'bug修改', taskTime, 0)) AS 'bug修改'," +
            " sum(IF(taskType = '方案设计', taskTime, 0)) AS '方案设计'," +
            " sum(IF(taskType = '项目实施', taskTime, 0)) AS '项目实施'," +
            " sum(IF(taskType = '功能测试', taskTime, 0)) AS '功能测试'," +
            " sum(IF(taskType = '模块开发', taskTime, 0)) AS '模块开发'," +
            " sum(IF(taskType = '数据处理', taskTime, 0)) AS '数据处理'" +
            " from (select sum(taskTime) as taskTime ,taskType ,project.name as projectName from weekly left JOIN project on project.id = weekly.project where executor = "+req.userInfo.id+" group by taskType,project) p GROUP BY projectName\n";

    }

    db.sequelize.query(sql).then(function (results) {
        console.log(results);
        res.json({
            userInfo: req.userInfo,
            data: results
        });
    });
});

router.get('/statisticByTaskType',function(req,res){
    //var isAdmin =req.cookies.get('isAdmin');
    console.log(req.userInfo.isAdmin);
    var sql = "";
    if(req.userInfo.isAdmin===true){
        sql = "select sum(taskTime) as value ,taskType as name  from weekly  group by taskType";
    }else{
        sql = "select sum(taskTime) as value ,taskType  as name  from weekly  where executor = "+req.userInfo.id+" group by taskType";
    }

    db.sequelize.query(sql).then(function (results) {
        console.log(results);
        res.json({
            userInfo: req.userInfo,
            data: results
        });
    });
});


router.get('/statisticByProject',function(req,res){
    var sql = "";
    if(req.userInfo.isAdmin===true){
        sql = "select sum(taskTime) as value,project.name as name from weekly left JOIN project on project.id = weekly.project group by project";
    }else{
        sql = "select sum(taskTime) as value,project.name as name from weekly  left JOIN project on project.id = weekly.project where executor = "+req.userInfo.id+" group by project";
    }

    db.sequelize.query(sql).then(function (results) {
        console.log(results);
        res.json({
            userInfo: req.userInfo,
            data: results
        });
    });
});

router.get('/statisticByWeek',function(req,res){
    //var isAdmin =req.cookies.get('isAdmin');
    console.log(req.userInfo.isAdmin);
    var sql = "";
    if(req.userInfo.isAdmin===true){
        sql = "select sum(taskTime) as value ,week as name  from weekly  group by week";
    }else{
        sql = "select sum(taskTime) as value ,week  as name  from weekly  where executor = "+req.userInfo.id+" group by week";
    }

    db.sequelize.query(sql).then(function (results) {
        console.log(results);
        res.json({
            userInfo: req.userInfo,
            data: results
        });
    });
});

router.get('/statisticByMonth',function(req,res){
    //var isAdmin =req.cookies.get('isAdmin');
    console.log(req.userInfo.isAdmin);
    var sql = "";
    if(req.userInfo.isAdmin===true){
        sql = "select sum(taskTime) as value ,month as name  from weekly  group by month";
    }else{
        sql = "select sum(taskTime) as value ,month  as name  from weekly  where executor = "+req.userInfo.id+" group by month";
    }

    db.sequelize.query(sql).then(function (results) {
        console.log(results);
        res.json({
            userInfo: req.userInfo,
            data: results
        });
    });
});



module.exports = router;