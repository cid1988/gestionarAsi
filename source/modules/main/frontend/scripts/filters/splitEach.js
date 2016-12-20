angular.module('bag2.splitEach', [])
.config(function($provide, $filterProvider) {
    $provide.value('splitEach', function(input, each) {
        var out = [];
        var rowInitial;

        if (angular.isObject(input)) {
            var currentGroup = {};
            var count = 0;
            angular.forEach(input, function(item, key) {
                count++;
                currentGroup[key] = item;
                if (count >= each) {
                    out.push(currentGroup);
                    currentGroup = {};
                    count = 0;
                }
            });

            if (count > 0) {
                out.push(currentGroup);
            }
        }
        else if (angular.isArray(input)) {
            var currentGroup = [];
            var count = 0;
            angular.forEach(input, function(item) {
                count++;
                currentGroup.push(item);
                if (count >= each) {
                    out.push(currentGroup);
                    currentGroup = {};
                    count = 0;
                }
            });

            if (count > 0) {
                out.push(currentGroup);
            }
        }

        return out;
    });

    $filterProvider.register('splitEach', function(splitEach) {
        return function(input, each) {
            return splitEach(input, each || 2);
        };
    });
});