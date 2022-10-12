// 导入 express模块
const express = require('express');

// 导入加密模块
const md5 = require('js-md5');

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
app.use(express.urlencoded({ extended: false }));

// 读取文件JSON数据
function read() {
  return fs.readFileSync(
    'mysql/table-data.json',
    'utf-8',
    function (err, data) {
      if (err) {
        console.log(err, '💛💙 初始化表格数据失败');
        return [];
      } else {
        return data;
      }
    }
  );
}

// 书写文件JSON数据
function write(data) {
  let sortData = data.sort(sortList('id'));
  fs.writeFile('mysql/table-data.json', JSON.stringify(data), (err) => {
    if (err) console.log(err, '💛💙 写入新增用户数据失败');
    else {
      console.log(
        JSON.parse(fs.readFileSync('mysql/table-data.json', 'utf8')),
        '💛💙 写入新增用户数据成功'
      );
    }
  });
}

// 数组对象进行排序 按照一个指定的key对数组对象进行排序
function sortList(propertyName) {
  var datalist = (object1, object2) => {
    var value1 = Number(object1[propertyName]);
    var value2 = Number(object2[propertyName]);
    if (value1 < value2) {
      return -1;
    } else if (value1 > value2) {
      return 1;
    } else {
      return 0;
    }
  };
  return datalist;
}

// 将一个数组拆分成几个一定个数的数组块
function chunk(arr, size) {
  var arr2 = [];
  for (var i = 0; i < arr.length; i = i + size) {
    arr2.push(arr.slice(i, i + size));
  }

  return arr2;
}

// 多条件筛选数据
function filterAnything(aim, name, age, gender) {
  let returnData = aim;
  if (name != '') {
    returnData = returnData.filter((item) => item.name == name);
    if (age != '') {
      returnData = returnData.filter((item) => item.age == age);
      if (gender != '') {
        returnData = returnData.filter((item) => item.gender == gender);
      }
    } else {
      if (gender != '') {
        returnData = returnData.filter((item) => item.gender == gender);
      }
    }
  } else {
    if (age != '') {
      returnData = returnData.filter((item) => item.age == age);
      if (gender != '') {
        returnData = returnData.filter((item) => item.gender == gender);
      }
    } else {
      if (gender != '') {
        returnData = returnData.filter((item) => item.gender == gender);
      }
    }
  }

  return returnData;
}

// 将json数据转化成blob数据传到前台
function reverseToBlob(fileName, data, keys) {
  let sheet = [];
  if (!!data && data.length > 0) {
    if (!sheet[fileName]) {
      sheet[fileName] = { sheet: [], value: [] };
    }
    sheet[fileName].sheet = keys;

    let values = []; //用来存储每一行json的数值，
    data.forEach((item, index) => {
      values = [];
      keys.forEach((key) => {
        values.push(item[key]);
      });
      sheet[fileName].value[index] = values;
    });
  }
  sheet[fileName].value.unshift(sheet[fileName].sheet);
  let fileSheet = sheet[fileName].value;
  let obj = [{ name: fileName, data: fileSheet }];
  let file = nodeXlsx.build(obj); //这一步将符合要求的数据拼成buffer
  return file;
}

// Login
app.get('/api/login', (req, res) => {
  console.log(req.query, '💙💛 前台登录获取的数据');

  let str = req.query.userName.concat(req.query.password);

  res.send({
    RESULT_MSG: '登录成功',
    RESULT_CODE: '0000',
    data: {
      access_token: md5(str),
    },
  });
});

// 启动服务器
app.listen(3002, () => {
  console.log('💙💛 小程序服务在3002端口启动');
});
