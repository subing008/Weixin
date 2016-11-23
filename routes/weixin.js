var express = require('express');
var router = express.Router();
var wechat = require('wechat');
var token = "79faf82271944fe38c4f1d99be71bc9c";


router.get('/',wechat(token).middlewarify());
router.post('/', wechat(token).text(function(message,req,res,next){
  if (message.Content === "帮助") {
    res.reply("当前公众号正在开发阶段，更多功能敬请期待！");
  }else{
    res.reply("本公众号测试专用！");
  }
}).image(function(message,req,res,next){
  res.reply("MsgType : 图片类型");
}).middlewarify());

module.exports = router;
