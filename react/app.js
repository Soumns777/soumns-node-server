// 1.导入 express模块
const express = require('express');

// 读取文件
const fs = require('fs');

// 创建 web服务器
const app = express();

// 允许跨域资源共享
// const cors = require('cors');
//
//
// app.use(cors({
//     credentials: true, origin: ['http://localhost:3030', 'http://localhost:3000',], // web前端服务器地址
// }));

//配置解析 application/json 格式数据的内置中间件
app.use(express.json());

//配置中间件解析post application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}));

// 书写文件JSON数据
function writeData(data, type) {
    if (type == 'one') {
        let _data = readData()

        if (_data.length <= 0) {
            _data = []
        } else {
            _data = JSON.parse(_data)
        }

        _data.unshift(data)

        fs.writeFileSync('mysql/todo-list.json', JSON.stringify(_data), (err) => {
            if (err) console.log(err, '💛💙 写入新增用户数据失败'); else {
                console.log("💙💛写入数据成功:", readData())
            }
        });
    } else {
        fs.writeFileSync('mysql/todo-list.json', JSON.stringify(data), (err) => {
            if (err) console.log(err, '💛💙 写入新增用户数据失败'); else {
                console.log("💙💛写入数据成功:", readData())
            }
        });

    }


}


// 读取文件JSON数据
function readData() {
    return fs.readFileSync('mysql/todo-list.json', 'utf-8', function (err, data) {
        if (err) {
            console.log(err, '💛💙 初始化表格数据失败');
            return [];
        } else {
            console.log(Object.prototype.toString.call(data).slice(8, -1))
            return data
        }
    });
}


// 新增一条代办
app.post('/add', (req, res) => {
    writeData(req.body, 'one')

    if (readData().length >= 0) {
        res.send({
            RESULT_MSG: '新增成功', RESULT_CODE: '0000', RESULT_DATA: JSON.parse(readData())
        })
    }
});


// 查看所有代办
app.post('/init', (req, res) => {
    const _data = readData().length <= 0 ? [] : JSON.parse(readData())

    console.log(req.url, "💙💛url")

    res.send({
        RESULT_MSG: '初始化成功', RESULT_CODE: '0000', RESULT_DATA: _data
    })
});

// 删除当前代办
app.post('/del', (req, res) => {
    let _data = readData().length <= 0 ? [] : JSON.parse(readData())

    const {id} = req.body

    const _data2 = _data.filter(item => {
        return item.id != id
    })

    writeData(_data2, 'all')

    res.send({
        RESULT_MSG: '初始化成功', RESULT_CODE: '0000', RESULT_DATA: _data2
    })
});


// 更新代办状态
app.post('/update', (req, res) => {
    const {id, isDone} = req.body;
    const _data = readData().length <= 0 ? [] : JSON.parse(readData())

    _data.map(item => {
        if (item.id == id) {
            item.isDone = isDone;
        }
    })

    writeData(_data, 'all')

    res.send({
        RESULT_MSG: '初始化成功', RESULT_CODE: '0000', RESULT_DATA: _data
    })
});

// 删除所有代办
app.post('/del/all', (req, res) => {
    const {ids} = req.body;
    let _data = readData().length <= 0 ? [] : JSON.parse(readData())

    _data = _data.filter(item => {
        return item.isDone == true
    })

    writeData(_data, 'all')

    res.send({
        RESULT_MSG: '初始化成功', RESULT_CODE: '0000', RESULT_DATA: _data
    })
});

// 启动服务器
app.listen(3030, () => {
    console.log('💙💛 服务在3030端口启动');
});
