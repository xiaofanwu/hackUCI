'use strict';

// Initializes LeactureHall.
function LeactureHall() {

  this.initFirebase();
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
LeactureHall.prototype.initFirebase = function() {
  // Shortcuts to Firebase SDK features.
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  // Initiates Firebase auth and listen to auth state changes.
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));

};

window.onload = function() {
  window.friendlyChat = new LeactureHall();
};
