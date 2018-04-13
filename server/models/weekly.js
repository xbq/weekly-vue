var Sequelize = require('sequelize');
var db = require('./db');

var Weekly = db.sequelize.define('Weekly', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        startTime: Sequelize.DATE,
        endTime: Sequelize.DATE,
        taskDesc: Sequelize.STRING,
        taskTime: Sequelize.INTEGER,
        week: Sequelize.INTEGER,
        month: Sequelize.INTEGER,
        year: Sequelize.INTEGER,
        taskType: Sequelize.STRING,
        approveTaskTime: Sequelize.INTEGER,
        process: Sequelize.STRING,
        project: {
            type: Sequelize.INTEGER,
            filed:'project',
            references: {
                model: 'Project',
                key: 'id'
            }
        },
        isApprove: {type: Sequelize.STRING, default: '尚未审批'},
        executor: {
            type: Sequelize.INTEGER,
            filed:'executor',
            references: {
                model: 'User',
                key: 'id'
            }
        },
        approveOpinion: Sequelize.STRING,
        approver: {
            type: Sequelize.INTEGER,
            filed:'approver',
            references: {
                model: 'User',
                key: 'id'
            }
        }
    },
    {
        timestamps: true,
        underscored: true,
        paranoid: true,
        freezeTableName: true,
        tableName: 'weekly',
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });

/*//初始化表的时候使用，生产环境不要使用
Weekly.sync({force:true}).then(function (result) {

});*/

module.exports = Weekly;