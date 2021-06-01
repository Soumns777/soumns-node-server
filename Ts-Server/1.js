// 导入 express模块
const express = require('express');

// 创建 web服务器
const app = express();

// 允许跨域资源共享
const cors = require('cors');
app.use(cors());

//配置解析 application/json 格式数据的内置中间件
app.use(express.json());

//配置中间件解析post application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}));

// 挂载路由
app.get('/', (req, res) => {
    res.send('Hello TypeScript');
});

app.get('/login', (req, res) => {
    res.send({
        status: 200,
    });
});

app.post('/login', (req, res) => {
    res.send({
        status: 400,
    });
});

// 启动服务器
app.listen(3000, () => {
    console.log('服务启动开始')
})
