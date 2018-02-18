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

function signOut() {
  $("#g-signin").toggle();
  $("#g-signout").toggle();
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}
