const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    // 定义 User 模型
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      username: { //账号名称
        type: DataTypes.STRING(32), // 对应 varchar(32)
        allowNull: true, // 如果需要非空约束，可加上这行
      },
      password: {
        type: DataTypes.STRING(32), // 对应 varchar(32)
        allowNull: true, // 如果需要非空约束，可加上这行
      },
      storename:{ //店名
        type: DataTypes.STRING, // 对应 varchar(32)
        allowNull: true, // 如果需要非空约束，可加上这行
      },
      location:{ //位置
        type: DataTypes.STRING, // 对应 varchar(32)
        allowNull: true, // 如果需要非空约束，可加上这行
      },
      telphoneno:{ //电话
        type: DataTypes.STRING, // 对应 varchar(32)
        allowNull: true, // 如果需要非空约束，可加上这行
      },
      connectername:{ //联系人
        type: DataTypes.STRING, // 对应 varchar(32)
        allowNull: true, // 如果需要非空约束，可加上这行
      },
      info:{ //备注
        type: DataTypes.STRING, // 对应 varchar(32)
        allowNull: true, // 如果需要非空约束，可加上这行
      },
      roles:{ //角色
        type: DataTypes.JSON, //使用TEXT存储数组
        defaultValue: ["common"], // 设置默认值为当前时间，如果适用
      }
      
      
      
    }, {
      freezeTableName: true, // 禁止 Sequelize 自动复数化表名
    });
  
    return User;
  };
  