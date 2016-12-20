'use strict';
var app = angular.module('colorpicker', []);
app.directive('colorpicker', function() {
    return {
        require: '?ngModel',
        link: function(scope, element, attrs, controller) {
            var updateModel;
            if(controller != null) {
                updateModel = function(value) {
                    return scope.$apply(function() {
                        return controller.$setViewValue(value);
                    });
                };
                controller.$render = function() {
                    return element.colorpicker("setColor", controller.$viewValue).on('changeColor', function(e) {
                        if(updateModel) updateModel(e.color.toHex());
                    });
                };
            }
            return element.colorpicker().on('changeColor', function(e) {
                if(updateModel) updateModel(e.color.toHex());
            });
        }
    };
});

