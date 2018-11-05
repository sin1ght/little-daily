var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var https=require('https');


var config = require('./config');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use('/',express.static('./public'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'sinight',
  //重新保存：强制会话保存即使是未修改的。默认为true但是得写上
  resave: true, 
  //强制“未初始化”的会话保存到存储。 
  saveUninitialized: true
}));


//登录检测
app.use(function (req,res,next) {
  
  //登录
  if(req.path == '/user/login' && req.method == 'POST'){
    return next();
  }

  //注册
  if(req.path == '/user' && req.method == 'POST'){
    return next();
  }

  if(req.session.user){
    return next();
  }else{
    return res.json({status:false,data:'请先登录'});
  }
});





//注册路由
var user=require('./routes/user');
var plan=require('./routes/plan');
var diary=require('./routes/diary');
var bill=require('./routes/bill');
var habit=require('./routes/habit');
var check=require('./routes/check');
var card=require('./routes/card');


app.use('/user',user);
app.use('/plan',plan);
app.use('/diary',diary);
app.use('/bill',bill);
app.use('/habit',habit);
app.use('/check',check);
app.use('/card',card);

//新闻
app.get('/news',function (req,outer_res) {
  https.get('https://www.toutiao.com/api/pc/hot_gallery/', (res) =>{  
      var html='';
      res.on('data',chunk=>{
          html+=chunk;
      });

      res.on('end',()=>{
        outer_res.json(JSON.parse(html));
      });
  });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




app.listen(config.port,function(){
  console.log("listen on "+config.port);
});
