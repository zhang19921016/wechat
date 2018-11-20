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
const {writeFile, readFile, createReadStream} = require('fs');
//引入confix
const {appID,appsecret} = require('../config')
//引入menu
const menu = require('./menu')
//引入api
const api = require('../api')
//引入读写功能
const {writeFileAsync,readFileAsync} = require('../format/method')

//封装一个类
class Wechat {
  //获取access_token
  async getAccessToken () {
    //定义一个请求地址
    const url = `${api.access_token}appid=${appID}&secret=${appsecret}`;
    //发送请求
    const result = await rp({method:'GET',url,json:true});
    console.log(result);
    //设置过期时间
    result.expires_in = Date.now() + 7200000 - 300000;
    return result;
  }
  //保存access_token
  saveAccessToken (filePath,data) {
    return writeFileAsync (filePath,data)

  }
  //读取access_token
  readAccessToken (filePath) {
    return readFileAsync (filePath);
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

  async getTicket () {
    //获取ticket
    const {access_token} = await this.fetchAccessToken();
    //定义请求地址
    const url = `${api.ticket}access_token=${access_token}`;
    //发送请求
    const result = await rp({method: 'GET', url, json: true});
    return {
      ticket: result.ticket,
      ticket_expires_in: Date.now() + 7200000 - 300000
    };
  }

  saveTicket (filePath, ticket) {
    return writeFileAsync(filePath, ticket);
  }

  readTicket (filePath) {
    return readFileAsync(filePath);
  }

  isValidTicket ({ticket_expires_in}) {
    return Date.now() < ticket_expires_in;
  }

  fetchTicket () {
    if (this.ticket && this.ticket_expires_in && this.isValidTicket(this)) {
      console.log('非第一次');
      return Promise.resolve({ticket: this.ticket, ticket_expires_in: this.ticket_expires_in});
    }

    return this.readTicket('./ticket.txt')
      .then(async res => {
        if (this.isValidTicket(res)) {
          //没有过期，直接使用
          //作为then函数返回值， promise对象包着res
          return res;
        } else {
          //过期了
          const ticket = await this.getTicket();
          await this.saveTicket('ticket.txt', ticket);
          //作为then函数返回值， promise对象包着accessToken
          return ticket;
        }
      })
      .catch(async err => {
        const ticket = await this.getTicket();
        await this.saveTicket('ticket.txt', ticket);
        return ticket;
      })
      .then(res => {
        //不管上面成功或者失败都会来到这
        this.ticket = res.ticket;
        this.ticket_expires_in = res.ticket_expires_in;

        return Promise.resolve(res);
      })

  }
  //自定义创建菜单
  async createMenu (menu) {
   try{
     //获取access_token
     const {access_token} = await this.fetchAccessToken();
     //定义一个url地址
     const url = `${api.menu.creat}access_token=${access_token}`
     //发送请求
     const result = await rp({method:'POST',url,json:true,body:menu});
     return result;
   }catch(e){
     console.log('这是createMenu出的错误'+e);
   }
  }
  //删除菜单
  async deleteMenu () {
    try{
      //获取access_token
      const {access_token}  = await this.fetchAccessToken();
      const url = `${api.menu.delete}access_token=${access_token}`
      //发送请求
      const result = rp({method:'GET',url,json:true});
      return result;
    }catch(e){
      console.log('这是deleteMenu出的错误'+e);
    }
  }
  //用户管理
  //创建用户标签
  async createUsersTag (name) {
    try{
      //获取access_token
      const {access_token} = await this.fetchAccessToken();
      //定义一个请求地址
      const url = `${api.tag.create}access_token=${access_token}`
      //发送请求
      const result = await rp({method:'POST',url,json:true,body:{tag:{name}}});
      return result;
    }catch(e){
      console.log('这是createUsersTa出的错误'+e);
    }
  }
  //获取公众号已创建的标签
  async getUsersTag () {
   try{
     //获取access_token
     const {access_token} = await this.fetchAccessToken();
     //定义一个请求地址
     const url = `${api.tag.get}access_token=${access_token}`
     //发送请求
     const result = await rp({method:'GET',url,json:true});
     return result;
   }catch(e){
     console.log('这是getUsersTag出的错误'+e);
   }
  }
  //编辑标签
  async updateUsersTag (id,name) {
   try{
     //获取access_token
     const {access_token} = await this.fetchAccessToken();
     //定义一个请求地址
     const url = `${api.tag.update}access_token=${access_token}`
     //发送请求
     const result = await rp({method:'POST',url,json:true,body:{tag:{id,name}}});
     return result;
   }catch(e){
     console.log('这是updateUsersTag出的错误'+e);
   }
  }
  //删除标签
  async deleteUsersTag (id) {
    try{
      //获取access_token
      const {access_token} = await this.fetchAccessToken();
      //定义一个请求地址
      const url = `${api.tag.delete}access_token=${access_token}`
      //发送请求
      const result = await rp({method:'POST',url,json:true,body:{tag:{id}}});
      return result;
    }catch(e){
      console.log('这是deleteUsersTag出的错误'+e);
    }
  }
  //获取标签下粉丝列表
  async getUsersByTag (tagid,next_openid='') {
    try{
      //获取access_token
      const {access_token} = await this.fetchAccessToken();
      //定义一个请求地址
      const url = `${api.tag.get}access_token=${access_token}`
      //发送请求
      const result = await rp({method:'POST',url,json:true,body:{tagid,next_openid}});
      return result;
    }catch(e){
      console.log('这是getUsersByTag出的错误'+e);
    }
  }
  //群发消息
  async sendAllByTag (option) {
    try{
      //获取access_token
      const {access_token} = await this.fetchAccessToken();
      //定义一个请求地址
      const url = `${api.message}access_token=${access_token}`
      //发送请求
      const result = await rp({method:'POST',url,json:true,body:option});
      return result;
    }catch(e){
      console.log('这是sendAllByTag出的错误'+e);
    }
  }
  //新增永久素材
  async uploadMaterial (type, material, body) {
    try {
      //获取access_token
      const {access_token} = await this.fetchAccessToken();
      //定义请求地址
      let url = '';
      let options = {method: 'POST', json: true};

      if (type === 'news') {
        url = `${api.media.upNews}access_token=${access_token}`;
        //请求体参数
        options.body = material;
      } else if (type === 'pic') {
        url = `${api.media.upLoadimg}access_token=${access_token}`;
        //以form表单上传
        options.formData = {
          media: createReadStream(material)
        }
      } else {
        url = `${api.media.upLoadOthers}access_token=${access_token}&type=${type}`;
        //以form表单上传
        options.formData = {
          media: createReadStream(material)
        }

        if (type === 'video') {
          options.body = body;
        }

      }
      options.url = url;
      //发送请求
      return await rp(options);

    } catch (e) {
      return 'uploadMaterial方法出了问题' + e;
    }
  }
}

(async () => {
  const w = new Wechat();
  //获取media_id
  const result1 = await w.uploadMaterial('image','./1.jpg')
  //获取url
  const result2 = await w.uploadMaterial('pic','./2.jpg')
  //上传图文消息
  const result3 = await w.uploadMaterial('news',{
    "articles": [{
      "title": '风景独好',
      "thumb_media_id": result1.media_id,
      "author": '张冬冬',
      "digest": '测试',
      "show_cover_pic": 1,
      "content": `<!DOCTYPE html>
                  <html lang="en">
                  <head>
                    <meta charset="UTF-8">
                    <title>Title</title>
                  </head>
                  <body>
                    <h1>风景</h1>
                    <img src="${result2.url}">
                  </body>
                  </html>`,
      "content_source_url":'https://www.douban.com/interest/2/16/',
      "need_open_comment":1,
      "only_fans_can_comment":1
     }
    ]
  })
  //删除菜单，再重新创建
  let result = await w.deleteMenu();
  console.log(result);
  result = await w.createMenu(require('./menu'));
  console.log(result);
})()




/*
(async () => {
  const w = new Wechat();
  /!*const resule = await w.sendAllByTag ({
    "filter":{
      "is_to_all":false,
      "tag_id":2
    },
    "text":{
      "content":"到不了的都是远方"
    },
    "msgtype":"text"
  })
  console.log(resule);*!/

})()
*/

module.exports = Wechat;
