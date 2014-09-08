angular.module('socialsync', [
  'socialsync.auth',
  'socialsync.notifications',
  'ui.router'
  ])

.config(function($stateProvider, $urlRouterProvider, $compileProvider) {
  $urlRouterProvider.otherwise('/notifications/twitter');

  var currentImgSrcSanitizationWhitelist = $compileProvider.imgSrcSanitizationWhitelist();
    var newImgSrcSanitizationWhiteList = currentImgSrcSanitizationWhitelist.toString().slice(0,-1)
    + '|chrome-extension:'
    +currentImgSrcSanitizationWhitelist.toString().slice(-1);

    console.log("Changing imgSrcSanitizationWhiteList from "+currentImgSrcSanitizationWhitelist+" to "+newImgSrcSanitizationWhiteList);
    $compileProvider.imgSrcSanitizationWhitelist(newImgSrcSanitizationWhiteList);
});
