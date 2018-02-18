const CLIENT_ID = "YOUR_CLIENT_ID";
const REFRESH_INTERVAL = 60*1000;  // Refresh every minute.
var refreshTimer;

function onSignIn(googleUser) {
  $("#g-signin").toggle();
  $("#g-signout").toggle();
  var profile = googleUser.getBasicProfile();
  var id_token = googleUser.getAuthResponse().id_token;
  //console.log('ID: ' + profile.getId());
  //console.log('Name: ' + profile.getName());
  //console.log('Image URL: ' + profile.getImageUrl());
  //console.log('Email: ' + profile.getEmail());

  var xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  xhr.open('POST', '/users');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    if (xhr.response.success) {
      console.log("success: " + xhr.response.success);
      authenticate().then(loadClient).then(execute);
    } else if (xhr.response.session === 'expired') {
      // session is expired, disconnect from google auth.
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.disconnect();
      // show signin button and hide signout button.
      $("#g-signin").show();
      $("#g-signout").hide();
    }
  };
  xhr.send('idtoken=' + id_token);
}

function authenticate() {
  return gapi.auth2.getAuthInstance()
    .signIn({scope: "https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly"})
    .then(function() { console.log("Sign-in successful"); },
          function(err) { console.error("Error signing in", err); });
}
function loadClient() {
  return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(function() { console.log("GAPI client loaded for API"); },
          function(err) { console.error("Error loading GAPI client for API", err); });
}
// Make sure the client is loaded and sign-in is complete before calling this method.
function execute() {
  return gapi.client.youtube.liveBroadcasts.list({
    "part": "snippet",
    "broadcastStatus": "all",
    "broadcastType": "all"
  })
    .then(function(response) {
      // Handle the results here (response.result has the parsed body).
      var liveChatId = response.result.items[0].snippet.liveChatId;
      console.log("liveChatId", liveChatId);
      // Refresh in every REFRESH_INTERVAL.
      refreshTimer = window.setInterval(function() { fetchLiveMsg(liveChatId); }, REFRESH_INTERVAL);
      fetchLiveMsg(liveChatId);
    },
    function(err) { console.error("Execute error", err); });
}

function fetchLiveMsg(liveChatId) {
  return gapi.client.youtube.liveChatMessages.list({
    "liveChatId": liveChatId,
    "part": "snippet,authorDetails"
  })
    .then(function(response) {
      // Handle the results here (response.result has the parsed body).
      //console.log("Response", response);
      var msgArray = response.result.items;
      var htmlStr = "";
      // Create JSON obj to contain all record.
      var chatJson = { record: [] };

      msgArray.forEach(function(element) {
        //console.log(element.authorDetails.displayName + ": " + element.snippet.displayMessage);
        htmlStr += "<p>" + element.authorDetails.displayName + ": " + element.snippet.displayMessage + "</p>";
        chatJson.record.push({
          "msgId": element.id,
          "liveChatId": element.snippet.liveChatId,
          "displayName": element.authorDetails.displayName,
          "displayMessage": element.snippet.displayMessage
        });
      });
      $("#messageFeed").html(htmlStr);
      sendChatJsonToBackend(chatJson);
      // Reset the refresh timer
      clearInterval(refreshTimer);
      refreshTimer = window.setInterval(function() { fetchLiveMsg(liveChatId); }, REFRESH_INTERVAL);
    },
    function(err) { console.error("Execute error", err); });
}

gapi.load("client:auth2", function() {
  gapi.auth2.init({client_id: CLIENT_ID});
});

function sendChatJsonToBackend(chatJson) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  xhr.open('POST', '/users/chatmsgs');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    if (xhr.response.success) {
      console.log("success: " + xhr.response.success);
    } else {
      console.log(xhr.response);
    }
  };
  var stringJson = JSON.stringify(chatJson);
  // console.log(stringJson);
  // console.log(JSON.parse(stringJson));
  xhr.send('json=' + stringJson);
}

function signOut() {
  $("#g-signin").toggle();
  $("#g-signout").toggle();
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}
