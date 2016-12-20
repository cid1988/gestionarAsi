angular.module('bag2.alerts', [])
.controller('AlertsCtrl', function($scope, $rootScope) {}).controller('AlertCtrl', function($scope, $rootScope) {
    $scope.dismiss = function(a) {
        $rootScope.alerts.splice($rootScope.alerts.indexOf(a));
    };
});