angular.module('bag2.scopeAlias', []).directive('ngParams', function() {
    return {
        restrict: 'A',
        scope: {
            params: '@ngParams'
        },
        link: function(scope, element, attrs) {
            var watchers = [];
            scope.$watch('params', function(params) {
                while (watchers.length) {
                    watchers.shift()();
                }

                angular.forEach(scope.$eval(params), function(k, v) {
                    watchers.push(scope.$parent.$watch(k, function(newV) {
                        scope[v] = newV;
                    }));
                });
            });
        }
    };
});