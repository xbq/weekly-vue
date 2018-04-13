var Sequelize = require('sequelize');
var db = require('./db');
var Project = db.sequelize.define('Project', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true
        },
        name: Sequelize.STRING,
        number: Sequelize.STRING,
        description: Sequelize.STRING,
        manager: {
            type: Sequelize.INTEGER,
            field:'manager',
            references: {
                // 引用User
                model: 'User',
                // 连接模型的列
                key: 'id'
            }
        },
        budget: Sequelize.STRING,
        startTime: {type: Sequelize.DATE, defaultValue: null},
        endTime: {type: Sequelize.DATE, defaultValue: null},
        preStartTime: {type: Sequelize.DATE, defaultValue: null},
        preEndTime: {type: Sequelize.DATE, defaultValue: null},
        state: {type: Sequelize.STRING, defaultValue: '未开始'}
    },
    {
        underscored: true,
        timestamps: true,
        tableName: 'project',
        comment: '项目信息',
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });

/*//初始化表的时候用
Project.sync().then(function (result) {
    // 同步了'User'一个模型
});*/

module.exports = Project;
