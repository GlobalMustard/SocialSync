angular.module('socialsync', [
  'socialsync.auth',
  'socialsync.notifications',
  'ui.router'
  ])

.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/notifications');

  $stateProvider
    .state('home', {
      url: '/notifications', //UPDATE FOR CHILD VIEWS
      templateUrl: 'app/notifications/notifications.html'
    })
    .state('auth', {
      url: '/auth', //UPDATE FOR CHILD VIEWS
      templateUrl: 'app/auth/auth.html'
    })
})
.run(); //handle tokens, etc.

/*
DESCRIPTION: main page of app, integrate modules;

CONFIG: ??

FACTORIES: ??

RUN: ??
*/