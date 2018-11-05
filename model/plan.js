var db=require('../database');
var Sequelize =require('sequelize');

var User = require('./user');

const Plan=db.define('plan',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    content:{
        type:Sequelize.STRING
    },
    color:{
        type:Sequelize.STRING(10)
    },
    time:{
        type:Sequelize.STRING(30)
    }
},{timestamps: false});


Plan.belongsTo(User,{
    foreignKey:'user_id',as: 'user'
});
User.hasMany(Plan,{
    as:'plans',
    foreignKey:'user_id'
});



// Plan.sync();

module.exports=Plan;