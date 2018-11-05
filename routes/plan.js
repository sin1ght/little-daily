var express=require('express');
var router=express.Router();

var Plan= require('../model/plan');
var User=require('../model/user');

var Utils=require('../utils');


//添加计划
router.post('/',function (req,res) {  
    var content=req.body.content;
    var color=req.body.color;

    var time=Utils.getTime();

    Plan.create({content:content,color:color,time:time}).then(plan=>{
        if(plan){
            plan.setUser(req.session.user.id);
            return res.json({status:true,data:'ok'});
        }else{
            return res.json({status:true,data:'未知错误'});
        }
    });
});


//查询
router.get('/',function (req,res) {
    
    var from=0;
    if(req.query.from)
        from=parseInt(req.query.from);

    var limit=10;
    if(req.query.limit)
        limit=parseInt(req.query.limit);
    
    User.findByPk(req.session.user.id).then(user=>{
        user.getPlans({offset:from,limit:limit,order:[['time','desc']]}).then(plans=>{
            return res.json({status:true,data:plans});
        });
    });
});



module.exports=router;