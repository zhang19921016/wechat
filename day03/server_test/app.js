/**
 * Created by 94326 on 2018/11/16.
 */
//引入express
const express = require('express');
//引入中间件模块
const handleRequest = require('./reply/handleRequest')
//创建app应用对象
const app = express();
//调用中间件
app.use(handleRequest());
//监听端口号
app.listen(3000,err => {
  if (!err) console.log('服务器启动成功');
  else console.log(err);
})

