/**
 * Created by 94326 on 2018/11/16.
 */
//引入express
const express = require('express');
//引入sha1加密模块
const sha1 = require('sha1');


//引入自定义模块
const {getUserDataAsync,parseXMLDataAsync,formatMessage} = require('./format/method')
//创建app应用对象
const app = express();
//个人微信公众号配置信息
const config = {
  appID: 'wxc3bcaba30b42a8c7',
  appsecret: 'b62256ae4e9775086e20d9ee2fdb8df4',
  token: 'zdd0810test'
}
//中间件
app.use(async (req,res,next) => {
  //获取请求参数
  // console.log(req.query);
  const {signature, echostr, timestamp, nonce} = req.query;
  const {token} = config;
  //排序加密
  const str = sha1([timestamp, nonce, token].sort().join(''));
  if (req.method === 'GET') {
    //验证微信签名,是否是来自微信服务器
    if (signature === str) {
      //说明消息来自于微信服务器
      res.end(echostr);
    } else {
      //说明消息不来自于微信服务器
      res.end('error');
    }
  }else if (req.method === 'POST') {
    //验证微信签名,是否是来自微信服务器
    if (signature !== str) {
      //说明消息不是来自于微信服务器
      res.end('error');
      return;
    }
    //用户发送的消息在请求体中
    //封装一个获取请求体的方法
    const xmlData = await getUserDataAsync(req);
    // console.log(result);
    //封装一个将xml内容转化为对象的方法
    const result = await parseXMLDataAsync(xmlData);

    //格式转换
    const content = formatMessage(result);
    //收到消息
    const message = content.Content;
    //初始化一个data
    let data = ''

    if (message === '1') {
      data = '冬哥最帅';
    }else if (message === '2') {
      data = '天冷了,请穿衣服';
    }else if (message === '3') {
      data = '你来自哪里';
    }else if (message === '4') {
      data = '冬哥哈哈';
    }else if (message === '5') {
      data = '冬哥吃饭';
    }else if (message.includes('6')) {
      data = '冬哥入寝';
    }else{
      data = '我听不懂你在说什么?'
    }

    //数据转为xml返回响应
    let replyMessage = `<xml>
      <ToUserName><![CDATA[${content.FromUserName}]]></ToUserName>
      <FromUserName><![CDATA[${content.ToUserName}]]></FromUserName>
      <CreateTime>${Date.now()}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${data}]]></Content>
      </xml>`;
    // console.log(replyMessage);
    res.send(replyMessage);

  }else {
    res.end('error');
  }
})

//监听端口号
app.listen(3000,err => {
  if (!err) console.log('服务器启动成功');
  else console.log(err);
})
