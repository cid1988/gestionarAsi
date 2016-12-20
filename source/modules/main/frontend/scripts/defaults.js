angular.module('bag2.defaults', [])
.value('$strapConfig', {
    datepicker: {
        language: 'es',
        format: 'DD/MM/YYYY'
    }
}).factory('parseDateDMY', function() {
    return function(f) {
        var parts = f.match(/(\d+)/g);
        
        var d = parts[0],
            m = parts[1],
            y = parts[2];

        // months in Javascript starts at 0
        var d = new Date(d + '/' + m + '/' + y );//+ ' 00:00:00 AM GMT-0300 (ART)');
        console.log([d]);
        d.setFullYear(parts[2], parts[1] - 1, parts[0]);
        d = new Date(Date.parse(d.toString()));
        return d;
    };
});