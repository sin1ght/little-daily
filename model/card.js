var db=require('../database');
var Sequelize =require('sequelize');

var User = require('./user');


const Card=db.define('card',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    time:{
        type:Sequelize.STRING(30)
    },
    img:{
        type:Sequelize.STRING
    },
    zh:{
        type:Sequelize.STRING
    },
    en:{
        type:Sequelize.STRING
    },
    pick_time:{
        type:Sequelize.STRING
    }
},{
    timestamps: false
});


Card.belongsTo(User,{
    foreignKey:'user_id',as: 'user'
});
User.hasMany(Card,{
    as:'cards',
    foreignKey:'user_id'
});




// Card.sync();


module.exports=Card;