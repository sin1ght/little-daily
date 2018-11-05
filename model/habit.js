var db=require('../database');
var Sequelize =require('sequelize');

var User = require('./user');

const Habit=db.define('habit',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    icon:{
        type:Sequelize.STRING(50)
    },
    background:{
        type:Sequelize.STRING(20)
    },
    day_time:{
        type:Sequelize.INTEGER //一天中的什么时候
    },
    week_time:{
        type:Sequelize.STRING(20) //一周中的那天  0-6,星期日-星期六
    },
    sentence:{
        type:Sequelize.STRING(50) //激励自己的话
    },
    name:{
        type:Sequelize.STRING(20)
    }
},{
    timestamps: false
});



Habit.belongsTo(User,{
    foreignKey:'user_id',as: 'user'
});
User.hasMany(Habit,{
    as:'habits',
    foreignKey:'user_id'
});

// Habit.sync();


module.exports=Habit;