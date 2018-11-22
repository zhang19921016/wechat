/**
 * Created by 94326 on 2018/11/20.
 */
const express = require('express');
//引入sha1模块
const sha1 = require('sha1');
//引入config
const {url,appID} = require('../config')
//引入wechat
const Wechat = require('../wechat/wechat')
const wechat = new Wechat();
const Trailers = require('../models/trailers');

const router = new express.Router();

//search页面服务器
router.get('/search',async (req,res) => {
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
router.get('/movie', async (req, res) => {
  //去数据库中找到所有数据
  const movies = await Trailers.find({}, {_id: 0, __v: 0, image: 0, src: 0, cover: 0})

  res.render('movie', {movies, url});
})

module.exports = router;