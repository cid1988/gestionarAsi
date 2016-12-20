angular.module('bag2.search', ['bag2.restApi']).service('searchService', function($rootScope) {
    var defaultProviders = [];
    return {
        start: function(search, providers) {
            providers || (providers = defaultProviders);

            search.searching = true;
            search.results = [];
            search.waitingProviders = 0;

            angular.forEach(providers, function(p) {
                search.waitingProviders++;
                p.search(search.searchTerms).then(function(providerResults) {
                    search.waitingProviders--;
                    search.results.push.apply(search.results, providerResults);
                    search.searching = (search.waitingProviders > 0);
                }, function() {
                    search.waitingProviders--;
                    search.searching = (search.waitingProviders > 0);
                });
            });

            search.searching = (search.waitingProviders > 0);

            $rootScope.$broadcast('search-updated', search);
        },
        registerDefaultProvider: function(provider) {
            defaultProviders.push(provider);
        }
    };
}).run(function($rootScope, searchService) {
    $rootScope.$on('start-search', function(event, search, providers) {
        if (!search) return;

        searchService.start(search, providers);
    })
});