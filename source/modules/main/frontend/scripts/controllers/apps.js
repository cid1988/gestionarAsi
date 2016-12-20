angular.module('bag2.apps', ["bag2.checkUrl"])
.controller('AppsCtrl', function($scope, $http, $location, checkUrl, getUiStates, $location, updateRoutes) {
    updateRoutes().then(function () {
        checkUrl.checkUrl().then(function (u) {
           $location.url(u)
        });
    });

    $http.get('/api/apps').success(function(data) {
        var appsMenu = [];
        data.forEach(function(a) {
            if (a.display === undefined || a.display === true) {
                appsMenu.push(a);
            }
        });
        $scope.apps = appsMenu;
    });
});