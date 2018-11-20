/**
 * Created by 94326 on 2018/11/16.
 
 */
//引入express
const express = require('express');
//引入sha1模块
const sha1 = require('sha1');
//引入中间件模块
const handleRequest = require('./reply/handleRequest')
//引入config
const {url,appID} = require('./config')
//引入wechat
const Wechat = require('./wechat/wechat')
const wechat = new Wechat();
//创建app应用对象
const app = express();
//模板资源目录
app.set('views','views');
//模板引擎
app.set('view engine','ejs')


//search页面服务器
app.get('/search',async (req,res) => {

//jsapi_ticket
  const {ticket} = await wechat.fetchTicket()
  //随机字符串
  const noncestr = Math.random().toString().split('.')[1];
//获取时间戳
  const timestamp = parseInt(Date.now()/1000);
//url
//   const url = `${url}/search`
  const arr = [
    `noncestr=${noncestr}`,
    `jsapi_ticket=${ticket}`,
    `timestamp=${timestamp}`,
    `url=${url}/search`
  ]
  console.log(arr);
  const signature = sha1(arr.sort().join('&'))
  res.render('search',{
    signature,
    timestamp,
    noncestr,
    appID
  })
})
//调用中间件
app.use(handleRequest());
//监听端口号
app.listen(3000,err => {
  if (!err) console.log('服务器启动成功');
  else console.log(err);
})

