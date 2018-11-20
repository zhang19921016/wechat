/**
 * Created by 94326 on 2018/11/20.
 */
const db = require('../db');
const crawler = require('./crawler');
const save = require('./save');

(async () => {
  await db;
  const movies = await crawler();
  console.log(movies);

  await save(movies);
})()