'use strict';

angular.module('bag2.auth', []).factory('auth', function($http, $rootScope, $location, $state, $stateParams, $q) {
    var self = {
        checkLoginState: function() {
            var p = $q.defer();

            $http.get('/api/auth/status').success(function(data) {
                $rootScope.isLoggedIn = data.isLoggedIn;
                $rootScope.username = data.username;

                if (data.isLoggedIn) {
                    $http.get('/api/auth/permissions').success(function(data) {
                        $rootScope.permissions = data;
                        $rootScope.$broadcast('logged-in');
                    });
                    
                    p.resolve(data.isLoggedIn);
                }
                else {
                    $rootScope.permissions = [];
                    
                    p.resolve(data.isLoggedIn);
                }
            }).error(function() {
                $rootScope.$broadcast('auth-error');
                $rootScope.isLoggedIn = false;
                delete $rootScope.username;
                delete $rootScope.permissions;
            });

            return p.promise;
        },
        isAllowedTo: function(r) {
            if (typeof r == "string") {
                r = $rootScope.uiRoutes[r];
            }

            if (!r) {
                return true;
            }

            var found = false;
            if (r.allowed && $rootScope.isLoggedIn && $rootScope.permissions) {
                $rootScope.permissions.forEach(function(p) {
                    r.allowed.forEach(function(p2) {
                        if (p == p2) {
                            found = true;
                        }
                    });
                });

                return found;
            }
            else if (!r.allowed) {
                return true;
            }
            else {
                return false;
            }
        },
        logout: function() {
            $http.post('/api/auth/logout').success(function() {
                $rootScope.$broadcast('logged-out');
                $rootScope.isLoggedIn = false;
                delete $rootScope.permissions;
            });
        },
        login: function(username, password) {
            $rootScope.$broadcast('auth-start');
            $http.post('/api/auth/login', {
                username: username,
                password: password
            }).success(function(data) {
                $rootScope.$broadcast('auth-success');
                self.checkLoginState();
            }).error(function() {
                $rootScope.$broadcast('auth-error');
                self.checkLoginState();
            });
        }
    };

    self.watcher = $rootScope.$watch('state.current.name', function(r) {
        if (r && !self.isAllowedTo(r)) {
            $state.transitionTo('not-allowed');
        }
    });

    return self;
});