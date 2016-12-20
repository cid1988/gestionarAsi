(function(window, angular, undefined) {
    var concatAndResolveUrl = function(url, concat) {
        var url1 = url.split('/');
        var url2 = concat.split('/');
        var url3 = [];
        for (var i = 0, l = url1.length; i < l; i++) {
            if (url1[i] == '..') {
                url3.pop();
            }
            else if (url1[i] == '.') {
                continue;
            }
            else {
                url3.push(url1[i]);
            }
        }
        for (var i = 0, l = url2.length; i < l; i++) {
            if (url2[i] == '..') {
                url3.pop();
            }
            else if (url2[i] == '.') {
                continue;
            }
            else {
                url3.push(url2[i]);
            }
        }
        return url3.join('/');
    };
    angular.module('url', []).value('concatAndResolveUrl', concatAndResolveUrl);
})(window, window.angular);