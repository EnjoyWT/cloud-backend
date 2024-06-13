const { Request, Response } = require("express");
const { models } = require("../models/mysql");
const { Op , Sequelize} = require("sequelize");
const { Message } = require("../utils/enums");
const { createHash } = require("crypto");


const oAdd = async (req, res) => {


    const { roomnum, name = "" , username, ordernum , info =""} = req.body;


    if (!ordernum) {
        return res.send({ success: false, msg: '订单编号不能为空' });
    }
  

       // 校验参数
    if (!roomnum) {
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
        const oldone = await models.Order.findOne( { where:{ordernum:ordernum}})
        
        if(oldone){
          //账号已存在
          await  res.send({ success: false, msg:  "订单编号已存在", code:"401" });

        }else{
          // let passwordhash = createHash("md5").update(password).digest("hex")
         

          // 创建新用户
         const newUser = await models.Order.create({
            username,
            name,
            roomnum,
            ordernum,
            info
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

  const oUpdater = async (req, res) => {


    const { username, roomnum ,ordernum ,phonenumber ,photos ,state = 0, totoalnum, info = ""} = req.body;

    
    if (!username) {
        return res.send({ success: false, msg: '关联的商户账号不能为空' });
    }
    if (!roomnum) {
        return res.send({ success: false, msg: '关联的商户账号不能为空' });
    }

    if (!ordernum) {
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
        const oldone = await models.Order.findOne( { where:{name:name,username:username }})
        
        if(oldone){
          const updatedUser = await oldone.update({
            roomnum,
            phonenumber,
            photos,
            state,
            totoalnum,
            info
          });
    
          res.send({ success: true, msg: '更新成功', user: updatedUser });

        }else{
            return res.send({ success: false, msg: '该订单 不存在' });
        }
        
      } catch (error) {
        return res.json({
          success: false,
          data: { message: JSON.stringify(error, null, 2) },
          msg:JSON.stringify(error, null, 2)
        });
      }
  };
  const oDelete = async (req, res) => {
    const { id } = req.body;
    if(!id){
      return res.send({ success: false, msg: '用户 id 不能为空' });
    }
    try {
      const userToDelete = await models.Order.findOne({ where: { id: id } });
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



  const oPage = async (req, res) => {
    
    const { page = 1, pageSize = 10 ,username  = "", ordernum = "" , roomnum = "", phonenumber = ""} = req.body;

          // 构建 where 条件对象
      const whereCondition = {
        
      };

      // 如果 username 非空字符串，添加到 where 条件中
      if (username !== "") {
        whereCondition.username = username; //精确匹配
      }

      // 如果 storename 非空字符串，添加到 where 条件中
      if (ordernum !== "") {
        // whereCondition.storename = storename; 精确匹配
        whereCondition.ordernum = {
          [Op.like]: `%${ordernum}%`
        };
      }
      if (roomnum !== "") {
        // whereCondition.storename = storename; 精确匹配
        whereCondition.roomnum = {
          [Op.like]: `%${roomnum}%`
        };
      }
      if (phonenumber !== "") {
        // whereCondition.storename = storename; 精确匹配
        whereCondition.phonenumber = {
          [Op.like]: `%${phonenumber}%`
        };

      }
    try {
      const offset = (page - 1) * pageSize;
      const users = await models.Order.findAll({
        offset,
        limit: pageSize,
        order: [['updatedAt', 'DESC']], // 按updatedAt字段降序排列
        where: whereCondition

      });
      const totalCount = await models.Order.count() ;
     
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
    oAdd,
    oUpdater,
    oDelete,
    oPage
  }