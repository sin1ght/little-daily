var db=require('../database');
var Sequelize =require('sequelize');

var User = require('./user');

const Diary=db.define('diary',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    time:{
        type:Sequelize.STRING(30)
    },
    content:{
        type:Sequelize.TEXT
    },
    title:{
        type:Sequelize.STRING(40)
    },
    weather:{
        type:Sequelize.STRING(20)
    },
    mood:{
        type:Sequelize.STRING(20)
    }
},{
    timestamps: false
});


Diary.belongsTo(User,{
    foreignKey:'user_id',as: 'user'
});
User.hasMany(Diary,{
    as:'diarys',
    foreignKey:'user_id'
});

// Diary.sync();


module.exports=Diary;