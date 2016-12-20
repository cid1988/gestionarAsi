angular.module('bag2.cgestion', [])
.controller('CGestionCtrl', function($scope, $location, $http, CGestion, $modal, $routeParams) {
	$scope.cgestiones = CGestion.query();
    $scope.uploaded = [];
    
    $scope.aMilisegundos = function(fecha) {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 0, 0, 0, 0);
        return date.getTime();
    };
    
    $scope.agregarImagen = function(confirmado, data) {
        if (confirmado) {
            $scope.cgestion.imagen = $scope.uploaded.shift().id;
            $scope.cgestion.titulo = data.titulo;
            $scope.cgestion.fecha = data.fecha;
            $scope.cgestion.milisegundos = $scope.aMilisegundos(data.fecha);
            $scope.cgestion.$save({}, function() {
                $scope.cgestiones = CGestion.query();
            });
        }
        else {
            $scope.cgestion = new CGestion();
                
            var modalScope = $scope.$new();
            
            modalScope.data = {
                titulo: '',
                fecha: undefined
            };
            $modal({template: '/views/cgestion/agregarImagen.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
})
.controller('DetalleCGestionCtrl', function($scope, $location, $http, CGestion, $modal, $routeParams) {
    
    $scope.cgestion = CGestion.get({
        _id : $routeParams._id
    });
    
    $scope.agregarComentario = function() {
        if (!$scope.cgestion.comentarios) {
            $scope.cgestion.comentarios = [];
        }
        $scope.data.fecha = new Date();
        $scope.data.usuario = $scope.username;
        $scope.cgestion.comentarios.push($scope.data);
        $scope.cgestion.$save();
        
        $scope.data = {
            usuario : '',
            fecha : '',
            comentario : ''
        };
    };
    
    $scope.dameFecha = function(fecha) {
        var f = new Date(fecha);
        if (f.getMinutes() < 10) {
            var minutos = "0" + f.getMinutes();
        } else {
            var minutos = f.getMinutes();
        }
        return (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear() + " - " + f.getHours() + ":" + minutos);
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.reverse = function(array) {
        var copy = [].concat(array);
        return copy.reverse();
    };
})
.controller('CGestionAdministracionCtrl', function($scope, $location, $http, PlantillaCGestion, $modal, $routeParams) {
	$scope.cgestiones = PlantillaCGestion.query();
    $scope.uploaded = [];
    
    $scope.aMilisegundos = function(fecha) {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 0, 0, 0, 0);
        return date.getTime();
    };
    
    $scope.agregarImagen = function(confirmado, data) {
        if (confirmado) {
            $scope.cgestion.imagen = $scope.uploaded.shift().id;
            $scope.cgestion.titulo = data.titulo;
            $scope.cgestion.fecha = data.fecha;
            $scope.cgestion.milisegundos = $scope.aMilisegundos(data.fecha);
            $scope.cgestion.$save({}, function() {
                $scope.cgestiones = PlantillaCGestion.query();
            });
        }
        else {
            $scope.cgestion = new PlantillaCGestion();
                
            var modalScope = $scope.$new();
            
            modalScope.data = {
                titulo: '',
                fecha: undefined
            };
            $modal({template: '/views/cgestion/agregarImagen.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
})
.controller('DetalleCGestionAdministracionCtrl', function($scope, $location, $http, PlantillaCGestion, $modal, $routeParams) {
    
    $scope.cgestion = PlantillaCGestion.get({
        _id : $routeParams._id
    });
    
    $scope.agregarComentario = function() {
        if (!$scope.cgestion.comentarios) {
            $scope.cgestion.comentarios = [];
        }
        $scope.data.fecha = new Date();
        $scope.data.usuario = $scope.username;
        $scope.cgestion.comentarios.push($scope.data);
        $scope.cgestion.$save();
        
        $scope.data = {
            usuario : '',
            fecha : '',
            comentario : ''
        };
    };
    
    $scope.dameFecha = function(fecha) {
        var f = new Date(fecha);
        if (f.getMinutes() < 10) {
            var minutos = "0" + f.getMinutes();
        } else {
            var minutos = f.getMinutes();
        }
        return (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear() + " - " + f.getHours() + ":" + minutos);
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.reverse = function(array) {
        var copy = [].concat(array);
        return copy.reverse();
    };
});
