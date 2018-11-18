/**
 * Created by 94326 on 2018/11/16.
 */
//引入一个将xml转换为js的模板
const parseString = require('xml2js').parseString;
module.exports = {
  getUserDataAsync (req) {
    return new Promise((resolve) => {
      let result = '';
      req
        .on('data', (data) => {
          result += data.toString();
        })
        .on('end', () => {
          console.log('数据已经接收完毕');
          resolve(result);
        })
    })
  },
  parseXMLDataAsync (xmlData) {
    return new Promise((resolve, reject) => {
      parseString(xmlData, {trim: true}, (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject('parseXMLDataAsync方法出了问题：' + err);
        }
      })
    })
  },
  formatMessage ({xml}) {
    let result = {};
    //遍历对象
    for (let key in xml) {
      //获取属性值
      let value = xml[key];
      //去掉[]
      result[key] = value[0];
    }

    return result;
  }
}