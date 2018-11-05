var express=require('express');
var router=express.Router();

var Bill=require('../model/bill');
var User=require('../model/user');

var Utils=require('../utils');

var Sequelize=require('sequelize');

//添加
router.post('/',function (req,res) {  
    var type=req.body.type;
    var price=parseFloat(req.body.price).toFixed(2);
    var num=req.body.num;
    var category=req.body.category;
    var img=req.body.img;
    var extra=req.body.extra;

    var date=new Date();
    var weekday=["周日","周一","周二","周三","周四","周五","周六"];
    var time=date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日 '+weekday[date.getDay()];


    Bill.create({
        type:type,
        price:price,
        num:num,
        category:category,
        img:img,
        time:time,
        extra:extra
    }).then(bill=>{
        if(bill){
            bill.setUser(req.session.user.id);
            return res.json({status:true,data:'ok'});
        }else{
            return res.json({status:true,data:'未知错误'});
        }
    });

});



//获取列表
router.get('/',function (req,res) {  
    var latest=Boolean(req.query.latest);

    if(latest==true){
        //获取最近一日的消费
        User.findByPk(req.session.user.id).then(user=>{
            user.getBills({
                order:[['time','desc']]
            }).then(bills=>{
                var tempData={};
                bills.forEach(bill => {
                    var monthDayTime=bill.time.split(' ')[0].slice(5);
                    var weekDay=bill.time.split(' ')[1];
                    if(!tempData.hasOwnProperty(monthDayTime)){
                        tempData[monthDayTime]={
                            time:monthDayTime+' '+weekDay,
							income:0.00,
							pay:0.00,
							content:[]
                        }
                    }
                    if(bill.type==0)//支出
							tempData[monthDayTime].pay+=bill.price*bill.num;
						else //收入
							tempData[monthDayTime].income+=bill.price*bill.num;
						tempData[monthDayTime].content.push(bill);
                });

                var tempArr=[];
                for (const key in tempData) {
                    tempArr.push(tempData[key]);
                }
                return res.json({status:true,data:tempArr[0]});
            });
        });
    }else{
        var time=req.query.time;
    
        var Op=Sequelize.Op;
        User.findByPk(req.session.user.id).then(user=>{
            user.getBills({
                where:{
                    time:{[Op.like]:'%'+time+'%'}
                }
            }).then(bills=>{
                return res.json({status:true,data:bills});
            });
        });
    }
});



module.exports=router;