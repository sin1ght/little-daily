var db=require('../database');
var Sequelize =require('sequelize');

var User = require('./user');


const Bill=db.define('bill',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    time:{
        type:Sequelize.STRING(30)
    },
    type:{
        type:Sequelize.INTEGER//0 收入 1 支出
    },
    price:{
        type:Sequelize.FLOAT
    },
    num:{
        type:Sequelize.INTEGER
    },
    category:{
        type:Sequelize.STRING(10) //消费/收入类型
    },
    img:{
        type:Sequelize.STRING(30) //类别图标
    },
    extra:{
        type:Sequelize.STRING //备注
    }
},{
    timestamps: false
});



Bill.belongsTo(User,{
    foreignKey:'user_id',as: 'user'
});
User.hasMany(Bill,{
    as:'bills',
    foreignKey:'user_id'
});



// Bill.sync();

module.exports=Bill;