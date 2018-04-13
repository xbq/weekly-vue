var express = require('express');

//解析post请求的参数
var bodyParser = require('body-parser');
//处理cookie
var Cookies = require('cookies');
//创建app应用程序，相当于一个httpserver
var app = new express();

//bodyParser设置
app.use(bodyParser.urlencoded({extended:true}));
app.use(function(req,res,next){
    req.cookies = new Cookies(req,res);
    req.userInfo={};
    if(req.cookies.get('userInfo')){
        try{
            req.userInfo = JSON.parse(req.cookies.get('userInfo'))
        }catch (e){

        }
    }
    next();
});

app.use('/user', require('./routers/user'));
app.use('/project', require('./routers/project'));
app.use('/weekly', require('./routers/weekly'));
app.use('/manager', require('./routers/manager'));
app.use('/', require('./routers/api'));

app.listen(8003,()=>{
console.log('服务启动8003端口');
});
