angular.module('socialsync', [
  'socialsync.auth',
  'socialsync.notifications',
  'ui.router'
  ])

.config(function($stateProvider, $urlRouterProvider) {
  
  $urlRouterProvider.otherwise('/notifications/twitter');

})
.run(); //TODO: handle tokens, etc.
