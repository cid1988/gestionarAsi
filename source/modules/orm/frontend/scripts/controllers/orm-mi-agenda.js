angular.module("bag2.orm.mi-agenda", []).controller("MiAgendaCtrl", function ($scope, Reuniones, Utilidades, Contactos) {
	$scope.reuniones = Reuniones.proximasFechas(5);
	$scope.series = Reuniones.series(function () {
		$scope.seriesPorId = Utilidades.diccionario ($scope.series);
	});
	$scope.contactos = Contactos.listar(function () {
		$scope.contactosPorId = Utilidades.diccionario($scope.contactos);
	});
	$scope.traerContacto = Contactos.traer;
	var formatDate = function convertDate(inputFormat) {
	  var d = new Date(inputFormat);
	  return [d.getDate(), d.getMonth()+1, d.getFullYear()].join('/');
	};

	$scope.filtro = {
		star: true
	};

	$scope.formatoFecha = function (fecha) {
		if (fecha == formatDate(new Date())) {
			return "Hoy";
		} else {
			return fecha;
		}
	};
})
.controller("ORMEnvioInvitacionReunionCtrl", function ($scope, Contactos, Utilidades) {
	$scope.invitacion = {
		para: [],
		cc: [],
		asunto: 'Invitación - Reunión',
		mensaje: '',
		instanciaId: $scope.r._id
	};

	$scope.puedeEnviar = function () {
		return ((($scope.invitacion.para.length > 0) || ($scope.invitacion.cc.length > 0)) &&
		       ($scope.invitacion.asunto > '') &&
		       ($scope.invitacion.mensaje > ''));
	};

    $scope.contactos = Contactos.listar(function() {
    	$scope.contactosPorId = Utilidades.diccionario($scope.contactos);
    });

    $scope.agregarParticipantePara = function () {
    	if ($scope.buscadorPara) {
    		if ($scope.invitacion.para.indexOf($scope.buscadorPara) === -1 &&
    			$scope.invitacion.cc.indexOf($scope.buscadorPara) === -1) {
		    	$scope.invitacion.para.push($scope.buscadorPara)
		    }
	    	$scope.buscadorPara = "";
	    }
    };
    $scope.agregarParticipanteCC = function () {
    	if ($scope.buscadorCC) {
    		if ($scope.invitacion.para.indexOf($scope.buscadorCC) === -1 &&
    			$scope.invitacion.cc.indexOf($scope.buscadorCC) === -1) {
		    	$scope.invitacion.cc.push($scope.buscadorCC)
		    }
	    	$scope.buscadorCC = "";
	    }
    };

    $scope.quitarContacto = function (pId) {
    	if ($scope.invitacion.para.indexOf(pId) > -1) {
    		$scope.invitacion.para.splice($scope.invitacion.para.indexOf(pId), 1);
    	}
    	if ($scope.invitacion.cc.indexOf(pId) > -1) {
    		$scope.invitacion.cc.splice($scope.invitacion.para.indexOf(pId), 1);
    	}
    };

    $scope.enviar = function () {
    	$http.post('/api/orm/enviar-invitaciones', $scope.invitacion)
    	.success(function () {
    		$scope.r.invitacionEnviada = true;
    	});
    }
});