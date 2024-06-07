// /** 创建用户表 */
// const user =
//   "CREATE TABLE if not EXISTS users(id int PRIMARY key auto_increment,username varchar(32),password varchar(32),time DATETIME)";

// export { user };



const { Sequelize } = require('sequelize');
const config = require("../../config/index")
const mysql = config.default.mysql;


const sequelize = new Sequelize(mysql.database, mysql.username, mysql.password, {
    host: mysql.host,
    port: mysql.port, 
    dialect: "mysql",
  });
  

const db = {
  sequelize,
  Sequelize,
  models: {},
};

// 加载模型
db.models.User = require('./user')(sequelize, Sequelize);


module.exports = db;
