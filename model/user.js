var db=require('../database');
var Sequelize =require('sequelize');



const User=db.define('user',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    account:{
        type:Sequelize.STRING(20),
    },
    passwd:{
        type:Sequelize.STRING(50)
    },
    email:{
        type:Sequelize.STRING(20)
    },

}); 





// User.sync().then(()=>{
//     User.create({
//         account:'si',
//         passwd:'202cb962ac59075b964b07152d234b70',
//         email:'test@qq.com'
//     });
// });

module.exports=User;