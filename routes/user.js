var express=require('express');
var router=express.Router();
var User=require('../model/user');

var crypto=require('crypto');

//注册
router.post('/',function (req,res) {
    
    var account=req.body.account;
    var email=req.body.email;
    var passwd1=req.body.passwd1;
    var passwd2=req.body.passwd2;

    
    if(passwd1 != passwd2){
        return res.json({status:false,data:'两次密码不一致'});
    }

    User.findOne({where:{account:account}}).then(user=>{
        if(user){
            return res.json({status:false,data:'账户已经存在'});
        }else{
            var md5=crypto.createHash('md5');

            User.create({
                account:account,
                email:email,
                passwd:md5.update(passwd1).digest('hex')
            });

            return res.json({status:true,data:'ok'});
        }
    });
});


//登录
router.post('/login',function (req,res) {
    
    User.findOne({where:{account:req.body.account}}).then(user=>{
        if(user){
            var md5=crypto.createHash('md5');
            var passwd=md5.update(req.body.passwd).digest('hex')

            if (passwd == user.get('passwd')){

                req.session.user=user;

                return res.json({status:true,data:{user:user.account}});
            }else{
                return res.json({status:false,data:'密码错误'}); 
            }
        }else{
            return res.json({status:false,data:'账户不存在'}); 
        }
    });
});



module.exports=router;