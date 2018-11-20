/**
 * Created by 94326 on 2018/11/20.
 */
const qiniu = require("qiniu");

var accessKey = 'z5arqUEVb8tFDw7lN37RrZoPAYSUOIs0hau2srvM';
var secretKey = 'OiwDyZX1_kMXqGQ8tvThhc35xQelxSTqKtM8izlw';
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var config = new qiniu.conf.Config();
//config.useHttpsDomain = true;
//config.zone = qiniu.zone.Zone_z1;
var bucketManager = new qiniu.rs.BucketManager(mac, config);
// var resUrl = 'http://devtools.qiniu.com/qiniu.png';
var bucket = 'zhangdongdong';
// var key = "qiniu.png";

module.exports = (resUrl,key) => {
  return new Promise((resolve,reject) => {
    bucketManager.fetch(resUrl, bucket, key, function(err, respBody, respInfo) {
      if (err) {
        console.log(err);
        reject();
        //throw err;
      } else {
        if (respInfo.statusCode == 200) {
              resolve();
        }
      }
    });
  })
}
