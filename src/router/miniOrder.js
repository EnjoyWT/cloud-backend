const { models } = require("../models/mysql");
const { Op } = require('sequelize');
const moment = require('moment');

const minilogin = async (req, res) => {

    const {  phonenumber } = req.query;


    if (!phonenumber) {
        return res.send({ success: false, msg: '手机号码不能为空' });
    }
  
    const threeMonthsAgo = moment().subtract(3, 'months').toDate();


      try {
        const oldone = await models.Order.findOne( { where:{phonenumber:phonenumber, createdAt: {
          [Op.gte]: threeMonthsAgo
        }}})
        
        if(oldone){
          //账号已存在
          await  res.send({ success: true, msg:  "订单存在"});

        }else{
          return res.send({ success: false, msg: '手机号对应订单订单不存在' }); 
      }

    }catch{
      res.send({ success: false, msg: "数据库出错"});
    }

  };

  const miniGetAll = async (req, res) => {


    const {  phonenumber } = req.body;


    if (!phonenumber) {
        return res.send({ success: false, msg: '手机号码不能为空' });
    }
  
    const threeMonthsAgo = moment().subtract(3, 'months').toDate();

      try {
        const users = await models.Order.findAll( { where:{phonenumber:phonenumber, createdAt: {
          [Op.gte]: threeMonthsAgo
        }}})
        
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

  


  module.exports = {
    miniGetAll,
    minilogin

  }
