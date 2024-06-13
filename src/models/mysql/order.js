const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    // 定义 User 模型
    const Order = sequelize.define('Order', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      roomnum: { //房间编号
        type: DataTypes.STRING(32), // 对应 varchar(32)
        allowNull: true, // 如果需要非空约束，可加上这行
      },
      name: { //订单名称
        type: DataTypes.STRING(32), // 对应 varchar(32)
        allowNull: true, // 如果需要非空约束，可加上这行
      },
      phonenumber: {//联系人电话
        type: DataTypes.STRING(32), // 对应 varchar(32)
        allowNull: true, // 如果需要非空约束，可加上这行
      },
      photos: {//照片数组
        type: DataTypes.JSON, //使用TEXT存储数组
        allowNull: true, // 如果需要非空约束，可加上这行
        defaultValue:[]
      },
      state: { //状态 0:没开始, 1:正在拍摄 2:已结束
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      totoalnum: { //照片总数
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      info: {//备注
        type: DataTypes.STRING, // 对应 varchar(32)
        allowNull: true, // 如果需要非空约束，可加上这行
      },



    }, {
      freezeTableName: true, // 禁止 Sequelize 自动复数化表名
    });
  
    return Order;
  };
  