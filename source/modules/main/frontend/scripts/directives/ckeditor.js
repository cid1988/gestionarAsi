angular.module('ck', []).directive('ckEditor', function() {
    var calledEarly, loaded;
    loaded = false;
    calledEarly = false;

    return {
        require: '?ngModel',
        scope: {
            options: '=ckEditor',
            ngModel:'=ngModel'
        },
        link: function($scope, elm, attributes, ngModel, $timeout) {
            var ck;
            $scope.$watch('options', function (options) {
                elm.contentEditable = true;
                elm.css('-webkit-user-modify', 'read-write');
                ck = CKEDITOR.replace(elm[0], angular.extend({
                    language: 'es'
                },$scope.options));
                ck.on("instanceReady", function() {
                    ck.setData($scope.ngModel);
                });
                ck.on('pasteState', function() {
                    var data = ck.getData();
                    
                    return $scope.$eval(attributes.ngModel + ' = ' + angular.toJson(data));
                });        
            });
    
            if (!ngModel) {
                return;
            }
            return ngModel.$render = function(value) {
                if (ck) {
                    return ck.setData(ngModel.$viewValue);
                }
            };
        }
    };
});