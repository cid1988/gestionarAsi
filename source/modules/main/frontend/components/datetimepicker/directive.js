angular.module("angular-datetime", []).directive("date", function() {
    return {
        restrict: 'EA',
        replace: true,
        scope: false,
        require: "ngModel",
        link: function(scope, element, attrs, model) {
            var format = "DD/MM/YYYY";
            var render = model.$render;

            model.$render = function() {
                $(element).data("DateTimePicker").setDate(
                    moment(model.$viewValue, format));

                //render();  
            };

            $(element).datetimepicker({
                format: format,
                pickTime: false,
                language:"es"
            }).on('change.dp', function() {
                scope.$apply(function() {
                    model.$setViewValue($(element).datetimepicker().data("DateTimePicker").getDate().format(format));
                });
            });
        }
    };
});