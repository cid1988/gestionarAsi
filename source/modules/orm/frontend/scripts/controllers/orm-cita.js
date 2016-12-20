angular.module('bag2.orm.cita',[])
.controller('ORMCitaCtrl', function($rootScope, $scope, $routeParams, ORMTemario, ORMInstanciaReunion, ORMCita, ORMTema, ORMReunion, $modal, $window) {
    
    /*$scope.armarORMCita = function() {
        var instancias = ORMInstanciaReunion.query({}, function(){
            instancias.forEach(function(i) {
                if (i.cita) {
                    var cita = new ORMCita({
                        "idInstancia" : i._id,
                        "fecha" : i.cita.fecha,
                        "version" : i.cita.version,
                        "para" : i.cita.para,
                        "cc" : i.cita.cc,
                        "cco" : i.cita.cco,
                        "exclusivos" : i.cita.exclusivos,
                        "asunto" : i.cita.asunto,
                        "mensajeHtml" : i.cita.mensajeHtml
                    });
                    cita.$save();
                    i.cita = {};
                    i.$save();
                }
            });
        });
    };*/
    
    $scope.preAsunto = "";
    $rootScope.$on('start-edit', function() {
        $rootScope.$broadcast('edit-started');
        $scope.editando = true;
    });
    
    $rootScope.$on('stop-edit', function() {
        $rootScope.$broadcast('edit-stopped');
        $scope.editando = false;
    });

    $rootScope.$on('enviar-cita', function() {
        $rootScope.$broadcast('mostrar-enviar-cita', true);
    });
    
    $rootScope.$on('cancel-cita', function() {
        $rootScope.$broadcast('cancelar-cita', true);
    });
    
    $rootScope.$on('modifica-cita', function() {
        $rootScope.$broadcast('modificar-cita', true);
    });
    
    $rootScope.$on('recuerda-cita', function() {
        $rootScope.$broadcast('recordar-cita', true);
    });
    
    $rootScope.$on('prepara-cita', function() {
        $rootScope.$broadcast('preparar-cita', true);
    });
    
    $rootScope.$on('reserva-fecha', function() {
        $rootScope.$broadcast('reservar-fecha', true);
    });
    
    $scope.imprimir = function () {
        $window.print(); 
    };

    $scope.instancia = ORMInstanciaReunion.findById({
        _id: $routeParams._id
    }, function() {
        var cita2 = ORMCita.query({
            idInstancia: $routeParams._id
        }, function () {
            if (cita2.length) {
                $scope.instancia.cita = cita2[0];
            }
            $scope.fechaDesde = new Date($scope.instancia.desdeDate).format('dd/mm/yyyy');
            $scope.horaDesde = new Date($scope.instancia.desdeDate).format('H:MM');
            $scope.horaHasta = new Date($scope.instancia.hastaDate).format('H:MM');
            $scope.reunion = ORMReunion.findById({
                _id: $scope.instancia.reunion
            }, function(){
                var idMaestro;
                if ($scope.reunion.tipo == "seguimiento") {
                    idMaestro = "5249c2913dacd74127000001";
                } else if ($scope.reunion.tipo == "transversales") {
                    idMaestro = "53075d93491f2d02e0d14813";
                } else if ($scope.reunion.tipo == "presupuesto") {
                    idMaestro = "53075dc7491f2d02e0d14815";
                } else if ($scope.reunion.tipo == "especificas") {
                    idMaestro = "53075d79491f2d02e0d14812";
                } else if ($scope.reunion.tipo == "planeamiento") {
                    idMaestro = "53075db4491f2d02e0d14814";
                } else if ($scope.reunion.tipo == "coordinacion") {
                    idMaestro = "53075ddc491f2d02e0d14816";
                } else if ($scope.reunion.tipo == "planLargoPlazo") {
                    idMaestro = "553f971d41e6232024e2933d";
                } else if ($scope.reunion.tipo == "proyectosEspeciales") {
                    idMaestro = "55e472739e8ff113c48a8f19";
                } else if ($scope.reunion.tipo == "eventuales") {
                    idMaestro = "5486de0c41e6231858ad5329";
                }
                $scope.maestro = ORMReunion.get({
                    _id: idMaestro
                });
            });
            
            var fecha = new Date($scope.instancia.desdeDate);
            if (fecha.getMinutes() === 0) {
                $scope.hora = fecha.getHours() + ":00";
            } else {
                $scope.hora = fecha.getHours() + ":" + fecha.getMinutes();
            }
            var fecha2 = new Date($scope.instancia.hastaDate);
            if (fecha2.getMinutes() === 0) {
                $scope.hora2 = fecha2.getHours() + ":00";
            } else {
                $scope.hora2 = fecha2.getHours() + ":" + fecha2.getMinutes();
            }
        });
    });
    
    $scope.modificarCita = function() {
        $rootScope.$broadcast('modifica-cita');
    };
    
    $scope.prepararCita = function() {
        $rootScope.$broadcast('prepara-cita');
    };
    
    $scope.recordarCita = function() {
        $rootScope.$broadcast('recuerda-cita');
    };
    
    $scope.reservaFecha = function() {
        $rootScope.$broadcast('reserva-fecha');
    };
    
    $scope.cancelar = function() {
        $rootScope.$broadcast('cancel-cita');
    };
    
})
.controller('ORMCitaListaEnvioCtrl', function($scope, $state, $location, ORMInstanciaReunion, ORMCita, ORMTemario, ORMReunion, $rootScope, ORMContacto, $http) {
    $scope.textoCita = "";
    $scope.meses = [ "de Enero", "de Febrero", "de Marzo", "de Abril", "de Mayo", "de Junio", "de Julio", "de Agosto", "de Septiembre", "de Octubre", "de Noviembre", "de Diciembre" ];
    $scope.dias = [ "Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado" ];
    $scope.uploadedFile = [];
    
    
    $scope.$on('cancelar-cita', function(event, mostrar) {
        $scope.version = "cancelado";
        $scope.preAsunto = "Cancelacion - ";
        $scope.rearmarTextoCita();
        $scope.mostrarEnviarTemario = mostrar;
    });
    
    $scope.$on('modificar-cita', function(event, mostrar) {
        $scope.version = "modificacion";
        $scope.preAsunto = "Modificacion - ";
        $scope.rearmarTextoCita();
        $scope.mostrarEnviarTemario = mostrar;
    });
    
    $scope.$on('recordar-cita', function(event, mostrar) {
        $scope.version = "recordatorio";
        $scope.preAsunto = "Recordatorio - ";
        $scope.rearmarTextoCita();
        $scope.mostrarEnviarTemario = mostrar;
    });
    
    $scope.$on('reservar-fecha', function(event, mostrar) {
        $scope.version = "reserva";
        $scope.preAsunto = "Reserva fechas de Reunion " + $scope.reunionTipo + " - " + $scope.reunion.nombre;
        $scope.asunto = "";
        $scope.textoCita = '<div class="mailwrapper" style="font-size: 17px; color: black; line-height: 100% !important;" >Estimad@s,<br><br><br>Por el presente les adelantamos las posibles fechas de las reuniones ' + $scope.reunion.tipo + ' programadas para el próximo mes. En la semana previa a la reunión les estaremos enviando la convocatoria particular de la misma con los temas considerados, confirmando fecha , hora y  lugar donde se llevará a cabo que determinará la oficina de Jefatura de Gabinete de Ministros.<br><br>Les informamos que la reunión de referencia se realizaría el ' + $scope.dias[$scope.fecha.getDay()] + ' ' + $scope.fecha.getDate() + ' ' + $scope.meses[$scope.fecha.getMonth()] + ' a las ' + $scope.hora + 'hs. <br><br>Ante cualquier consulta pueden comunicarse telefónicamente o vía mail con nuestras oficinas.<br><br><br>Saludos cordiales,<br><br><br><b>Dirección General de Control de Gestión<br> Subsecretaría de Planeamiento y Control de Gestión<br> Jefatura de Gabinete de Ministros<br> Tel: + 54 11 5091-7200 Int: 7214 / 7215<br><br></b></div>';
        $scope.mostrarEnviarTemario = mostrar;
    });
    
    $scope.$on('preparar-cita', function(event, mostrar) {
        $scope.version = "final";
        $scope.preAsunto = "";
        $scope.asunto = "Cita para Reunion " + $scope.reunionTipo + " - " + $scope.reunion.nombre;
        $scope.textoCita = '<div class="mailwrapper" style="font-size: 17px; color: black; line-height: 100% !important;" >Estimad@s,<br><br><br>Les informamos que la reunión de referencia se realizará el ' + $scope.dias[$scope.fecha.getDay()] + ' ' + $scope.fecha.getDate() + ' ' + $scope.meses[$scope.fecha.getMonth()] + ' a las ' + $scope.hora + 'hs (' + ($scope.instancia.hastaDate - $scope.instancia.desdeDate) / 60000 + ' min)';
        if ($scope.instancia.ubicacion) {
            $scope.textoCita = $scope.textoCita + ' en ' + $scope.instancia.ubicacion.nombre + '.';
        }
        if ($scope.esEspecifica($scope.instancia.reunion)) {
            $scope.textoCita = $scope.textoCita + '<br><br><b>Fecha, Horario y Lugar</b> de la reunión <b>los determina la oficina de Jefatura de Gabinete de Ministros.</b><br><br>Quedamos a su disposición ante cualquier consulta.<br><br><br>Saludos cordiales,<br><br><br>Dirección General de Control de Gestión<br> Subsecretaría de Planeamiento y Control de Gestión<br> Jefatura de Gabinete de Ministros<br> Tel: + 54 11 5091-7200 Int: 7215<br><br></b></div>';
        } else {
            $scope.textoCita = $scope.textoCita + '<br><br>Quedamos a su disposición ante cualquier consulta.<br><br><br>Saludos cordiales,<br><br><br>Dirección General de Control de Gestión<br> Subsecretaría de Planeamiento y Control de Gestión<br> Jefatura de Gabinete de Ministros<br> Tel: + 54 11 5091-7200 Int: 7215<br><br></b></div>';
        }
        $scope.mostrarEnviarTemario = mostrar;
    });
    
    // Cambiamos el asunto del mensaje en función del nombre de la reunión
    $scope.$watch('reunion.nombre', function (n) {
        if ($scope.reunion.tipo == 'seguimiento') {
            $scope.reunionTipo = "de Seguimiento";
        } else if ($scope.reunion.tipo == 'transversales') {
            $scope.reunionTipo = "Transversal";
        } else if ($scope.reunion.tipo == 'especificas') {
            $scope.reunionTipo = "Especifica";
        } else if ($scope.reunion.tipo == 'planeamiento') {
            $scope.reunionTipo = "de Planeamiento";
        } else if ($scope.reunion.tipo == 'presupuesto') {
            $scope.reunionTipo = "de Presupuesto";
        } else if ($scope.reunion.tipo == 'coordinacion') {
            $scope.reunionTipo = "de Coordinacion";
        } else if ($scope.reunion.tipo == 'planLargoPlazo') {
            $scope.reunionTipo = "de Plan Largo Plazo";
        } else if ($scope.reunion.tipo == 'proyectosEspeciales') {
            $scope.reunionTipo = "de Proyectos Especiales";
        }  else if ($scope.reunion.tipo == 'eventuales') {
            $scope.reunionTipo = "Eventual";
        }
        
        $scope.asunto = "Cita para Reunion " + $scope.reunionTipo + " - " + $scope.reunion.nombre;
        $scope.asunto = $scope.omitirAcentos($scope.asunto);
    });

    // Escuchamos mostrar-enviar-temario
    $scope.$on('mostrar-enviar-cita', function(event, mostrar) {
        $scope.mostrarEnviarCita = mostrar;
    });

    $scope.cancelarEnvio = function() {
        if (!$scope.enviando) {
            $rootScope.$broadcast('mostrar-enviar-cita', false);
        }
    };
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    $scope.esEspecifica = function (id) {
      var valor = false;
      for (var i = 0; i < $scope.reuniones.length; i++) {
          if (($scope.reuniones[i]._id == id) && ($scope.reuniones[i].tipo == "especificas")) {
              valor = true;
          }
      } 
      return valor;
    };
    
    $scope.omitirAcentos = function(text) {
        var acentos = "ÁÉÍÓÚáéíóúÑñ";
        var original = "AEIOUaeiouNn";
        for (var i=0; i<acentos.length; i++) {
            text = text.replace(acentos.charAt(i), original.charAt(i));
        }
        return text;
    };
    
    $scope.rearmarTextoCita = function() {
        if ($scope.preAsunto == "Cancelacion - ") {
            $scope.textoCita = '<div class="mailwrapper" style="font-size: 17px; color: black; line-height: 100% !important;" >Estimad@s,<br><br><br>Les informamos que la reunión de referencia que se realizaría el ' + $scope.dias[$scope.fecha.getDay()] + ' ' + $scope.fecha.getDate() + ' ' + $scope.meses[$scope.fecha.getMonth()] + ' a las ' + $scope.hora + 'hs, fue cancelada hasta nuevo aviso. Nos pondremos en contacto cuando reagendemos la misma. <br><br>Ante cualquier consulta pueden comunicarse telefónicamente o vía mail con nuestras oficinas.<br><br><br>Saludos cordiales,<br><br><br><b>Dirección General de Control de Gestión<br> Subsecretaría de Planeamiento y Control de Gestión<br> Jefatura de Gabinete de Ministros<br> Tel: + 54 11 5091-7200 Int: 7214 / 7215<br><br></b></div>';
        } else {
            if ($scope.preAsunto == "Modificacion - ") {
                $scope.textoCita = '<div class="mailwrapper" style="font-size: 17px; color: black; line-height: 100% !important;" >Estimad@s,<br><br><br>Les informamos que la reunión de referencia tuvo modificaciones, ahora se realizará el <b>' + $scope.dias[$scope.fecha.getDay()] + ' ' + $scope.fecha.getDate() + ' ' + $scope.meses[$scope.fecha.getMonth()] + ' a las ' + $scope.hora + 'hs (' + ($scope.instancia.hastaDate - $scope.instancia.desdeDate) / 60000 + ' min)';
            }
            if ($scope.preAsunto == "Recordatorio - ") {
                $scope.textoCita = '<div class="mailwrapper" style="font-size: 17px; color: black; line-height: 100% !important;" >Estimad@s,<br><br><br>Les recordamos que la reunión de referencia se realizará el <b>' + $scope.dias[$scope.fecha.getDay()] + ' ' + $scope.fecha.getDate() + ' ' + $scope.meses[$scope.fecha.getMonth()] + ' a las ' + $scope.hora + 'hs (' + ($scope.instancia.hastaDate - $scope.instancia.desdeDate) / 60000 + ' min)';
            }
            if ($scope.instancia.ubicacion) {
                $scope.textoCita = $scope.textoCita + ' en ' + $scope.instancia.ubicacion.nombre + '</b>.';
            }
            if ($scope.preAsunto == "Recordatorio - ") {
                $scope.textoCita = $scope.textoCita + '<br><br><b>Tengan a bien llegar unos minutos más temprano, a fin de poder realizar el ingreso con tiempo.</b>';
            }
            if ($scope.esEspecifica($scope.instancia.reunion)) {
                $scope.textoCita = $scope.textoCita + '<br><br><b>Fecha, Horario y Lugar</b> de la reunión <b>los determina la oficina de Jefatura de Gabinete de Ministros.</b><br><br>Quedamos a su disposición ante cualquier consulta.<br><br><br>Saludos cordiales,<br><br><br>Dirección General de Control de Gestión<br> Subsecretaría de Planeamiento y Control de Gestión<br> Jefatura de Gabinete de Ministros<br> Tel: + 54 11 5091-7200 Int: 7214 / 7215<br><br></b></div>';
            } else {
                $scope.textoCita = $scope.textoCita + '<br><br><br>Saludos cordiales,<br><br><br>Dirección General de Control de Gestión<br> Subsecretaría de Planeamiento y Control de Gestión<br> Jefatura de Gabinete de Ministros<br> Tel: + 54 11 5091-7200 Int: 7214 / 7215<br><br></b></div>';
            }
        }
    };

    // creamos un objeto vacío, que vamos a usar como diccionario
    // _id = ORMContacto
    $scope.contactos = ORMContacto.list();

    // tanto para el 'reset' como para cuando cambia el id de temario con el que estamos trabajando
    // ($scope.state.current.params._id)
    $scope.traerOriginal = function() {
        $scope.instancia = ORMInstanciaReunion.findById({
            _id: $state.params._id
        }, function () {
            var cita2 = ORMCita.query({
                idInstancia: $state.params._id
            }, function () {
                if (cita2.length) {
                    $scope.instancia.cita = cita2[0];
                }
                $scope.fecha = new Date($scope.instancia.desdeDate);
                if ($scope.fecha.getMinutes() === 0) {
                    $scope.hora = $scope.fecha.getHours() + ":00";
                } else {
                    $scope.hora = $scope.fecha.getHours() + ":" + $scope.fecha.getMinutes();
                }
                $scope.reuniones = ORMReunion.query({}, function() {
                    if (cita2.length) {
                        $scope.textoCita = cita2[0].mensajeHtml;
                    } else {
                        $scope.textoCita = '<div class="mailwrapper" style="font-size: 17px; color: black; line-height: 100% !important;" >Estimad@s,<br><br><br>Les informamos que la reunión de referencia se realizará el ' + $scope.dias[$scope.fecha.getDay()] + ' ' + $scope.fecha.getDate() + ' ' + $scope.meses[$scope.fecha.getMonth()] + ' a las ' + $scope.hora + 'hs (' + ($scope.instancia.hastaDate - $scope.instancia.desdeDate) / 60000 + ' min)';
                        if ($scope.instancia.ubicacion) {
                            $scope.textoCita = $scope.textoCita + ' en ' + $scope.instancia.ubicacion.nombre + '.';
                        }
                        if ($scope.esEspecifica($scope.instancia.reunion)) {
                            $scope.textoCita = $scope.textoCita + '<br><br><b>Fecha, Horario y Lugar</b> de la reunión <b>los determina la oficina de Jefatura de Gabinete de Ministros.</b><br><br>Quedamos a su disposición ante cualquier consulta.<br><br><br>Saludos cordiales,<br><br><br>Dirección General de Control de Gestión<br> Subsecretaría de Planeamiento y Control de Gestión<br> Jefatura de Gabinete de Ministros<br> Tel: + 54 11 5091-7200 Int: 7215<br><br></b></div>';
                        } else {
                            $scope.textoCita = $scope.textoCita + '<br><br>Quedamos a su disposición ante cualquier consulta.<br><br><br>Saludos cordiales,<br><br><br>Dirección General de Control de Gestión<br> Subsecretaría de Planeamiento y Control de Gestión<br> Jefatura de Gabinete de Ministros<br> Tel: + 54 11 5091-7200 Int: 7215<br><br></b></div>';
                        }
                    }
                });
                //alert(str);
                $scope.reunion = ORMReunion.findById({
                    _id: $scope.instancia.reunion
                }, function () {
                    var idMaestro;
                    if ($scope.reunion.tipo == "seguimiento") {
                        idMaestro = "5249c2913dacd74127000001";
                    } else if ($scope.reunion.tipo == "transversales") {
                        idMaestro = "53075d93491f2d02e0d14813";
                    } else if ($scope.reunion.tipo == "presupuesto") {
                        idMaestro = "53075dc7491f2d02e0d14815";
                    } else if ($scope.reunion.tipo == "especificas") {
                        idMaestro = "53075d79491f2d02e0d14812";
                    } else if ($scope.reunion.tipo == "planeamiento") {
                        idMaestro = "53075db4491f2d02e0d14814";
                    } else if ($scope.reunion.tipo == "coordinacion") {
                        idMaestro = "53075ddc491f2d02e0d14816";
                    } else if ($scope.reunion.tipo == "planLargoPlazo") {
                        idMaestro = "553f971d41e6232024e2933d";
                    } else if ($scope.reunion.tipo == "proyectosEspeciales") {
                        idMaestro = "55e472739e8ff113c48a8f19";
                    } else if ($scope.reunion.tipo == "eventuales") {
                        idMaestro = "5486de0c41e6231858ad5329";
                    }
                    $scope.maestro = ORMReunion.get({
                        _id: idMaestro
                    });
                });
            });
        });
    };
    $scope.traerOriginal();

    // hacemos una copia del objeto temario en nuestro scope local
    //$scope.temario = angular.copy($scope.temario);

    // hacemos una copia del objeto instancia en nuestro scope local
    $scope.instancia = angular.copy($scope.instancia);

    // si cambia el tipo de temario, cambiamos la lista que vamos a modificar
    $scope.version = "final";
    $scope.$watch('version', function(version) {
        // estas son las listas de correo que manejamos para el temario
        var listasPorVersion = {
            'final': 'cita',
            'propuesta': 'propuestaCita',
            'cancelado': 'cancelado'
        };
        var textosPorVersion = {
            'final': 'Versión final',
            'propuesta': 'Propuesta',
            'cancelado': 'cancelado'
        };

        $scope.lista = listasPorVersion[version];
        $scope.textoVersion = textosPorVersion[version] || 'Sin establecer';
    });
    

    $scope.enviar = function() {

        $scope.enviando = true;
        if (!$scope.instancia.ubicacion) {
            $scope.instancia.ubicacion = {nombre : " "};
        }
        if ($scope.uploadedFile.length) {
            var adjunto = "/uploads/" + $scope.uploadedFile.shift().id;
        } else {
            var adjunto = "";
        }
        if ($scope.instancia.reunion == '531e45b0ee7b07a673df4e68') {
            var payload = {
                asunto: $scope.preAsunto + $scope.asunto,
                para: $scope.reunion.cita.para,
                cc: $scope.reunion.cita.cc,
                cco: $scope.reunion.cita.cco,
                exclusivos: $scope.reunion.cita.exclusivos,
                instanciaId: $scope.instancia._id,
                mensajeHtml: $scope.textoCita + '<br> - ' + $scope.username,
                principioHtml: $scope.dias[$scope.fecha.getDay()] + " " + $scope.fecha.getDate() + " " + $scope.meses[$scope.fecha.getMonth()] + " " + $scope.hora + "hs (" + (($scope.instancia.hastaDate - $scope.instancia.desdeDate) / 60000) + "min) " + $scope.instancia.ubicacion.nombre,
                finHtml: $scope.username,
                adjunto : adjunto,
                version: $scope.version
            };
        } else {
            var payload = {
                asunto: $scope.preAsunto + $scope.asunto,
                para: $scope.reunion.cita.para.concat($scope.maestro.cita.para),
                cc: $scope.reunion.cita.cc.concat($scope.maestro.cita.cc),
                cco: $scope.reunion.cita.cco.concat($scope.maestro.cita.cco),
                exclusivos: $scope.reunion.cita.exclusivos.concat($scope.maestro.cita.exclusivos),
                instanciaId: $scope.instancia._id,
                mensajeHtml: $scope.textoCita + '<br> - ' + $scope.username,
                principioHtml: $scope.dias[$scope.fecha.getDay()] + " " + $scope.fecha.getDate() + " " + $scope.meses[$scope.fecha.getMonth()] + " " + $scope.hora + "hs (" + (($scope.instancia.hastaDate - $scope.instancia.desdeDate) / 60000) + "min) " + $scope.instancia.ubicacion.nombre,
                finHtml: $scope.username,
                adjunto : adjunto,
                version: $scope.version
            };
        }

        for (var pId in $scope.instancia.participantes) {
            var p = $scope.instancia.participantes[pId];

            // equivale a
            // p.temario que podría tomar de valores: undefined, '', 'para', 'cc'
            if (p[$scope.lista] &&
                payload[p[$scope.lista]]) {
                // lo agregamos a la lista de payload.para o de payload.cc
                payload[p[$scope.lista]].push(pId);
            }
        }
        $http.post('/api/orm/enviar-cita', payload).success(function() {
            $scope.enviando = false;
            //$rootScope.$broadcast('mostrar-enviar-cita', false);
            $location.url('/orm/calendario?instancia=' + $scope.instancia._id);
        }).error(function() {
            $scope.enviando = false;
            alert("Fallo el envio");
        });
    };


    $scope.hayReceptores = function() {
        var participantes = $scope.$eval('instancia.participantes');
        var receptores = false;
        for (var p in participantes) {
            if (participantes[p][$scope.lista] && participantes[p][$scope.lista] != '') {
                receptores = true;
                break;
            }
        }

        return receptores;
    };

    $scope.puedeEnviar = function() {
        if ($scope.enviando) return false;
        return $scope.hayReceptores();
    };

    $scope.agregarParticipante = function() {
        var lista = $scope.lista;

        // se seleccionó un contacto de la lista de Para, pero no está todavía
        // relacionado a la instancia reunión
        if ($scope.buscadorPara) {
            // lo agregamos
            if (!$scope.instancia.participantes[$scope.buscadorPara]) {
                $scope.instancia.participantes[$scope.buscadorPara] = {};
            }

            // lo asignamos al temario
            $scope.instancia.participantes[$scope.buscadorPara][lista] = 'para';
            $scope.buscadorPara = null;
        };

        // se seleccionó un contacto de la lista de Para, pero no está todavía
        // relacionado a la instancia de la reunión
        if ($scope.buscadorCC) {
            // lo agregamos
            if (!$scope.instancia.participantes[$scope.buscadorCC]) {
                $scope.instancia.participantes[$scope.buscadorCC] = {};
            }

            $scope.instancia.participantes[$scope.buscadorCC][lista] = 'cc';
            $scope.buscadorCC = null;
        };
    };

    $scope.noRecibeCita = function(input, param) {
        return !$scope.$eval('instancia.participantes[\'' + input._id + '\'].' + $scope.lista);
    };

    // si cambia el id de temario con el que estamos trabajando
    $scope.$watch('state.params._id', function(instanciaId) {
        if (instanciaId) {
            $scope.traerOriginal();
        } else {
            $scope.instancia = null;
        }
    });

    $scope.cambiarVersion = function(version) {
        $scope.instancia.cita.version = version;
    };
    
    
});