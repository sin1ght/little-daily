var express=require('express');
var router=express.Router();

var https=require('https');
var http=require('http');
var cheerio=require('cheerio');

var Card=require('../model/card');
var User=require('../model/user');
var Check=require('../model/check');
var Utils=require('../utils');


var needChecks=4;//需要打卡的次数



function getImg() {  
    return new Promise((resolve,reject)=>{
        https.get('https://www.gracg.com/works/index/type/new', (res) =>{  
            var html='';
            res.on('data',chunk=>{
                html+=chunk;
            });

            res.on('end',()=>{
                var $=cheerio.load(html);
                var img_url=$('.NewHomeWorksList .item').eq(Math.floor(Math.random()*10+1)).find('.imgbox img').attr('src');
                resolve(img_url);
            });
        });
    });
}

function getSentence() {
    return new Promise((resolve,reject)=>{
        http.get('http://open.iciba.com/dsapi/',res=>{
            var data='';

            res.on('data',chunk=>{
                data+=chunk;
            });

            res.on('end',()=>{
                data=JSON.parse(data);
                var sentence={
                    zh:data.note,
                    en:data.content
                };
                resolve(sentence);
            });
        });
    });
}

async function getTodayCard() {  
    var img=await getImg();
    var sentence=await getSentence();

    return {img,sentence};
}
//今日卡片
router.get('/today',function (req,res) {  
    getTodayCard().then(data=>{
        var date=new Date();
        var mouth=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Otc','Nov','Dec'];
        var week=['周日','周一','周二','周三','周四','周五','周六'];
        var time=mouth[date.getMonth()+1]+','+date.getFullYear()+' '+week[date.getDay()];
        data.time=time;

        //今日打卡次数达标需求
        res.json({status:true,data:data});
    });
});


//获取基本信息
//今日是否领卡 还需要打卡几次才达标
router.get('/info',function (req,res) { 
    //今日打卡次数达标需求
    var data={};
    var today=Utils.getTime().split(' ')[0];
    Check.findAll({
        where:{time:today}
    }).then(checks=>{
        data.needChecks=needChecks-checks.length;
        
        Card.findAll({
            where:{pick_time:today}
        }).then(cards=>{
            data.pick=cards.length;
            res.json({status:true,data:data});
        });
    });
});


//领取卡片
router.post('/',function (req,res) {
    var img=req.body.img;
    var zh=req.body.sentence.zh;
    var en=req.body.sentence.en;
    var time=req.body.time;
    var pick_time=Utils.getTime().split(' ')[0];

    //今日打卡次数是否达标
    var today=Utils.getTime().split(' ')[0];
    Check.findAll({
        where:{time:today}
    }).then(checks=>{
        if(checks.length == needChecks){
            //达标
            Card.create({
                img:img,
                zh:zh,
                en:en,
                time:time,
                pick_time:pick_time
            }).then(card=>{
                if(card){
                    card.setUser(req.session.user.id);
                    res.json({status:true,data:'成功领取'});
                }else{
                    res.json({status:false,data:'未知错误'});
                }
            });
        }else{
            //未达标
            res.json({status:false,data:'打卡次数未达标'});
        }
    });
});



//获取列表
router.get('/',function (req,res) {
    User.findByPk(req.session.user.id).then(user=>{
        user.getCards({order:[['pick_time','desc']]}).then(cards=>{
            return res.json({status:true,data:cards});
        });
    });
});





module.exports=router;