var Sequelize = require('sequelize');
var db = require('./db');
var User = db.sequelize.define('User', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        username: Sequelize.STRING,
        password: {type: Sequelize.STRING, defaultValue: 'zjzhd'},
        role: {
            type: Sequelize.INTEGER,
            field: 'role',
            references: {
                // 引用User
                model: 'Role',
                // 连接模型的列
                key: 'id'
            }
        },
        department: Sequelize.STRING,
        tel: Sequelize.STRING,
        isAdmin:Sequelize.BOOLEAN
    },
    {
        timestamps: true,
        underscored: true,
        paranoid: true,
        freezeTableName: true,
        tableName: 'user',
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });

//初始化表的时候使用，生产环境不要使用
/*User.sync().then(function (result) {
    // 同步了'User'一个模型
})*/

module.exports = User;