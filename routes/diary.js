var express=require('express');
var router=express.Router();

var Diary=require('../model/diary');
var User=require('../model/user');

var Utils=require('../utils');


//添加
router.post('/',function (req,res) {

    var weekday=["周日","周一","周二","周三","周四","周五","周六"];
    var date=new Date();

    var time=Utils.getTime()+' '+weekday[date.getDay()];
    var title=req.body.title;
    var content=req.body.content;
    var weather=req.body.weather;
    var mood=req.body.mood;


    Diary.create({
        time:time,
        title:title,
        content:content,
        weather:weather,
        mood:mood
    }).then(diary=>{
        if(diary){
            diary.setUser(req.session.user.id);
            return res.json({status:true,data:'ok'});
        }else{
            return res.json({status:true,data:'未知错误'});
        }
    });
});


//获取列表
router.get('/',function (req,res) {  
    var from=0;
    if(req.query.from)
        from=parseInt(req.query.from);
    
    var limit=10;
    if(req.query.limit)
        limit=parseInt(req.query.limit);
    
    User.findByPk(req.session.user.id).then(user=>{
        user.getDiarys({offset:from,limit:limit,order:[['time','desc']]}).then(diarys=>{
            return res.json({status:true,data:diarys});
        });
    });
});



module.exports=router;