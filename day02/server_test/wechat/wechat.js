/**
 * Created by 94326 on 2018/11/17.
 */
/*
 发送请求的包
 npm install --save request
 npm install --save npm install --save request */

//引入发送请求的包
const rp = require('request-promise-native');
//引入fs
const {writeFile, readFile} = require('fs');
//引入confix
const {appID,appsecret} = require('../config')
//引入menu
const menu = require('./menu')
//封装一个类
class Wechat {
  //获取access_token
  async getAccessToken () {
    //定义一个请求地址
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
    //发送请求
    const result = await rp({method:'GET',url,json:true});
    console.log(result);
    //设置过期时间
    result.expires_in = Date.now() + 7200000 - 300000;
    return result;
  }
  //保存access_token
  saveAccessToken (filePath,accessToken) {
    return new Promise((resolve,reject) => {
      writeFile(filePath,JSON.stringify(accessToken),err => {
        if (!err) {
          resolve();
        }else{
          reject('这是saveAccessToken时的错误' + err);
        }
      })
    })
  }
  //读取access_token
  readAccessToken (filePath) {
    return new Promise((resolve,reject) => {
      readFile(filePath,(err,data) => {
        if (!err) {
          const result = JSON.parse(data.toString())
          resolve(result);
        }else{
          reject('这是readAccessToken时的错误' + err);
        }
      })
    })
  }
  //access_token是否过期
  isValidAccessToken ({expires_in}) {
    return Date.now() < expires_in;
  }
  //返回有效的access_token
  fetchAccessToken () {
    if (this.access_token && this.expires_in && this.isValidAccessToken(this)) {
      console.log('这是非第一次')
      return Promise.resolve({access_token:this.access_token,expires_in:this.expires_in});
    }
    return this.readAccessToken('accessToken.txt')
      .then(async res => {
        //本地有access_token
        //判断是否过期
        if (this.isValidAccessToken(res)) {
          //没过期
          return res;
        }else{
          //过期
          const result =await this.getAccessToken();
          await this.saveAccessToken('accessToken.txt',result);
          return result;
        }
      })
      .catch(async err => {
        const result =await this.getAccessToken();
        await this.saveAccessToken('accessToken.txt',result);
        return result;
      })
      .then(res => {
        this.access_token = res.access_token;
        this.expires_in = res.expires_in;
        return Promise.resolve(res);
      })
  }
  //自定义创建菜单
  async createMenu (menu) {
    //获取access_token
    const {access_token} = await this.fetchAccessToken();
    //定义一个url地址
    const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${access_token}`
    //发送请求
    const result = await rp({method:'POST',url,json:true,body:menu});
    return result;
  }
  //删除菜单
  async deleteMenu () {
    //获取access_token
    const {access_token}  = await this.fetchAccessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${access_token}`
    //发送请求
    const result = rp({method:'GET',url,json:true});
    return result;
  }
}



(async () => {
  const w = new Wechat();
  let result = await w.deleteMenu();
  console.log(result);
  result = await w.createMenu(menu);
  console.log('==============');
  console.log(result);

})()
