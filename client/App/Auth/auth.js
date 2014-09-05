angular.module('socialsync.auth', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('auth', {
        abstract: true,
        url: '/auth', 
        templateUrl: 'app/auth/auth.html'
      })
    .state('auth.twitter', {
        url: '/twitter', 
        templateUrl: 'app/auth/auth.twitter.html'
      })
    .state('auth.facebook', {
        url: '/facebook', 
        templateUrl: 'app/auth/auth.facebook.html'
      })
    .state('auth.google-plus', {
        url: '/google-plus', 
        templateUrl: 'app/auth/auth.google-plus.html'
      })
})

.factory('Auth', function($http, $state) {
  var login = function(user) {
    return $http({
      method: 'POST', 
      url: 'localhost:3000/auth/twitter',
      data: user,
    })
    .then(function(resp) {
      return resp.data.token;
    })
    .catch(function(err) {
      //TODO: indicate invalid login in auth view
    });
  };

  //may need to refactor isAuth() AND/OR login to return bool 
  var isAuth = function() {
    return $http({
      method: 'GET', 
      url: '', //TODO: GET URL INFO
    })
    .then(function(resp) {
      return resp.data;
    }) 
    .catch(function(err) {
      $state.go('') 
      //TODO: navigate to 'You're not signed in' in appropriate auth view state
    });
  }

  return {
    login: login,
    isAuth: isAuth
  };
})

.controller('AuthController', function($scope, $state, Auth) {
  $scope.user = {};
  
  $scope.login = function(user) {
    Auth.login($scope.user).then(function() {
      //TODO: navigate to notifications view state
      $state.go();
    });
  };
});

