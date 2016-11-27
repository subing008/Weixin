var fs = require('fs');
var request = require('request');
const jsapiTokenFile = ".accesstoken.json";
const accessTokenFile = ".accesstoken.json";

function weixinsdk(appid,appsecret){
  this.appId = appid;
  this.appSecret = appsecret;
}

weixinsdk.prototype = {
  createNonceStr: function(){
    return Math.random().toString(36).substr(2, 15);
  },

  createTimestamp: function(){
    return parseInt(new Date().getTime() / 1000) + '';
  },

  rew: function(args){
    var keys = Object.keys(args);
    keys = keys.sort()
    var newArgs = {};
    keys.forEach(function (key) {
      newArgs[key.toLowerCase()] = args[key];
    });

    var string = '';
    for (var k in newArgs) {
      string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
  },

  readCacheFile: function(filename){
    try {
      return JSON.parse(fs.readFileSync(filename));
    } catch (e) {
      console.log("read file failed!");
    }
    return null;
  },

  writeCacheFile: function(filename,data){
    return fs.writeFileSync(filename,JSON.stringify(data));
  },

  getAccessToken: function(){
    var data = this.readCacheFile(accessTokenFile);
    var curtiem = new Data().getTime() / 1000;

    if ( typeof data.expireTime == "undefined" || data.expireTime < curtiem) {
      var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + this.appId + "&secret=" + this.appSecret;
      request.get(url,function(err,res,body){
        if (err) {
          console.log("request accesstoken failed: " + err );
          return
        }

        var access_token = JSON.parse(body).access_token;
        this.writeCacheFile(accessTokenFile,{
          accessToken: access_token,
          expireTime: curtiem + 7200,
        });

        return access_token;
      });
    }else{
      return data.accessToken
    }
  },

  getJsApiTicket: function(){
    var data = this.readCacheFile(jsapiTokenFile);
    var curtiem = new Data().getTime() / 1000;

    if ( typeof data.expireTime == "undefined" || data.expireTime < curtiem) {
      var accessToken = this.getAccessToken();
      const url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=$" + accessToken;
      request.get(url,function(err,res,body){
        if (err) {
          console.log("request jsapitoken failed: " + err );
          return
        }

        var jsapiTicket = JSON.parse(body).ticket;
        this.writeCacheFile(jsapiTokenFile,{
          JsApiTicket: jsapiTicket,
          expireTime: curtiem + 7200,
        });

        return jsapiTicket;
      });
    }else{
      return data.JsApiTicket;
    }
  },

  getSignPackage: function(url){
    var ret = {
      jsapi_ticket: this.getJsApiTicket(),
      nonceStr: createNonceStr(),
      timestamp: createTimestamp(),
      url: url
    };

    var string = this.raw(ret);
    jsSHA = require('jssha');
    shaObj = new jsSHA(string, 'TEXT');
    ret.signature = shaObj.getHash('SHA-1', 'HEX');

    return ret;
  },
}

module.exports = weixinsdk;
