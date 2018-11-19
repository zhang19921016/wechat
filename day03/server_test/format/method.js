/**
 * Created by 94326 on 2018/11/16.
 */
//引入一个将xml转换为js的模板
const parseString = require('xml2js').parseString;
//引入fs
const {writeFile, readFile} = require('fs');
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
  },
  //读写access_token和ticket
  //读
  writeFileAsync (filePath,data) {
    return new Promise((resolve,reject) => {
      writeFile(filePath,JSON.stringify(data),err => {
        if (!err) {
          resolve();
        }else{
          reject('这是writeFileAsync时的错误' + err);
        }
      })
    })
  },
  //写
  readFileAsync (filePath) {
    return new Promise((resolve,reject) => {
      readFile(filePath,(err,data) => {
        if (!err) {
          const result = JSON.parse(data.toString())
          resolve(result);
        }else{
          reject('这是readFileAsync时的错误' + err);
        }
      })
    })
  }
}