/**
 * Created by 94326 on 2018/11/17.
 */
const {url} = require('../config');
module.exports = (message) => {
  //初始化一个data
  let data = '';
  //初始化一个option
  let options = {
    toUserName:message.FromUserName,
    fromUserName:message.ToUserName,
    createTime:Date.now(),
    MsgType: 'text'
  }

  if (message.MsgType === 'text') {
    if (message.Content === '1') {
      data = '冬哥最帅';
    }else if (message.Content.includes('2')) {
      options.MsgType = 'news';
      options.title = '图文测试';
      options.description = '测试一波';
      options.picUrl = 'https://b-gold-cdn.xitu.io/v3/static/img/logo.a7995ad.svg';
      options.url = 'https://juejin.im/explore/all';

    }else if (message.Content === '3') {
      data = `<a href="${url}/search">search页面</a>`;
    }else{
      data = '我听不懂你在说什么?'
    }
  }else if (message.MsgType === 'voice') {
    data = `语音识别结果为:${message.Recognition}`;
  }else if (message.MsgType === 'location') {
    data = `纬度：${message.Location_X}经度：${message.Location_Y}地图的缩放大小：${message.Scale} 位置详情：${message.Label}`;
  }else if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      //订阅事件
      if (message.EventKey) {
        data = '欢迎你扫码订阅'
      }else{
        data = '欢迎您的订阅';
      }

    }else if (message.Event === 'unsubscribe') {

    }else if (message.Event === 'LOCATION') {
      data = `纬度：${message.Latitude}经度：${message.Longitude}位置详情:${message.Precision}`;
    }else if (message.Event === 'CLICK') {
      data = `返回:${message.EventKey}`
    }
  }

  options.content = data;
  return options;
}