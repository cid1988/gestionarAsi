angular.module('bag2.rte', []).directive('richTextEditor', function($timeout) {
  return {
    restrict: "A",
    require: 'ngModel',
    transclude: 'element',
    replace: true,
    template: "<div ng-transclude></div>",
    compile: function(scope, $element, $attrs, $transclude) {
      return {
        post: function(scope, element, attrs, ctrl) {
          // model -> view
          ctrl.$render = function() {
            var textarea = $(element).find('textarea');
            var placeholder = textarea.attr('placeholder');
            textarea.attr('placeholder', undefined);
            textarea.wysihtml5({
              stylesheets: ['/styles/temario.css'],
              placeholder: placeholder
            });
            var editor = textarea.data('wysihtml5').editor;
            editor.observe("load", function() {
              scope.$watch(attrs.ngModel, function() {
                if (ctrl.$viewValue && ctrl.$viewValue != '') {
                  editor.fire('unset_placeholder');
                  textarea.html(ctrl.$viewValue);
                  editor.setValue(ctrl.$viewValue);
                } else {
                  textarea.html('');
                  editor.setValue('');
                  editor.fire('set_placeholder');
                }
              });
            });

            // view -> model
            editor.on('change', function() {
              lastHtml = editor.getValue();
              scope.$apply(function() {
                ctrl.$setViewValue(lastHtml);
              });
              if (attrs.userInputEmits) {
                scope.$apply(function () {
                  scope.$emit(attrs.userInputEmits);
                });
              }
            });
            editor.on('newword:composer', function() {
              if (attrs.userInputEmits) {
                scope.$apply(function () {
                  scope.$emit(attrs.userInputEmits);
                });
              }
            });

            // load init value from DOM
          }
          return ctrl.$render();  
        }
      }
    }
  };
});