const CLIENT_ID = "YOUR_CLIENT_ID";
const EXPIRED_INTERVAL = 60 * 60;

var express = require('express');
var User = require("../models/users");
var router = express.Router();
var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var client = new auth.OAuth2(CLIENT_ID, '', '');

function checkUsersDB(payload, res) {
  // User is exist, check the session
  User.findOne( { email: payload.email } , function(err, user) {
    if (err) {
      res.status(401).json({ error: "Database findOne error" });
    } else if (!user) {
      // User is not exist, save user info in the database.
      // Prepare a new user
      var newUser = new User( {
          email: payload.email,
          fullName: payload.name
      });
      newUser.save( function(err, user) {
        if (err) {
          res.status(400).json( {error: "Bad Request" } );
        } else {
          res.status(201).json( {success: "User " + payload.name + " is saved." } );
        }
      });
    } else {
      // User is exist, check the session
      var issueTimeOffset = Date.now()/1000 - payload.iat;
      //console.log(issueTimeOffset);
      if (issueTimeOffset > EXPIRED_INTERVAL) {
        // Session is expired.
        res.status(201).json({session: "expired"});
      } else {
        res.status(201).json({success: "google login success"});
      }
    }
  });
}

var headerCheck = function(req, res, next) {
  // Check if the header is set
  if (req.headers["content-type"] !== "application/x-www-form-urlencoded") {
    return res.status(401).json({error: "Missing header"});
  }
  next();
}

router.post('/', headerCheck, function(req, res, next) {
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
        checkUsersDB(payload, res);
      }
    });
});

router.post('/chatmsgs', headerCheck, function(req, res, next) {
  var jsonStr = req.body.json;
  var data = JSON.parse(jsonStr);

  data.record.forEach(function(element) {
    console.log(element.msgId + ": " + element.liveChatId + ": " + element.displayName + ": " + element.displayMessage);
  });
  res.status(201).json({success: "chatmsgs success"});
});

module.exports = router;
