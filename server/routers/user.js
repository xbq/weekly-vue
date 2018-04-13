var express = require('express');
var router = express.Router();
var Role = require('../models/Role');
var User = require('../models/User');

User.belongsTo(Role, {foreignKey: 'role', as: 'roleObj'});

//统一返回格式
var responseData = {};

//初始化处理
router.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: ''
    };
    next();
});


//用户列表
router.get('/list', function (req, res) {
    var page = req.query.page || 1;
    var limit = Number(req.query.limit || 10);
    var offset = (page - 1) * limit;
    User.findAndCountAll({
        include: [{
            model: Role,
            as: 'roleObj'
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

//用户列表
router.get('/find', function (req, res) {
    var page = req.query.page || 1;
    var limit = Number(req.query.limit || 10);
    var offset = (page - 1) * limit;
    var username = req.query.username || '';
    var tel = req.query.tel || '';
    var role = req.query.role || '';
    var department = req.query.department || '';
    var whereObj = {};
    if (username) {
        whereObj.username = {$like: '%' + username + '%'};
    }
    if (tel) {
        whereObj.tel = {$like: '%' + tel + '%'};
    }
    if (role) {
        whereObj.role = role;
    }
    if (department) {
        whereObj.department = department;
    }

    User.findAndCountAll({
        where: whereObj,
        include: [{
            model: Role,
            as: 'roleObj'
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

//用户列表
router.get('/delete', function (req, res) {
    User.destroy({where: req.query}).then(function (user) {
        if (user) {
            responseData.message = "删除成功";
        } else {
            responseData.code = 1;
            responseData.message = "删除失败";
        }
        res.json(responseData);
    })
});

//添加用户
router.get('/add', function (req, res) {
    Role.findAll().then(function (roles) {
        res.render('manager/addUser', {
            userInfo: req.userInfo,
            roles: roles
        });
    });
});

//添加用户
router.post('/add', function (req, res, next) {
    User.findOne({where: {username: req.body.username}}).then(function (user) {
        if (user) {
            responseData.code = 1;
            responseData.message = "添加失败,用户名已经存在";
            res.json(responseData);
        } else {
            User.create(req.body).then(function (newUser) {
                if (newUser) {
                    responseData.message = "添加成功";
                } else {
                    responseData.code = 2;
                    responseData.message = "添加失败";
                }
                res.json(responseData);
            }).catch(next);
        }

    });
});

//更新用户
router.post('/update', function (req, res) {
    User.update(req.body, {where: {id: req.body.id}}).then(function (user) {
        if (user) {
            responseData.message = "修改成功";
        } else {
            responseData.code = 1;
            responseData.message = "修改失败";
        }
        res.json(responseData);
    });
});


//管理员修改用户
router.get('/editByEmployee', function (req, res) {
    //添加初始密码
    Role.findAll().then(function (roles) {
        res.render('manager/editUserByEmployee', {
            userInfo: req.userInfo,
            roles: roles
        });
    });
});

//个人用户基本资料修改
router.get('/edit', function (req, res) {
    //添加初始密码
    Role.findAll().then(function (roles) {
        res.render('manager/editUser', {
            userInfo: req.userInfo,
            roles: roles
        });
    });
});

//添加用户
router.get('/findById', function (req, res) {
    //添加初始密码
    User.findById(req.query.id).then(function (user) {
        res.json({
            user: user
        });
    });
});

//初始化密码
router.get('/initPsw', function (req, res) {
    //添加初始密码
    var initPsw = 'zjzhd';
    User.update({'password': initPsw}, {where: {id: req.query.id}}).then(function (user) {
        if (user) {
            responseData.message = "初始化成功，初始密码为zjzhd";
        } else {
            responseData.code = 1;
            responseData.message = "初始化失败";
        }
        res.json(responseData);
    });
});

//添加用户
router.get('/setPassword', function (req, res) {
    res.render('manager/setPassword', {
        userInfo: req.userInfo
    });
});


//更新用户
router.post('/updatePassword', function (req, res) {
    User.findOne({where: {id: req.body.userId, password: req.body.oldPWD}}).then(function (user) {
        if (user) {
            User.update({password: req.body.newPWD}, {where: {id: req.body.userId}}).then(function (user) {
                if (user) {
                    responseData.message = "修改成功";
                } else {
                    responseData.code = 1;
                    responseData.message = "修改失败";
                }
                res.json(responseData);
            });
        } else {
            responseData.code = 2;
            responseData.message = "原始密码不正确，请联系管理员初始化密码！";
            res.json(responseData);
        }
    });

});


module.exports = router;