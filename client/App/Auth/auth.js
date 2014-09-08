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


  var isAuth = function(socialMediaName) {
    var tempToken;

    getLocalData(socialMediaName, function(data) {
      tempToken = data.token;
    });

    if(tempToken === undefined) {
      return false;
    }
    return true;
  }
  
  var setLocalData = function(key, value) {  
    var dataObjectToBeStored = {};
    dataObjectToBeStored[key] = value;
    chrome.storage.sync.set(dataObjectToBeStored, function (){});
  };

  //getLocalData works sort of like a hash table. Use the key to get the value.
  //In our code, the key is usually the name of the social media site.
  //The callback will run on the data that is returned.
  var getLocalData = function(key, callback) {
    chrome.storage.sync.get(key, function (data) { 
      console.log('storage get promise has executed' + data[key]);
      callback(data[key]);
    });
  };
  
  return {
    login: login,
    isAuth: isAuth,
    setLocalData: setLocalData,
    getLocalData: getLocalData
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

