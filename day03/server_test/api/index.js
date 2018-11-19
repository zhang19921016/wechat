/**
 * api接口地址
 */
const path ='https://api.weixin.qq.com/cgi-bin/'
module.exports = {
  access_token:`${path}token?grant_type=client_credential&`,
  menu:{
    creat:`${path}menu/create?`,
    delete:`${path}menu/delete?`
  },
  tag:{
    create:`${path}tags/create?`,
    get:`${path}tags/get?`,
    update:`${path}tags/update?`,
    delete:`${path}tags/delete?`,

  }
}