/**
 * Created by 94326 on 2018/11/17.
 */
const {url} = require('../config');
module.exports = async message => {
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
    if (message.Content === '预告片') {
      options.MsgType = 'news';
      options.title = '冬哥影院';
      options.description = '最新电影及时看!';
      options.picUrl = 'https://b-gold-cdn.xitu.io/v3/static/img/logo.a7995ad.svg'
      options.url = `${url}/movie`
    }else if (message.Content === '语音识别') {
      options.MsgType = 'news';
      options.title = '语音识别电影';
      options.description = '更加方便!';
      options.picUrl = 'https://b-gold-cdn.xitu.io/v3/static/img/logo.a7995ad.svg'
      options.url = `${url}/search`
    }else {
     //定义请求地址
      const url = `http://api.douban.com/v2/movie/search?q=${message.Content}&count=5`
      //发送请求
      const {subject} = await rp({method: 'GET', url, json: true, qs: {count: 1, q: message.Content}});
      //设置options
      options.MsgType = 'news';
      options.title = subjects[0].title;
      options.description = `评分：${subjects[0].rating.average}`;
      options.picUrl = subjects[0].images.small;
      options.url = subjects[0].alt;
    }
  }else if (message.MsgType === 'voice') {
    //定义请求地址
    const url = `http://api.douban.com/v2/movie/search?q=${message.Recognition}&count=5`
    //发送请求
    const {subject} = await rp({method: 'GET', url, json: true, qs: {count: 1, q: message.Recognition}});
    //设置options
    options.MsgType = 'news';
    options.title = subjects[0].title;
    options.description = `评分：${subjects[0].rating.average}`;
    options.picUrl = subjects[0].images.small;
    options.url = subjects[0].alt;
  }else if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      //订阅事件
      if (message.EventKey) {
        data = `欢迎您订阅我们的公众号;\n
回复'预告片',即可观看最新电影资源/n
回复'语音识别',即可识别电影名,搜索海量电影\n
回复任意文本,即可搜索最新资源\n
回复任意语音,搜索电影\n
也可以直接点击<a href="${url}/search">语音识别</a>来跳转我们的网页`;
      }else{
        data = `欢迎您订阅我们的公众号;\n
回复'预告片',即可观看最新电影资源\n
回复'语音识别',即可识别电影名,搜索海量电影\n
回复任意文本,即可搜索最新资源\n
回复任意语音,搜索电影\n
也可以直接点击<a href="${url}/search">语音识别</a>来跳转我们的网页`;
      }

    }else if (message.Event === 'unsubscribe') {
      console.log('又少了一个关注');
    } else if (message.Event === 'CLICK') {
      if (message.EventKey === 'help') {
        data = `欢迎您订阅我们的公众号;\n
回复'预告片',即可观看最新电影资源\n
回复'语音识别',即可识别电影名,搜索海量电影\n
回复任意文本,即可搜索最新资源\n
回复任意语音,搜索电影\n
也可以直接点击<a href="${url}/search">语音识别</a>来跳转我们的网页`;
      }
    }
  }
  options.content = data;
  return options;
}