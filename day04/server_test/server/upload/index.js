/**
 * Created by 94326 on 2018/11/20.
 */
//引入nanoid
const nanoid = require('nanoid');
//引入toQiNiu
const upload = require('./toQiNiu')
//引入Trailers数据库
const Trailers = require('../../models/trailers')

module.exports = async () => {
  //先找到所有的数据
  const movies = await Trailers.find({})
  for (var i = 0; i < movies.length; i++) {
    let movie = movies[i];
    const coverKey = nanoid(10) + '.jpg';
    const imageKey = nanoid(10) + '.jpg';
    const videoKey = nanoid(10) + '.mp4';
    await Promise.all([upload(movie.cover, coverKey),upload(movie.image, imageKey), upload(movie.src, videoKey)]);

    movie.coverKey = coverKey;
    movie.imageKey = imageKey;
    movie.videoKey = videoKey;

    await movie.save();

  }
}
