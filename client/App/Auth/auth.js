angular.module('socialsync.auth', [])

.factory('Auth', function($http, $state) {
  var login = function(user) {
    return $http({
      method: 'POST', 
      url: '', //SERVER URLS??
      data: user,
    })
    .then(function(resp) {
      return resp.data.token;
    })
    .error(function(err) {
      //indicate invalid login in auth view
    });
  };

  var signup = function(user) {
    return $http({
      method: 'POST',
      url: '',  //GET URL INFO
      data: user
    })
    .then(function(resp) {
      return resp.data.token;
    })
    .error(function(err) {
      //indicate invald signup in auth view
    });
  }

  var isAuth = function() {
    return $http({
      method: 'GET', 
      url: '', //GET URL INFO
    })
    .then()
    .error(function(err) {
      //redirect to login
      //indicate 'you need to login' in auth view state
    });
  }

  return {
    login: login,
    signup: signup,
    isAuth: isAuth
  };
})

.controller('AuthController', function($scope, $location, Auth) { //DO WE NEED LOCATION WITH UI ROUTER??
  $scope.user = {};
  
  $scope.login = function(user) {
    Auth.login($scope.user).then(function() {
      //navigate to notifications view state
      $location.path('/notifications');
    });
  };

  $scope.signup = function(user) {
    Auth.signup($scope.user).then(function() {
      //navigate to notifications view state
      $location.path('/notifications');
    })
  };
});


/*
DESCRIPTION: module for authorization interface

CONTROLLER:
-on click, initiate authorization for given SM (this may include login on SocialSync OR SM website...unclear right now)
-after login, render notifications view (factory more appropriate??)

FACTORY:
-??
*/
