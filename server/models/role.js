var Sequelize = require('sequelize');
var db = require('./db');
var Role = db.sequelize.define('Role', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true
        },
        role: Sequelize.STRING
    },
    {
        underscored: true,
        timestamps: true,
        tableName: 'role',
        comment: '项目信息',
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });

//初始化表的时候用
/*Role.sync().then(function (result) {
});*/

module.exports = Role;
