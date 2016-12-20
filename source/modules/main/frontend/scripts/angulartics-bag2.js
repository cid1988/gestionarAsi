(function(angular) {
'use strict';

var post = angular.noop;

angular.module('angulartics.bag2', ['angulartics'])
.run(["$http", function ($http) {
  post = $http.post;
}])
.config(['$analyticsProvider', "$httpProvider", function ($analyticsProvider) {
  $analyticsProvider.registerPageTrack(function (path) {
    post('/angulartics-pageTrack', { path: path });
  });

  $analyticsProvider.registerEventTrack(function (action, properties) {
    post('/angulartics-pageEventTrack', { action: action, properties: properties });
  });
}]);
})(angular);
