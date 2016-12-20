	angular.module('bag2.orm.contacts-search', []).factory('contactsProvider',
	 function($interpolate, $q, $timeout, $rootScope, ORMContacto) {
		return {
			search: function(searchTerms) {
				var deferred = $q.defer();

				var restResults = ORMContacto.list({
					$or: JSON.stringify([{
							nombre: {
								"$regex": searchTerms,
								"$options": "i"
							}
						}, {
							apellido: {
								"$regex": searchTerms,
								"$options": "i"
							}
						}
					])
				}, function() {
					var results = [];
					var displayText = $interpolate("{{nombre}} {{apellido}}");
					angular.forEach(restResults, function(r) {
						results.push({
							displayText: displayText(r),
							actions: [{
									displayText: 'Abrir',
									do :


									function() {
										$rootScope.$broadcast('dashboard-open-card', {
											templateUrl: '/views/orm/dashboard/contact-card.html',
											data: {
												contacto: r
											}
										});
									}
								}]
						})
					});

					deferred.resolve(results);
				});

				return deferred.promise;
			}
		}
	})
		.run(function(searchService, contactsProvider) {
		searchService.registerDefaultProvider(contactsProvider);
	});