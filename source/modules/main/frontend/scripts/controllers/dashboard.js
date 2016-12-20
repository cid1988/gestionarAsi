angular.module('bag2.dashboard', []).controller('SearchBarCtrl', function($scope) {
    $scope.search = function() {
        $scope.$emit('start-search', {
            searchTerms: $scope.searchTerms
        });
    };
}).controller('DashboardCtrl', function($scope, $compile, $http) {
    $scope.cards = [];
    $scope.$on('dashboard-open-card', function(event, card) {
        $scope.cards.splice(0, 0, card);
    });

    $scope.$on('search-updated', function(event, search) {
        $scope.search = search;
    })
});