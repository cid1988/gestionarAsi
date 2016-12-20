angular.module('bag2.app', ["angulartics.bag2", "ui.state", "ngRoute", "compile"]).config(function($provide, $routeProvider, $locationProvider, $stateProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider.when('/', {
        templateUrl: '/views/oneColumn.html',
        controller: 'PageCtrl'
    });

    $provide.factory('cleanObject', function() {
        return function(src) {
            for (var k in src) {
                if (src[k] === "" || src[k] === undefined) {
                    delete src[k];
                }
            }

            return src;
        };
    });

    $provide.factory('$routeProvider', function() {
        return $routeProvider;
    });

    $provide.factory('$stateProvider', function() {
        return $stateProvider;
    });
}).factory("getUiStates", function($q, $http, $stateProvider, $rootScope) {
    var loaded = false;
    return function() {
        var p = $q.defer();

        if (!loaded) {
            $http.get('/api/ui/states').success(function(rawStates) {
                angular.forEach(rawStates, function(s) {
                    $stateProvider.state(s.name, s);
                })

                loaded = true;

                p.resolve();
            }).error(function() {
                p.reject();
            });
        }
        else {
            p.resolve();
        }

        return p.promise;
    };
}).factory("updateRoutes", function($q, $state, $stateParams, auth, $rootScope, $stateProvider, $routeProvider, $http) {
    var done = false;

    return function() {
        var p = $q.defer();

        if (done) {
            p.resolve();
        }
        else {
            $http.get('/api/ui/routes').success(function(rawRoutes) {
                for (var r in rawRoutes) {
                    if (!rawRoutes[r].aliasOf) {
                        var route = $rootScope.uiRoutes[r] = {
                            url: r,
                            templateUrl: '/views/oneColumn.html',
                            title: 'BAGestion',
                            reloadOnSearch: false,
                            views: {
                                'body@': rawRoutes[r]
                            }
                        };
                        if (rawRoutes[r].views) {
                            route.views = rawRoutes[r].views;
                            angular.extend(route, rawRoutes[r]);
                        }

                        $routeProvider.when(r, route);
                        $stateProvider.state(r, route);
                    }
                };

                $rootScope.alerts = [];
                $rootScope.state = $state;
                $rootScope.stateParams = $stateParams;

                $rootScope.isAllowedTo = auth.isAllowedTo;
                var extend = angular.extend,
                    inherit = function(extra) {
                        extend(new(extend(function() {}, {
                            prototype: parent
                        }))(), extra);
                    };

                for (var r in $rootScope.uiRoutes) {
                    if ($rootScope.uiRoutes[r].aliasOf) {
                        $routeProvider.when(r, $rootScope.uiRoutes[r]);
                        $stateProvider.state(r, $rootScope.uiRoutes[r]);
                    }
                }

                done = true;
                p.resolve()

            }).error(function() {
                p.reject();
            });
        }

        return p.promise;
    };
}).run(function(auth, $urlRouter, $stateProvider, $routeProvider, $http, $route, $rootScope, $location, $timeout, $state, $stateParams, checkUrl, concatAndResolveUrl, $q, getUiStates, updateRoutes, Contactos, ORMOrganigrama) {
    $.fn.modal.Constructor.prototype.enforceFocus = function() {};

    $rootScope.appRootUrl = location.protocol + '//' + location.host;

    // si recién ingresamos al sistema, no tenemos ningún permiso
    // estos se van a actualizar cuando pase por auth.checkLoginState()
    $rootScope.permissions = [];

    $rootScope.uiRoutes = {};

    $http.get('/scripts/calles.js').success(function(data) {
        $rootScope.calles = data;
    });

    $rootScope.hasPermission = function(lookFor) {
        return $rootScope.permissions.indexOf(lookFor) > -1;
    };
    
    updateRoutes().then(function() {
        getUiStates().then(function() {
            $rootScope.statesLoaded = true;
            $rootScope.$broadcast('states-loaded');
            auth.checkLoginState().then(function() {
                checkUrl.checkUrl();
            });
        });
    });
    
    //NUEVAS FUNCIONES PARA TODO EL BAG
    var contactos = Contactos.listar();
    var organigrama = ORMOrganigrama.query();
    
    $rootScope.contactoPorId = function(id){
        for(var i = 0; i < contactos.length; i++){
            if (contactos[i]._id == id){
                return contactos[i];
            }
        }
    };
    
    $rootScope.jurisdiccionPorId = function(id){
        for (var i = 0; i < organigrama.length; i++) {
            if (organigrama[i]._id == id){
                return organigrama[i];
            }
        }
    };
});
angular.module('compile', [], function($compileProvider) {
  // configure new 'compile' directive by passing a directive
  // factory function. The factory function injects the '$compile'
  $compileProvider.directive('compile', function($compile) {
    // directive factory creates a link function
    return function(scope, element, attrs) {
      scope.$watch(function(scope) {
        // watch the 'compile' expression for changes
        return scope.$eval(attrs.compile);
      },
      function(value) {
        // when the 'compile' expression changes
        // assign it into the current DOM
        element.html(value);
         
        // compile the new DOM and link it to the current
        // scope.
        // NOTE: we only compile .childNodes so that
        // we don't get into infinite loop compiling ourselves
        $compile(element.contents())(scope);
      });
    };
  })
})
.factory("trackState", function ($http, $location) {
    return function (state) {
        $http.post('/angulartics-trackState', {
            url: $location.url(),
            state: state
        });
    };
})
.factory('throttle', ['$timeout', function ($timeout) {
  return function (delay, no_trailing, callback, debounce_mode) {
    var timeout_id,
    last_exec = 0;
    
    if (typeof no_trailing !== 'boolean') {
      debounce_mode = callback;
      callback = no_trailing;
      no_trailing = undefined;
    }
    
    var wrapper = function () {
      var that = this,
          elapsed = +new Date() - last_exec,
          args = arguments,
          exec = function () {
            last_exec = +new Date();
            callback.apply(that, args);
          },
          clear = function () {
            timeout_id = undefined;
          };
 
      if (debounce_mode && !timeout_id) { exec(); }
      if (timeout_id) { $timeout.cancel(timeout_id); }
      if (debounce_mode === undefined && elapsed > delay) {
        exec();
      } else if (no_trailing !== true) {
        timeout_id = $timeout(debounce_mode ? clear : exec, debounce_mode === undefined ? delay - elapsed : delay);
      }
    };
    
    return wrapper;
  };
}]);
