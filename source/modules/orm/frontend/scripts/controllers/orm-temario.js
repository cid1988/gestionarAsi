angular.module('bag2.orm.temario',[])
.controller('ORMTemarioTemasCtrl', function($scope, ORMTema) {
    $scope.cambios = false;
    
    $scope.editado = function () {
        $scope.cambios = true;
    };

    $scope.guardar = function () {
        $scope.cambios = false;
        $scope.temario.$save();
    };

    $scope.cancelar = function () {
        $scope.temario.temas = $scope.temasEdit;
    };
})
.controller('ORMTemarioNavbarCtrl', function($scope, $rootScope) {
    $scope.editar = function() {
        $rootScope.$broadcast('start-edit');
    };
    $scope.$on('edit-started', function() {
        $scope.editando = true;
    });
    
    $scope.cerrarEditar = function() {
        $rootScope.$broadcast('stop-edit');
    };
    
    $scope.$on('edit-stopped', function() {
        $scope.editando = false;
    });
    
    $scope.$on('mostrar-enviar-temario', function(event, mostrar) {
        $scope.mostrarEnviarTemario = mostrar;
    });
    $scope.enviar = function() {
        $rootScope.$broadcast('enviar-temario', 'final');
    };
    $scope.enviarPropuesta = function() {
        $rootScope.$broadcast('enviar-temario', 'propuesta');
    };
}).controller('ORMTemarioCtrl', function($rootScope, $scope, ORMColoresPorTipo, $routeParams, ORMTemario, ORMInstanciaReunion, ORMTema, ORMReunion, $modal, $window) {
    $scope.cancelacion = "";
    $rootScope.$on('start-edit', function() {
        $rootScope.$broadcast('edit-started');
        $scope.editando = true;
    });
    
    $scope.instancia = ORMInstanciaReunion.get({
        _id: $routeParams._id
    });
    
    $rootScope.$on('stop-edit', function() {
        $rootScope.$broadcast('edit-stopped');
        $scope.editando = false;
    });

    $rootScope.$on('enviar-temario', function(event, tipoTemario) {
        $rootScope.$broadcast('mostrar-enviar-temario', true, tipoTemario);
    });
    
    $rootScope.$on('cancel-temario', function() {
        $rootScope.$broadcast('cancelar-temario', true);
    });
    
    $scope.colorReunion = function (r){
        return (ORMColoresPorTipo()[r.tipo] || 'grey');
    }
    
    var temarios = ORMTemario.list({
        instancia: $routeParams._id
    }, function() {
        if (temarios.length > 0) {
            $scope.temario = temarios[0];
        } else {
            $scope.temario = new ORMTemario({
                instancia: $routeParams._id,
                tipoTemario: 'propuesta',
                html: '',
                prioridades: []
            });
        }
    });
    
    $scope.temas = ORMTema.query();
    
    $scope.imprimir = function () {
        $window.print(); 
    };
    
    $scope.mostrarTema = function (r) {
        if (r.eliminado) {
            return false; 
        } else {
            return true;
        }
    };

    $scope.instancia = ORMInstanciaReunion.findById({
        _id: $routeParams._id
    }, function() {
        $scope.fechaDesde = new Date($scope.instancia.desdeDate).format('dd/mm/yyyy');
        $scope.horaDesde = new Date($scope.instancia.desdeDate).format('H:MM');
        $scope.horaHasta = new Date($scope.instancia.hastaDate).format('H:MM');
        $scope.reunion = ORMReunion.findById({
            _id: $scope.instancia.reunion
        }, function(){
            if ($scope.reunion.frecuencia == "2meses") {
                $scope.proxReuAprox = "Aproximadamente en 2 meses";
            } else if ($scope.reunion.frecuencia == "1mes") {
                $scope.proxReuAprox = "Aproximadamente en 1 mes";
            } else if ($scope.reunion.frecuencia == "3semanas") {
                $scope.proxReuAprox = "Aproximadamente en 3 semanas";
            } else if ($scope.reunion.frecuencia == "2semanas") {
                $scope.proxReuAprox = "Aproximadamente en 2 semanas";
            } else if ($scope.reunion.frecuencia == "1semana") {
                $scope.proxReuAprox = "Aproximadamente en 1 semana";
            } else if ($scope.reunion.frecuencia == "aPedido") {
                $scope.proxReuAprox = "A pedido";
            } else {
                $scope.proxReuAprox = " ";
            }
            $scope.prioridades = [];
            for (var i = 0; i < 7; i++) {
                if ($scope.dameTema(i + 1)) {
                    $scope.prioridades.push($scope.dameTema(i + 1));
                }
            }
            
            $scope.temario.prioridades = $scope.prioridades;
            
            if (!$scope.temario.temas) {
                $scope.temario.temas = $scope.reunion.temas;
            }
            
            if ($scope.reunion.nombre.length < 41) {
              $scope.set_size = {'font-size': '25px'};
            }
            else {
              $scope.set_size = {'font-size': '20px'};
            }
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
    
    $scope.dameTema = function (numeroOrden) {
        if ($scope.reunion.temas) {
            for (var i = 0; i < $scope.reunion.temas.length; i++) {
              if ($scope.reunion.temas[i].orden == numeroOrden)
              {
                  return $scope.reunion.temas[i].temaId;
              }
            } 
        }
    };
    
    $scope.cancelar = function() {
        $rootScope.$broadcast('cancel-temario');
    };
    
    
    $scope.temaPorId = function (id) {
      for (var i = 0; i < $scope.temas.length; i++) {
          if ($scope.temas[i]._id == id)
          {
              return $scope.temas[i];
          }
      }  
    };
    
})
.controller('ORMTemarioListaEnvioCtrl', function($scope, $state, ORMInstanciaReunion, ORMTemario, ORMReunion, $rootScope, ORMContacto, $http) {
    
    $scope.meses = [ "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ];
    $scope.dias = [ "Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab" ];
    $scope.uploadedFile = [];
    $scope.$on('cancelar-temario', function(event, mostrar) {
        $scope.version = "cancelado";
        $scope.cancelacion = "Cancelacion - ";
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
        } else if ($scope.reunion.tipo == 'eventuales') {
            $scope.reunionTipo = "Eventual";
        } 
        
        $scope.asunto = "Temario de Reunion " + $scope.reunionTipo + " - " + $scope.reunion.nombre;
        $scope.asunto = $scope.omitirAcentos($scope.asunto);
    });

    // Escuchamos mostrar-enviar-temario
    $scope.$on('mostrar-enviar-temario', function(event, mostrar, tipoTemario) {
        $scope.mostrarEnviarTemario = mostrar;
        $scope.temario.tipoTemario = tipoTemario;
    });

    $scope.cancelarEnvio = function() {
        if (!$scope.enviando) {
            $rootScope.$broadcast('mostrar-enviar-temario', false);
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
    
    $scope.omitirAcentos = function(text) {
        var acentos = "ÁÉÍÓÚáéíóúÑñ";
        var original = "AEIOUaeiouNn";
        for (var i=0; i<acentos.length; i++) {
            text = text.replace(acentos.charAt(i), original.charAt(i));
        }
        return text;
    }

    // creamos un objeto vacío, que vamos a usar como diccionario
    // _id = ORMContacto
    $scope.contactos = ORMContacto.list();

    // tanto para el 'reset' como para cuando cambia el id de temario con el que estamos trabajando
    // ($scope.state.current.params._id)
    $scope.traerOriginal = function() {
        $scope.instancia = ORMInstanciaReunion.findById({
            _id: $state.params._id
        }, function () {
            $scope.fecha = new Date($scope.instancia.desdeDate);
            if ($scope.fecha.getMinutes() === 0) {
                $scope.hora = $scope.fecha.getHours() + ":00";
            } else {
                $scope.hora = $scope.fecha.getHours() + ":" + $scope.fecha.getMinutes();
            }
            //alert(str);
            $scope.reunion = ORMReunion.findById({
                _id: $scope.instancia.reunion
            }, function () {
                $scope.temario = ORMTemario.findById({
                    instancia: $scope.instancia._id
                });
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
    };
    $scope.traerOriginal();
    
    $scope.buscarCorreo = function(nombre, contacto) {
        if (contacto) {
            if (!contacto.correos) {
                return " ";
            }
            else {
                for (var i = 0; i < contacto.correos.length; i++) {
                    var em = contacto.correos[i];
                    var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                    if (em.nombre == nombre) {
                        if ( !expr.test(em.valor) ) {
                            return " ";
                        } else {
                            return (contacto.apellidos + " " + contacto.nombre + " <" + em.valor + ">");
                        }
                    }
                }
            } 
            return " ";
        } else {
            return " ";
        }
    };

    // hacemos una copia del objeto temario en nuestro scope local
    //$scope.temario = angular.copy($scope.temario);

    // hacemos una copia del objeto instancia en nuestro scope local
    $scope.instancia = angular.copy($scope.instancia);

    // si cambia el tipo de temario, cambiamos la lista que vamos a modificar
    $scope.$watch('temario.tipoTemario', function(tipo) {
        $scope.version = tipo;
    });

    $scope.$watch('version', function(version) {
        // estas son las listas de correo que manejamos para el temario
        var listasPorVersion = {
            'final': 'temario',
            'propuesta': 'propuestaTemario',
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
        if ($scope.temario.tipoTemario == "propuesta") {
            if ($scope.instancia.reunion == '531e45b0ee7b07a673df4e68') {
                var payload = {
                    asunto: $scope.cancelacion + "Propuesta de " + $scope.asunto,
                    para: $scope.reunion.propuestaTemario.para,
                    cc: $scope.reunion.propuestaTemario.cc,
                    cco: $scope.reunion.propuestaTemario.cco,
                    exclusivos: $scope.reunion.propuestaTemario.exclusivos,
                    temarioId: $scope.temario._id,
                    principioHtml: "<div style='font-size: 20px; font-family: Arial; line-height: 120%;padding-top: 15px;padding-left: 5px;border-right-width: 10px;padding-right: 5px;padding-bottom: 10px;background-color: #FFD300;text-align: center;'><b>Propuesta de " + $scope.asunto + "</b></div><br /><hr/>",
                    finHtml: "- " + $scope.temario.usuario + " (" + $scope.temario.fecha + ")",
                    adjunto : adjunto,
                    version: $scope.version,
                    desdeEmail : $scope.buscarCorreo('Email oficial', $scope.contactoPorId($scope.reunion.asistenteTablero))
                };
            } else {
                var payload = {
                    asunto: $scope.cancelacion + "Propuesta de " + $scope.asunto,
                    para: $scope.reunion.propuestaTemario.para.concat($scope.maestro.propuestaTemario.para),
                    cc: $scope.reunion.propuestaTemario.cc.concat($scope.maestro.propuestaTemario.cc),
                    cco: $scope.reunion.propuestaTemario.cco.concat($scope.maestro.propuestaTemario.cco),
                    exclusivos: $scope.reunion.propuestaTemario.exclusivos.concat($scope.maestro.propuestaTemario.exclusivos),
                    temarioId: $scope.temario._id,
                    principioHtml: "<div style='font-size: 20px; font-family: Arial; line-height: 120%;padding-top: 15px;padding-left: 5px;border-right-width: 10px;padding-right: 5px;padding-bottom: 10px;background-color: #FFD300;text-align: center;'><b>Propuesta de " + $scope.asunto + "</b></div><br /><hr/>",
                    finHtml: "- " + $scope.temario.usuario + " (" + $scope.temario.fecha + ")",
                    adjunto : adjunto,
                    version: $scope.version,
                    desdeEmail : $scope.buscarCorreo('Email oficial', $scope.contactoPorId($scope.reunion.asistenteTablero))
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
            $http.post('/api/orm/enviar-temario', payload).success(function() {
                $scope.enviando = false;
                $rootScope.$broadcast('mostrar-enviar-temario', false);
            }).error(function() {
                $scope.enviando = false;
                alert("Fallo el envio");
            });
        } else if ($scope.temario.tipoTemario == "final") {
            if ($scope.instancia.reunion == '531e45b0ee7b07a673df4e68') {
                var payload = {
                    asunto: $scope.cancelacion + $scope.asunto,
                    para: $scope.reunion.temario.para,
                    cc: $scope.reunion.temario.cc,
                    cco: $scope.reunion.temario.cco,
                    exclusivos: $scope.reunion.temario.exclusivos,
                    temarioId: $scope.temario._id,
                    principioHtml: " ",
                    finHtml: "- " + $scope.temario.usuario + " (" + $scope.temario.fecha + ")",
                    adjunto : adjunto,
                    version: $scope.version
                };
            } else {
                var payload = {
                    asunto: $scope.cancelacion + $scope.asunto,
                    para: $scope.reunion.temario.para.concat($scope.maestro.temario.para),
                    cc: $scope.reunion.temario.cc.concat($scope.maestro.temario.cc),
                    cco: $scope.reunion.temario.cco.concat($scope.maestro.temario.cco),
                    exclusivos: $scope.reunion.temario.exclusivos.concat($scope.maestro.temario.exclusivos),
                    temarioId: $scope.temario._id,
                    principioHtml: " ",
                    finHtml: "- " + $scope.temario.usuario + " (" + $scope.temario.fecha + ")",
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
            $http.post('/api/orm/enviar-temario', payload).success(function() {
                $scope.enviando = false;
                $rootScope.$broadcast('mostrar-enviar-temario', false);
            }).error(function() {
                $scope.enviando = false;
                alert("Fallo el envio");
            });
        } else {
            alert("Error por falta de tipo de temario. Intente nuevamente.");
        }
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
    }

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

    $scope.noRecibeTemario = function(input, param) {
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
        $scope.instancia.tipoTemario = version;
    };
    
    
})
.controller('ORMNotaTemarioCtrl', function($scope, $window, ORMOrganigrama, ORMReunion) {
    $scope.cancelarCambios = function() {
        $scope.html = $scope.$eval('temario.html');
        $scope.cambios = false;
    };
    
    
    $scope.jurisdicciones = ORMOrganigrama.query();
    
    var restarDias = function (fecha){
        var days = $scope.fechaProx.getDay();
        var tiempo = fecha.getTime();
        if (days == 0) {
            var milisegundos = 0;
        } else {
            var milisegundos = ((days-1)*24*60*60*1000);
        }
        var total = new Date(tiempo-milisegundos);
        var day=total.getDate();
        var month=total.getMonth()+1;
        var year=total.getFullYear();
    
        return (day+"/"+month+"/"+year);
    };
    var reunion = ORMReunion.get({_id : $scope.instancia.reunion}, function(){
        if (reunion.frecuencia == "2meses") {
            $scope.fechaProx = new Date($scope.instancia.desdeDate + 5184000000);
            $scope.temario.proxima_reunion = restarDias($scope.fechaProx);
        } else if (reunion.frecuencia == "1mes") {
            $scope.fechaProx = new Date($scope.instancia.desdeDate + 2592000000);
            $scope.temario.proxima_reunion = restarDias($scope.fechaProx);
        } else if (reunion.frecuencia == "3semanas") {
            $scope.fechaProx = new Date($scope.instancia.desdeDate + 1814400000);
            $scope.temario.proxima_reunion = restarDias($scope.fechaProx);
        } else if (reunion.frecuencia == "2semanas") {
            $scope.fechaProx = new Date($scope.instancia.desdeDate + 1209600000);
            $scope.temario.proxima_reunion = restarDias($scope.fechaProx);
        } else if (reunion.frecuencia == "1semana") {
            $scope.fechaProx = new Date($scope.instancia.desdeDate + 604800000);
            $scope.temario.proxima_reunion = restarDias($scope.fechaProx);
        } else if (reunion.frecuencia == "aPedido") {
            $scope.temario.proxima_reunion = "A pedido";
        } else {
            $scope.fechaProx = new Date($scope.instancia.desdeDate);
            $scope.temario.proxima_reunion = restarDias($scope.fechaProx);
        }
    });
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    
    $scope.$on('mostrar-enviar-temario', function(event, mostrar) {
        $scope.mostrarEnviarTemario = mostrar;
    });

    $scope.$on('html-changed', function() {
        $scope.cambios = true;
    });
    
    $scope.imprimir = function () {
        $window.print(); 
    };

    // si cambia la instancia, actualizamos el html
    $scope.$watch('temario', $scope.cancelarCambios);

    // al guardar la nota, sólo vamos a cambiar el html
    $scope.guardarNota = function() {
        if ($scope.temario) {
            var f = new Date();
            if (f.getMinutes() < 10) {
                var minutos = "0" + f.getMinutes();
            } else {
                var minutos = f.getMinutes();
            }
            $scope.temario.fecha = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear() + " - " + f.getHours() + ":" + minutos);
            $scope.temario.usuario = $scope.username;
            $scope.temario.html = $scope.html;
            $scope.temario.$save(function() {
                $scope.cambios = false;
            });
        }
    };
}).controller('ORMListaTemariosCtrl', function($rootScope, throttle, trackState, $scope, ORMTemario, ORMInstanciaReunion, ORMReunion, $modal, $window) {
    $scope.filtro = "";
    $scope.filtro2 = "";
    
    var throttledFiltro = throttle(5000, function () {
        trackState($scope.filtro);
    });
    
    $scope.$watch('filtro', function () {
        if ($scope.filtro !== "") {
            throttledFiltro();
        }
    }, true);
    
    var throttledFiltro2 = throttle(5000, function () {
        trackState($scope.filtro2);
    });
    
    $scope.$watch('filtro2', function () {
        if ($scope.filtro2 !== "") {
            throttledFiltro2();
        }
    }, true);
    
    $scope.temarios = ORMTemario.query();
    var  hoy = new Date();
    hoy = hoy.getTime() - 28800000;
    $scope.reuniones = ORMReunion.query();
    $scope.instancias = ORMInstanciaReunion.query({
        $or:JSON.stringify([
            {desdeDate:{$gte: hoy}},
        ]),
    });
    $scope.orden = 'desdeDate';
    $scope.tieneTemario = function(idInstancia) {
        for (var i = 0; i < $scope.temarios.length; i++) {
            if ($scope.temarios[i].instancia == idInstancia)
            {
                return true;
            }
        }  
        return false;
    };
    
    $scope.permiso = function (tipo) {
        if (tipo == "seguimiento") {
            return $scope.hasPermission('orm.seguimiento');
        } else if (tipo == "transversales") {
            return $scope.hasPermission('orm.transversales');
        } else if (tipo == "especificas") {
            return $scope.hasPermission('orm.especificas');
        } else if (tipo == "planeamiento") {
            return $scope.hasPermission('orm.planeamiento');
        } else if (tipo == "presupuesto") {
            return $scope.hasPermission('orm.presupuesto');
        } else if (tipo == "coordinacion") {
            return $scope.hasPermission('orm.coordinacion');
        } else if (tipo == "planLargoPlazo") {
            return $scope.hasPermission('orm.planLargoPlazo');
        } else if (tipo == "proyectosEspeciales") {
            return $scope.hasPermission('orm.proyectosEspeciales');
        } else if (tipo == "eventuales") {
            return $scope.hasPermission('orm.eventuales');
        }
    };
    
    $scope.cortar = function(fechaNueva) {
        if ($scope.fechaVieja) {
            var v = (new Date($scope.fechaVieja)).getDay();
            var n = (new Date(fechaNueva)).getDay();
            if (n < v) {
                //alert(n + " - " + v);
                $scope.fechaVieja = fechaNueva;
                return true;
            } else {
                $scope.fechaVieja = fechaNueva;
                return false;
            }
        } else {
            $scope.fechaVieja = fechaNueva;
            return false;
        }
    };
    
    $scope.filterTipo = function(instanciaI) {
        if ($scope.filtro2 === "") {
            return true;
        } else {
            if ($scope.filtro2.tipo === "") {
                return true;
            } else {
                if ($scope.reunionPorId(instanciaI.reunion).tipo == $scope.filtro2.tipo) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    };
    
    $scope.noTieneTemario = function(idInstancia) {
        for (var i = 0; i < $scope.temarios.length; i++) {
            if ($scope.temarios[i].instancia == idInstancia)
            {
                return false;
            }
        }  
        return true;
    };
    
    $scope.imprimir = function () {
        $window.print(); 
    };
    
    $scope.reunionPorId = function (id) {
        for (var i = 0; i < $scope.reuniones.length; i++) {
            if ($scope.reuniones[i]._id == id)
            {
                return $scope.reuniones[i];
            }
        }  
    };
    
}).controller('ORMHistoricoCtrl', function($rootScope, $scope, ORMTemario, ORMMinuta, ORMInstanciaReunion, ORMOrganigrama, ORMReunion, $modal, $window) {
    $scope.filtro2 = "";
    $scope.temarios = ORMTemario.query();
    $scope.minutas = ORMMinuta.query();
    var  hoy = new Date();
    hoy = hoy.getTime() - 28800000;
    $scope.jurisdicciones = ORMOrganigrama.query();
    $scope.instancias = ORMInstanciaReunion.query({
        $or:JSON.stringify([
            {desdeDate:{$lt: hoy}},
        ]),
    });
    $scope.orden = 'desdeDate';
    $scope.tablaJurisdicciones = ["SinJurisdiccion"];
    
    $scope.reuniones = ORMReunion.query(function(){
        for (var i = 0; i < $scope.reuniones.length; i++) {
            if ($scope.reuniones[i].jurisdiccion) {
                if ($scope.tablaJurisdicciones.indexOf($scope.reuniones[i].jurisdiccion) < 0)
                {
                    $scope.tablaJurisdicciones.push($scope.reuniones[i].jurisdiccion);
                }
            } else {
                $scope.reuniones[i].jurisdiccion = "SinJurisdiccion";
            }
        }
    });
    
    $scope.jurisdiccionOrdenPorId = function (id) {
        for (var i = 0; i < $scope.jurisdicciones.length; i++) {
            if ($scope.jurisdicciones[i]._id == id)
            {
                if ($scope.jurisdicciones[i].orden) {
                    return $scope.jurisdicciones[i].orden;
                } else {
                    return "9999";
                }
            }
        }  
    };
    
    $scope.myValueFunction = function(juris) {
        return $scope.jurisdiccionOrdenPorId(juris);
    };
    
    $scope.tieneTemario = function(idInstancia) {
        for (var i = 0; i < $scope.temarios.length; i++) {
            if ($scope.temarios[i].instancia == idInstancia)
            {
                return true;
            }
        }  
        return false;
    };
    
    $scope.temasTemario = function(idInstancia) {
        for (var i = 0; i < $scope.temarios.length; i++) {
            if ($scope.temarios[i].instancia == idInstancia)
            {
                if ($scope.temarios[i].temas) {
                    var canti = 0;
                    angular.forEach($scope.temarios[i].temas, function (t) {
                        if (t.agregado == "si") {
                            canti = canti + 1;
                        }
                    });
                    return canti;
                }
            }
        }  
        return 0;
    };
    
    $scope.compromisosCant = function(idInstancia) {
        for (var i = 0; i < $scope.minutas.length; i++) {
            if ($scope.minutas[i].instancia == idInstancia)
            {
                if ($scope.minutas[i].compromisos) {
                    return $scope.minutas[i].compromisos.length;
                }
            }
        }  
        return 0;
    };
    
    $scope.cortar = function(fechaNueva) {
        if ($scope.fechaVieja) {
            var v = (new Date($scope.fechaVieja)).getDay();
            var n = (new Date(fechaNueva)).getDay();
            if (n < v) {
                //alert(n + " - " + v);
                $scope.fechaVieja = fechaNueva;
                return true;
            } else {
                $scope.fechaVieja = fechaNueva;
                return false;
            }
        } else {
            $scope.fechaVieja = fechaNueva;
            return false;
        }
    };
    
    $scope.filterTipo = function(instanciaI) {
        if ($scope.filtro2 === "") {
            return true;
        } else {
            if ($scope.filtro2.tipo === "") {
                return true;
            } else {
                if ($scope.reunionPorId(instanciaI.reunion).tipo == $scope.filtro2.tipo) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    };
    
    $scope.noTieneTemario = function(idInstancia) {
        for (var i = 0; i < $scope.temarios.length; i++) {
            if ($scope.temarios[i].instancia == idInstancia)
            {
                return false;
            }
        }  
        return true;
    };
    
    $scope.imprimir = function () {
        $window.print(); 
    };
    
    $scope.reunionPorId = function (id) {
        for (var i = 0; i < $scope.reuniones.length; i++) {
            if ($scope.reuniones[i]._id == id)
            {
                return $scope.reuniones[i];
            }
        }  
    };
    
    $scope.jurisdiccionPorId = function (id) {
        if (id == "SinJurisdiccion") {
            return {'nombreCompleto': "Sin Jurisdiccion"};
        } else {
            for (var i = 0; i < $scope.jurisdicciones.length; i++) {
                if ($scope.jurisdicciones[i]._id == id)
                {
                    return $scope.jurisdicciones[i];
                }
            }  
        }
    };
    
})
.controller('ORMTemarioVueltaCtrl', function($rootScope, $scope, ORMColoresPorTipo, $routeParams, ORMTemario, ORMInstanciaReunion, ORMTema, ORMReunion, $modal, $window) {
    $scope.cancelacion = "";
    $rootScope.$on('start-edit', function() {
        $rootScope.$broadcast('edit-started');
        $scope.editando = true;
    });
    
    $rootScope.$on('stop-edit', function() {
        $rootScope.$broadcast('edit-stopped');
        $scope.editando = false;
    });
    
    $scope.colorReunion = function (r){
        return (ORMColoresPorTipo()[r.tipo] || 'grey');
    };
    
    $scope.cambios = false;
    
    $scope.editado = function () {
        $scope.cambios = true;
    };

    $scope.guardar = function () {
        $scope.cambios = false;
        $scope.temario.$save();
    };

    $scope.cancelar = function () {
        $scope.temario.temas = $scope.temasEdit;
    };
    
    var temarios = ORMTemario.list({
        instancia: $routeParams._id
    }, function() {
        if (temarios.length > 0) {
            $scope.temario = temarios[0];
        } else {
            $scope.temario = new ORMTemario({
                instancia: $routeParams._id,
                tipoTemario: 'propuesta',
                html: '',
                prioridades: []
            });
        }
    });
    
    $scope.temas = ORMTema.query();
    
    $scope.imprimir = function () {
        $window.print(); 
    };
    
    $scope.mostrarTema = function (r) {
        if (r.eliminado) {
            return false; 
        } else {
            return true;
        }
    };

    $scope.instancia = ORMInstanciaReunion.findById({
        _id: $routeParams._id
    }, function() {
        $scope.fechaDesde = new Date($scope.instancia.desdeDate).format('dd/mm/yyyy');
        $scope.horaDesde = new Date($scope.instancia.desdeDate).format('H:MM');
        $scope.horaHasta = new Date($scope.instancia.hastaDate).format('H:MM');
        $scope.reunion = ORMReunion.findById({
            _id: $scope.instancia.reunion
        }, function(){
            $scope.prioridades = [];
            for (var i = 0; i < 7; i++) {
                if ($scope.dameTema(i + 1)) {
                    $scope.prioridades.push($scope.dameTema(i + 1));
                }
            }
            
            $scope.temario.prioridades = $scope.prioridades;
            
            if (!$scope.temario.temas) {
                $scope.temario.temas = $scope.reunion.temas;
            }
            
            if ($scope.reunion.nombre.length < 41) {
              $scope.set_size = {'font-size': '25px'};
            }
            else {
              $scope.set_size = {'font-size': '20px'};
            }
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
    
    $scope.dameTema = function (numeroOrden) {
        if ($scope.reunion.temas) {
            for (var i = 0; i < $scope.reunion.temas.length; i++) {
              if ($scope.reunion.temas[i].orden == numeroOrden)
              {
                  return $scope.reunion.temas[i].temaId;
              }
            } 
        }
    };
    
    
    $scope.temaPorId = function (id) {
      for (var i = 0; i < $scope.temas.length; i++) {
          if ($scope.temas[i]._id == id)
          {
              return $scope.temas[i];
          }
      }  
    };
    
});