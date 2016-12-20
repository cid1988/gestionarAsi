'use strict';
angular.module('bag2.page', []).controller('PageCtrl', function($scope, $location, auth, checkUrl, $state) {
    if ($scope.statesLoaded) {
        $state.transitionTo('dashboard');
        // $location.url('/apps');
    }
    else {
        $scope.$on('states-loaded', function() {
            $state.transitionTo('dashboard');
            // $location.url('/apps');
        });
    }
});