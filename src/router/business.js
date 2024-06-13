const { Request, Response } = require("express");
const { models } = require("../models/mysql");
const { Op , Sequelize} = require("sequelize");
const { Message } = require("../utils/enums");
const { createHash } = require("crypto");


const bRegister = async (req, res) => {


    const { username, password, storename, location, telphoneno, connectername, info } = req.body;


    // 校验参数
    if (!username) {
        return res.send({ success: false, msg: '用户名不能为空' });
    }

    if (!password) {
        return res.send({ success: false, msg: '密码不能为空' });
    }

    if (!storename) {
        return res.send({ success: false, msg: '店名不能为空' });
    }

    // if (!location) {
    //     return res.send({ success: false, msg: '位置不能为空' });
    // }

    // if (!telphoneno) {
    //     return res.send({ success: false, msg: '无效的电话号码' });
    // }

    // if (!connectername) {
    //     return res.send({ success: false, msg: '联系人姓名不能为空' });
    // }

      try {
        const oldone = await models.User.findOne( { where:{username:username}})
        
        if(oldone){
          //账号已存在
          await  res.send({ success: false, msg:  Message[5], code:"401" });

        }else{
          // let passwordhash = createHash("md5").update(password).digest("hex")
         

          // 创建新用户
         const newUser = await models.User.create({
            username,
            password,
            storename,
            location,
            telphoneno,
            connectername,
            info,
          });
          if(newUser){
          
            await  res.send({ success: true, msg:  Message[6]});
          }else{
            return res.json({
              success: false,
              data: { message: "数据库异常" },
              msg:"数据库异常"
            });
          }
  
        }
      } catch (error) {
        console.log(error)
        return res.json({
          success: false,
          data: { message: JSON.stringify(error, null, 2) },
          msg:JSON.stringify(error, null, 2)
        });
      }
  };


  const bUpdater = async (req, res) => {


    const { username, password, storename, location, telphoneno, connectername, info } = req.body;


    // 校验参数
    if (!username) {
        return res.send({ success: false, msg: '用户名不能为空' });
    }

    if (!password) {
        return res.send({ success: false, msg: '密码不能为空' });
    }

    if (!storename) {
        return res.send({ success: false, msg: '店名不能为空' });
    }

    // if (!location) {
    //     return res.send({ success: false, msg: '位置不能为空' });
    // }

    // if (!telphoneno) {
    //     return res.send({ success: false, msg: '无效的电话号码' });
    // }

    // if (!connectername) {
    //     return res.send({ success: false, msg: '联系人姓名不能为空' });
    // }

      try {
        const oldone = await models.User.findOne( { where:{username:username}})
        
        if(oldone){
          // //账号存在,直接更新
          // console.log("======0=====存在")
          // console.log(password)
          // console.log("=====1======存在")

          const updatedUser = await oldone.update({
            username,
            password,
            storename,
            location,
            telphoneno,
            connectername,
            info,
          });
    
          res.send({ success: true, msg: '更新成功', user: updatedUser });

        }else{
          let time = await getFormatDate();
          // let passwordhash = createHash("md5").update(password).digest("hex")
  
          // 创建新用户
         const newUser = await models.User.create({
             username,
            password,
            storename,
            location,
            telphoneno,
            connectername,
            info,
          });
          if(newUser){
          
            await  res.send({ success: true, msg:  Message[6]});
          }else{
            return res.json({
              success: false,
              data: { message: "数据库异常" },
              msg:"数据库异常"
            });
          }
  
        }
      } catch (error) {
        return res.json({
          success: false,
          data: { message: JSON.stringify(error, null, 2) },
          msg:JSON.stringify(error, null, 2)
        });
      }
  };
  const bDelete = async (req, res) => {
    const { id } = req.body;
    if(!id){
      return res.send({ success: false, msg: '用户 id 不能为空' });
    }
    try {
      const userToDelete = await models.User.findOne({ where: { id: id } });
      if (userToDelete) {
          await userToDelete.destroy();
          await res.json({
            success: true,
            data: { message: Message[8] },
          });
      } else {
        return res.send({ success: false, msg: '用户 不存在' });
      }
      } catch (error) {
        return res.send({ success: false, msg: JSON.stringify(error, null, 2) });
      }
  };

  const bMine = async (req, res) => {
    const { username } = req.body;
    if(!username){
      return res.send({ success: false, msg: '用户username 不能为空' });
    }
    try {
      const userToDelete = await models.User.findOne({ where: { 
        username: username
      } });
      if (userToDelete) {
          await res.json({
            success: true,
            data: userToDelete,
          });
      } else {
        return res.send({ success: false, msg: '用户 不存在' });
      }
      } catch (error) {
        return res.send({ success: false, msg: JSON.stringify(error, null, 2) });
      }
  };

  const bPage = async (req, res) => {
    
    const { page = 1, pageSize = 10 ,username  = "", storename = ""} = req.body;

    console.log(req.body)
          // 构建 where 条件对象
      const whereCondition = {
        [Op.and]: [
          Sequelize.literal("NOT JSON_CONTAINS(roles, '\"admin\"', '$')")
        ]
      };

      // 如果 username 非空字符串，添加到 where 条件中
      if (username !== "") {
        // whereCondition.username = username; 精确匹配
        whereCondition.username = {
          [Op.like]: `%${username}%`
        };
      }

      // 如果 storename 非空字符串，添加到 where 条件中
      if (storename !== "") {
        // whereCondition.storename = storename; 精确匹配
        whereCondition.storename = {
          [Op.like]: `%${storename}%`
        };
      }
    try {
      const offset = (page - 1) * pageSize;
      const users = await models.User.findAll({
        offset,
        limit: pageSize,
        order: [['updatedAt', 'DESC']], // 按updatedAt字段降序排列
        where: whereCondition

      });
      const totalCount = await models.User.count() ;
     
      const result = {
        list:users,
        total:totalCount - 1,
        pageSize:pageSize,
        currentPage:page
      }
      res.send({
        success: true,
        data: result,
      });
    } catch (err) {
      console.log(err)
      res.send({ success: false, msg: JSON.stringify(err)});
    }
  }
 

  module.exports = {
    bRegister,
    bUpdater,
    bDelete,
    bMine,
    bPage
  }