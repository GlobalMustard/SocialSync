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
    .state('notifications.google-plus', {
      url: '/google-plus',
      templateUrl: 'app/notifications/notifications.google-plus.html'
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

  $scope.notifications.twitter = [
    {
      image: 'app/assets/test/carl.png',
      user: 'CarlBrutananadilewski',
      message: 'It starts over here...where I used to have a full tank of gas. #lookwhatsbubblininthepool',
      createdAt: 'yesterday-ish from web'

    },
    {
      image: 'app/assets/test/toki.jpg',
      user: 'TokiWartooth',
      message: "I'm heatings up somes lunchables in thuhs firebox. #imissmykitty",
      createdAt: 'tomorrowday from mobile'
    },
    {
      image: 'app/assets/test/prince.png',
      user: 'Prince',
      message: "Well, for starters you have to purify yourself in the waters of Lake Minnetonka. #thebeautifulones",
      createdAt: 'June 25,1984 from First Avenue'
    },
    {
      image: 'app/assets/test/archer.png',
      user: 'SterlingArcherReynolds',
      message: "Well...lawyer up, call the cops. #deathbyrubbereggplant",
      createdAt: 'about an hour ago from web'
    },
    {
      image: 'app/assets/test/dr-steve-brule.png',
      user: 'SteveBrule',
      message: "If I could remember my dingus password for my email that would be cool. #foryourhealth",
      createdAt: '3 minutes ago from web'
    },
    {
      image: 'app/assets/test/morris-day.png',
      user: 'MorrisDay',
      message: "I think I wanna know ya know ya!! #junglelove",
      createdAt: 'two hours ago from mobile'
    }
  ];

  $scope.getNotifications = function() {
    $scope.notifications = Notifications.getNotifications();
  };
});
