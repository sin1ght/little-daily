var express=require('express');
var router=express.Router();

var Check=require('../model/check');
var Habit=require('../model/habit');

var Utils=require('../utils');


//今日打卡
router.post('/',function(req,res){
    var time=Utils.getTime().split(' ')[0]; //年月日
    var habit_id=req.body.habit_id;


    //判断今日此习惯打卡了没有
    Habit.findByPrimary(habit_id).then(habit=>{
        if(habit){
            habit.getChecks({
                where:{time:time}
            }).then(checks=>{
                if(checks.length){
                    //打过了 删除
                    checks[0].destroy();
                    return res.json({status:true,data:{type:0,msg:'取消打卡'}});
                }else{
                    //没有打
                    Check.create({
                        time:time
                    }).then(check=>{
                        if(check){
                            check.setUser(req.session.user.id);
                            check.setHabit(habit_id);
                            return res.json({status:true,data:{type:1,msg:'打卡成功'}});
                        }else{
                            return res.json({status:false,data:'未知错误'});
                        }
                    });
                }
            });
        }else{
            return res.json({status:false,data:'未知的习惯'});
        }
    });
    
});



module.exports=router;