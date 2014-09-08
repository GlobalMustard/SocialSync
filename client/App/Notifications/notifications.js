angular.module('socialsync.notifications', ['ui.router', 'socialsync.auth'])

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

.factory('Notifications', function($http, Auth) {
  var notifications = {};
  
  var getNotifications = function(socialMediaName) {
    Auth.getLocalData(socialMediaName, function(data){
      var currentToken = data.token;
      var currentSecret = data.token;
    });
 
    return $http({
      method: 'POST',
      url: 'http://127.0.0.1:3000/' + socialMediaName,
      data: {"token": currentToken,"secret": currentSecret},
      headers: {'Content-Type': 'application/json'}
    });
  };

  return {
    getNotifications: getNotifications,
    notifications: notifications
  };
})

.controller('NotificationsController', function($scope, $state, Notifications, Auth) {
  $scope.notifications = Notifications.notifications;

  $scope.getNotifications = function(socialMediaName) {
    if(!Auth.isAuth(socialMediaName)) {
      window.open('localhost:3000/auth/' + socialMediaName, '', "height=600, width=600, toolbar=no"); 
    } else {
      Notifications.getNotifications(socialMediaName)
      .then(function(resp) {
        Notifications.notifications.twitter = resp.data;
        $scope.notifications[socialMediaName] = Notifications.notifications[socialMediaName];
        $state.go('notifications.' + socialMediaName);
      });        
    }
  };


  // DEMO DATA FOR TWITTER NOTIFICAITONS...comment out for actual deployment
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
      image: 'app/assets/test/archer.png',
      user: 'SterlingArcherReynolds',
      message: "This is how we get ants #pam",
      createdAt: '3 minutes ago from web'
    },
    {
      image: 'app/assets/test/carl.png',
      user: 'CarlBrutananadilewski',
      message: "G-men!!! #gmen",
      createdAt: '3 hours ago from mobile'
    },
    {
      image: 'app/assets/test/morris-day.png',
      user: 'MorrisDay',
      message: "I think I wanna know ya know ya!! #junglelove",
      createdAt: 'two hours ago from mobile'
    }
  ];
  
 //DEMO DATA FOR FACEBOOK NOTIFICAITONS...comment out for actual deployment
  $scope.notifications.facebook = [
    {
      first_user_image: 'app/assets/test/toki.jpg',
      users: 'Toki Wartooth, Carl Brutananadilewski, and Prince',
      message: ' like your photo.',
      icon: 'app/assets/facebook/like-icon.png',
      createdAt: '2 hrs',
      photo: 'app/assets/test/archer-tiger.jpg'
    },
     
    {
      first_user_image: 'app/assets/test/carl.png',
      users: 'Carl Brutananadilewski and Morris Day',
      message: ' commented on your photo.',
      icon: 'app/assets/facebook/comment-icon.png',
      createdAt: '2 hrs',
      photo: 'app/assets/test/archer-tiger.jpg'
    },
    
    {
      first_user_image: 'app/assets/test/Prince.png',
      users: 'Prince, Morris Day, and Steve Brule',
      message: ' like your status.',
      icon: 'app/assets/facebook/like-icon.png',
      createdAt: '3 hrs',
      photo: ''
    },

    {
      first_user_image: 'app/assets/test/dr-steve-brule.png',
      users: 'Steve Brule and Carl Brutananadilewski',
      message: ' commented on your status.',
      icon: 'app/assets/facebook/comment-icon.png',
      createdAt: '3 hrs',
      photo: ''
    },

    {
      first_user_image: 'app/assets/test/carl.png',
      users: 'Carl Brutananadilewski',
      message: ' commented on your photo.',
      icon: 'app/assets/facebook/comment-icon.png',
      createdAt: '2 hrs',
      photo: 'app/assets/test/archer-rampage.jpg'
    },

     {
      first_user_image: 'app/assets/test/dr-steve-brule.png',
      users: 'Steve Brule and Prince',
      message: ' commented on your photo.',
      icon: 'app/assets/facebook/comment-icon.png',
      createdAt: '2 hrs',
      photo: 'app/assets/test/archer-rampage.jpg'
    },

     {
      first_user_image: 'app/assets/test/Prince.png',
      users: 'Prince, Steve Brule, and Carl Brutananadilewski',
      message: ' commented on your photo.',
      icon: 'app/assets/facebook/comment-icon.png',
      createdAt: '2 hrs',
      photo: 'app/assets/test/archer-rampage.jpg'
    }
  ];
});
