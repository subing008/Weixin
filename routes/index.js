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
  res.render('index', { title: 'MyServers' });
});

var token = "79faf82271944fe38c4f1d99be71bc9c";

router.get('/weixin',function(req, res, next){
  var query = req.query;
  var signature = query.signature;
  var timestamp = query['timestamp'];
  var nonce = query.nonce;
  var echostr = query.echostr;

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

module.exports = router;
