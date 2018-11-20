/**
 * Created by 94326 on 2018/11/17.
 */
module.exports = (options) => {
  let result = `<xml>
      <ToUserName><![CDATA[${options.toUserName}]]></ToUserName>
      <FromUserName><![CDATA[${options.fromUserName}]]></FromUserName>
      <CreateTime>${options.createTime}</CreateTime>
      <MsgType><![CDATA[${options.MsgType}]]></MsgType>`;
  if (options.MsgType === 'text') {
    result += `<Content><![CDATA[${options.content}]]></Content>`
  }else if (options.MsgType === 'image') {
    result += `<Image><MediaId><![CDATA[${options.mediaId}]]></MediaId></Image>`
  }else if (options.MsgType === 'voice') {
    result += `<Voice><MediaId><![CDATA[${options.mediaId}]]></MediaId></Voice>`
  }else if (options.MsgType === 'video') {
    result += `<Video>
                <MediaId><![CDATA[${options.mediaId}]]]></MediaId>
                <Title><![CDATA[${options.title}]]]></Title>
                <Description><![CDATA[${options.description}]]></Description>
              </Video>`
  }else if (options.MsgType === 'music') {
    result += `<Music>
                <Title><![CDATA[${options.title}]]></Title>
                <Description><![CDATA[${options.description}]]></Description>
                <MusicUrl><![CDATA[${options.musicUrl}]]></MusicUrl>
                <HQMusicUrl><![CDATA[${options.hqMusicUrl}l]]></HQMusicUrl>
                <ThumbMediaId><![CDATA[${options.mediaId}]]></ThumbMediaId>
              </Music>`
  }else if (options.MsgType === 'news') {
    result += `<ArticleCount>1</ArticleCount>
              <Articles>
                <item>
                  <Title><![CDATA[${options.title}]]></Title>
                   <Description><![CDATA[${options.description}]]></Description>
                   <PicUrl><![CDATA[${options.picUrl}]]></PicUrl>
                   <Url><![CDATA[${options.url}]]></Url>
                 </item>
               </Articles>`
  }
  result += '</xml>';
  return result;
}
