//1.导入 express模块
const express = require('express');

// 读取文件
const fs = require('fs');

// 创建 web服务器
const app = express();

// 允许跨域资源共享
const cors = require('cors');
app.use(cors());
//配置解析 application/json 格式数据的内置中间件
app.use(express.json());

//配置中间件解析post application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// mock 数据
app.post('/api/mock', (req, res) => {
  let idx = Number(req.body.id);

  fs.readFile(`mysql/${idx}.json`, 'utf-8', function (err, data) {
    if (err) {
      console.log(err, '💛💙 初始化表格数据失败');
      res.send({
        RESULT_MSG: `测试数据${idx}`,
        RESULT_CODE: '0001',
        RESULT_DATA: [],
      });
    } else {
      res.send({
        RESULT_MSG: `测试数据${idx}`,
        RESULT_CODE: '0000',
        RESULT_DATA: JSON.parse(data),
      });
    }
  });
});

// 启动服务器
app.listen(3000, () => {
  console.log('💙💛 服务在3000端口启动');
});
