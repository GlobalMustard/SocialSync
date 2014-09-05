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
    console.log('executed');

    return $http({
      method: 'POST',
      url: 'http://127.0.0.1:3000/twitter', //TODO: NEED URL FOR SERVER/API
      data: {"token":"2680848008-TkyvkCOOCgeKXDgDEfpIiDhRwVBWHeaL5wfe4oT","secret":"K2DGUMFANnNpHdOFAdTPiTaJdlBOL3inNDtsdjJLSFkXw"},
     headers: {'Content-Type': 'application/json'}
    })
    .then(function(resp){
      console.log(resp);
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
