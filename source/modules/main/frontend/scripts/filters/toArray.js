    angular.module('bag2.toArray', []).config(function($provide, $filterProvider) {
        $provide.value('keysArray', function(input, sortExpression) {
            var out = [];
            for (var k in input) {
                out.push(k);
            }

            if (sortExpression) {
                out.sort(function(a, b) {
                    if (a && b) {
                        return input[k][sortExpression] > input[k][sortExpression];
                    }
                    else {
                        return input[k] > input[k];
                    }
                });
            }

            return out;
        });

        $provide.value('valuesArray', function(input, sortExpression) {
            var out = [];
            for (var k in input) {
                out.push(input[k]);
            }

            if (sortExpression) {
                out.sort(function(a, b) {
                    if (a && b) {
                        return a[sortExpression] > b[sortExpression];
                    }
                    else {
                        return a > b;
                    }
                });
            }

            return out;
        });

        $filterProvider.register('keysArray', function(keysArray) {
            return function(input, sortExpression) {
                return keysArray(input, sortExpression);
            };
        });

        $filterProvider.register('valuesArray', function(valuesArray) {
            return function(input, sortExpression) {
                return valuesArray(input, sortExpression);
            };
        });
    });