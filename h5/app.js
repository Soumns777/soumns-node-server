// 导入 express模块
const express = require('express');

// 导入加密模块
const md5 = require('js-md5');

const multer = require('multer')

// 读取文件
const fs = require('fs');

// 创建 web服务器
const app = express();

// 允许跨域资源共享
const cors = require('cors');

// 生成xlsx的buffer
const nodeXlsx = require('node-xlsx');

app.use(
    cors({
        credentials: true,
        origin: [
            'http://localhost:3001',
            'http://localhost:3002',
            'http://localhost:3003',
            'http://localhost:8081',
            'http://localhost:5173',
        ], // web前端服务器地址
    })
);

//配置解析 application/json 格式数据的内置中间件
app.use(express.json());

//配置中间件解析post application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}));

// app.use('/images', express.static(path.join(__dirname, './uploads')));

// 设置图片存储路径
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // ../uploads是将存放图片文件夹创建在node项目平级，./uploads会存放在node项目根目录下，需要提前建好文件夹，否则会报错
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`) // 文件名
    }
})

// 添加配置文件到muler对象。
var upload = multer({storage: storage});


/***
 * 图片上传 并将拼接好的图片url返回给前端，示例：（http://127.0.0.1:8000/images/xxxx.png）
 */
app.post('/api/upload', upload.single('file'), (req, res) => {
    console.log("💙💛上传图片成功", req.file)
    res.json({
        code: 200,
        data: {
            img: `http://127.0.0.1:8056/images/${req.file.filename}`
        },
        msg: '上传成功'
    })
})


// 启动服务器
app.listen(3000, () => {
    console.log('💙💛 服务在3000端口启动');
});
