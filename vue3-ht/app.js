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
      routeList: [
        {
          id: 1,
          pid: 0,
          name: 'home',
          path: '/home',
          title: '首页',
          icon: 'home-filled',
        },
        {
          id: 2,
          pid: 0,
          name: 'test',
          path: '/test',
          title: '测试',
          icon: 'goblet-square-full',
        },
        {
          id: 3,
          pid: 2,
          name: 'test1',
          path: '/test1',
          title: '测试1',
          icon: 'moon-night',
        },
        {
          id: 4,
          pid: 2,
          name: 'test2',
          path: '/test2',
          title: '测试2',
          icon: 'open',
        },
        {
          id: 5,
          pid: 2,
          name: 'test3',
          path: '/test3',
          title: '测试3',
          icon: 'operation',
        },
        {
          id: 6,
          pid: 0,
          name: 'table',
          path: '/table',
          icon: 'message-box',
          title: '表格',
        },
        {
          id: 7,
          pid: 6,
          name: 'excel',
          title: 'Excel',
          path: '/excel',
          icon: 'orange',
        },
        {
          id: 8,
          pid: 0,
          name: 'dataScreen',
          title: '数据大屏',
          path: '/dataScreen',
          icon: 'histogram',
        },
      ],
    },
  });
});

// Init TableData
app.post('/api/init/table-data', (req, res) => {
  console.log(req.body, '💛💙 search init table params');
  if (req.body.uName) {
    if (req.body.uName === 'admin') {
      let reverseData = chunk(JSON.parse(read()), req.body.pageSize)[
        req.body.pageNum - 1
      ];
      const { name, age, gender } = req.body.search;

      console.log(reverseData, '💛💙 reverseData');

      if (reverseData && reverseData.length > 0) {
        if (name || age || gender) {
          console.log(
            filterAnything(JSON.parse(read()), name, age, gender).length,
            '💛💙 search total'
          );
          return res.send({
            RESULT_MSG: '💛💙 搜索数据成功',
            RESULT_CODE: '0000',
            data: chunk(
              filterAnything(JSON.parse(read()), name, age, gender),
              req.body.pageSize
            )[req.body.pageNum - 1],
            total: filterAnything(JSON.parse(read()), name, age, gender).length,
          });
        }

        // console.log(JSON.parse(read()).length, '💛💙 init total');
        res.send({
          RESULT_MSG: '💛💙初始化表格数据成功',
          RESULT_CODE: '0000',
          data: reverseData,
          total: JSON.parse(read()).length,
        });
      } else {
        res.send({
          RESULT_MSG: '💛💙当前页暂无数据',
          RESULT_CODE: '0000',
          data: [],
          total: JSON.parse(read()).length,
        });
      }
    } else {
      res.send({
        RESULT_MSG: '用户错误',
        RESULT_CODE: '0001',
        RESULT_DATA: [],
      });
    }
  } else {
    res.send({
      RESULT_MSG: '请传入需要初始化的用户',
      RESULT_CODE: '0002',
    });
  }
});

// 新增用户
app.post('/api/add-user', (req, res) => {
  let reverseData = JSON.parse(read());
  reverseData.push(
    Object.assign(req.body, {
      id: (Number(reverseData[reverseData.length - 1].id) + 1).toString(),
    })
  );

  write(reverseData);
  res.send({
    RESULT_MSG: '新增用户成功',
    RESULT_CODE: '0000',
  });
});

// 删除用户
app.post('/api/del-user', (req, res) => {
  // console.log(req.body, '💛💙 批量删除');
  const type = Object.prototype.toString.call(req.body).slice(8, -1);

  let transferData = JSON.parse(read());

  if (transferData && transferData.length > 0) {
    if (type == 'Object') {
      if (transferData.find((item) => item.id == req.body.id)) {
        transferData = transferData.filter((item) => item.id != req.body.id);
        write(transferData);
        res.send({
          RESULT_MSG: '删除用户成功',
          RESULT_CODE: '0000',
        });
      } else {
        res.send({
          RESULT_MSG: '请不要删除不存在的用户',
          RESULT_CODE: '0002',
        });
      }
    } else if (type == 'Array') {
      req.body.forEach((item) => {
        if (transferData.find((item1) => item1.id == item.id)) {
          transferData = transferData.filter((item2) => item2.id != item.id);
        }
      });

      write(transferData);
      res.send({
        RESULT_MSG: '测试批量删除用户成功',
        RESULT_CODE: '0000',
      });
    }
  } else {
    res.send({
      RESULT_MSG: '测试批量删除用户失败',
      RESULT_CODE: '0001',
    });
  }
});

// 编辑用户
app.post('/api/edit-user', (req, res) => {
  let transferData = JSON.parse(read());

  if (transferData && transferData.length > 0) {
    let idx = transferData.findIndex((item) => item.id == req.body.id);

    if (idx >= 0) {
      transferData[idx] = req.body;

      write(transferData);
      res.send({
        RESULT_MSG: '编辑用户成功',
        RESULT_CODE: '0000',
      });
    } else {
      res.send({
        RESULT_MSG: '请不要编辑不存在的用户',
        RESULT_CODE: '0002',
      });
    }
  } else {
    res.send({
      RESULT_MSG: '编辑用户用户失败',
      RESULT_CODE: '0001',
    });
  }
});

// 导出数据
app.post('/api/export-user', (req, res) => {
  try {
    const { fileName, data, keys } = req.body;
    let file = reverseToBlob(fileName, JSON.parse(read()), keys);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats'); //setHeader一定要写在生成buffer的下面
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' +
        ` ${encodeURIComponent(fileName)}_${Date.now()}.xlsx`
    ); //不能使用中文
    res.writeHead(200);
    res.end(file);
  } catch (err) {
    return res.status(500).json({ success: false, data: err.message });
  }
});

var multer = require('multer');

// 批量新增用户
app.post('/api/import-user', uploadFile, (req, res) => {
  try {
    var file = req.file;
    //以下代码得到文件后缀
    name = file.originalname;
    nameArray = name.split('');
    var nameMime = [];
    l = nameArray.pop();
    nameMime.unshift(l);
    while (nameArray.length != 0 && l != '.') {
      l = nameArray.pop();
      nameMime.unshift(l);
    }
    //Mime是文件的后缀
    Mime = nameMime.join('');

    //重命名文件 加上文件后缀
    fs.renameSync(
      './upload/' + file.filename,
      './upload/' + file.filename + Mime
    );

    let filepath = './upload/' + file.filename + Mime;

    var list = nodeXlsx.parse(filepath);

    // console.log(list[0].data, '💛💙 读取表格数据');

    let sheetData = list[0].data;
    // 建立空数组，用于放置数据
    let testList = [];
    // testTitle也是个数组，用于读取标题行
    let testTitle = sheetData[0];
    // console.log(testTitle) // 表头

    sheetData.forEach((item, index) => {
      //整一个新对象
      var NewVot = {};
      if (index == 0) {
        return;
      } else {
        for (var i = 0; i < testTitle.length; i++) {
          NewVot[testTitle[i]] = item[i];
        }
        testList.push(NewVot);
      }
    });

    let reverseData = [...JSON.parse(read()), ...testList];
    write(reverseData);
    res.send({
      RESULT_MSG: '💛💙导入成功',
      RESULT_CODE: '0000',
    });
  } catch (err) {
    return res.status(500).json({ success: false, data: err.message });
  }
});

// 自定义中间件
function uploadFile(req, res, next) {
  //dest 值为文件存储的路径;single方法,表示上传单个文件,参数为表单数据对应的key
  let upload = multer({ dest: 'upload/' }).single('file');
  upload(req, res, (err) => {
    //打印结果看下面的截图
    if (err) {
      res.send('err:' + err);
    } else {
      //将文件信息赋值到req.body中，继续执行下一步
      req.body.file = req.file.filename;
      next();
    }
  });
}

// upload image
app.post('/api/upload-images', (req, res) => {
  console.log(req, '💛💙 上传图片');

  res.send({
    RESULT_MSG: '上传成功',
    RESULT_CODE: '0000',
  });
});

// 启动服务器
app.listen(3000, () => {
  console.log('💙💛 服务在3000端口启动');
});
