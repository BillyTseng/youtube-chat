var express = require('express');
var router = express.Router();

var CLIENT_ID = "YOUR_CLIENT_ID";
var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var client = new auth.OAuth2(CLIENT_ID, '', '');

router.post('/', function(req, res, next) {
  if (req.headers["content-type"] !== "application/x-www-form-urlencoded") {
    return res.status(401).json({error: "Missing header"});
  }

  var token = req.body.idtoken;
  client.verifyIdToken(
    token,
    CLIENT_ID,
    function(e, login) {
      if (e) {
        //console.log(e);
        res.status(400).json({error: "google login error"});
      } else {
        var payload = login.getPayload();
        var userid = payload['sub'];
        //console.log(payload);
        res.status(200).json({success: "google login success"});
        //res.status(200).json({session: "expired"});
      }
    });
});

module.exports = router;
