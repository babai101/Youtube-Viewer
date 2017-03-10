app.service('userService', function($resource) {
  this.userObj = {};
  this.authApi = $resource('/auth/isLoggedIn');
  this.addUserData = function(newObj) {
      this.userObj = newObj;
  };

  this.getUserData = function(callback){
      this.authApi.get({}, function(user) {
        this.userObj = user;
        callback(this.userObj);
      });
  };
});