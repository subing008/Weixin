var express = require('express');
var router = express.Router();
var wechat = require('wechat');
var jssdk = require('../lib/jssdk.js');
var token = "79faf82271944fe38c4f1d99be71bc9c";
const myUrlRoot = "http://kugcsq.top/weixin";
router.get('/user',function(req,res,next){
  jssdk.getSignPackage(myUrlRoot+req.url,function(err,SignPackage){
    if (err) {
      return next(err);
    }

    res.render('index',{
      title: "微信公众平台测试页面",
      signPackage: JSON.stringify(SignPackage),
      pretty: true,
    })
  });
});

router.get('/',wechat(token).middlewarify());
router.post('/', wechat(token).text(function(message,req,res,next){
  if (message.Content === "帮助") {
    res.reply("当前公众号正在开发阶段，更多功能敬请期待！");
  }else if(message.Content === "ac"){
    jssdk.getAccessToken(function(err,accessToken){
      res.reply("accessToken : " + accessToken);
    })
  }else if(message.Content === "js"){
    jssdk.getJsApiTicket(function(err,JsApiTicket){
      res.reply("JsApiTicket : " + JsApiTicket);
    })
  }else if(message.Content === "sp"){
    jssdk.getSignPackage("http://subing.duapp.com/weixin",function(err,SignPackage){
      res.reply("SignPackage : " + JSON.stringify(SignPackage));
    })
  }else{
    res.reply("本公众号测试专用！");
  }
}).image(function(message,req,res,next){
  res.reply("MsgType : 图片类型");
}).middlewarify());

module.exports = router;
