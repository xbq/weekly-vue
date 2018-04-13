var express = require('express');
var router = express.Router();
var User = require('../models/user');
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

router.post('/login',function (req,res) {
    if(req&&req.body){
        //查询数据库，验证用户名密码是否正确
        User.findOne({where:req.body}).then(function(userInfo){
            if(!userInfo){
                responseData.code=3;
                responseData.message= "用户名或密码错误";
                res.json(responseData);
                return;
            }else{
                responseData.message="登陆成功";
                req.cookies.set('userInfo',JSON.stringify({
                    id:userInfo.id,
                    username:new Buffer(userInfo.username).toString('base64'),
                    role:userInfo.role,
                    isAdmin:userInfo.isAdmin
                }));
                res.json(responseData);
                return;
            }
        });
    }
});

router.get('/logout',function (req,res,next) {
    req.cookies.set('userInfo',null);
    res.json(responseData);
});

router.get('/',function (req,res,next) {
    res.render('login');
});


module.exports=router;