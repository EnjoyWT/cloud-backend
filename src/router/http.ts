import * as fs from "fs";
import secret from "../config";
import * as mysql from "mysql2";
import * as jwt from "jsonwebtoken";
import { createHash } from "crypto";
import Logger from "../loaders/logger";
import { Message } from "../utils/enums";
import getFormatDate from "../utils/date";
import { connection } from "../utils/mysql";
import { Request, Response } from "express";
import { createMathExpr } from "svg-captcha";

const utils = require("@pureadmin/utils");

const { models } = require("../models/mysql");

import { Op } from 'sequelize';



/** 保存验证码 */
let generateVerify: number;

/** 过期时间 单位：毫秒 默认 1分钟过期，方便演示 */
let expiresIn = 60000;
let refreshExpiresIn = "2m"

/**
 * @typedef Error
 * @property {string} code.required
 */

/**
 * @typedef Response
 * @property {[integer]} code
 */

// /**
//  * @typedef Login
//  * @property {string} username.required - 用户名 - eg: admin
//  * @property {string} password.required - 密码 - eg: admin123
//  * @property {integer} verify.required - 验证码
//  */

/**
 * @typedef Login
 * @property {string} username.required - 用户名 - eg: admin
 * @property {string} password.required - 密码 - eg: admin123
 */

/**
 * @route POST /login
 * @param {Login.model} point.body.required - the new point
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @summary 登录
 * @group 用户登录、注册相关
 * @returns {Response.model} 200
 * @returns {Array.<Login>} Login
 * @headers {integer} 200.X-Rate-Limit
 * @headers {string} 200.X-Expires-After
 * @security JWT
 */

const login = async (req: Request, res: Response) => {
 
  const { username, password } = req.body;

  try {
    // 检查是否有相同的 email 用户存在
    const existingUser = await models.User.findOne({ where: { username: username } });

    if (existingUser) {
      if (
        createHash("md5").update(password).digest("hex") == existingUser.password
      ) {
        const accessToken = jwt.sign(
          {
            accountId: existingUser.id,
          },
          secret.jwtSecret,
          { expiresIn }
        );

        const refreshToken = jwt.sign({ accountId: existingUser.id }, secret.jwtRefreshSecret, { expiresIn: refreshExpiresIn });

        if (username === "admin") {
          await res.json({
            success: true,
            data: {
              message: Message[2],
              username,
              // 这里模拟角色，根据自己需求修改
              roles: ["admin"],
              accessToken,
              // 这里模拟刷新token，根据自己需求修改
              refreshToken: refreshToken,
              expires: new Date(new Date()).getTime() + expiresIn,              
            },
          });
        } else {
          await res.json({
            success: true,
            data: {
              message: Message[2],
              username,
              // 这里模拟角色，根据自己需求修改
              roles: ["common"],
              accessToken,
              // 这里模拟刷新token，根据自己需求修改
              refreshToken: "eyJhbGciOiJIUzUxMiJ9.adminRefresh",
              expires: new Date(new Date()).getTime() + expiresIn,
              // 这个标识是真实后端返回的接口，只是为了演示
              pureAdminBackend:
                "这个标识是pure-admin-backend真实后端返回的接口，只是为了演示",
            },
          });
        }
      } else {
        await res.json({
          success: false,
          data: { message: Message[3] },
        });
      }
     
    } else {
      await res.json({
        success: false,
        data: { message: Message[1] },
      });
    }
  } catch (error) {
    await res.json({
      success: false,
      data: { message: Message[12] },
    });
  }
};


const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  // if (!refreshToken) {
  //     return res.status(400).send('缺少刷新令牌');
  // }

  // // 验证刷新令牌
  // try {
  //     const payload = jwt.verify(refreshToken, secret.jwtRefreshSecret);

  //     payload.
  //     if (!user) {
  //         return res.status(401).send('无效的刷新令牌');
  //     }

  //     // 生成新的访问令牌
  //     const accessToken = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '15m' });

  //     res.json({ accessToken });
  // } catch (err) {
  //     return res.status(401).send('刷新令牌无效或已过期');
  // }
}
// /**
//  * @typedef Register
//  * @property {string} username.required - 用户名
//  * @property {string} password.required - 密码
//  * @property {integer} verify.required - 验证码
//  */
/**
 * @typedef Register
 * @property {string} username.required - 用户名
 * @property {string} password.required - 密码
 */

/**
 * @route POST /register
 * @param {Register.model} point.body.required - the new point
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @summary 注册
 * @group 用户登录、注册相关
 * @returns {Response.model} 200
 * @returns {Array.<Register>} Register
 * @headers {integer} 200.X-Rate-Limit
 * @headers {string} 200.X-Expires-After
 * @security JWT
 */

const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
 
  if (password.length < 6){
    return res.json({
      success: false,
      data: { message: Message[4] },
    });
  }
  
    try {
      const oldone = await models.User.findOne( { where:{username:username}})
      console.log(oldone)
      if(oldone){
        await res.json({
          success: false,
          data: { message: Message[5] },
        });
      }else{
        let time = await getFormatDate();
        let passwordhash = createHash("md5").update(password).digest("hex")

        const newUser = await models.User.create({
          username,
          password:passwordhash,
          time:time
        });
        if(newUser){
          await res.json({
            success: true,
            data: { message: Message[6] },
          });
        }else{
          return res.json({
            success: false,
            data: { message: "数据库异常" },
          });
        }

      }
    } catch (error) {
      return res.json({
        success: false,
        data: { message: error },
      });
    }
};

/**
 * @typedef UpdateList
 * @property {string} username.required - 用户名 - eg: admin
 */

/**
 * @route PUT /updateList/{id}
 * @summary 列表更新
 * @param {UpdateList.model} point.body.required - 用户名
 * @param {UpdateList.model} id.path.required - 用户id
 * @group 用户管理相关
 * @returns {object} 200
 * @returns {Array.<UpdateList>} UpdateList
 * @security JWT
 */

const updateList = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username } = req.body;
  let payload = null;
  try {
    const authorizationHeader = req.get("Authorization") as string;
    const accessToken = authorizationHeader.substr("Bearer ".length);
    payload = jwt.verify(accessToken, secret.jwtSecret);
  } catch (error) {
    return res.status(401).end();
  }

};

/**
 * @typedef DeleteList
 * @property {integer} id.required - 当前id
 */

/**
 * @route DELETE /deleteList/{id}
 * @summary 列表删除
 * @param {DeleteList.model} id.path.required - 用户id
 * @group 用户管理相关
 * @returns {object} 200
 * @returns {Array.<DeleteList>} DeleteList
 * @security JWT
 */

const deleteList = async (req: Request, res: Response) => {
  const { id } = req.params;
  let payload = null;
  try {
    const authorizationHeader = req.get("Authorization") as string;
    const accessToken = authorizationHeader.substr("Bearer ".length);
    payload = jwt.verify(accessToken, secret.jwtSecret);
  } catch (error) {
    return res.status(401).end();
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
        console.log('User not found.');
    }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};

/**
 * @typedef SearchPage
 * @property {integer} page.required - 第几页 - eg: 1
 * @property {integer} size.required - 数据量（条）- eg: 5
 */

/**
 * @route POST /searchPage
 * @param {SearchPage.model} point.body.required - the new point
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @summary 分页查询
 * @group 用户管理相关
 * @returns {Response.model} 200
 * @returns {Array.<SearchPage>} SearchPage
 * @headers {integer} 200.X-Rate-Limit
 * @headers {string} 200.X-Expires-After
 * @security JWT
 */

const searchPage = async (req: Request, res: Response) => {
  const { page, size } = req.body;
  let payload = null;
  try {
    const authorizationHeader = req.get("Authorization") as string;
    const accessToken = authorizationHeader.substr("Bearer ".length);
    payload = jwt.verify(accessToken, secret.jwtSecret);
  } catch (error) {
    return res.status(401).end();
  }

  try {
    const users = await models.User.findAll({
        limit: size,
        offset: (page - 1) * size
      });
      await res.json({
        success: true,
        data:users,
      });
  } catch (error) {
      console.error('Error fetching users:', error);
  }
};

/**
 * @typedef SearchVague
 * @property {string} username.required - 用户名  - eg: admin
 */

/**
 * @route POST /searchVague
 * @param {SearchVague.model} point.body.required - the new point
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @summary 模糊查询
 * @group 用户管理相关
 * @returns {Response.model} 200
 * @returns {Array.<SearchVague>} SearchVague
 * @headers {integer} 200.X-Rate-Limit
 * @headers {string} 200.X-Expires-After
 * @security JWT
 */

const searchVague = async (req: Request, res: Response) => {
  const { username } = req.body;
  let payload = null;
  try {
    const authorizationHeader = req.get("Authorization") as string;
    const accessToken = authorizationHeader.substr("Bearer ".length);
    payload = jwt.verify(accessToken, secret.jwtSecret);
  } catch (error) {
    return res.status(401).end();
  }
  if (username === "" || username === null)
    return res.json({
      success: false,
      data: { message: Message[9] },
    });
  try {
    const users = await models.User.findAll({
        where: {
            username: {
                [Op.like]: `%${username}%`
            }
        }
    });
        console.log('Users:', users);
    } catch (error) {
        console.error('Error fetching users:', error);
    }

};

// express-swagger-generator中没有文件上传文档写法，所以请使用postman调试
const upload = async (req: Request, res: Response) => {
  // 文件存放地址
  const des_file: any = (index: number) =>
    "./public/files/" + req.files[index].originalname;
  let filesLength = req.files.length as number;
  let result = [];

  function asyncUpload() {
    return new Promise((resolve, rejects) => {
      (req.files as Array<any>).forEach((ev, index) => {
        fs.readFile(req.files[index].path, function (err, data) {
          fs.writeFile(des_file(index), data, function (err) {
            if (err) {
              rejects(err);
            } else {
              while (filesLength > 0) {
                result.push({
                  filename: req.files[filesLength - 1].originalname,
                  filepath: utils.getAbsolutePath(des_file(filesLength - 1)),
                });
                filesLength--;
              }
              if (filesLength === 0) resolve(result);
            }
          });
        });
      });
    });
  }

  asyncUpload()
    .then((fileList) => {
      res.json({
        success: true,
        data: {
          message: Message[11],
          fileList,
        },
      });
    })
    .catch(() => {
      res.json({
        success: false,
        data: {
          message: Message[10],
          fileList: [],
        },
      });
    });
};

/**
 * @route GET /captcha
 * @summary 图形验证码
 * @group captcha - 图形验证码
 * @returns {object} 200
 */

const captcha = async (req: Request, res: Response) => {
  const create = createMathExpr({
    mathMin: 1,
    mathMax: 4,
    mathOperator: "+",
  });
  generateVerify = Number(create.text);
  res.type("svg"); // 响应的类型
  res.json({ success: true, data: { text: create.text, svg: create.data } });
};

export {
  login,
  register,
  updateList,
  deleteList,
  searchPage,
  searchVague,
  upload,
  captcha,
};
