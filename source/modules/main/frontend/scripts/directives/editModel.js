angular.module('bag2.editModel', []).directive('editModel', function() {
    return {
        require: "ngModel",
        scope: true,
        restrict: "A",
        link: function($scope, element, attributes) {
            var expressions = [];

            expressions = attributes.changesWatch.split(',');

            var addFieldWatchers = function() {
                var fullExpression = '';

                expressions.forEach(function(e, i) {
                    if (i > 0) {
                        fullExpression += '|| ';
                    }
                    fullExpression += '((' + attributes.ngModel + '.' + e + ')| json) != ((' + attributes.editModel + '.' + e + ')|json)';
                    $scope.$watch(attributes.ngModel + '.' + e,

                    function(nv,  ov) {
                        // TODO: Chequear esto
//                        if ($scope[attributes.editModel] && $scope[attributes.ngModel]) {
                            $scope.$eval(attributes.editModel + '.' + e + '=' + angular.toJson(nv)); 
//                        }
                    });
                });

                $scope.$watch(fullExpression, function(newValue, oldValue) {
                    $scope.changes = newValue;
                }, true);
            };

            addFieldWatchers();

            $scope.$parent.$watch(attributes.ngModel, function(newModel) {
                $scope[attributes.editModel] = angular.copy(newModel);

                //                $scope.changes = false;
            });

            $scope.applyChanges = function() {
                var original = $scope.$parent.$eval(attributes.ngModel);
                var live = $scope.$eval(attributes.editModel);
                if (original && live) {
                    expressions.forEach(function(e) {
                        original[e] = live[e];
                    });
                }
                //                $scope.changes = false;
            };
            $scope.returnToOriginal = function() {
                var live = $scope.$eval(attributes.editModel);
                var original = $scope.$eval(attributes.ngModel);
                if (original && live) {
                    expressions.forEach(function(e) {
                        live[e] = angular.copy(original[e])
                    });
                }
                //                $scope.changes = false;
            };
        }
    };
});