/**
 * Created by 94326 on 2018/11/20.
 */
const db = require('../db');
const crawler = require('./crawler');
const save = require('./save');
//引入定义的上传七牛的方法
const upload = require('./upload');
  // console.log(upLoad);

(async () => {
  await db;
  // const movies = await crawler();
  // console.log(movies);
  // await save(movies);
  await upload();
})();