/**
 * Created by 94326 on 2018/11/18.
 */
//引入express
const express = require('express');
//引入sha1加密模块
const sha1 = require('sha1');
//引入自定义模块
const {getUserDataAsync,parseXMLDataAsync,formatMessage} = require('../format/method')
//引入个人配置信息
const {token} = require('../config')
//引入回复类型模块
const template = require('./template');
const reply = require('./reply')
module.exports = () => {
  //中间件
  return (async (req,res,next) => {
    //获取请求参数
    // console.log(req.query);
    const {signature, echostr, timestamp, nonce} = req.query;
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
      const message = formatMessage(result);
      let options = await reply(message);
      let replyMessage = template(options);
      console.log(replyMessage);
      res.send(replyMessage);
    }else {
      res.end('error');
    }
  })
}