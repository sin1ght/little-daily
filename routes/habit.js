var express=require('express');
var router=express.Router();

var Habit=require('../model//habit');
var User=require('../model/user');

var Utils=require('../utils');


//添加
router.post('/',function (req,res) {  
    var icon=req.body.icon;
    var background=req.body.background;
    var day_time=req.body.day_time;
    var week_time=req.body.week_time;
    var sentence=req.body.sentence;
    var name=req.body.name;


    Habit.create({
        icon:icon,
        background:background,
        day_time:day_time,
        week_time:week_time,
        sentence:sentence,
        name:name
    }).then(habit=>{
        if(habit){
            habit.setUser(req.session.user.id);
            return res.json({status:true,data:'ok'});
        }else{
            return res.json({status:true,data:'未知错误'});
        }
    });
});


//获取habit 的打卡次数信息
//总打卡次数
function getChecksCount(habit) {
    return new Promise((resolve,reject)=>{
        habit.getChecks().then(checks=>{
            resolve(checks.length);
        });
    });
}

//今日是否打卡
function getTodayCheck(habit){
    return new Promise((resolve,reject)=>{
        var time=Utils.getTime().split(' ')[0]; //年月日
        habit.getChecks({
            where:{time:time}
        }).then(checks=>{
            resolve(checks.length);
        });
    });
}

async function getFullData(habits) {
    var data=[];
    for (const habit of habits) {
        habit.dataValues.checks=await getChecksCount(habit);
        habit.dataValues.todayCheck=await getTodayCheck(habit);
        data.push(habit);
    }
    return data;
}

//获取列表 /今日习惯 /所有习惯
router.get('/',function (req,res) {  
    var from=0;
    if(req.query.from)
        from=parseInt(req.query.from);

    var today=Boolean(req.query.today);
    
    User.findByPk(req.session.user.id).then(user=>{

        if(today == true){
            //今日习惯
            var week_day=new Date().getDay(); //0 ~6
            user.getHabits().then(habits=>{
                var data=[];

                habits.forEach(habit => {
                    if(habit.get('week_time').indexOf(week_day)!=-1){
                        data.push(habit);
                    }
                });
                
                getFullData(data).then(results=>{
                    return res.json({status:true,data:results});
                });
            });  
        }else{
            //所有习惯
            user.getHabits({offset:from,limit:10}).then(habits=>{
               
                getFullData(habits).then(data=>{
                    return res.json({status:true,data:data});
                });
            });
        }
       
    });
});






module.exports=router;