'use strict';

  angular.module('bag2.filters', []).config(function($provide, $filterProvider) {
    $provide.value('skip', function(input, amount) {
      if (angular.isObject(input)) {
        var out = {};
        var skipped = 0;
        angular.forEach(input, function(item, key) {
          if (skipped < amount) {
            skipped++
          } else {
            out[key] = item;
          }
        });

        return out;
      } else if (angular.isArray(input)) {
        return input.slice(amount);
      } else {
        return input;
      }
    });

    $filterProvider.register('skip', function(skip) {
      return function(input, amount) {
          return skip(input, amount);
      };
    });
  });