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
  xhr.open('POST', '/users');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    console.log('Signed in as: ' + xhr.responseText);
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
