var db=require('../database');
var Sequelize =require('sequelize');

var User = require('./user');
var Habit= require('./habit');

const Check=db.define('check',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    time:{
        type:Sequelize.STRING(30)
    }
},{
    timestamps: false
});


Check.belongsTo(User,{
    foreignKey:'user_id',as: 'user'
});
User.hasMany(Check,{
    as:'checks',
    foreignKey:'user_id'
});

Check.belongsTo(Habit,{
    foreignKey:'habit_id',as:'habit'
});
Habit.hasMany(Check,{
    as:'checks',
    foreignKey:'habit_id'
});


// Check.sync();

module.exports=Check;