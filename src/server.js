const app = require("./app.js");
// import * as open from "open";
const config = require("./config");
const dayjs = require("dayjs");
const multer = require("multer");
const Logger = require("./loaders/logger");
const jwt = require("jsonwebtoken");

const { sequelize } = require("./models/mysql")
const expressSwagger = require("express-swagger-generator")(app);
expressSwagger(config.options);


const {
  login,
  refreshToken,
  register,
  updateList,
  deleteList,
  searchPage,
  searchVague,
  upload,
  captcha,
} = require("./router/http");

const {bRegister,bUpdater,bDelete , bMine, bPage } = require("./router/business.js")


// 创建一个中间件函数
const authMiddleware = (req, res, next) => {
  let payload = null;
  try {
    const authorizationHeader = req.get("Authorization");
    const accessToken = authorizationHeader.substr("Bearer ".length);
    payload = jwt.verify(accessToken, config.jwtSecret);
    next()
  } catch (error) {
    return res.send({
      success: false,
      msg:'令牌无效或已过期'});
  }

};

app.post("/login", (req, res) => {
  login(req, res);
});

app.post("/register", (req, res) => {
  register(req, res);
});
app.post("/refresh-token", (req, res) => {
  refreshToken(req, res);
});

app.put("/updateList/:id", (req, res) => {
  updateList(req, res);
});

app.delete("/deleteList/:id", (req, res) => {
  deleteList(req, res);
});

app.post("/searchPage", (req, res) => {
  searchPage(req, res);
});

app.post("/searchVague", (req, res) => {
  searchVague(req, res);
});


// 新建存放临时文件的文件夹
const upload_tmp = multer({ dest: "upload_tmp/" });
app.post("/upload", upload_tmp.any(), (req, res) => {
  upload(req, res);
});

app.get("/captcha", (req, res) => {
  captcha(req, res);
});
app.get("/get-async-routes", (req, res) => {
  
  const permissionRouter = {
    path: "/permission",
    meta: {
      title: "权限管理",
      icon: "ep:lollipop",
      rank: 10
    },
    children: [
      {
        path: "/permission/page/index",
        name: "PermissionPage",
        meta: {
          title: "页面权限",
          roles: ["admin", "common"]
        }
      },
      {
        path: "/permission/button/index",
        name: "PermissionButton",
        meta: {
          title: "按钮权限",
          roles: ["admin", "common"],
          auths: [
            "permission:btn:add",
            "permission:btn:edit",
            "permission:btn:delete"
          ]
        }
      }
    ]
  };

  res.json({
    success: true,
    data: [permissionRouter],
  });
});



app.ws("/socket", function (ws, req) {
  ws.send(
    `${dayjs(new Date()).format("YYYY年MM月DD日HH时mm分ss秒")}成功连接socket`
  );

  // 监听客户端是否关闭socket
  ws.on("close", function (msg) {
    console.log("客户端已关闭socket", msg);
    ws.close();
  });

  // 监听客户端发送的消息
  ws.on("message", function (msg) {
    // 如果客户端发送close，服务端主动关闭该socket
    if (msg === "close") ws.close();

    ws.send(
      `${dayjs(new Date()).format(
        "YYYY年MM月DD日HH时mm分ss秒"
      )}接收到客户端发送的信息，服务端返回信息：${msg}`
    );
  });
});





//商家
app.post("/bRegister",authMiddleware, (req, res) => {
  bRegister(req, res);
});
app.post("/bUpdater",authMiddleware, (req, res) => {
  bUpdater(req, res);
});
app.post("/bDelete",authMiddleware, (req, res) => {
  bDelete(req, res);
});
app.post("/bMine",authMiddleware, (req, res) => {
  bMine(req, res);
});
app.post("/getUsers",authMiddleware, (req, res) => {
  bPage(req, res);
});

sequelize.sync()
  .then(() => {
    app
    .listen(config.port, () => {
      Logger.info(`
      ################################################
      🛡️  Swagger文档地址: http://localhost:${config.port} 🛡️
      ################################################
    `);
    })
    .on("error", (err) => {
      Logger.error(err);
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error('Unable to synchronize the database:', error);
  });

