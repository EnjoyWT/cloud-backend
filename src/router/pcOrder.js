const { models } = require("../models/mysql");
const { Op } = require('sequelize');
const moment = require('moment');

  const pcGetOrder = async (req, res) => {

    const { username, roomnum  } = req.body;

    if (!username) {
        return res.send({ success: false, msg: '商户名称不能为空' });
    }
    if (!roomnum) {
        return res.send({ success: false, msg: '房间编号不能为空' });
    }
  
    const threeMonthsAgo = moment().subtract(3, 'months').toDate();

      try {
        // const users = await models.Order.findAll( { where:{username:username, roomnum:roomnum, createdAt: {
        //   [Op.gte]: threeMonthsAgo
        // }}})
        const users = await models.Order.findAll( { where:{username:username, roomnum:roomnum, state: 1}})
        if(users){
          //账号已存在
          res.send({
            success: true,
            data: users,
          });

        }else{
          return res.send({ success: false, msg: '手机号对应订单订单不存在' }); 
      }
    }catch{
      res.send({ success: false, msg: "数据库出错"});
    }
  }

  const pcUpdater = async (req, res) => {


    const { ordernum ,photos , totoalnum} = req.body;
    if (!ordernum) {
        return res.send({ success: false, msg: '订单编号不能为空' });
    }

      try {
        const oldone = await models.Order.findOne( { where:{ordernum:ordernum}})
        
        if(oldone){
          const updatedUser = await oldone.update({
            photos,
            totoalnum
          });
    
          res.send({ success: true, msg: '更新成功', user: updatedUser });

        }else{
            return res.send({ success: false, msg: '该订单 不存在' });
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

  


  module.exports = {
    pcGetOrder,
    pcUpdater
  }
