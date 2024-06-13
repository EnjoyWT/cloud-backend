const { Request, Response } = require("express");
const { models } = require("../models/mysql");
const { Op , Sequelize} = require("sequelize");
const { Message } = require("../utils/enums");
const { createHash } = require("crypto");
const room = require("../models/mysql/room");


const rAdd = async (req, res) => {


    const { name, roomnumber , username} = req.body;


    // 校验参数
    if (!name) {
        return res.send({ success: false, msg: '名称不能为空' });
    }
    



    if (!username) {
        return res.send({ success: false, msg: '关联的商户账号不能为空' });
    }

    // if (!telphoneno) {
    //     return res.send({ success: false, msg: '无效的电话号码' });
    // }

    // if (!connectername) {
    //     return res.send({ success: false, msg: '联系人姓名不能为空' });
    // }

      try {
        const oldone = await models.Room.findOne( { where:{name:name,username:username }})
        
        if(oldone){
          //账号已存在
          await  res.send({ success: false, msg:  "房间名称已存在", code:"401" });

        }else{
          // let passwordhash = createHash("md5").update(password).digest("hex")
         

          // 创建新用户
         const newUser = await models.Room.create({
            username,
            name,
            roomnumber,
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


  const rUpdater = async (req, res) => {


    const { name, roomnumber , username} = req.body;


    if (!name) {
        return res.send({ success: false, msg: '名称不能为空' });
    }
    
    if (!username) {
        return res.send({ success: false, msg: '关联的商户账号不能为空' });
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
        const oldone = await models.Room.findOne( { where:{name:name,username:username }})
        
        if(oldone){
          const updatedUser = await oldone.update({
            username,
            name,
            roomnumber,
          });
    
          res.send({ success: true, msg: '更新成功', user: updatedUser });

        }else{
        //   let time = await getFormatDate();
          // let passwordhash = createHash("md5").update(password).digest("hex")
  
          // 创建新用户
         const newUser = await models.Room.create({
            username,
            name,
            roomnumber,
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
  const rDelete = async (req, res) => {
    const { id } = req.body;
    if(!id){
      return res.send({ success: false, msg: '用户 id 不能为空' });
    }
    try {
      const userToDelete = await models.Room.findOne({ where: { id: id } });
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



  const rPage = async (req, res) => {
    
    const { page = 1, pageSize = 10 ,username  = "", name = "" , roomnumber = ""} = req.body;

          // 构建 where 条件对象
      const whereCondition = {
        
      };

      // 如果 username 非空字符串，添加到 where 条件中
      if (username !== "") {
        whereCondition.username = username; //精确匹配
      }

      // 如果 storename 非空字符串，添加到 where 条件中
      if (name !== "") {
        // whereCondition.storename = storename; 精确匹配
        whereCondition.name = {
          [Op.like]: `%${name}%`
        };
      }
      if (roomnumber !== "") {
        // whereCondition.storename = storename; 精确匹配
        whereCondition.roomnumber = {
          [Op.like]: `%${roomnumber}%`
        };
      }
    try {
      const offset = (page - 1) * pageSize;
      const users = await models.Room.findAll({
        offset,
        limit: pageSize,
        order: [['updatedAt', 'DESC']], // 按updatedAt字段降序排列
        where: whereCondition

      });
      const totalCount = await models.Room.count() ;
     
      const result = {
        list:users,
        total:totalCount ,
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
    rAdd,
    rUpdater,
    rDelete,
    rPage
  }