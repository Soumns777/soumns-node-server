// 1.导入 express模块
const express = require('express');


// 创建 web服务器
const app = express();


//配置解析 application/json 格式数据的内置中间件
app.use(express.json());


app.get('/init', (req, res) => {
    console.log(req.url, "💙💛url")
    res.send({
        RESULT_CODE: '0000', RESULT_MSG: "init成功", RESULT_DATA: [{
            id: '001', name: 'iu', age: 19
        }, {
            id: '002', name: 'krystal', age: 20
        }, {
            id: '003', name: 'yoona', age: 22
        }]
    })
})

//配置中间件解析post application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}));


// 启动服务器
app.listen(3031, () => {
    console.log('💙💛 服务在3031端口启动');
});
