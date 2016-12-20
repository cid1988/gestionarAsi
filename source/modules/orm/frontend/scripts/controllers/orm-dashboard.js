    angular.module('bag2.orm.dashboard', [])
    .controller('ORMContactoCardCtrl', function ($scope){ 
		$scope.isCollapsed = true;
	    $scope.edit = function() {
	        $scope.editando = true;
	        $scope.original = angular.copy($scope.contacto);
	    }
	    $scope.cancelar = function() {
	        $scope.contacto = angular.copy($scope.original);
	        $scope.editando = false;
	    }
	    $scope.guardar = function() {
	        $scope.contacto.$save(function() {
		        $scope.original = angular.copy($scope.contacto);
	            $scope.editando = false;
	        });
	    }
	    $scope.collapse = function() {
	        $scope.isCollapsed = true;
	    };
	    $scope.expand = function() {
	        $scope.isCollapsed = false;
	    };
	    $scope.cerrar = function () {
	    	$scope.$emit('close-card', $scope.card);
	    };
    });