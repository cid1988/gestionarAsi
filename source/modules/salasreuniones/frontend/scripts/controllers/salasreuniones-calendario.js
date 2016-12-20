var controllerCalendar = angular.module('bag2.salasreuniones.calendario', []);

controllerCalendar.controller("ORMCalendarioNavbarCtrl", function($scope, User, SalasReunionesPisos, SalasReunionesUsuariosPorPiso, $http){
	$scope.usuarios = User.query();
	$scope.pisos = SalasReunionesPisos.query();
	$scope.editando = false;

	$scope.$on('change-edit', function () {
		$scope.editando = !$scope.editando;
	});

	function recargarUsuarios(){
		$scope.usuariosPorPiso = SalasReunionesUsuariosPorPiso.query();
	}
	recargarUsuarios();

	$scope.filtroRepetidos = function(usuario){
		var lengthUsuariosPiso = $scope.usuariosPorPiso.length;
		for (var i = 0; i < lengthUsuariosPiso; i++){
			if ( usuario._id == $scope.usuariosPorPiso[i].idUser ){
				return false;
			}
		}
		return true;
	};

	$scope.agregarUsuario = function (sUsuario, pisoDeUsuario){
		var oUsuario = JSON.parse(sUsuario);
		if (oUsuario._id && pisoDeUsuario.length){
			var nuevoUsuario = new SalasReunionesUsuariosPorPiso({
				idUser: oUsuario._id,
				piso: pisoDeUsuario,
				username: oUsuario.username,
				nombre: oUsuario.nombre || "",
				apellido: oUsuario.apellido || "",
				idContacto: oUsuario.idContacto || "",
			});

			nuevoUsuario.$save(function(){
				recargarUsuarios();
			});
		}
	};

	$scope.guardarUsuario = function (oUsuario){
		var actualizacionUsuario = SalasReunionesUsuariosPorPiso.get({_id:oUsuario._id}, function(){
			actualizacionUsuario = oUsuario;
			actualizacionUsuario.$save();
		});
	};

	$scope.eliminarUsuario = function (oUsuario){
		if( confirm("¿Desea eliminar a " + oUsuario.username + "?")){
			SalasReunionesUsuariosPorPiso.get({_id:oUsuario._id}, function(usuarioEliminar){
				usuarioEliminar.$delete(function(){
					recargarUsuarios();
				});
			});
		}
	};

	var nombreUsuario = function ( idUser ){
		for( var i = 0; i < $scope.usuarios.length; i++){
			if( $scope.usuarios[i]._id == idUser ){
				return $scope.usuarios[i].username;
			}
		}
	};

	var existeUsuario = function ( arreglo, idUser ){
		for ( var i = 0; i < arreglo.length; i++){
			if ( arreglo[i]._id == idUser){
				return true;
			}
		}
		return false;
	};
});

controllerCalendar.controller('SalasReunionesCtrl', function( $scope, SalasReunionesUsuariosPorPiso,  $state, $stateProvider, Contactos, ORMContacto, SalasReuniones, SalasReunionesInstancia, $timeout, SRRolesPorKey, SRTiposAsistenciaPorKey, $location, $rootScope, $http) {
	$scope.filtro = {};
	var hoy = new Date().getTime();
	var haceMesYMedio = hoy - 3945250000;

	$scope.$on('programar-nueva-fecha', function (event, r) {
		$scope.programandoNuevaFecha = r;
	});

	//Nuevoooo Alex LEZAMA
	$scope.todasLasSalas=SalasReuniones.query(); ///QWE

	$scope.iterarApagado=function(deVerdad,sala){
		if(!deVerdad){
			$scope.reunionesApagaran=SalasReunionesInstancia.query({sala:sala._id},function(){
				$scope.salaApagada=sala;

				$scope.modalIterarApagado = {};
				if(sala.apagado){
					$scope.modalIterarApagado.titulo = "Encender " + $scope.salaApagada.nombre;
					$scope.modalIterarApagado.leyenda = "¿Desea encender la " + $scope.salaApagada.nombre + "?";
				}else{
					$scope.modalIterarApagado.titulo = "Apagar " + $scope.salaApagada.nombre;
					$scope.modalIterarApagado.leyenda = "¿Desea apagar la " + $scope.salaApagada.nombre + "?";
				}

				$("#modalApagarSala").modal('show');
			});
		} else {
			var salaApagar=SalasReuniones.get({_id:sala._id},function(){
				if(salaApagar.apagado){
					salaApagar.apagado=false;
				}else{
					salaApagar.apagado=true;
				}

				salaApagar.$save({},function(){
					$scope.salas=SalasReuniones.query(function(){
						location.reload();
					});
				});
			});
		}
	};

	$scope.orderByStar = function(c1, c2) {
		return (((c1 && c1.star) || 0) && 1) - (((c2 && c2.star) || 0) && 1);
	};

	$scope.volver = function() {
		$scope.instancia = false;
		$location.url('/salasreuniones');
		$scope.instanciaSeleccionada = "";
		//$scope.calendar.refreshEvents && $scope.calendar.refreshEvents();
		//$scope.$apply();
	};

	$scope.ver = function(t) {
		$scope.salaSeleccionada = t;
		$("#detalleSala").modal('show');
	};

	$scope.$on('seGuardoUnaReunion',function(){
		$scope.instanciaSeleccionada = "";
	});

	$scope.$on('volver', function(event, accept) {
		// TODO: sacar MEBRolesPorKey
		$scope.rolesPorKey = SRRolesPorKey();

		// TODO: sacar MEBTiposAsistenciaPorKey
		$scope.tiposAsistenciaPorKey = SRTiposAsistenciaPorKey();

		$scope.estado.trabajando++;

		var salas = $scope.salas = SalasReuniones.list(function() {
			$scope.estado.trabajando--;
			salas.forEach(function(r) {
				salasPorId[r._id] = r;
			});

			var instancias = $scope.instancias = SalasReunionesInstancia.list(function() {
				instancias.forEach(function(i) {
					// la guardamos en el diccionario
					instanciasPorId[i._id] = i;
				});

				$scope.$watch('events', function() {
					refrescar();
				}, true);

				$scope.$watch('filtro', function() {
					refrescar();
				}, true);
			});
		});
		$scope.instancia = false;
		$location.url('/salasreuniones');
	});

	$scope.estado = {
		trabajando: 0
	};
	$scope.estado.trabajando++;
	$scope.contactos = Contactos.listar(function() {
		$scope.estado.trabajando--;
		$scope.contactosPorId = {};
		$scope.contactos.forEach(function(c) {
			$scope.contactosPorId[c._id] = c;
		});
	});


	$scope.$on('start-edit', function(event, accept) {
		$scope.editando = true;
		$rootScope.$emit('edit-started');
		$rootScope.$broadcast('change-edit');
	});

	$scope.$on('stop-edit', function(event, accept) {
		$scope.editando = false;
		$rootScope.$emit('edit-stoped');
		$rootScope.$broadcast('change-edit');
	});

	$scope.$on('add-date', function() {
		$scope.agregarFecha();
	});

	var noExistenCambiosSinGuardar = function(){
		for (var _id in $scope.reprogramados){
			return false;
		}
		return true;
	};

	// usamos ?instancia=... para trackear el id seleccionado y para hacer significativa la URL
	$scope.instanciaSeleccionada = $location.search().instancia;


	//vamos a esperar a que la directiva fullcalendar agregue la función goToDate y
	// la llamamos para asegurarnos que en el calendario
	$scope.$watch('instancia.desdeDate', function(d) {
		if ($scope.calendar && $scope.calendar.goToDate && d) {
			$scope.calendar.goToDate(new Date(d));
		}
	});

	// En este array vamos a guardar los objetos event de fullCalendar
	// http://arshaw.com/fullcalendar/docs/event_data/Event_Object/
	$scope.events = [];///QWE

	// diccionarios para acceder a los datos de las salas y las instancias por id
	var salasPorId = $scope.salasPorId = {};
	var instanciasPorId = $scope.instanciasPorId = {};

	$scope.colorSala = function (r){
		return (r.color || 'grey');
	};

	$scope.colorTipo = function (sala){

		var color = "grey";

		$scope.salas.forEach(function(r){

			if(r.nombre === sala)
			{
			 color = r.color;
		 }

	 });

		return color;
	};

	var formatTipoSalaCombo = function (object, container, query) {
		if (object.id != '') {
			var html = '<div style="width: 10px;height:10px;margin-right:4px;display:inline-block; background-color: ' + $scope.colorTipo(object.id) + '"></div>' + object.text;
			return html;
		} else {
			return object.text;
		}
	};
	$scope.tipoSalaSelect2 = {
		formatResult: formatTipoSalaCombo,
		// formatSelection: formatTipoSalaCombo
	};

	var usuariosPisos = SalasReunionesUsuariosPorPiso.query();
	var tienePermiso = function(pisoSala, nombreUsuario){
		for ( var i = 0; i < usuariosPisos.length; i++ ){
			if( usuariosPisos[i].username == nombreUsuario){
				if( usuariosPisos[i].piso.indexOf(pisoSala)>=0){
					return true;
				} else {
					return false;
				}
			}
		}
		return false;
	};
	$scope.filtroUsuarioPiso = function(sala){
		return tienePermiso(sala.piso, $scope.username);
	};

	var eventFromInstancia = function (i){
		return {
			title: i.titulo || '',
			start: new Date(i.desdeDate),
			end: new Date(i.hastaDate),
			editable: $scope.editando || false,
			allDay: false,
			color: ( i.sala && salasPorId[i.sala] && salasPorId[i.sala].color ) || 'grey',
			html: '<i ng-repeat="p in salasPorId[instancia.sala].participantes" ngclass="{\'icon-star\': p.star, \'icon-star-empty\': !p.star}"></i> <span></span>',
			css: {
				opacity: (i._id != $scope.instanciaSeleccionada && '0.5') || '1.0'
			},
				// si agregamos estos campos al objeto event los mantiene
				// cuando lo pasa de parámetro en algún evento de UI (click, etc)
				sala: i.sala,
				_id: i._id
			};
		};

		var refrescar = function() {
			// borramos todos los eventos que había para el calendario
			$scope.events.splice(0, $scope.events.length);

			if ($scope.instancias) {
				$scope.instancias.forEach(function(i) {

					var v1 = (!$scope.filtro || !$scope.filtro.nombre);

					var aprobo1 = true, aprobo2 = true;

					if( $scope.filtro.nombre ){
						aprobo1 = false;
					}

					if( $scope.filtro.piso ){
						aprobo2 = false;
					}

					if ( !aprobo1 ){
						if( ($scope.salasPorId[i.sala].nombre == $scope.filtro.nombre) ){
							aprobo1 = true;
						}
					}

					if ( !aprobo2 ){
						if( ($scope.salasPorId[i.sala].piso == $scope.filtro.piso) ){
							aprobo2 = true;
						}
					}

					if ( aprobo1 && aprobo2 ){
						//@Alex: No mostar reuniones de salas apagadas
						if(!$scope.salasPorId[i.sala].apagado){
							//@Alex: No mostrar reuniones de pisos que no se tienen asignados
							if(tienePermiso($scope.salasPorId[i.sala].piso, $scope.username)){
								// TODO: @eazel7: estaría bueno que esto lo haga el servidor
								$scope.events.push(eventFromInstancia(i));
							}
						}
					}

				});
			}

			$scope.calendar.refreshEvents && $scope.calendar.refreshEvents();
		};

		var traerDatos = function() {
		// TODO: sacar MEBRolesPorKey
		$scope.rolesPorKey = SRRolesPorKey();

		// TODO: sacar MEBTiposAsistenciaPorKey
		$scope.tiposAsistenciaPorKey = SRTiposAsistenciaPorKey();

		$scope.estado.trabajando++;

		var salas = $scope.salas = SalasReuniones.list(function() {
			$scope.estado.trabajando--;
			salas.forEach(function(r) {
				salasPorId[r._id] = r;
			});
			var instancias = $scope.instancias = SalasReunionesInstancia.query({
				$and:JSON.stringify([
					{desdeDate:{$gte: haceMesYMedio}},
					])}, function() {
					instancias.forEach(function(i) {
					// la guardamos en el diccionario
					instanciasPorId[i._id] = i;
				});

					if ($scope.instanciaSeleccionada) {
						if( instanciasPorId[$scope.instanciaSeleccionada] ){
							$scope.instancia = instanciasPorId[$scope.instanciaSeleccionada];
							$scope.sala = salasPorId[$scope.instancia.sala];
						}
					}

					$scope.$watch('events', function() {
						refrescar();
					}, true);

					$scope.$watch('filtro', function() {
						refrescar();
					}, true);
				});
		});
	};

	$scope.funcionFiltro = function( sala ){
		if($scope.filtro.piso){
			if(sala.piso == $scope.filtro.piso){
				return true;
			} else {
				return false;
			}
		} else {
			return true;
		}
	};

	traerDatos();
	$scope.$on('recargar-salas', traerDatos);

	$scope.reprogramados = {};

	$scope.huboReporogramacion = function() {
		for (var p in $scope.reprogramados) {
			return true;
		}
		return false;
	};

	$scope.editar = function() {
		$scope.editando = true;
	};
	$scope.cancelarReprogramacion = function() {
		refrescar();
	};

	//@ACA
	$scope.guardarReporogramacion = function() {

		var quitarReprogramado = function(_id) {

			delete $scope.reprogramados[_id];
		};

		var guardarInstancia = function(_id) {
			var instancia = SalasReunionesInstancia.findById({
				_id: _id
			}, function() {
				var f = new Date();
				var min = "00";
				if (f.getMinutes() < 10) {
					min = "0" + f.getMinutes();
				} else {
					min = f.getMinutes();
				}
				instancia.usuario = $scope.username;
				var reprogramada = $scope.reprogramados[_id];
				instancia.fecha = reprogramada.fecha;
				instancia.desdeHora = reprogramada.desdeHora;
				instancia.hastaHora = reprogramada.hastaHora;
				instancia.desdeDate = reprogramada.desdeDate;
				instancia.hastaDate = reprogramada.hastaDate;
				instancia.creada = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear() + ' a las ' + f.getHours() + ':' + min);
				instancia.$save(function() {
					quitarReprogramado(_id);
				});
				$scope.estado.trabajando--;
			}, function () {
				$scope.estado.trabajando--;
			});
		};

		for (var _id in $scope.reprogramados) {
			console.log(JSON.stringify($scope.reprogramados,null,4));
			var contador = 0;
			var a = $scope.reprogramados[_id].fecha;
			var b = $scope.reprogramados[_id].sala;
			var desde = $scope.reprogramados[_id].desdeDate;
			var hasta = $scope.reprogramados[_id].hastaDate;

			SalasReunionesInstancia.query( {
					fecha: a,
					sala: b }, function(reunionesPorFecha){
				if ( sePuedeCrear(desde, hasta, traerReunionesMenos1(reunionesPorFecha, _id) ) ){
					$scope.estado.trabajando++;
					guardarInstancia(_id);
				} else {
					$scope.textoAlertaModal = "La reunion del " + $scope.reprogramados[_id].fecha + " de las " + $scope.reprogramados[_id].desdeHora + " hasta " + $scope.reprogramados[_id].hastaHora + ".\n Coincide con el horario y Sala de otra reunion. \n Por favor, modifique el horario.";
					$("#modalCancelarGuardado").modal('show');
				}
			});
			contador++;
		}
	};

	$("#modalCancelarGuardado").on("hidden",function(){
		 refrescar();
		 traerDatos();
	});

	var traerReunionesMenos1 = function (arrayL, idReunion){
		var arrayRetornar = [];
		for( var x = 0; x < arrayL.length; x++){
			if(arrayL[x]._id != idReunion){
				arrayRetornar.push(arrayL[x]);
			}
		}
		return arrayRetornar;
	};

	var obtenerFechaNormalizada = function(fecha){
		var dia = new Date( fecha );
		var fechaBuscar = "";

		if( dia.getDate() < 10 ){ fechaBuscar+="0"; }
		fechaBuscar+= dia.getDate() + "/";

		if( dia.getMonth() < 10 ){ fechaBuscar+="0"; }
		fechaBuscar+= ( dia.getMonth() + 1 ) + "/" + dia.getFullYear();

		return fechaBuscar;
	};

	var sePuedeCrear = function (horaInicio, horaFin, reunionesEnSalaMismoDia){
		var lengthReuniones = reunionesEnSalaMismoDia.length;
		for ( var i = 0; i < lengthReuniones; i++){
			if ( ( (horaInicio < reunionesEnSalaMismoDia[i].desdeDate) && (horaFin <= reunionesEnSalaMismoDia[i].desdeDate) ) ||  ( (horaFin > reunionesEnSalaMismoDia[i].hastaDate) && (horaInicio >= reunionesEnSalaMismoDia[i].hastaDate) ) ){
				//return true;
			} else {
				return false;
			}
		}
		return true;
	};

	$scope.$watch('editando', function() {
		refrescar();
	});

	var actualizarConEvento = function(event) {
		var f = new Date();
		var min = "00";
		if (f.getMinutes() < 10) {
			min = "0" + f.getMinutes();
		} else {
			min = f.getMinutes();
		}

		var instancia = instanciasPorId[event._id];
		$scope.reprogramados[event._id] = instancia;
		instancia.usuario = $scope.username;
		instancia.fecha = event.start.format('dd/mm/yyyy');
		instancia.desdeHora = event.start.format('H:MM');
		instancia.hastaHora = event.end.format('H:MM');
		instancia.desdeDate = event.start.valueOf();
		instancia.hastaDate = event.end.valueOf();
		instancia.creada = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear() + ' a las ' + f.getHours() + ':' + min);
	};

	$scope.editarObligatoriamente = {
		elemento: ""
	};

	$scope.$on('$locationChangeStart', function(event, next, current) {
		// Esto se ejecuta al clickear otra reunion o seleccionar otra pestaña
		if( !$scope.recienCreado ){
			if( $scope.editarObligatoriamente.elemento != "" ){
				$http.post('/api/salasreunionesEliminarReunion', $scope.editarObligatoriamente ).success( function ( nuevaInstancia ) {

					$scope.instancias.pop();
					$scope.events.pop();

					// Cambia el link y trae los datos de la reunion
					$scope.calendar.refreshEvents && $scope.calendar.refreshEvents();
					$location.search();

					$scope.editarObligatoriamente.elemento = "";
				}).error(function( err ){
					console.log("Ocurrio un error" + err);
				});
			}
		} else {
			$scope.recienCreado = false;
		}
	});

	// Recibe de otro controller que se guardo la reunion que era obligatoria
	$scope.$on('seGuardoLaReunionObligatoria', function (event, r) {
		$scope.editarObligatoriamente.elemento = "";
	});

	var isMobile = {
			Android: function() {
					return navigator.userAgent.match(/Android/i);
		},
			BlackBerry: function() {
					return navigator.userAgent.match(/BlackBerry/i);
			},
		iOS: function() {
					return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			},
			Opera: function() {
					return navigator.userAgent.match(/Opera Mini/i);
			},
			Windows: function() {
					return navigator.userAgent.match(/IEMobile/i);
			},
			any: function() {
					return ( this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
			}
	};

	var tipoVista = {
		diaDefecto: function(){
			if( isMobile.any() )
				return "agendaDay";
			else
				return "agendaWeek";
		},
		headerLeft: function(){
			if( isMobile.any() )
				return "prev next agendaDay today";
			else
				return "prev next agendaDay agendaWeek month";
		},
		headerCenter: function(){
			if( isMobile.any() )
				return "";
			else
				return "today";
		}

	}


	$scope.calendar = {
		events: $scope.events,
		viewConfig: {
			height: 510,
			editable: true,
			allDaySlot: false,
			defaultView: tipoVista.diaDefecto(),//'agendaWeek',
			header: {
				left: tipoVista.headerLeft(), //'prev next agendaDay agendaWeek month',
				center: tipoVista.headerCenter(), //'today',
				right: ''//'title'
			},
			eventClick: function(event) {
				//event._id = _id de la reunion.
				console.log('eventClick');
				$scope.instanciaSeleccionada = event._id;
				$location.search('instancia', event._id); //Cambia el link para que traiga datos de la reunion.
				$scope.$apply();
			},
			dayClick: function(date, allDay, jsEvent, view) {
				console.log("dayclickeo");
				//Al crear una reunion.
				$scope.$apply(function () {
					if ($scope.programandoNuevaFecha) {
						var payload = {
							startDate: date,
							sala: $scope.programandoNuevaFecha,
							usuario: $scope.username
						};

						// PODRIA OBTENER UN OBJECTID y cambiar el URL
						$http.post('/api/salasreunionesCrearReunion', { payload }).success( function ( nuevaInstancia ) {
							if( !nuevaInstancia.error ){
								if( nuevaInstancia.seCreo){
									// Crea en el frontend la reunion para que asi se vea en tiempo real la creacion y evito recargar.
									var reunionInsertada = nuevaInstancia.reunion;
									reunionInsertada = new SalasReunionesInstancia(reunionInsertada);
									$scope.reprogramados[reunionInsertada._id] = reunionInsertada;
									$scope.instancias.push(reunionInsertada);
									$scope.instanciasPorId[reunionInsertada._id] = reunionInsertada;
									$scope.events.push(eventFromInstancia(reunionInsertada));

									// Para que deje de estar la sala activa como si fuera a crear una reunion.
									$scope.estado.trabajando--;
									delete $scope.programandoNuevaFecha;

									// Cambia el link y trae los datos de la reunion
									$scope.calendar.refreshEvents && $scope.calendar.refreshEvents();
									$scope.instanciaSeleccionada = nuevaInstancia.idReunion;
									$location.search('instancia', nuevaInstancia.idReunion);

									// Activo modo edicion de una reunion
									$scope.editarObligatoriamente.elemento= nuevaInstancia.idReunion;
									$scope.recienCreado = true;
								} else {
									$scope.tituloModal = "No se pudo crear la clase";
									$scope.contenidoModal = "<b>Causa:</b> " + nuevaInstancia.causa;
									$scope.cerrarModal = false;
									$scope.botonModal = "Aceptar";
									$("#modalConfirmacion").modal("toggle");
								}
							} else {
								$scope.tituloModal = "Error al crear la clase";
								$scope.contenidoModal = "Ocurrio un error y no se pudo crear, por favor intente recargar y vuelva a intentar. <br> <b> Error: </b>" + nuevaInstancia.tipo + "<br><br> <b>Codigo:</b> " + nuevaInstancia.exp;
								$('#modalAlertar').modal("show");
							}
							console.log(nuevaInstancia);
						}).error(function( err ){
							$scope.tituloModal = "Error";
							$scope.contenidoModal = "Ocurrio un error";
							$('#modalAlertar').modal("show");
							console.log("Ocurrio un error" + err);
						});
					}
				});

				console.log('dayClick', date, allDay, jsEvent, view);
			},
			eventMouseover: function(event) {
				$scope.resaltar = event.sala;
				$scope.salaResaltada = $scope.salasPorId[$scope.resaltar];
				$scope.instanciaResaltada = $scope.instanciasPorId[event._id];
				$scope.$apply();
			},
			eventMouseout: function(event) {
				$scope.salaResaltada = $scope.instanciaResaltada = $scope.resaltar = null;
				$scope.$apply();
			},
			eventResize: function(event) {
				$scope.evento = event;
				$scope.tituloModal = "Ajustar reunion";
				$scope.contenidoModal = "¿Está seguro, que desea ajustar la duración de la reunión?";
				$scope.botonModal = "Aceptar";
				$("#modalConfirmacion").modal("show");
			},
			eventDrop: function(event) {
				$scope.evento = event;
				$scope.tituloModal = "Mover reunion";
				$scope.contenidoModal = "¿Está seguro, que desea mover la reunión?";
				$scope.botonModal = "Aceptar";
				$("#modalConfirmacion").modal("show");
			}
		}
	};

	$scope.cerrarModal = true;

	$scope.seguroDeCambiosCalendar = function(){
		$("#modalConfirmacion").modal("toggle");

		if( $scope.cerrarModal ){
			var payload = {
				_id: $scope.evento._id,
				ultimaModificacion: $scope.username,
				desdeDate: $scope.evento.start,
				hastaDate: $scope.evento.end,
				sala: $scope.evento.sala,
				usuario: $scope.username
			};

			$http.post('/api/salasreunionesActualizarReunion', payload ).success( function ( nuevaInstancia ) {
				if( !nuevaInstancia.error ){
					if( nuevaInstancia.seCreo){
						// Crea en el frontend la reunion para que asi se vea en tiempo real la creacion y evito recargar.
						var reunionInsertada = nuevaInstancia.reunion;

						reunionInsertada = new SalasReunionesInstancia(reunionInsertada);

						for( var i = 0; i < $scope.events.length; i++ ){
							if ( $scope.instancias[i]._id == reunionInsertada._id){
								$scope.instancias[i] = reunionInsertada;
								// $scope.instancias y $scope.events estan igual ordenados asi que para evitar realizar otro ciclo lo hago aca.
								$scope.events[i] = eventFromInstancia(reunionInsertada);
								break;
							}
						}
						$scope.instanciasPorId[reunionInsertada._id] = reunionInsertada;

						// Cambia el link y trae los datos de la reunion
						$scope.instanciaSeleccionada = nuevaInstancia.idReunion;
						$location.search('instancia', nuevaInstancia.idReunion);
					} else {
						$scope.tituloModal = "No se pudo actualizar la clase";
						$scope.contenidoModal = "<b>Causa:</b> " + nuevaInstancia.causa;
						$scope.cerrarModal = false;
						$("#modalConfirmacion").modal("toggle");
					}
				} else {
					$scope.tituloModal = "Error";
					$scope.contenidoModal = "Ocurrio un error y no se pudo crear, por favor intente recargar y vuelva a intentar. <br> <b> Error: </b>" + nuevaInstancia.tipo + "<br><br> <b>Codigo:</b> " + nuevaInstancia.exp;
					$scope.cerrarModal = false;
					$("#modalConfirmacion").modal("toggle");
				}
				console.log(nuevaInstancia);
			}).error(function( err ){
				console.log("Ocurrio un error" + err);
			});
		}
		$scope.cerrarModal = true;
	};

	$scope.$watch('instancia.sala', function(i) {
		if (i) {
			$scope.sala = $scope.salasPorId[i];
		} else {
			$scope.sala = null;
		}
	});

	$scope.$watch('instancia.desdeDate', function(d) {
		$scope.fechaDesde = new Date(d);
	});

	$scope.$watch('instanciaSeleccionada', function(i) {
		if (i) {
			$scope.instancia = $scope.instanciasPorId[i];
			if ($scope.instancia) {
				$scope.sala = $scope.salasPorId[$scope.instancia.sala];
			}
		} else {
			$scope.instancia = null;
			$scope.sala = null;
		}
		$scope.events.forEach(function(e) {
			e.color = salasPorId[e.sala].color;
			e.css = {
				opacity: (e._id != $scope.instanciaSeleccionada && '0.5') || '1.0'
			};

		});
		$scope.calendar.refreshEvents && $scope.calendar.refreshEvents();
		if (i) {
			$location.search('instancia', i);
		}
	});

	$scope.$watch('estado.trabajando', function (t) {
		$rootScope.$broadcast('trabajando', t);
	}, true);
});

controllerCalendar.controller('SalasReunionesConsultaCtrl', function($scope, SalasReunionesUsuariosPorPiso, $state, $stateProvider, Contactos, ORMContacto, SalasReuniones, SalasReunionesInstancia, $timeout, SRRolesPorKey, SRTiposAsistenciaPorKey, $location, $rootScope, $http) {
	$scope.filtro = {};
	var hoy = new Date().getTime();
	var haceMesYMedio = hoy - 3945250000;

	$scope.contactos = Contactos.listar();

	$scope.orderByStar = function(c1, c2) {
		return (((c1 && c1.star) || 0) && 1) - (((c2 && c2.star) || 0) && 1);
	};

	//vamos a esperar a que la directiva fullcalendar agregue la función goToDate y
	// la llamamos para asegurarnos que en el calendario
	$scope.$watch('instancia.desdeDate', function(d) {
		if ($scope.calendar && $scope.calendar.goToDate && d) {
			$scope.calendar.goToDate(new Date(d));
		}
	});

	$scope.ver = function(t) {
		$scope.salaSeleccionada = t;
		$("#detalleSala").modal('show');//modalCancelarGuardado
	};

	var usuariosPisos = SalasReunionesUsuariosPorPiso.query();
	var tienePermiso = function(pisoSala, nombreUsuario){
		for ( var i = 0; i < usuariosPisos.length; i++ ){
			if( usuariosPisos[i].username == nombreUsuario){
				if( usuariosPisos[i].piso.indexOf(pisoSala)>=0){
					return true;
				} else {
					return false;
				}
			}
		}
		return false;
	};

	// En este array vamos a guardar los objetos event de fullCalendar
	// http://arshaw.com/fullcalendar/docs/event_data/Event_Object/
	$scope.events = [];

	// diccionarios para acceder a los datos de las salas y las instancias por id
	var salasPorId = $scope.salasPorId = {};
	var instanciasPorId = $scope.instanciasPorId = {};

	$scope.colorSala = function (r){
		return (r.color || 'grey');
	};

	$scope.colorTipo = function (tipo){
		var color = "grey";
		$scope.salas.forEach(function(r) {
			if (tipo == r.tipo) {
				color = r.color;
			}
		});
		return color;
	};

	var formatTipoSalaCombo = function (object, container, query) {
		if (object.id != '') {
			var html = '<div style="width: 10px;height:10px;margin-right:4px;display:inline-block; background-color: '+ ($scope.colorTipo(object.id) || 'grey') +'"></div>' + object.text;
			console.log(html);
			return html;
		} else {
			return object.text;
		}
	};
	$scope.tipoSalaSelect2 = {
		formatResult: formatTipoSalaCombo,
		// formatSelection: formatTipoSalaCombo
	};

	var eventFromInstancia = function (i){
		return {
			title: i.titulo || '',
			start: new Date(i.desdeDate),
			end: new Date(i.hastaDate),
			editable: $scope.editando || false,
			allDay: false,
			color: salasPorId[i.sala].color || 'grey',
			html: '<i ng-repeat="p in salasPorId[instancia.sala].participantes" ngclass="{\'icon-star\': p.star, \'icon-star-empty\': !p.star}"></i> <span></span>',
			css: {
				opacity: (i._id != $scope.instanciaSeleccionada && '0.5') || '1.0'
			},
				// si agregamos estos campos al objeto event los mantiene
				// cuando lo pasa de parámetro en algún evento de UI (click, etc)
				sala: i.sala,
				_id: i._id
			};
		};

		var refrescar = function() {
			// borramos todos los eventos que había para el calendario
			$scope.events.splice(0, $scope.events.length);

			if ($scope.instancias) {
				$scope.instancias.forEach(function(i) {
					if ((!$scope.filtro || !$scope.filtro.nombre) || $scope.salasPorId[i.sala].nombre == $scope.filtro.nombre) {

						//@Alex: No mostar reuniones de salas apagadas
						if(!$scope.salasPorId[i.sala].apagado){
							if($scope.username){
								//@Alex: No mostar las salas sin permisos
								if(tienePermiso($scope.salasPorId[i.sala].piso, $scope.username)){
									// TODO: @eazel7: estaría bueno que esto lo haga el servidor
									$scope.events.push(eventFromInstancia(i));
								}
							} else {
								$scope.events.push(eventFromInstancia(i));
							}
						}
					}
				});
			}
			$scope.calendar.refreshEvents && $scope.calendar.refreshEvents();
		};

	var traerDatos = function() {
		// TODO: sacar MEBRolesPorKey
		$scope.rolesPorKey = SRRolesPorKey();

		// TODO: sacar MEBTiposAsistenciaPorKey
		$scope.tiposAsistenciaPorKey = SRTiposAsistenciaPorKey();

		var salas = $scope.salas = SalasReuniones.list(function() {
			salas.forEach(function(r) {
				salasPorId[r._id] = r;
			});

			var instancias = $scope.instancias = SalasReunionesInstancia.query({
				$and:JSON.stringify([
					{desdeDate:{$gte: haceMesYMedio}},
					]),
			}, function() {
				instancias.forEach(function(i) {
					// la guardamos en el diccionario
					instanciasPorId[i._id] = i;
				});

				if ($scope.instanciaSeleccionada) {
					$scope.instancia = instanciasPorId[$scope.instanciaSeleccionada];
					$scope.sala = salasPorId[$scope.instancia.sala];
				}

				$scope.$watch('events', function() {
					refrescar();
				}, true);

				$scope.$watch('filtro.tipo', function() {
					refrescar();
				}, true);
			});
		});
	};

	traerDatos();
	$scope.$on('recargar-salas', traerDatos);

	var isMobile = {
			Android: function() {
					return navigator.userAgent.match(/Android/i);
		},
			BlackBerry: function() {
					return navigator.userAgent.match(/BlackBerry/i);
			},
		iOS: function() {
					return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			},
			Opera: function() {
					return navigator.userAgent.match(/Opera Mini/i);
			},
			Windows: function() {
					return navigator.userAgent.match(/IEMobile/i);
			},
			any: function() {
					return ( this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
			}
	};

	var tipoVista = {
		diaDefecto: function(){
			if( isMobile.any() )
				return "agendaDay";
			else
				return "agendaWeek";
		},
		headerLeft: function(){
			if( isMobile.any() )
				return "prev next agendaDay today";
			else
				return "prev next agendaDay agendaWeek month";
		},
		headerCenter: function(){
			if( isMobile.any() )
				return "";
			else
				return "today";
		}

	}


	$scope.calendar = {
		events: $scope.events,
		viewConfig: {
			height: 510,
			editable: true,
			allDaySlot: false,
			defaultView: tipoVista.diaDefecto(),//'agendaWeek',
			header: {
				left: tipoVista.headerLeft(), //'prev next agendaDay agendaWeek month',
				center: tipoVista.headerCenter(), //'today',
				right: ''//'title'
			},
			eventClick: function(event) {
				console.log('eventClick');
				$scope.instanciaSeleccionada = event._id;
				$scope.$apply();
			},
			eventMouseover: function(event) {
				$scope.resaltar = event.sala;
				$scope.salaResaltada = $scope.salasPorId[$scope.resaltar];
				$scope.instanciaResaltada = $scope.instanciasPorId[event._id];
				$scope.$apply();
			},
			eventMouseout: function(event) {
				$scope.salaResaltada = $scope.instanciaResaltada = $scope.resaltar = null;
				$scope.$apply();
			},
		}
	};

	$scope.$watch('instancia.sala', function(i) {
		if (i) {
			$scope.sala = $scope.salasPorId[i];
		} else {
			$scope.sala = null;
		}
	});

	$scope.$watch('instancia.desdeDate', function(d) {
		$scope.fechaDesde = new Date(d);
	});

	$scope.$watch('instanciaSeleccionada', function(i) {
		if (i) {
			$scope.instancia = $scope.instanciasPorId[i];
			if ($scope.instancia) {
				$scope.sala = $scope.salasPorId[$scope.instancia.sala];
			}
		} else {
			$scope.instancia = null;
			$scope.sala = null;
		}
		$scope.events.forEach(function(e) {
			e.color = salasPorId[e.sala].color;
			e.css = {
				opacity: (e._id != $scope.instanciaSeleccionada && '0.5') || '1.0'
			};

		});
		$scope.calendar.refreshEvents && $scope.calendar.refreshEvents();
	});

	$scope.$watch('estado.trabajando', function (t) {
		$rootScope.$broadcast('trabajando', t);
	}, true);

	$scope.filtroUsuarioPiso = function(sala){
		if($scope.username){
			return tienePermiso(sala.piso, $scope.username);
		} else {
			return true;
		}
	};
});

controllerCalendar.controller('SalasReunionesCateringCtrl', function($scope, $state, $stateProvider, Contactos, ORMContacto, SalasReuniones, SalasReunionesInstancia, $timeout, SRRolesPorKey, SRTiposAsistenciaPorKey, $location, $rootScope, $http) {
	$scope.filtro = {};

	$scope.orderByStar = function(c1, c2) {
		return (((c1 && c1.star) || 0) && 1) - (((c2 && c2.star) || 0) && 1);
	};

	// usamos ?instancia=... para trackear el id seleccionado y para hacer significativa la URL
	$scope.instanciaSeleccionada = $location.search().instancia;

	//vamos a esperar a que la directiva fullcalendar agregue la función goToDate y
	// la llamamos para asegurarnos que en el calendario
	$scope.$watch('instancia.desdeDate', function(d) {
		if ($scope.calendar && $scope.calendar.goToDate && d) {
			$scope.calendar.goToDate(new Date(d));
		}
	});

	// En este array vamos a guardar los objetos event de fullCalendar
	// http://arshaw.com/fullcalendar/docs/event_data/Event_Object/
	$scope.events = [];

	// diccionarios para acceder a los datos de las salas y las instancias por id
	var salasPorId = $scope.salasPorId = {};
	var instanciasPorId = $scope.instanciasPorId = {};

	$scope.colorSala = function (r){
		return (r.color || 'grey');
	};

	$scope.colorTipo = function (tipo){
		var color = "grey";
		$scope.salas.forEach(function(r) {
			if (tipo == r.tipo) {
				color = r.color;
			}
		});
		return color;
	};

	var formatTipoSalaCombo = function (object, container, query) {
		if (object.id != '') {
			var html = '<div style="width: 10px;height:10px;margin-right:4px;display:inline-block; background-color: '+ ($scope.colorTipo(object.id) || 'grey') +'"></div>' + object.text;
			console.log(html);
			return html;
		} else {
			return object.text;
		}
	};
	$scope.tipoSalaSelect2 = {
		formatResult: formatTipoSalaCombo,
		// formatSelection: formatTipoSalaCombo
	};

	var eventFromInstancia = function (i){
		return {
			title: i.titulo || '',
			start: new Date(i.desdeDate),
			end: new Date(i.hastaDate),
			editable: $scope.editando || false,
			allDay: false,
			color: salasPorId[i.sala].color || 'grey',
			html: '<i ng-repeat="p in salasPorId[instancia.sala].participantes" ngclass="{\'icon-star\': p.star, \'icon-star-empty\': !p.star}"></i> <span></span>',
			css: {
				opacity: (i._id != $scope.instanciaSeleccionada && '0.5') || '1.0'
			},
				// si agregamos estos campos al objeto event los mantiene
				// cuando lo pasa de parámetro en algún evento de UI (click, etc)
				sala: i.sala,
				_id: i._id
			};
		};

		var refrescar = function() {
		// borramos todos los eventos que había para el calendario
		$scope.events.splice(0, $scope.events.length);

		if ($scope.instancias) {
			$scope.instancias.forEach(function(i) {
				if ((!$scope.filtro || !$scope.filtro.tipo) ||
					 $scope.salasPorId[i.sala].tipo == $scope.filtro.tipo) {

				// TODO: @eazel7: estaría bueno que esto lo haga el servidor
			$scope.events.push(eventFromInstancia(i));
		}
	});
		}

		$scope.calendar.refreshEvents && $scope.calendar.refreshEvents();
	};

	var traerDatos = function() {
		// TODO: sacar MEBRolesPorKey
		$scope.rolesPorKey = SRRolesPorKey();

		// TODO: sacar MEBTiposAsistenciaPorKey
		$scope.tiposAsistenciaPorKey = SRTiposAsistenciaPorKey();

		var salas = $scope.salas = SalasReuniones.list(function() {
			salas.forEach(function(r) {
				salasPorId[r._id] = r;
			});

			var instancias = $scope.instancias = SalasReunionesInstancia.query({
				catering : true
			}, function() {
				instancias.forEach(function(i) {
					// la guardamos en el diccionario
					instanciasPorId[i._id] = i;
				});

				if ($scope.instanciaSeleccionada) {
					$scope.instancia = instanciasPorId[$scope.instanciaSeleccionada];
					$scope.sala = salasPorId[$scope.instancia.sala];
				}

				$scope.$watch('events', function() {
					refrescar();
				}, true);

				$scope.$watch('filtro.tipo', function() {
					refrescar();
				}, true);
			});
		});
	};

	traerDatos();
	$scope.$on('recargar-salas', traerDatos);

	$scope.calendar = {
		events: $scope.events,
		viewConfig: {
			height: 510,
			editable: true,
			allDaySlot: false,
			defaultView: 'agendaWeek',
			header: {
				left: 'prev next agendaDay agendaWeek month',
				center: 'today',
				right: ''//'title'
			},
			eventClick: function(event) {
				console.log('eventClick');
				$scope.instanciaSeleccionada = event._id;
				$location.search('instancia', event._id);
				$scope.$apply();
			},
			eventMouseover: function(event) {
				$scope.resaltar = event.sala;
				$scope.salaResaltada = $scope.salasPorId[$scope.resaltar];
				$scope.instanciaResaltada = $scope.instanciasPorId[event._id];
				$scope.$apply();
			},
			eventMouseout: function(event) {
				$scope.salaResaltada = $scope.instanciaResaltada = $scope.resaltar = null;
				$scope.$apply();
			},
		}
	};

	$scope.$watch('instancia.sala', function(i) {
		if (i) {
			$scope.sala = $scope.salasPorId[i];
		} else {
			$scope.sala = null;
		}
	});

	$scope.$watch('instancia.desdeDate', function(d) {
		$scope.fechaDesde = new Date(d);
	});

	$scope.$watch('instanciaSeleccionada', function(i) {
		if (i) {
			$scope.instancia = $scope.instanciasPorId[i];
			if ($scope.instancia) {
				$scope.sala = $scope.salasPorId[$scope.instancia.sala];
			}
		} else {
			$scope.instancia = null;
			$scope.sala = null;
		}
		$scope.events.forEach(function(e) {
			e.color = salasPorId[e.sala].color;
			e.css = {
				opacity: (e._id != $scope.instanciaSeleccionada && '0.5') || '1.0'
			};

		});
		$scope.calendar.refreshEvents && $scope.calendar.refreshEvents();
		if (i) {
			$location.search('instancia', i);
		}
	});

	$scope.$watch('estado.trabajando', function (t) {
		$rootScope.$broadcast('trabajando', t);
	}, true);
});

controllerCalendar.controller('TiposSalasCtrl', function($http, $rootScope, $location, $scope, $modal, SalasReunionesUsuariosPorPiso, SalasReuniones) {
	var self = this;

	self.programarNuevaFecha = function (r) {
		$scope.$emit('programar-nueva-fecha', r);
	};

	$('#modalReservar').on('shown', function () {
		document.getElementById("inputTitulo").focus();
	});

	var usuariosPisos = SalasReunionesUsuariosPorPiso.query();

	$scope.mostrar = function (r){
		if($scope.verApagadas){
			if (!$scope.filtro.nombre) {
				return true;
			} else {
				return $scope.filtro.nombre == r.nombre;
			}
		}else{
			if(!r.apagado){
				 if (!$scope.filtro.nombre) {
					return true;
				} else {
					return $scope.filtro.nombre == r.nombre;
				}
			}
		}
	};

	var tienePermiso = function(pisoSala, nombreUsuario){
		for ( var i = 0; i < usuariosPisos.length; i++ ){
			if( usuariosPisos[i].username == nombreUsuario){
				if( usuariosPisos[i].piso.indexOf(pisoSala)>=0){
					return true;
				} else {
					return false;
				}
			}
		}
		return false;
	};

	$scope.filtroUsuarioPiso = function(sala){
		return tienePermiso(sala.piso, $scope.username);
	};

	$scope.estaResaltado = function (t) {
		return t && $scope.resaltar == t._id;
	};

	$scope.aMilisegundos = function(fecha, hora, minutos) {
		var fechaDividida = fecha.split("/");
		var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], hora, minutos, 0, 0);
		return date.getTime();
	};

	$scope.respuesta = {

		seCreo: true
	}

	var pedirReunionSemanal = function( avisar ){
		var payload = $scope.reservaPeriodica;
		payload.usuario = $scope.username;
		payload.avisar = avisar;

		if( !payload.horaDesde ){
			payload.horaDesde = 0;
		}
		if( !payload.minutosDesde ){
			payload.minutosDesde = 0;
		}
		if( !payload.horaHasta ){
			payload.horaHasta = 0;
		}
		if( !payload.minutosHasta ){
			payload.minutosHasta = 0;
		}

		$http.post('/api/crearReservaSemanal', payload).success(function(asd) {
			$scope.respuesta = asd;
			if ( asd.error ){

				$scope.tituloModal = "No se pudo crear la clase semanal";
				$scope.contenidoModal = "<p>Ocurrio un error al crear la reserva semanal, por favor recargue y vuelva a intentar.</p><br><br><b>Error:</b> " + asd.texto + "<br> <b>Tipo:</b> " + asd.err;
				$('#modalAlertar').modal("show");

				console.log(" Ocurrio un error: '" + asd.texto + "' \nCodigo Error: " + asd.err );
			} else {
				$scope.reservaPeriodica.idSala = asd.idSala;
				if( asd.seCreo ){
					$scope.respuesta = {
						seCreo: true
					};
					$scope.reservaPeriodica = {
						idReunion : '',
						lunes : false,
						martes : false,
						miercoles : false,
						jueves : false,
						viernes : false,
						fecha1 : '',
						fecha2 : '',
						hora : '',
						minutos : '',
						duenio: ''
					};
					document.querySelector("#s2id_selectDuenno > a > span").innerText = "";
					document.querySelector("#inputEntreFechas").value = "";
					document.querySelector("#inputEntreFechas2").value = "";
					$('#modalReunionesPeriodicas').modal('toggle');
					$scope.contenidoModal = "";
				}
			}
		}).error(function(asd) {
			$scope.contenidoModal = "<p>Ocurrio un error al crear la reserva semanal, por favor recargue y vuelva a intentar.</p><br><br><b>Error:</b> " + asd;
		});

		$scope.$emit('recargar-salas');
	}

	$scope.maximaCantidadSemanal = 1;

	$scope.cambiarMaximo = function( idSala ){
		if( idSala ){
			var sala = SalasReuniones.get( {_id: idSala }, function(){
				$scope.maximaCantidadSemanal = ( sala.capacidad + sala.capacidadAdicional )
			}) ;
		} else {
			return 1;
		}
	}

	$scope.programaReservaPeriodica = function( confirmado, avisar ) {
		if ( confirmado ) {
			if ($scope.reservaPeriodica.fecha1 && $scope.reservaPeriodica.fecha2 && ( $scope.reservaPeriodica.horaDesde >= 0 ) && ( $scope.reservaPeriodica.minutosDesde >= 0 ) && ( $scope.reservaPeriodica.horaHasta >= 0 ) &&  ( $scope.reservaPeriodica.minutosHasta >= 0 ) && $scope.reservaPeriodica.idSala && ($scope.reservaPeriodica.lunes || $scope.reservaPeriodica.martes || $scope.reservaPeriodica.miercoles || $scope.reservaPeriodica.jueves || $scope.reservaPeriodica.viernes)) {

				var fechaInicio = ( moment( $scope.reservaPeriodica.fecha1, "DD/MM/YYYY").toDate().getTime() + ( 3 * 3600000 ) );
				var diaDeHoy  = moment(moment(new Date()).format("DD/MM/YYYY"), "DD/MM/YYYY").toDate().getTime();
				var fechaFin = ( moment( $scope.reservaPeriodica.fecha2, "DD/MM/YYYY").toDate().getTime() + ( 3 * 3600000 ) );

				if(  ( fechaInicio >= diaDeHoy ) ){
					if( ( fechaInicio < fechaFin ) ){
						if ( ( $scope.reservaPeriodica.horaDesde <= 23 ) || ( $scope.reservaPeriodica.horaHasta <= 23 ) ){
							if ( ( $scope.reservaPeriodica.minutosDesde <= 59 ) || ( $scope.reservaPeriodica.minutosHasta <= 59 ) ) {
								var sumaHoraInicio = ( ( $scope.reservaPeriodica.horaDesde * 60 ) + $scope.reservaPeriodica.minutosDesde );
								var sumaHoraFin = ( ( $scope.reservaPeriodica.horaHasta * 60 ) + $scope.reservaPeriodica.minutosHasta );
								if( sumaHoraInicio < sumaHoraFin ){
									// TIENEPERMISOS DE RECEPCION  $scope.hasPermission('salasreuniones.recepcion')
									if ( $scope.hasPermission( 'salasreuniones.crearEditarReuniones' ) ){
										pedirReunionSemanal( avisar );
									}
								} else {
									$scope.contenidoModal = "<p>La hora de inicio no puede ser igual ni mayor a la hora de fin</p>";
								}
							} else {
								$scope.contenidoModal = "<p>Los minutos no pueden ser mayor a 59</p>";
							}
						} else {
							$scope.contenidoModal = "<p>La hora no puede ser mayor a 23</p>";
						}
					} else {
						$scope.contenidoModal = "<p>La fecha de Inicio no puede ser mayor a la fecha de fin</p>";
					}
				} else {
					$scope.contenidoModal = "<p>La fecha de Inicio no puede ser menor al dia de hoy</p>";
				}

			} else {
				$scope.contenidoModal = "<p>Faltan datos para poder programar la reserva periódica</p>";
			}
		}
		else {
			$scope.reservaPeriodica = {
				idReunion : '',
				lunes : false,
				martes : false,
				miercoles : false,
				jueves : false,
				viernes : false,
				fecha1 : '',
				fecha2 : '',
				hora : '',
				minutos : '',
			};
			$('#modalReunionesPeriodicas').modal('show');
		}
	};

	$scope.cancelarCambiosEnvio = function( seCreo ){
		$scope.respuesta = {
			seCreo: true
		};
		$scope.reservaPeriodica = {
			idReunion : '',
			lunes : false,
			martes : false,
			miercoles : false,
			jueves : false,
			viernes : false,
			fecha1 : '',
			fecha2 : '',
			hora : '',
			minutos : '',
		};
	};
});

controllerCalendar.controller('SalasDisponiblesCtrl', function($rootScope, $location, $scope, $http, Contactos, SalasReunionesInstancia) {

	$scope.filtroFunc = function(sala){
		if($scope.filtroTv){
			if(sala.tv){
				return true;
			} else {
				return false;
			}
		} else {
			return true;
		}
	};

	$scope.cantidadPers = function(sala){
		if($scope.busqueda.cantidad){
			if( $scope.busqueda.cantidad <= ( sala.capacidad + sala.capacidadAdicional ) ){
				return true;
			} else {
				return false;
			}
		} else {
			return true;
		}
	}

	var self = this;
	$scope.salasLibres = $scope.salas;
	$scope.horas = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
	$scope.minutos = ['00','15','30','45'];
	$scope.filtroTv = false;
	$scope.busqueda = {};

	self.programarNuevaFecha = function (r) {
		var horaDesde = $scope.busqueda.horaDesde,
			minutosDesde = $scope.busqueda.minutosDesde,
			horaHasta = $scope.busqueda.horaHasta,
			minutosHasta = $scope.busqueda.minutosHasta;

		$scope.nombreSala = r.nombre;

		var fechaHoy = new Date(), min = "00", minutosFechaHoy = fechaHoy.getMinutes();

		if (minutosFechaHoy < 10) {
			min = "0" + minutosFechaHoy;
		} else {
			min = minutosFechaHoy;
		}

		var fechaDeCreacion = ( fechaHoy.getDate() + "/" + ( fechaHoy.getMonth() +1 ) + "/" + fechaHoy.getFullYear() + ' a las ' + fechaHoy.getHours() + ':' + min );

		$scope.salaAReservar = r;
		$scope.reservarSala = {
			usuario: $scope.username,
			salaNombre: r.nombre,
			sala: r._id,
			fecha: $scope.busqueda.fecha,
			desdeHora: "",
			hastaHora: "",
			desdeDate: "",
			hastaDate: "",
			creada: fechaDeCreacion,
			titulo: "",
			interno: "",
			asistentes: $scope.busqueda.cantidad,
			formato: "0",
			observaciones: "",
			lcd: $scope.filtroTv,
			consultaHora: {
				horaDesde: horaDesde,
				minutosDesde: minutosDesde,
				horaHasta: horaHasta,
				minutosHasta: minutosHasta
			},
			idClase: 1
		};

		$("#modalReservar").modal('show');
	};

	var aBuscar = ["fecha", "cantidad", "horaDesde", "minutosDesde", "horaHasta", "minutosHasta"];
	var lengthBuscar = aBuscar.length;
	self.sePuedeCrear = function (parametro){
		for(var i = 0; i < lengthBuscar; i++){
			if( ( $scope.busqueda[aBuscar[i]] == "" || $scope.busqueda[aBuscar[i]] == undefined) ){
				return false;
			}
		}
		return true;
	};

	$('#modalReservar').on('shown', function () {
		document.getElementById("inputTitulo").focus();
	});

	var idEscribir = ""; //Hacer
	var escribirError = function (mensaje, hacerFocus){
		document.getElementById("mensajeError").innerText = mensaje;
		document.getElementById(hacerFocus).focus();
	};

	var datosNecesarios = ["titulo", "idClase"],
		datosNecesariosUsuario = ["Título", "ID Clase"];
		datosNecesariosIdS = ["inputTitulo", "inputIDReunion"];

	$scope.reservarReunion = function (reservaSala){
		var mensaje = "";
		if( reservaSala.consultaHora.horaDesde && reservaSala.consultaHora.minutosDesde && reservaSala.consultaHora.horaHasta && reservaSala.consultaHora.minutosHasta ){
			reservaSala.desdeDate = $scope.aMilisegundos( reservaSala.fecha, reservaSala.consultaHora.horaDesde, reservaSala.consultaHora.minutosDesde );
			reservaSala.hastaDate = $scope.aMilisegundos( reservaSala.fecha, reservaSala.consultaHora.horaHasta, reservaSala.consultaHora.minutosHasta );
			reservaSala.desdeHora = reservaSala.consultaHora.horaDesde + ":" + reservaSala.consultaHora.minutosDesde;
			reservaSala.hastaHora = reservaSala.consultaHora.horaHasta + ":" + reservaSala.consultaHora.minutosHasta;
		} else {
			mensaje = "Falta completar algun campo de tiempo";
			escribirError( mensaje, "inputHora");
			return;
		}

		var lengthDatosNecesarios = datosNecesarios.length;
		for( var i = 0; i < lengthDatosNecesarios; i++ ){
			if ( reservaSala[datosNecesarios[i]] === "" ){
				mensaje = "Falta completar el campo " + datosNecesariosUsuario[i];
				escribirError( mensaje, datosNecesariosIdS[i]);
				return;
			}
		}
		if ( !( reservaSala.idClase && reservaSala.idClase > 0 ) ){
			mensaje = "Falta completar el campo ID";
			escribirError( mensaje, "inputIDReunion");
			return;
		}

		var instanciaSala = new SalasReunionesInstancia(reservaSala);
		instanciaSala.registroCambios = [];
		instanciaSala.registroCambios[0] = {
			codigoCambio: 1,
			usuario: $scope.username,
			descripcion: "Creacion",
			fecha: moment().format("DD/MM/YYYY HH:MM"),
			cambios: {
				usuario: $scope.username,
				sala: reservaSala.sala,
				duenio: reservaSala.duenio,
				formato: reservaSala.formato,
				titulo: reservaSala.titulo,
				interno: reservaSala.interno,
				asistentes: reservaSala.asistentes
			}
		};

		instanciaSala.salaNombre = reservaSala.nombre;
		instanciaSala.salaPiso = reservaSala.piso;
		instanciaSala.$save(function(guardado){
			$scope.$emit('recargar-salas');
			$('#modalReservar').modal('toggle');
			vaciarCampos();
		});
	};

	var buscarCorreo = function(nombre, contacto){
		if ( contacto.correos ) {
			var lengthCorreosContacto = contacto.correos.length;

			for ( var i = 0; i < lengthCorreosContacto; i++) {
				if ( contacto.correos[i].nombre == nombre ) {
					lengthCorreosContacto = null;
					return contacto.correos[i].valor;
				}
			}
		}
		return "";
	};

	var vaciarCampos = function(){
		$scope.busqueda = {};
		$scope.filtroNuevo = {};
		$scope.filtroTv = false;
		$scope.reservarSala = {};
		$scope.reservarSala.consultaHora = {};
		document.getElementById("inputFecha").value = "";
	};

	$scope.aMilisegundos = function(fecha, hora, minutos) {
		if(fecha && hora && minutos){
			var fechaDividida = fecha.split("/");
			var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], hora, minutos, 0, 0);
			return date.getTime();
		} else {
			return 0;
		}
	};

	$scope.buscar = function () {
		if ($scope.busqueda.fecha && $scope.busqueda.horaDesde && $scope.busqueda.minutosDesde && $scope.busqueda.horaHasta && $scope.busqueda.minutosHasta) {
			var milisegundosDesde = $scope.aMilisegundos($scope.busqueda.fecha, $scope.busqueda.horaDesde, $scope.busqueda.minutosDesde);
			var milisegundosHasta = $scope.aMilisegundos($scope.busqueda.fecha, $scope.busqueda.horaHasta, $scope.busqueda.minutosHasta);
			var ocupadas = [];
			$scope.salasLibres = [];
			if( milisegundosDesde < milisegundosHasta ){
				//Comprueba horarios
				$scope.instancias.forEach(function(i) {

					if ( (((milisegundosDesde >= i.desdeDate) && (milisegundosDesde < i.hastaDate))||
							((milisegundosHasta > i.desdeDate) && (milisegundosHasta <= i.hastaDate))) ||
								((i.desdeDate >= milisegundosDesde) && (i.desdeDate < milisegundosHasta))||
									((i.hastaDate > milisegundosDesde) && (i.hastaDate <= milisegundosHasta)) )
					{
						if ( ocupadas.indexOf(i.sala) == -1 ){
							ocupadas.push(i.sala);
						}
					}
				});
				//Capacidad
				$scope.salas.forEach( function( r ) {
					if ( ocupadas.indexOf( r._id ) == -1 ) {
						if ( ( parseInt( r.capacidad ) + r.capacidadAdicional ) >= $scope.busqueda.cantidad ) {
							$scope.salasLibres.push(r);
						}
					}
				});
			}
		}
	};

	$scope.estaResaltado = function (t) {
		return t && $scope.resaltar == t._id;
	};

	$scope.$watch('busqueda.cantidad + busqueda.horaDesde + busqueda.minutosDesde + busqueda.horaHasta + busqueda.minutosHasta + busqueda.fecha', function() {
		$scope.buscar();
	});
});

controllerCalendar.controller('SRTabReservaCtrl', function($scope, SalasReunionesInstancia, Contactos, $location, $rootScope, $http) {

	$scope.contactos = Contactos.listar();

	$scope.sePuedeGuardar = false;

	$scope.traerFormatoDeSala = function(idSala){
		for( var i = 0; i < $scope.todasLasSalas.length; i++){
			if ( idSala == $scope.todasLasSalas[i]._id ){
				if($scope.$scope.todasLasSalas[i].formato){
					return $scope.todasLasSalas[i].formato;
				} else {
					return '1';
				}
			}
		}
	};

	$scope.buscarCorreo = function(nombre, contacto){
		if (!contacto.correos) {
			return "";
		}
		else {
			for (var i = 0; i < contacto.correos.length; i++) {
				var em = contacto.correos[i];

				if (em.nombre == nombre) {
					return em.valor;
				}
			}
		}

		return "";
	};

	$scope.contactoPorId = function (id) {
		if (id) {
			for (var i = 0; i < $scope.contactos.length; i++) {
				if ($scope.contactos[i]._id == id){
					return $scope.contactos[i];
				}
			}
		}
	};

	$scope.filtroEstado = function (sala) {
		if (sala.apagado) {
			return false;
		} else {
			return true;
		}
	};

	$scope.aMilisegundos = function(fecha, hora) {
		var fechaDividida = fecha.split("/");
		var horaDividida = hora.split(":");
		var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], horaDividida[0], horaDividida[1], 0, 0);
		return date.getTime();
	};

	$scope.guardarCambios = function() {
		angular.extend(new SalasReunionesInstancia($scope.instancia), {
			suspendida: $scope.live.suspendida,
			comentarios: $scope.live.comentarios
		}).$save(function() {
			$scope.applyChanges();
		});
	};

	$scope.$watch('instancia', function() {
		if( $scope.sala && $scope.sala.capacidad){
			$scope.maximaCantidadUnica = ( $scope.sala.capacidad+$scope.sala.capacidadAdicional );
		} else {
			return 1;
		}
	}, true);

	//@Aca
	$scope.guardar = function() {
		$scope.instancia.datosParaRegistro = {
			fecha: $scope.instancia.fecha,
			desdeHora: $scope.instancia.desdeHora,
			hastaHora: $scope.instancia.hastaHora
		};

		var registroCambios = SalasReunionesInstancia.get({ _id: $scope.instancia._id} ,function(){
			if( registroCambios ){
				$scope.instancia.registroCambios = registroCambios.registroCambios;
			}
			$http.post('/api/salasreunionesActualizarDatosReunion',  $scope.instancia).success(function( reunionCreada ) {
				if( !reunionCreada.error ){
					if ( reunionCreada.seCreo ){
						// Cambia el link y trae los datos de la reunion
						$scope.calendar.refreshEvents && $scope.calendar.refreshEvents();
						$location.search();

						$scope.$emit('seGuardoUnaReunion', $scope.instancia);

						delete $scope.instancia;
						$scope.sePuedeGuardar = false;
						$scope.$emit('seGuardoLaReunionObligatoria', $scope.instancia);
					} else {
						$scope.tituloModal = "No se creo";
						$scope.contenidoModal = "<p><b>Causa: </b> " + reunionCreada.causa + "</p>";
						$('#modalAlertar').modal("show");
					}
				} else {
					console.log(reunionCreada);
					alert("Ocurrio un error al crear la reunion, por favor recargue y vuelva a intentar");
				}

			}).error(function() {
				console.log(reunionCreada);
				alert("Ocurrio un error al crear la reunion, por favor recargue y vuelva a intentar");
			});
		})
	};

	$scope.valorConmutador = function(c) {
		if (c) {
			if (c.telefonos) {
				for (var i = 0; i < c.telefonos.length; i++) {
					if (c.telefonos[i].nombre == 'Conmutador') {
						return c.telefonos[i].valor + ' int. ' + c.telefonos[i].interno;
					}
				}
				return 'No hay conmutador cargado';
			}
		}
	};

	$scope.valorTelefono = function(c) {
		if (c) {
			if (c.telefonos) {
				for (var i = 0; i < c.telefonos.length; i++) {
					if (c.telefonos[i].nombre == 'Telefono directo') {
						return c.telefonos[i].valor;
					}
				}
				return 'No hay telefono cargado';
			}
		}
	};

	$scope.agregarParticipante = function(data) {
		if (!$scope.instancia.participantes) {
			$scope.instancia.participantes = [];
		}
		var parti = {
			contactoId : data,
			externo: false
		};
		$scope.instancia.participantes.push(parti);
	};

	$scope.abrirModalSala = function() {
		$("#modalSala").modal('show');
	};

	$scope.abrirModal = function() {
		$("#modalVisitas").modal('show');
	};

	$scope.guardarVisitas = function() {
		$scope.instancia.$save();
	};

	$scope.guardarSala = function() {
		$scope.instancia.$save({}, function() {
			$scope.$emit('recargar-salas');
		});
	};

	$scope.valorCorreo = function(c) {
		if (c) {
			if (c.correos) {
				for (var i = 0; i < c.correos.length; i++) {
					if (c.correos[i].nombre == 'Email oficial') {
						return c.correos[i].valor;
					}
				}
				return 'No hay correo cargado';
			}
		}
	};

	$scope.abrirModalContacto = function() {
		$("#modalContacto").modal('show');
	};

	$scope.eliminar = function(confirmado) {
		if (confirmado) {
			$scope.instancia.$delete(function(eliminado) {
				$location.url('/salasreuniones');
				$rootScope.$broadcast('volver');
			});
		}
		else {
			$("#confirmarEliminar").modal('show');
		}
	};

	$scope.eliminarSemanal = function(confirmado, idReunionSemanal) {
		if (confirmado) {
			$http.post('/api/eliminarReservaSemanal', { idReunionSemanal: idReunionSemanal }).success(function(asd) {
				$scope.$parent.reunionSemanalBorrar = "";
				$location.url('/salasreuniones');
				$rootScope.$broadcast('volver');
			})
			.error(function(asd){
				alert("Ocurrio un error, por favor recargue y vuelva a intentar");
				console.log("Ocurrio un error \n" +  asd);
			});
		}
		else {
			$scope.$parent.reunionSemanalBorrar = idReunionSemanal;
			$("#confirmarEliminarSemanal").modal('show');
		}
	};
});

controllerCalendar.controller("SalasReunionesPrint", function ($scope, $rootScope, $routeParams, $window, Contactos, SalasReunionesInstancia, SalasReuniones) {
	$scope.instancia = SalasReunionesInstancia.get({_id: $routeParams._id}, function(){
		$scope.sala = SalasReuniones.get({_id: $scope.instancia.sala});
	});

	$scope.imprimir = function () {
		$window.print();
	};

	$scope.contactos = Contactos.listar();

	$scope.contactoPorId = function (id) {
		if (id) {
			for (var i = 0; i < $scope.contactos.length; i++) {
				if ($scope.contactos[i]._id == id){
					return $scope.contactos[i];
				}
			}
		}
	};

	$scope.valorConmutador = function(c) {
		if (c) {
			if (c.telefonos) {
				for (var i = 0; i < c.telefonos.length; i++) {
					if (c.telefonos[i].nombre == 'Conmutador') {
						return c.telefonos[i].valor + ' int. ' + c.telefonos[i].interno;
					}
				}
				return 'No hay conmutador cargado';
			}
		}
	};

	$scope.valorTelefono = function(c) {
		if (c) {
			if (c.telefonos) {
				for (var i = 0; i < c.telefonos.length; i++) {
					if (c.telefonos[i].nombre == 'Telefono directo') {
						return c.telefonos[i].valor;
					}
				}
				return 'No hay telefono cargado';
			}
		}
	};

	$scope.valorCorreo = function(c) {
		if (c) {
			if (c.correos) {
				for (var i = 0; i < c.correos.length; i++) {
					if (c.correos[i].nombre == 'Email oficial') {
						return c.correos[i].valor;
					}
				}
				return 'No hay correo cargado';
			}
		}
	};

	var f = new Date();
	var minutos = "00";
	if (f.getMinutes() < 10) {
		minutos = "0" + f.getMinutes();
	} else {
		minutos = f.getMinutes();
	}
	$scope.hora = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear() + ' a las ' + f.getHours() + ':' + minutos);
});

controllerCalendar.controller('SalasRegistroCtrl', function($scope, SalasReuniones, SalasReunionesInstancia, Contactos, $http) {

	var tiempoParaCambio = 1800000; // Media hora
	var reproductorDeVideo = document.getElementById( "reproductorVideo" );

	var cambiarEstadoVideo = function( tipoCambio ){
		switch( tipoCambio ){
			case 1:
				// Reproducir Video
				reproductorDeVideo.play();
				break;
			case 2:
				// Pausar Video
				reproductorDeVideo.pause();
				break;
			case 3:
				// Maximizar Video
				break;
			case 4:
				// Minimizar Video
				break;
			case 5:
				// Subir Volumen
				reproductorDeVideo.volume+=0.1;
				break;
			case 6:
				// Bajar Volumen
				reproductorDeVideo.volume-=0.1;
				break;
			default:
				// Pausar Video
				break;
		}
	};

	var reproduciendo = false;
	var cambiarEstado = function(){
		if( $scope.pisoAula == "Todas las Aulas" ){
			if( document.getElementById( "reproductorVideo" ).paused ){
				reproduciendo = !reproduciendo;
				$scope.$apply();

				if( reproduciendo ){
					cambiarEstadoVideo(1);
				}
			}
		}
	};

	var intervaloDeCambio = setInterval( function(){ cambiarEstado() }, tiempoParaCambio);

	document.getElementById( "reproductorVideo" ).onended = function () {
  		cambiarEstado();
  		clearInterval( intervaloDeCambio );
		intervaloDeCambio = setInterval( cambiarEstado, tiempoParaCambio );
	};



	function setearHeight(){
		var $alturaMayor = 0;
		$(".columnas").each( function( index ) {
			var $alturaActual = $( this ).height();
			if( $alturaActual > $alturaMayor ) {
				$alturaMayor = $alturaActual;
			}
		});
			$(".columnas").each( function( index ) {
			$( this ).height( $alturaMayor );
		});
	};
	window.setTimeout( setearHeight, 1000 );

	var pulsado = 0;
	$scope.cambiarPiso = function(){
		function alPost(pulsado){
			$http.post('/api/salas',{"piso":pulsado})
			.success( function ( data ) {
				$scope.salas = data;
			}).error(function( err ){
				console.log("Ocurrio un error" + err);
			});
		};

		if(pulsado == 0){
			//Muestro todo
			alPost(0);
			$scope.pisoAula = "Aulas 2º Piso";
			window.setTimeout( setearHeight, 1000 );
			pulsado = 2;
		}else if(pulsado == 2){
			//Muestro piso 2
			alPost(2);
			$scope.pisoAula = "Aulas 3º Piso";
			window.setTimeout( setearHeight, 1000 );
			pulsado = 3;
		}else if(pulsado == 3){
			//Muestro pìso 3
			alPost(3);
			$scope.pisoAula = "Todas las Aulas";
			window.setTimeout( setearHeight, 1000 );
			pulsado = pulsado = 0;
		}
	}

	$scope.pisoAula = "Todas las Aulas";

	$http.post('/api/salas',{"piso":0})
	.success( function ( data ) {
		$scope.salas = data;
	}).error(function( err ){
		console.log("Ocurrio un error" + err);
	});

	$scope.fecha = new Date();
	var hoy = $scope.fecha.getTime();

	$scope.dia = moment().format('dddd');

	$scope.filtroHora = function(fecha){
		if(fecha.hastaHora > moment(hoy).format('HH:mm')){
			return true;
		}else{
			return false;
		}
	}

	$scope.filtroSala = function(sala){
		if(pulsado == 0){
			return true;
		}else if(parseInt(sala.piso) == pulsado){
			return true;
		}else{
			return false;
		}
	};

	$scope.filtroSalas = function(sala){
		if(sala.apagado){
			return false;
		}else{
			if(!$scope.filtroPiso){
				return true;
			}else{
				if(sala.piso == $scope.filtroPiso){
					return true;
				}else{
					return false;
				}
			}
		}
	};

});

controllerCalendar.controller("SalasReunionesReporteCtrl", function ($scope, $rootScope, $routeParams, Contactos, SalasReuniones, SalasReunionesInstancia) {
	var calcularPromedio = function( elArray, valor ){
		if(elArray){
			var asistentes = 0, lengthElArray = elArray.length;
			if( lengthElArray){
				elArray.forEach(function(reunion){
					asistentes+= parseInt(reunion[valor]);
				});
				return ( asistentes / lengthElArray ).toFixed();
			}
		}
		return 0;
	};

	var sumarAsistentes = function ( elArray, valor ){
		if( elArray ){
			var total = 0;
			elArray.forEach(function(reunion){
				total+= parseInt(reunion[valor]);
			});
			return total;
		}
		return 0;
	};

	var fechaHoy = new Date();
	$scope.fechaActual = "";

	if(fechaHoy.getDate() < 10){ $scope.fechaActual+="0"; }
	$scope.fechaActual+= fechaHoy.getDate()+"/";
	if(fechaHoy.getMonth() < 10){ $scope.fechaActual+="0"; }
	$scope.fechaActual+=(fechaHoy.getMonth()+1)+"/";
	$scope.fechaActual+=fechaHoy.getFullYear();

	$scope.salas = SalasReuniones.query(function(){
		SalasReunionesInstancia.query(function(todasReuniones){
			$scope.salas.forEach(function(sala, indexSala){
				$scope.salas[indexSala].reunionesTotales = [];
				todasReuniones.forEach(function(reunion, indexReunion){
					if(sala._id == reunion.sala){
						$scope.salas[indexSala].reunionesTotales.push({
							asistentes: reunion.asistentes || 0,
							inicio: reunion.desdeDate,
							fin: reunion.hastaDate,
							fecha: reunion.fecha,
							desdeHora: reunion.desdeHora,
							hastaHora: reunion.hastaHora,
							titulo: reunion.titulo || "",
							duenio: reunion.duenio,
							interno: reunion.interno
						});
						//console.log($scope.salas[indexSala].reunionesTotales);
						//todasReuniones.splice(indexReunion, 1);
					}
				});
			});
			$scope.salas.forEach(function(sala, indexSala){
				$scope.salas[indexSala].promedioAsistencia = calcularPromedio( $scope.salas[indexSala].reunionesTotales, "asistentes" );
				$scope.salas[indexSala].totalAsistentes = sumarAsistentes( $scope.salas[indexSala].reunionesTotales, "asistentes" );
			});
		});
	});

	$scope.filtroDia = function(reunion){
		if ( reunion.fecha == $scope.fechaActual){
			return true;
		} else {
			return false;
		}
	};
});

controllerCalendar.controller('salasReunionesNuevaSalaCrtl', function($scope, SalasReuniones, $location){
	$scope.sala = new SalasReuniones({});
	$scope.uploaded = [];

	// nuevo
	$scope.fechaDeHoy = function(){
		return moment().format("DD/MM/YYYY");
	};

	$scope.guardarObservacion = function(){
		if( $scope.observacion.descripcion.length > 0){
			$scope.sala.observaciones.push({
				fecha: $scope.observacion.fecha,
				descripcion: $scope.observacion.descripcion,
				usuario: $scope.username,
				fechaCreacion: moment().format("DD/MM/YYYY HH:MM"),
				estado: false
			})
		}

		$scope.observacion.fecha = $scope.fechaDeHoy();
		$scope.observacion.descripcion = "";
	}
	//fin nuevo

	var color = function(){
		var color   = '#',
		letters = '0123456789ABCDEF'.split('');

		for (var i = 0; i < 6; i++ )
			color += letters[Math.floor(Math.random() * 16)];

		return color;
	}

	$scope.sala.color = color();

	$scope.sala.piso = '0';

	$scope.guardar = function(){

		if($scope.uploaded.length > 0)
			 $scope.sala.imagen = $scope.uploaded.shift().id;

		$scope.sala.$save(function(){
			 $scope.uploaded = [];
			 $location.url('/salasreuniones');
		});
	}
});

controllerCalendar.controller('salasReunionesEditarSalaCrtl', function($scope, SalasReuniones, $location, $routeParams){
	$scope.sala = SalasReuniones.get({_id:$routeParams._id}, function(){
		if( typeof $scope.sala.capacidad ==  'string' ){
			$scope.sala.capacidad = parseInt( $scope.sala.capacidad );
		}
	});
	$scope.uploaded = [];

	// nuevo
	$scope.fechaDeHoy = function(){
		return moment().format("DD/MM/YYYY");
	};

	$scope.guardarObservacion = function(){
		if( $scope.observacion.descripcion.length > 0 ){
			$scope.sala.observaciones.push({
				fecha: $scope.observacion.fecha,
				descripcion: $scope.observacion.descripcion,
				usuario: $scope.username,
				fechaCreacion: moment().format("DD/MM/YYYY HH:MM"),
				estado: false
			})
		}

		$scope.observacion.fecha = $scope.fechaDeHoy();
		$scope.observacion.descripcion = "";
	}
	//fin nuevo

	$scope.guardar = function(){

		if($scope.uploaded.length > 0)
			 $scope.sala.imagen = $scope.uploaded.shift().id;

		$scope.sala.$save(function(){
			 $scope.uploaded = [];
			 $location.url('/salasreuniones');
		});
	};
});

controllerCalendar.controller('SalasReunionesRegistroCtrl', function($scope,  SalasReuniones, SalasReunionesInstancia, $routeParams) {
	$scope.reunion = SalasReunionesInstancia.get( { _id : $routeParams._id }, function(){
		$scope.sala = SalasReuniones.get( { _id : $scope.reunion.sala });
	} );

	$scope.tipoClase=function( tipoDeCambio ) {
		switch( tipoDeCambio ){
			case 1:
				return "success"; // Creacion
			case 2:
				return "warning"; // Modificacion
			case 3:
				return "info"; // Ajuste
			case 4:
				return "primary"; // Movida
		}
	 };

		$scope.colorFondo=function( tipoDeCambio ){
			switch( tipoDeCambio ){
			case 1:
				return "#3f903f"; // Creacion
			case 2:
				return "#f0ad4e"; // Modificacion
			case 3:
				return "#5bc0de"; // Ajuste
			case 4:
				return "#2e6da4"; // Movida
		}
		};

		$scope.iconoCambio=function( tipoDeCambio ){
			switch( tipoDeCambio ){
			case 1:
				return "icon-plus"; // Creacion
			case 2:
				return "icon-check"; // Modificacion
			case 3:
				return "icon-resize-full"; // Ajuste
			case 4:
				return "icon-move"; // Movida
		}
	 };
});