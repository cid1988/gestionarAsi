exports = module.exports = function(app, conf) {
	var mongo = require('mongodb'), db = require('../../../db');

	var moment = require('moment');
	db.setConf(conf);

	var unDiaEnMiliseg = 86400000, unaHoraMiliseg = 3600000, unMinutoMilisg = 60000;

	// Retorna un array numerico con los dias de la semana que estan ocupados
	var diasDeReunionToArray = function( datosReunion ){
		var arrayRetornar = [], dias = ["domingo", "lunes","martes","miercoles","jueves","viernes", "sabado"];

		for( var i = 0; i < dias.length; i++ ){
			if( datosReunion[ dias[ i ] ] ){
				arrayRetornar.push( i );
			}
		};

		return arrayRetornar;
	}

	// Comprueba si en ese numero de dia de la semana ocurre otra reunion
	var ocurrenElMismoDiaDeLaSemana = function( diaSemanaReunion, diasReservados ){
		var diaSemana = moment( diaSemanaReunion, "DD/MM/YYYY").day();

		for( var i = 0; i < diasReservados.length; i++ ){
			if ( diaSemana == diasReservados[i] ){
				return true;
			}
		}

		return false;
	}

	// Retorna todas las reuniones que ocurren algun dia en especifico
	var existenReunionesEsteDia = function( dia, reuniones ){
		var reunionesDelDia = [];
		for( var i = 0; i < reuniones.length; i++ ){
			if ( ( reuniones[i].desdeDate > dia ) && ( reuniones[i].desdeDate < ( dia + unDiaEnMiliseg ) ) ){
				reunionesDelDia.push( reuniones[i] );
			}
		}

		return reunionesDelDia;
	}

	// Retorna una fecha en milisegundos +  una hora en milisegundos + un minuto en milisegundos. Se le pasa MILISEG, HH, MM y lo retorna todo sumado en milisegundos.
	var aMilisegundos = function( diaMiliseg, horaNumero, minutoNumero ){

		return ( ( diaMiliseg ) + ( horaNumero * unaHoraMiliseg ) + ( minutoNumero * unMinutoMilisg ) );
	}

	// Retorna el objet de una reunion, es el que utiliza la collecion.
	var objetoNuevaReunion = function( payload, timeInicioMiliseg, timeFinMiliseg, id ){
		return ({
			usuario: payload.usuario,
			sala: payload.idSala,
			fecha: moment(timeInicioMiliseg).format("DD/MM/YYYY"),
			desdeHora: payload.horaDesde + ":" + payload.minutosDesde,
			hastaHora: payload.horaHasta + ":" + payload.minutosHasta,
			desdeDate: timeInicioMiliseg,
			hastaDate: timeFinMiliseg,
			formato: 0,
			creada: moment().format("LLLL"),
			titulo: payload.titulo,
			duenio: payload.duenio,
			interno: payload.interno,
			asistentes: payload.asistentes || 0,
			idReunionSemanal: id,
			idClase: payload.idClase
		});
	}

	// Retorna false si SI existe una reunion, caso contrario retorna true porque NO existe una clase (Complicado? XD)
	var noExisteReunion = function( reuniones, fechaComprobar ){
		for( var i = 0; i < reuniones.length; i++ ){
			if( reuniones[i].fecha == fechaComprobar ){
				return false;
			}
		}
		return true;
	}

	// Retorna true si las fechas en milisegundos se interesectan
	var chocaConOtraReunion = function( inicioReunion, finReunion, inicioComprobar, finComprobar){
		if(  ( ( inicioReunion >= inicioComprobar ) && ( inicioReunion < finComprobar ) )||
			( ( finReunion > inicioComprobar ) && ( finReunion <= finComprobar ) )||
				( ( inicioComprobar >= inicioReunion  ) && ( inicioComprobar < finReunion ) )||
					( (  finComprobar > inicioReunion ) && ( finComprobar <= finReunion ) ) ){
			return true;
		} else {
			return false;
		}
	}

	// Para retornar en caso de que ocurra un error
	var retornarError = function( res, err, texto ){
		console.log( texto + "\n" + err);
		res.json({
			texto: texto,
			err: err
		})
	}

	var retornarRegistroActualizar = function( payload ){
		var retornar = {
			usuario: payload.usuario,
			sala: payload.sala,
			duenio: payload.duenio,
			formato: payload.formato,
			titulo: payload.titulo,
			interno: payload.interno,
			asistentes: payload.asistentes,
			idClase: payload.idClase
		}

		return retornar;
	}

	var retornarCambioONuevo = function( codigoCambio, usuario, descripcion, cambios ){
		var retornar = {
			codigoCambio: codigoCambio,
			usuario: usuario,
			descripcion: descripcion,
			fecha: moment().format("DD/MM/YYYY  HH:MM"),
			cambios: cambios
		}

		return retornar;
	}

	// Crea una reserva semanal
	app.post('/api/crearReservaSemanal', function( req, res ){
		var payload = req.body;

		db.getDbInstance( function( err, db ){
			if( err ) retornarError( res, err, "Ocurrio un error al conectarse a la BD");

			var fecha1 = moment(payload.fecha1, "DD/MM/YYYY").toDate().getTime(), fecha2 = moment(payload.fecha2, "DD/MM/YYYY").add(1, 'days').toDate().getTime();

			db.collection("salasreuniones.instancias").find( {
				sala: payload.idSala,
				desdeDate: {
					$gte: fecha1
				},
				hastaDate: {
					$lte: fecha2
				}
			},{
				titulo: 1,
				desdeDate: 1,
				hastaDate: 1,
				fecha: 1,
				desdeHora: 1,
				hastaHora: 1
			} ).toArray(function( err, reuniones ){
				if( err ) retornarError( res, err, "Ocurrio un error al traer las reuniones de la colleccion");

				var reunionesNoCreadas = [], reunionesCreadas = [];

				// Almaceno en un array los dias de la semana que se pretende crear la reunion
				var arrayDiasOcupados = diasDeReunionToArray(payload);

				// Este id lo utilizo para poder encontrar a todas las reuniones creadas de manera semanal
				var id = new mongo.ObjectID().toString();

				// Recorro desde el dia 1 hasta el ultimo dia de la reserva semanal sumando de a 1 dia en milisegundos
				for( var i = fecha1; i < fecha2; i+=unDiaEnMiliseg ){
					var reunionesDelDia = existenReunionesEsteDia( i, reuniones);

					// Tomo el valor "i" que equivale al dia en milisegundos y le sumo las horas y minutos.
					var timeInicioMiliseg = aMilisegundos( i, payload.horaDesde, payload.minutosDesde );
					var timeFinMiliseg = aMilisegundos( i, payload.horaHasta, payload.minutosHasta );

					// Si existen reuniones ese dia
					if( ( reunionesDelDia.length ) ){
						// Si ese dia de la semana tiene que poseer una reunion
						if( ocurrenElMismoDiaDeLaSemana( reunionesDelDia[0].fecha, arrayDiasOcupados ) ){
							// Recorro todaslas reuniones que ocurren el dia de la clase que quiero agendar
							var cantidadReunionesEsteDia = reunionesDelDia.length;
							for( var j = 0; j < cantidadReunionesEsteDia; j++ ){

								// Si alguna de esas condiciones se cumplen, significa que chocan con el mismo horario
								if( chocaConOtraReunion( timeInicioMiliseg, timeFinMiliseg, reunionesDelDia[j].desdeDate, reunionesDelDia[j].hastaDate ) ){
									// AVISO QUE NO SE PUEDE CREAR
									reunionesNoCreadas.push( reunionesDelDia[ j ] ) ;
									break;
								} else {
									// CREO LA REUNION
									if( j == ( cantidadReunionesEsteDia - 1 ) ){
										if ( noExisteReunion( reunionesCreadas, moment(timeInicioMiliseg).format("DD/MM/YYYY") ) ){
											reunionesCreadas.push( objetoNuevaReunion( payload, timeInicioMiliseg, timeFinMiliseg, id) ) ;
        										}
									}
								}
							}
						}
					} else {
						// No existen reuniones guardadas en esta sala, para este dia asi que lo guardo directamente
						// Si ese dia de la semana tiene que poseer una reunion
						var diaEstandar = moment( aMilisegundos( i, payload.horaDesde, payload.minutosDesde ) ).format("DD/MM/YYYY");

						if( ocurrenElMismoDiaDeLaSemana(  diaEstandar, arrayDiasOcupados ) ){
							// CREO LA REUNION
							if ( noExisteReunion( reunionesCreadas, moment(timeInicioMiliseg).format("DD/MM/YYYY") ) ){
								reunionesCreadas.push( objetoNuevaReunion( payload, timeInicioMiliseg, timeFinMiliseg, id) ) ;
							}

						}
					}
				}

				if(  payload.avisar && ( reunionesNoCreadas && reunionesNoCreadas.length ) ){
					res.json({
						error: false,
						seCreo: false,
						titulo: "Algunas reuniones no se pueden crear",
						texto: "Las siguientes reuniones interfieren con sus reservas.",
						idSala: payload.idSala,
						reunionesNoCreadas: reunionesNoCreadas
					})
				} else {

					if( reunionesCreadas && reunionesCreadas.length ){

						for( var i = 0; i < reunionesCreadas.length; i++ ){
							reunionesCreadas[i].registroCambios = [];
							reunionesCreadas[i].registroCambios[0] = retornarCambioONuevo( 1, payload.usuario, "Creación Semanal",  {
								usuario: payload.usuario,
								sala: payload.idSala,
								duenio: payload.duenio,
								formato: 0,
								titulo: payload.titulo,
								interno: payload.interno,
								asistentes: payload.asistentes,
								cambiosCreacion: {
									fecha: reunionesCreadas[i].fecha,
									desdeHora: reunionesCreadas[i].desdeHora,
									hastaHora: reunionesCreadas[i].hastaHora
								},
								idClase: payload.idClase
							 } );
						}

						db.collection("salasreuniones.instancias").insert( reunionesCreadas, { w: 1 }, function( err, insertados ){
							if( err ) retornarError( res, err, "Ocurrio un error al insertar las reuniones a la collecion");

							res.json({
								noCreadas: reunionesNoCreadas,
								creadas: reunionesCreadas,
								seCreo: true,
								idSala: payload.idSala,
								error: false
							})
						} );
					} else {
						res.json({
							noCreadas: reunionesNoCreadas,
							creadas: [],
							seCreo: true,
							idSala: payload.idSala,
							error: false
						})
					}
				}
			})
		} )
	});

	app.post('/api/eliminarReservaSemanal', function( req, res){
		var payload = req.body;

		db.getDbInstance( function( err, db){
			if( err ) retornarError( res, err, "Ocurrio un error al conectarse a la BD");

			db.collection("salasreuniones.instancias").remove({ idReunionSemanal: payload.idReunionSemanal }, { w: 1 }, function( err , eliminados ){
				if(err){
					console.log(" Ocurrio un error al eliminar los registros");
					res.json({
						error: true,
						tipo: "Error al remover el registro ",
						exp: err
					})
				}

				res.json({
					error: false,
					cantidadEliminados: eliminados
				})
			})
		});
	})

	app.post('/api/salasreunionesCrearReunion', function( req, res){
		var payload = req.body.payload;

		db.getDbInstance( function( err, db ){
			if( err ) retornarError( res, err, "Ocurrio un error al conectarse a la BD");

			var fechaInicio = moment( payload.startDate );
			var fechaFin = moment( payload.startDate ).add(1, 'hours');

			db.collection("salasreuniones.instancias").find( {
				sala:  payload.sala._id,
				fecha: fechaInicio.format("DD/MM/YYYY")
			}, {
				titulo: 1,
				desdeDate: 1,
				hastaDate: 1
			}).toArray( function( err, reuniones ){
				if( err ) retornarError( res, err, "Ocurrio al traer todas las reuniones del dia");

				console.log("Reuniones: \n\n" + JSON.stringify(reuniones,null,4));

				var cantidadReuniones = reuniones.length;

				//var fnHoraMilisec = fechaDelFrontEnd.add(2, 'hours');

				// Si no existen reuniones en esta sala este dia creo directamente
				if( cantidadReuniones ){
					for( var i = 0; i < cantidadReuniones; i++ ){
						if( chocaConOtraReunion( fechaInicio.valueOf(), fechaFin.valueOf(), reuniones[i].desdeDate, reuniones[i].hastaDate ) ){
							// AVISO QUE NO SE PUEDE CREAR
							res.json({
								error: false,
								seCreo: false,
								causa: "La clase que desea crear interferia con otra previamente agendada",
								titulo: reuniones[i].titulo
							})
							break;
						} else if ( i == ( cantidadReuniones - 1 ) ){
							// CREO LA REUNION
							var insertar = {
								usuario: payload.usuario,
								sala: payload.sala._id,
								fecha: fechaInicio.format("DD/MM/YYYY"),
								desdeHora: fechaInicio.format("HH:mm"),
								hastaHora: fechaFin.format("HH:mm"),
								desdeDate: fechaInicio.valueOf(),
								hastaDate: fechaFin.valueOf(),
								formato: 0,
								creada: moment().format("LLLL"),
								titulo: "",
								duenio: "",
								interno: "",
								asistentes: 0,
								idClase: payload.idClase
							};

							db.collection("salasreuniones.instancias").save( insertar, { w: 1, fsync: 1 }, function( err, insertada ){
								if( err ) retornarError( res, err, "Ocurrio un error al insertar las reuniones a la BD");

								res.json({
									error: false,
									seCreo: true,
									reunion: insertada,
									idReunion: insertada._id
								})
							} );
						}
					}
				} else {
					console.log(" NO EXISTEN, CREO LA REUNION");

					// CREO LA REUNION
					var insertar = {
						usuario: payload.usuario,
						sala: payload.sala._id,
						fecha: fechaInicio.format("DD/MM/YYYY"),
						desdeHora: fechaInicio.format("HH:mm"),
						hastaHora: fechaFin.format("HH:mm"),
						desdeDate: fechaInicio.valueOf(),
						hastaDate: fechaFin.valueOf(),
						formato: 0,
						creada: moment().format("LLLL"),
						titulo: "",
						duenio: "",
						interno: "",
						asistentes: 0,
						idClase: payload.idClase
					};

					db.collection("salasreuniones.instancias").save( insertar, { w: 1, fsync: 1 }, function( err, insertada ){
						if( err ) retornarError( res, err, "Ocurrio un error al insertar las reuniones a la collecion");

						res.json({
							error: false,
							seCreo: true,
							reunion: insertada,
							idReunion: insertada._id
						})
					} );
				}
			});
		});
	})

	app.post('/api/salasreunionesEliminarReunion', function(req, res){
		var payload = req.body;

		var idReunion = new mongo.ObjectID( payload.elemento );

		db.getDbInstance( function( err, db ){
			if( err ) retornarError( res, err, "Ocurrio un error al conectarse a la BD");

			db.collection("salasreuniones.instancias").remove({ _id: idReunion }, { w: 1}, function( err, eliminado ){
				if(err){
					console.log(" Ocurrio un error al eliminar el registro");
					res.json({
						error: true,
						tipo: "Ocurrio un error al eliminar la clase ",
						exp: err
					})
				}

				console.log(" Se elimino el registro correctamente ");

				res.json({
					error: false,
					eliminado: eliminado
				})
			})
		})
	})

	app.post('/api/salasreunionesActualizarReunion', function(req, res){
		var payload = req.body;
		console.log(JSON.stringify(payload, null, 4));
		db.getDbInstance( function( err, db ){
			if( err ) retornarError( res, err, "Ocurrio un error al conectarse a la BD");

			var idRegistro = new mongo.ObjectID( payload._id );
			var idRegistroTexto = idRegistro.toString();

			var registroActualizado = {
				sala: payload.sala,
				ultimaModificacion: payload.ultimaModificacion || "",
				fecha: moment(payload.desdeDate).format("DD/MM/YYYY"),
				desdeDate: moment(payload.desdeDate.valueOf()).valueOf(),
				hastaDate: moment(payload.hastaDate.valueOf()).valueOf(),
				desdeHora: moment(payload.desdeDate.valueOf()).format("HH:mm"),
				hastaHora:  moment(payload.hastaDate.valueOf()).format("HH:mm")
			}
			var registroActualizado2 = {
				sala: payload.sala,
				ultimaModificacion: payload.ultimaModificacion || "",
				fecha: moment(payload.desdeDate).format("DD/MM/YYYY"),
				desdeDate: moment(payload.desdeDate.valueOf()).valueOf(),
				hastaDate: moment(payload.hastaDate.valueOf()).valueOf(),
				desdeHora: moment(payload.desdeDate.valueOf()).format("HH:mm"),
				hastaHora:  moment(payload.hastaDate.valueOf()).format("HH:mm")
			}

			db.collection("salasreuniones.instancias").find( {
				sala:  registroActualizado.sala,
				fecha: registroActualizado.fecha
			}, {
				titulo: 1,
				desdeDate: 1,
				hastaDate: 1,
				registroCambios: 1
			}).toArray( function( err, reuniones ){
				if( err ) retornarError( res, err, "Ocurrio un error al traer las reuniones del dia");

				var cantidadReuniones = ( reuniones && reuniones.length ) || 0;

				for( var i = 0; i < reuniones.length; i++ ){
					if( reuniones[i]._id == idRegistroTexto ){
						if( reuniones[i].registroCambios ){
							registroActualizado.registroCambios = reuniones[i].registroCambios;
							registroActualizado.registroCambios.push(retornarCambioONuevo( 3, payload.usuario, "Ajuste", registroActualizado2));
						}
					}
				}

				if( cantidadReuniones ){
					for( var i = 0; i < cantidadReuniones; i++ ){
						if( chocaConOtraReunion( registroActualizado.desdeDate, registroActualizado.hastaDate, reuniones[i].desdeDate, reuniones[i].hastaDate ) && ( reuniones[i]._id != idRegistroTexto ) ){
							// AVISO QUE NO SE PUEDE CREAR
							res.json({
								error: false,
								seCreo: false,
								causa: "La clase que desea crear interferia con otra previamente agendada",
								titulo: reuniones[i].titulo
							})
							break;
						} else if ( i == ( cantidadReuniones - 1 ) ){
							// CREO LA REUNION

							db.collection("salasreuniones.instancias").update( { _id: idRegistro },  { $set: registroActualizado }, function( err, cantidadInsertada ){
								if( err ) retornarError( res, err, "Ocurrio un error al insertar las clases a la BD");

								db.collection("salasreuniones.instancias").findOne( { _id: idRegistro }, function( err, reunion){
									if( err ) retornarError( res, err, "Ocurrio un error al traer la clase de la  collecion");

									res.json({
										error: false,
										seCreo: true,
										idReunion: idRegistro,
										reunion: reunion
									})
								})
							} );
						}
					}
				} else {
					console.log(" NO EXISTEN, CREO LA REUNION");
					console.log( JSON.stringify( registroActualizado, null, 4));

					db.collection("salasreuniones.instancias").findOne( { _id: idRegistro }, function( err, reunion){
						if( err ) retornarError( res, err, "Ocurrio un error al buscar las reuniones a la BD");

						if( reunion.registroCambios ){
							registroActualizado.registroCambios = reunion.registroCambios;
							registroActualizado.registroCambios.push(retornarCambioONuevo( 4, payload.usuario, "Movida", registroActualizado2));
						}
						db.collection("salasreuniones.instancias").update( { _id: idRegistro },  { $set: registroActualizado }, function( err, insertada ){
							if( err ) retornarError( res, err, "Ocurrio un error al insertar las reuniones a la BD");

							db.collection("salasreuniones.instancias").findOne( { _id: idRegistro }, function( err, reunion){
								if( err ) retornarError( res, err, "Ocurrio un error al traer las clase de la BD");

								res.json({
									error: false,
									seCreo: true,
									idReunion: idRegistro,
									reunion: reunion
								})
							})
						} );
					});
				}
			});
		})
	})

	app.post('/api/salas', function( req, res){
		var diaHoy = moment().format("DD/MM/YYYY");
		if(req.body.piso == 0){
			db.getDbInstance(function( err, db){
				if( err ) retornarError( res, err, "Ocurrio un error al conectarse a la BD");

				db.collection("salasreuniones").find({}).toArray(function(err,salas){
					if( err ) retornarError( res, err, "Ocurrio un error al consultar la colección");

					db.collection("salasreuniones.instancias").find({fecha:diaHoy}).toArray(function(err,reuniones){
						if( err ) retornarError( res, err, "Ocurrio un error al consultar la colección");

						var listaSalas = [];
						for(var s=0;s<salas.length;s++){
							var sala = {
								nombre: salas[s].nombre,
								piso: salas[s].piso,
								reuniones:[],
								color: salas[s].color,
								tipo: salas[s].tipo
							};
							if((req.body.piso == 2) || (req.body.piso == 3)){
								for(var r=0;r<reuniones.length;r++){
									if(salas[s]._id == reuniones[r].sala){
										if(salas[s].piso == req.body.piso){
											sala.reuniones.push(reuniones[r]);
										}
									}
								}
							}else{
								for(var r=0;r<reuniones.length;r++){
									if(salas[s]._id == reuniones[r].sala){
										sala.reuniones.push(reuniones[r]);
									}
								}
							}
							listaSalas.push(sala);
						}
						res.json(listaSalas);
					});
				});
			});
		}
	})

	app.post('/api/salasreunionesActualizarDatosReunion', function(req, res){
		var payload = req.body;

		db.getDbInstance( function( err, db ){
			if( err ) retornarError( res, err, "Ocurrio un error al conectarse a la BD");
			// ID identificador para el UPDATE
			var idRegistro = new mongo.ObjectID( payload._id );

			// Registro basico de cambios
			var registroActualizado = retornarRegistroActualizar( payload );
			var registroActualizado2 = retornarRegistroActualizar( payload );

			// Se utiliza en caso de que sea cambio
			var esCambio = retornarCambioONuevo( 2, payload.usuario, "Modificación", registroActualizado2 );
			var esNuevo = retornarCambioONuevo( 1, payload.usuario, "Creación", registroActualizado2 );


			if( typeof  payload.registroCambios == "undefined" ){
				registroActualizado.registroCambios = [];
				registroActualizado.registroCambios[0] =  esNuevo;

				registroActualizado.registroCambios[0].cambiosCreacion = {
					fecha: payload.datosParaRegistro.fecha,
					desdeHora: payload.datosParaRegistro.desdeHora,
					hastaHora: payload.datosParaRegistro.hastaHora
				}
			} else {
				registroActualizado.registroCambios = payload.registroCambios;
				console.log( JSON.stringify( payload, null , 4));
				esCambio.cambiosCreacion = {
					fecha: payload.datosParaRegistro.fecha,
					desdeHora: payload.datosParaRegistro.desdeHora,
					hastaHora: payload.datosParaRegistro.hastaHora
				}

				registroActualizado.registroCambios.push(esCambio);
			}

			db.collection("salasreuniones.instancias").update( { _id: idRegistro },  { $set: registroActualizado }, function( err, insertada ){
				if( err ) retornarError( res, err, "Ocurrio un error al insertar las reuniones a la BD");
				db.collection("salasreuniones.instancias").findOne( { _id: idRegistro }, function( err, reunion){
					if( err ) retornarError( res, err, "Ocurrio un error al traer las clase de la BD");
					res.json({
						error: false,
						seCreo: true,
						reunion: reunion
					})
				})
			} );
		})
	})
};