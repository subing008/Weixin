var express = require('express');
var router = express.Router();
var crypto = require('crypto');

function Sha1Encrypt(str){
  var md5hash = crypto.createHash('sha1');
  md5hash.update(str);
  str = md5hash.digest('hex');
  return str;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MyServer' });
});

var token = "79faf82271944fe38c4f1d99be71bc9c";
router.get('/weixin',function(req, res, next){
  var query = req.query;
  var signature = query.signature;
  var timestamp = query['timestamp'];
  var nonce = query.nonce;
  var echostr = query.echostr;

  if ( !signature || ! timestamp || !nonce || !echostr) {
    return res.send("Invalid token!");
  }

  var array = new Array(nonce,timestamp,token);
  array.sort();

  var arraystr = array[0] + array[1] + array[2];
  var sinat = Sha1Encrypt(arraystr);
  if (sinat == signature) {
    res.send(echostr);
  } else {
    res.send("Invalid token!");
  }
});

router.post('/weixin',function(req,res,next){
  var tousername = req.body.xml.tousername[0].toString();
  var fromusername = req.body.xml.fromusername[0].toString();
  var msgtype = req.body.xml.msgtype[0].toString();
  var content = req.body.xml.content[0].toString();
  var msgid = req.body.xml.msgid[0].toString();;
  var createtime = Math.round(Date.now()/1000);

  console.log("tousername : " + tousername);
  console.log("fromusername : " + fromusername);
  console.log("msgid : " + msgid);

  if (msgtype === "text") {
    var send_content = "当前公众号正在开发阶段，更多功能敬请期待！";
    if (content == "帮助") {
      send_content = "本公众号测试专用！";
    }
  }else{
    send_content = "本公众号暂时没有更多功能，敬请期待！";
  }

  var send_xml = "<xml><ToUserName><![CDATA[" + fromusername + "]]></ToUserName>"
                 "<FromUserName><![CDATA[" + tousername + "]]></FromUserName>"
                 "<CreateTime>" + createtime + "</CreateTime>"
                 "<MsgType><![CDATA[text]]></MsgType>"
                 "<Content><![CDATA[" + send_content + "]]></Content></xml>";
  // var xml2 = "<FromUserName><![CDATA[" + tousername + "]]></FromUserName>";
  // var xml3 = "<CreateTime>" + createtime + "</CreateTime>";
  // var xml4 = "<MsgType><![CDATA[text]]></MsgType>";
  // var xml5 = "<Content><![CDATA[" + send_content + "]]></Content></xml>";
  // send_xml = xml1 + xml2 + xml3 + xml4 + xml5;
  //const send_xml= '<xml><ToUserName><![CDATA[fromusername]]></ToUserName><FromUserName><![CDATA[${tousername}]]></FromUserName><CreateTime>${createtime}</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[send_content]]></Content></xml>';
  res.set("Content-Type","text/xml");
  res.send(send_xml);
})
module.exports = router;
