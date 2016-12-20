angular.module('bag2.jurisdicciones', [])
.controller('JurisdiccionesCtrl', function($scope, Jurisdiccion, $location) {
    $scope.jurisdicciones = Jurisdiccion.list();
    $scope.ver = function(f) {
        $location.url('/jurisdicciones/' + f._id);
    };
    $scope.puedeModificar = function() {
            return true;
    };
}).controller('VerJurisdiccionCtrl', function($scope, Funcionario, Jurisdiccion, $routeParams, $location) {
    $scope.responsables = Funcionario.query();
    $scope.jurisdiccion = Jurisdiccion.get({_id: $routeParams._id});
    $scope.modificar = function () {
        $scope.modificando = true;
    };
    $scope.guardar = function() {
      $scope.jurisdiccion.orden = 1;
      $scope.jurisdiccion.$save(function() {
          $scope.modificando = false;
      });  
    };
    
    $scope.puedeModificar = function() {
            return true;
    };
}).controller('NuevaJurisdiccionCtrl', function($scope, Funcionario, Jurisdiccion, $routeParams, $location) {
    $scope.responsables = Funcionario.query();
    $scope.jurisdiccion = new Jurisdiccion();
    $scope.guardar = function() {
        $scope.jurisdiccion.$save(function(data) {
          $location.url('/jurisdicciones/' + $scope.jurisdiccion._id);
        });
	};
});