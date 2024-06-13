module.exports = (sequelize, DataTypes) => {
    // 定义 Room 模型
    const Room = sequelize.define('Room', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: { //房间名称
        type: DataTypes.STRING, // 对应 varchar(32)
        allowNull: true, // 如果需要非空约束，可加上这行
      },
      roomnumber: { //房间编号
        type: DataTypes.STRING(32), // 对应 varchar(32)
        allowNull: true, // 如果需要非空约束，可加上这行
      }

    }, {
      freezeTableName: true, // 禁止 Sequelize 自动复数化表名
    });
  
    return Room;
  };
  