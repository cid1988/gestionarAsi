angular.module('bag2.checkUrl', []).service('checkUrl', function($location, $q, $urlMatcherFactory, $rootScope, $state, getUiStates, updateRoutes) {
    var checkUrl = function() {
        var p = $q.defer();

        updateRoutes().then(function() {
            getUiStates().then(function() {
                var url = $location.url();

                if ($location.search().goTo) {
                    url = $location.search().goTo;
                }

                var onlyPath = url;
                if (url.indexOf('?') > -1) {
                    onlyPath = url.substring(0, url.indexOf('?'));
                }

                var found = false;
                for (var r in $rootScope.uiRoutes) {
                    var params = $urlMatcherFactory.compile(r).exec(onlyPath);
                    if (params) {
                        if (!$rootScope.isAllowedTo(r)) {
                            if (!$rootScope.isLoggedIn) {
                                $location.url('/login?returnTo=' + encodeURIComponent(url));
                                $rootScope.lastGoodUrl = url;
                            }
                        }
                        else {
                            $location.url(url);
                            $rootScope.lastGoodUrl = url;
                        }

                        found = true;
                        p.resolve($location.search().goTo);
                    }
                }

                if (!found) {
                    p.reject();
                }
            });

        });

        return p.promise;
    };

    return {
        checkUrl: checkUrl
    };
});