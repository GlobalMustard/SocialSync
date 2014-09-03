angular.module('socialsync.notifications', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('notifications', {
      abstract: true,
      url: '/notifications',

      templateUrl: 'app/notifications/notifications.html'
    })
    .state('notifications.twitter', {
      url: '/twitter',
      templateUrl: 'app/notifications/notifications.twitter.html'
    })
    .state('notifications.facebook', {
      url: '/facebook',
      templateUrl: 'app/notifications/notifications.facebook.html'
    })
})

.factory('Notifications', function($http) {
  var getNotifications = function() {
    return $http({
      method: 'GET',
      url: '', //TODO: NEED URL FOR SERVER/API
    })
    .then(function(resp){
      return resp.data;
    })
    .catch(function(error) {
      console.log(error);
    });
  };

  return {
    getNotifications: getNotifications
  };
})

.controller('NotificationsController', function($scope, Notifications) {
  $scope.notifications = {};

  $scope.getNotifications = function() {
    $scope.notifications = Notifications.getNotifications();
  };
});
