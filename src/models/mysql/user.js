module.exports = (sequelize, DataTypes) => {
    // 定义 User 模型
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(32), // 对应 varchar(32)
        allowNull: true, // 如果需要非空约束，可加上这行
      },
      password: {
        type: DataTypes.STRING(32), // 对应 varchar(32)
        allowNull: true, // 如果需要非空约束，可加上这行
      },
      time: {
        type: DataTypes.DATE, // 对应 DATETIME
        allowNull: true, // 如果需要非空约束，可加上这行
        defaultValue: DataTypes.NOW, // 设置默认值为当前时间，如果适用
      },
    }, {
      freezeTableName: true, // 禁止 Sequelize 自动复数化表名
    });
  
    return User;
  };
  