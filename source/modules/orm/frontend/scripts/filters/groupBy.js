angular.module('bag2.groupBy', []).filter('groupBy', function() {
    return function(input, groupBy) {
        var groups = {};
        for (var i = 0; i < input.length; i++) {
            if (!groups[input[i][groupBy]]) {
                groups[input[i][groupBy]] = [input[i]];
            }
            else {
                groups[input[i][groupBy]].push(input[i]);
            }
        }

        return groups;
    };
});