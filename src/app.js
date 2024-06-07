const express = require("express");
const expressWs = require("express-ws");
const bodyParser = require("body-parser");
const cors = require("cors");

class App {
  constructor() {
    this.app = express();
    this.config();
  }

  config() {
    // 支持websocket
    expressWs(this.app);
    // 支持json编码的主体
    this.app.use(bodyParser.json());
    // 支持编码的主体
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
    // 设置静态访问目录(Swagger)
    this.app.use(express.static("public"));
    this.app.use(cors()); // 新增

    // 设置跨域访问
    // this.app.all("*", (req, res, next) => {
    //   res.header("Access-Control-Allow-Origin", "*");
    //   res.header("Access-Control-Allow-Headers", "content-type, x-requested-with"); // 添加 x-requested-with 请求头
    //   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    //   res.header("X-Powered-By", " 3.2.1");
    //   res.header("Content-Type", "application/json;charset=utf-8");
    //   next();
    // });
  }
}

module.exports = new App().app;
