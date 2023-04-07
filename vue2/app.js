//1.导入 express模块
const express = require('express');

// 读取文件
const fs = require('fs');

// 创建 web服务器
const app = express();

// 允许跨域资源共享
const cors = require('cors');

// 引入解析银行卡的包
const BIN = require('bankcardinfo');

app.use(cors());
//配置解析 application/json 格式数据的内置中间件
app.use(express.json());

//配置中间件解析post application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}));

// mock 数据
app.post('/api/mock', (req, res) => {
    let idx = Number(req.body.id);

    fs.readFile(`mysql/${idx}.json`, 'utf-8', function (err, data) {
        if (err) {
            console.log(err, '💛💙 初始化表格数据失败');
            res.send({
                RESULT_MSG: `测试数据${idx}`, RESULT_CODE: '0001', RESULT_DATA: [],
            });
        } else {
            res.send({
                RESULT_MSG: `测试数据${idx}`, RESULT_CODE: '0000', RESULT_DATA: JSON.parse(data),
            });
        }
    });
});


// 解析银行卡信息
BIN.getBankBin('4682030946465071')
    .then(function (data) {
        console.log("💙💛解析银行卡信息:", data)
    })
    .catch(function (err) {
        console.log("💙💛解析银行卡信息失败", err)
    })

// 启动服务器
app.listen(3000, () => {
    console.log('💙💛 服务在3000端口启动');
});
