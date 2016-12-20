angular.module('bag2.orm-reunion', ["bag2.orm", "bag2.restApi"])
.controller("ORMReunionDetalleCtrl", function ($scope, $routeParams, ORMReunion, ORMInstanciaReunion, ORMOrganigrama, ORMGrupoReunion, ORMTema, ORMColoresPorTipo, Contactos, ORMContacto, $rootScope, $modal, $window) {
    
    $scope.contactos = Contactos.listar();
    
    $scope.fechasReuniones = ORMInstanciaReunion.query({
        reunion : $routeParams._id
    });
    
    $scope.citaParaLlamados = [];
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    $scope.imprimir = function () {
        $window.print(); 
    };
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    
    $scope.grupoPorId = function (id) {
      for (var i = 0; i < $scope.gruposReuniones.length; i++) {
          if ($scope.gruposReuniones[i]._id == id)
          {
              return $scope.gruposReuniones[i];
          }
      }  
    };
    
    $scope.frecuenciaPorValor = function (valor) {
      if (valor == "2meses") {
          return "Cada dos meses";
      } else if (valor == "1mes") {
          return "Cada un mes";
      } else if (valor == "3semanas") {
          return "Cada tres semanas";
      } else if (valor == "2semanas") {
          return "Cada dos semanas";
      } else if (valor == "1semana") {
          return "Cada una semana";
      } else if (valor == "aPedido") {
          return "A pedido";
      } else {
          return "";
      }
    };
    
    $scope.tipoPorValor = function (valor) {
      if (valor == "seguimiento") {
          return "Seguimiento";
      } else if (valor == "transversales") {
          return "Transversales";
      } else if (valor == "especificas") {
          return "Especificas";
      } else if (valor == "planeamiento") {
          return "Planeamiento";
      } else if (valor == "presupuesto") {
          return "Presupuesto";
      } else if (valor == "coordinacion") {
          return "Coordinación";
      } else if (valor == "planLargoPlazo") {
          return "Plan Largo Plazo";
      } else if (valor == "proyectosEspeciales") {
          return "Proyectos Especiales";
      } else if (valor == "eventuales") {
          return "Eventuales";
      } else {
          return "";
      }
    };
    
    $scope.segmentoPorValor = function (valor) {
      if (valor == "infraestructura") {
          return "Infraestructura";
      } else if (valor == "social") {
          return "Social";
      } else {
          return "";
      }
    };
    
    $scope.filtroGrupo = function (grupo) {
      if (grupo.tipo == $scope.reunion.tipo) {
          return true;
      } else {
          return false;
      }
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
    
    $scope.buscarTelefono = function(nombre, contacto) {
        if (!contacto.telefonos) {
            return "";
        }
        else {
            for (var i = 0; i < contacto.telefonos.length; i++) {
                var em = contacto.telefonos[i];

                if ((em.nombre == nombre) && (em.interno)) {
                    return em.valor + " Int. " + em.interno;
                } else if (em.nombre == nombre) {
                    return em.valor;
                }
            }
        }

        return "";
    };
    
    $scope.reunionPorId = function (id) {
      for (var i = 0; i < $scope.reuniones.length; i++) {
          if ($scope.reuniones[i]._id == id)
          {
              return $scope.reuniones[i];
          }
      }  
    };
    
    $scope.importarDatos = function(confirmado) {
        if (confirmado) {
            if ($scope.reunionImportar) {
                $scope.reunionImportar = $scope.reunionPorId($scope.reunionImportar);
                $scope.reunion.participantes = $scope.reunionImportar.participantes;
                $scope.reunion.llamados = $scope.reunionImportar.llamados;
                $scope.reunion.cita = $scope.reunionImportar.cita;
                $scope.reunion.temario = $scope.reunionImportar.temario;
                $scope.reunion.minuta = $scope.reunionImportar.minuta;
                $scope.reunion.propuesta = $scope.reunionImportar.propuestaTemario;
            }
        }
        else {
            $scope.reunionImportar = "";
            $scope.reuniones = ORMReunion.query();
            $("#importarReunion").modal('show');
        }
    };
    
    $scope.tab = "participantes";
    
    $scope.eliminarParticipante = function (p) {
      $scope.reunion.participantes.splice($scope.reunion.participantes.indexOf(p), 1);
    };
    
    $scope.eliminarLlamado = function (p) {
      $scope.reunion.llamados.splice($scope.reunion.llamados.indexOf(p), 1);
    };
    
    $scope.eliminarCalendario = function (p) {
      $scope.reunion.calendario.splice($scope.reunion.calendario.indexOf(p), 1);
    };
    
    $scope.eliminarTema = function (p) {
      $scope.reunion.temas.splice($scope.reunion.temas.indexOf(p), 1);
    };
    
    $scope.subir = function (p) {
      var posicion = $scope.reunion.participantes.indexOf(p);
      if (posicion > 0) {
          $scope.reunion.participantes.splice(posicion, 1);
          $scope.reunion.participantes.splice(posicion - 1,0,p);
      }
    };
    
    $scope.subirLlamado = function (p) {
      var posicion = $scope.reunion.llamados.indexOf(p);
      if (posicion > 0) {
          $scope.reunion.llamados.splice(posicion, 1);
          $scope.reunion.llamados.splice(posicion - 1,0,p);
      }
    };
    $scope.edit = function () {
        $scope.editando = true;
    };
    
    $scope.noEstaEnArray = function (c) {
        var vuelta = true;
        angular.forEach($scope.reunion.llamados, function (ll) {
            if (ll.contactoId == c.contactoId) {
                vuelta = false;
            }
        });
        return vuelta;
    };

    $scope.save = function () {
        if (!$scope.reunion.llamados) {
            $scope.reunion.llamados = [];
        }
        angular.forEach($scope.citaParaLlamados, function (c) {
            if ($scope.noEstaEnArray(c)) {
                $scope.reunion.llamados.push(c);
            }
        });
        if ($scope.reunion.frecuencia) {
            $scope.reunion.$save(function() {
                $scope.editando = false;
                $scope.citaParaLlamados = [];
            });
        } else {
            alert("Falta ingresar una frecuencia");
        }
    };
    
    $scope.gruposReuniones = ORMGrupoReunion.query();
    $scope.jurisdicciones = ORMOrganigrama.query();
    $scope.temas = ORMTema.query();

    $scope.reunion = ORMReunion.findById({
        _id: $routeParams._id
    }, function () {
        
        if (!angular.isArray($scope.reunion.participantes)) {
            $scope.reunion.participantes = [];
        }

        if (!$scope.reunion.cita) {
            $scope.reunion.cita = {
                para: [],
                cc: [],
                cco: [],
                exclusivos: []
            };
        }

        if (!$scope.reunion.temario) {
            $scope.reunion.temario = {
                para: [],
                cc: [],
                cco: [],
                exclusivos: []
            };
        }
        if (!$scope.reunion.minuta) {
            $scope.reunion.minuta = {
                para: [],
                cc: [],
                cco: [],
                exclusivos: []
            };
        }
        if (!$scope.reunion.propuestaTemario) {
            $scope.reunion.propuestaTemario = {
                para: [],
                cc: [],
                cco: [],
                exclusivos: []
            };
        }
    });
    
    $scope.mostrarTema = function (r) {
        if (r.eliminado) {
            return false; 
        } else {
            return true;
        }
    };
    
    $scope.switchStar = function(contacto) {
        if (contacto.star) {
            contacto.star = false;
        } else {
            contacto.star = true;
        }
    };
    
    $scope.buscarCorreo = function(nombre, contacto) {
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
    
    $scope.quitar = function (p, array) {
        array && p && array.splice(array.indexOf(p), 1);
    };
    
    $scope.$watch('reunion.participantes', function (participantes){
        $scope.vistaParticipantes = {
            responsable: [],
            jefeGabinete: [],
            ejecutivo: [],
            otros: [],
            participante: [],
            privada: [],
            gestion: [],
            exclusivo: [],
            legislador: []
        };

        if (participantes) {
            angular.forEach(participantes, function (p){
                // @diego: Por default, lo mandamos a 'otros'
                var donde = $scope.vistaParticipantes.otros;

                if (p.clasificacion == 'responsable') {
                    donde = $scope.vistaParticipantes.responsable;
                } else if (p.clasificacion == 'jefeGabinete') {
                    donde = $scope.vistaParticipantes.jefeGabinete;
                } else if (p.clasificacion == 'ejecutivo') {
                    donde = $scope.vistaParticipantes.ejecutivo;
                } else if (p.clasificacion == 'participante') {
                    donde = $scope.vistaParticipantes.participante;
                } else if (p.clasificacion == 'gestion') {
                    donde = $scope.vistaParticipantes.gestion;
                } else if (p.clasificacion == 'privada') {
                    donde = $scope.vistaParticipantes.privada;
                } else if (p.clasificacion == 'legislador') {
                    donde = $scope.vistaParticipantes.legislador;
                } else if (p.clasificacion == 'exclusivo') {
                    donde = $scope.vistaParticipantes.exclusivo;
                }

                donde.push({
                    p: p,
                    c: Contactos.buscarPorId(p.contactoId)
                });
                
                if (p.star) {
                    $scope.agregarLlamado(p.contactoId);
                }
            });
        }
    }, true);
    
    
    $scope.$watch('reunion.llamados', function (llamados){
        $scope.vistaLlamados = [];
        if (llamados) {
            angular.forEach(llamados, function (p){
                $scope.vistaLlamados.push({
                    p: p,
                    c: Contactos.buscarPorId(p.contactoId)
                });
            });
        }
    }, true);
    
    
    $scope.$watch('reunion.calendario', function (calendario){
        $scope.vistaCalendario = [];
        if (calendario) {
            angular.forEach(calendario, function (p){
                $scope.vistaCalendario.push({
                    p: p,
                    c: Contactos.buscarPorId(p.contactoId)
                });
            });
        }
    }, true);
    
    
    $scope.temaPorId = function (id) {
      for (var i = 0; i < $scope.temas.length; i++) {
          if ($scope.temas[i]._id == id)
          {
              return $scope.temas[i];
          }
      }  
    };
    
    $scope.$watch('reunion.temas', function (temas){
        $scope.vistaTemas = [];
        if (temas) {
            angular.forEach(temas, function (p){
                $scope.vistaTemas.push({
                    p: p,
                    t: $scope.temaPorId(p.temaId)
                });
            });
        }
    }, true);
    
    $scope.puedeAgregar = function (contactoId) {
        if (!$scope.reunion.participantes) {
            return;
        }
        if (contactoId !== undefined && contactoId._id) {
            contactoId = contactoId._id;
        }
        if (!contactoId) {
            return false;
        }

        var found = false;

        for (var i = 0; i < $scope.reunion.participantes.length; i++) {
            if ($scope.reunion.participantes[i].contactoId == contactoId) {
                found = true;
                break;
            }
        }

        return !found;
    };
    
    $scope.puedeAgregarLlamado = function (contactoId) {
        if (!$scope.reunion.llamados) {
            return;
        }
        if (contactoId !== undefined && contactoId._id) {
            contactoId = contactoId._id;
        }
        if (!contactoId) {
            return false;
        }

        var found = false;

        for (var i = 0; i < $scope.reunion.llamados.length; i++) {
            if ($scope.reunion.llamados[i].contactoId == contactoId) {
                found = true;
                break;
            }
        }

        return !found;
    };

    $scope.agregarLlamado = function (c) {
        if(!$scope.reunion.llamados) {
            $scope.reunion.llamados = [];
        }
        if ($scope.puedeAgregarLlamado(c)) {
            $scope.reunion.llamados.push({
                contactoId: c
            });
            $scope.buscador2 = "";
        }
    };

    $scope.agregarParticipante = function (c) {
        if ($scope.puedeAgregar(c)) {
            $scope.reunion.participantes.push({
                contactoId: c,
                clasificacion: "otros"
            });

            // @diego: ponemos el combo en nada
            $scope.buscador = "";
        }
    };
    
    $scope.puedeAgregarCalendario = function (contactoId) {
        if (!$scope.reunion.calendario) {
            return;
        }
        if (contactoId !== undefined && contactoId._id) {
            contactoId = contactoId._id;
        }
        if (!contactoId) {
            return false;
        }

        var found = false;

        for (var i = 0; i < $scope.reunion.calendario.length; i++) {
            if ($scope.reunion.calendario[i].contactoId == contactoId) {
                found = true;
                break;
            }
        }

        return !found;
    };

    $scope.agregarCalendario = function (c) {
        if(!$scope.reunion.calendario) {
            $scope.reunion.calendario = [];
        }
        if ($scope.puedeAgregarCalendario(c)) {
            $scope.reunion.calendario.push({
                contactoId: c
            });
            $scope.buscador2 = "";
        }
    };

    $scope.agregarTema = function (c) {
        if(!$scope.reunion.temas) {
            $scope.reunion.temas = [];
        }
        $scope.reunion.temas.push({
            temaId: c
        });
        $scope.buscador5 = "";
    };
    
    $scope.crearContacto = function(confirmado, contacto) {
        if (confirmado) {
            contacto.apellidos = (contacto.apellidos || '').toUpperCase();
            contacto.$save();

            $scope.contactos = Contactos.listar();
        }
        else {
            $modal({template: '/views/orm/modalNuevoContacto.html', persist: true, show: true, scope: $scope.$new()});
        }
    };
})
.controller("ORMReunionNavbarCtrl", function ($scope, $rootScope, $routeParams) {
    $scope.$on('edit-changed', function (event, e) {
        $scope.editando = e;
    });
    
    $scope.reunionId = $routeParams._id;
    
    $scope.$on('print-changed', function (event, e) {
        $scope.imprimiendo = e;
    });

    $scope.edit = function () {
        $rootScope.$broadcast('edit');
    };
    
    $scope.print = function () {
      $rootScope.$broadcast('print');  
    };
    
    $scope.closePrint = function() {
      $rootScope.$broadcast('close-print');
    };

    $scope.save = function () {
        $rootScope.$broadcast('save');
    };
})
.controller("ORMReunionAsistenciaCtrl", function ($scope, $rootScope, $routeParams, $window, ORMInstanciaReunion, ORMReunion, Contactos, ORMOrganigrama) {
    $scope.myNumber=0;
    $scope.instancia = ORMInstanciaReunion.get({_id: $routeParams._id}, function(){
        $scope.reunion = ORMReunion.get({_id: $scope.instancia.reunion}, function(){
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
            $scope.maestro = ORMReunion.findById({
                _id: idMaestro
            }, function () {
                self.vistaMaestro = [];
                angular.forEach($scope.maestro.participantes, function (p){
                        self.vistaMaestro.push({
                            p: p,
                            c: Contactos.buscarPorId(p.contactoId)
                        });
                    });
               $scope.myNumber += self.vistaParticipantes.length;
            });
        });
    });
    
    $scope.arr = []; $scope.arr.length = 27;
    
    var self = this;
    self.vistaParticipantes = [];
    
   $scope.$watch('reunion.participantes', function (participantes){
      

      if (participantes) {
         $scope.myNumber += self.vistaParticipantes.length;
         angular.forEach(participantes, function (p){
            var donde=self.vistaParticipantes;
            donde.push({
               p: p,
               c: Contactos.buscarPorId(p.contactoId)
            });
         });
      }
   }, true);
    
    $scope.imprimir = function () {
        $window.print(); 
    };
    
    $scope.getNumber = function(num) {
        return new Array(num);   
    };
    
    
    $scope.contactos = Contactos.listar();
    $scope.jurisdicciones = ORMOrganigrama.query();
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    
    $scope.buscarCorreo = function(nombre, contacto) {
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
    
    
})
.controller("ORMReunionAsistenciaEditableCtrl", function ($scope, $rootScope, $routeParams, $window, ORMInstanciaReunion, ORMReunion, Contactos, ORMOrganigrama) {
    $scope.contactos = Contactos.listar();
    $scope.jurisdicciones = ORMOrganigrama.query();
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    $scope.switchImportante = function(contacto) {
        if (contacto.importante) {
            contacto.importante = false;
        } else {
            contacto.importante = true;
        }
    };
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    $scope.instancia = ORMInstanciaReunion.get({_id: $routeParams._id}, function(){
        $scope.reunion = ORMReunion.get({_id: $scope.instancia.reunion}, function(){
            if (!$scope.instancia.asistencia) {
                $scope.instancia.asistencia = $scope.reunion.participantes;
                $scope.instancia.asistenteTablero = $scope.reunion.asistenteTablero;
                $scope.instancia.asistenteMinuta = $scope.reunion.asistenteMinuta;
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
                $scope.maestro = ORMReunion.get({_id: idMaestro}, function(){
                    $scope.instancia.asistenciaMaestro = $scope.maestro.participantes;
                    $scope.vistaMaestro = [];
                    angular.forEach($scope.instancia.asistenciaMaestro, function (p){
                        $scope.vistaMaestro.push({
                            p: p,
                            c: Contactos.buscarPorId(p.contactoId)
                        });
                    });
                });
            } else if (!$scope.instancia.asistenciaMaestro) {
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
                $scope.maestro = ORMReunion.get({_id: idMaestro}, function(){
                    $scope.instancia.asistenciaMaestro = $scope.maestro.participantes;
                    $scope.vistaMaestro = [];
                    angular.forEach($scope.instancia.asistenciaMaestro, function (p){
                        $scope.vistaMaestro.push({
                            p: p,
                            c: Contactos.buscarPorId(p.contactoId)
                        });
                    });
                });
            } else {
                $scope.vistaMaestro = [];
                angular.forEach($scope.instancia.asistenciaMaestro, function (p){
                    $scope.vistaMaestro.push({
                        p: p,
                        c: Contactos.buscarPorId(p.contactoId)
                    });
                });
            }
        });
    });
    
    $scope.tab = "participantes";
    $scope.imprimir = function () {
        $window.print(); 
    };
    
    $scope.getNumber = function(num) {
        return new Array(num);   
    };
    
    $scope.eliminarParticipante = function (p) {
      $scope.instancia.asistencia.splice($scope.instancia.asistencia.indexOf(p), 1);
    };
    
    var self = this;
    
    
    $scope.$watch('instancia.asistencia', function (participantes){
        self.vistaAsistencia = {
            responsable: [],
            jefeGabinete: [],
            ejecutivo: [],
            otros: [],
            participante: [],
            privada: [],
            gestion: [],
            exclusivo: [],
            legislador: []
        };

        if (participantes) {
            $scope.myNumber = participantes.length;
            angular.forEach(participantes, function (p){
                // @diego: Por default, lo mandamos a 'otros'
                var donde = self.vistaAsistencia.otros;

                if (p.clasificacion == 'responsable') {
                    donde = self.vistaAsistencia.responsable;
                } else if (p.clasificacion == 'jefeGabinete') {
                    donde = self.vistaAsistencia.jefeGabinete;
                } else if (p.clasificacion == 'ejecutivo') {
                    donde = self.vistaAsistencia.ejecutivo;
                } else if (p.clasificacion == 'participante') {
                    donde = self.vistaAsistencia.participante;
                } else if (p.clasificacion == 'gestion') {
                    donde = self.vistaAsistencia.gestion;
                } else if (p.clasificacion == 'privada') {
                    donde = self.vistaAsistencia.privada;
                } else if (p.clasificacion == 'legislador') {
                    donde = self.vistaAsistencia.legislador;
                } else if (p.clasificacion == 'exclusivo') {
                    donde = self.vistaAsistencia.exclusivo;
                }

                donde.push({
                    p: p,
                    c: Contactos.buscarPorId(p.contactoId)
                });
            });
        }
    }, true);
    
    $scope.$watch('instancia.asistenciaMaestro', function (participantesMaestro){
        $scope.vistaMaestro = [];
        angular.forEach($scope.instancia.asistenciaMaestro, function (p){
            $scope.vistaMaestro.push({
                p: p,
                c: Contactos.buscarPorId(p.contactoId)
            });
        });
    }, true);
    
    $scope.edit = function() {
        self.editando = true;
    };
    
    $scope.save = function() {
        angular.forEach($scope.instancia.asistencia, function (p) {
            if (!p.asistio) {
                p.asistio = "No";
            }
            if (!p.confirmo) {
                p.confirmo = "No";
            }
        });
        angular.forEach($scope.instancia.asistenciaMaestro, function (p) {
            if (!p.asistio) {
                p.asistio = "No";
            }
            if (!p.confirmo) {
                p.confirmo = "No";
            }
        });
        $scope.instancia.$save(function() {
            self.editando = false;
            $scope.reunion = ORMReunion.get({_id: $scope.instancia.reunion}, function(){
                $scope.reunion.cita.exclusivos = [];
                $scope.reunion.temario.exclusivos = [];
                $scope.reunion.propuestaTemario.exclusivos = [];
                var nueva = [];
                angular.forEach($scope.reunion.participantes, function (p){
                    if (p.clasificacion != "exclusivo") {
                        nueva.push(p);
                    }
                });
                $scope.reunion.participantes = nueva;
                $scope.reunion.$save();
            });
        });
    };
        
    $scope.buscarCorreo = function(nombre, contacto) {
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
    
    self.puedeAgregar = function (contactoId) {
        if (!$scope.instancia.asistencia) {
            angular.extend($scope.instancia, {
                asistencia: []
            })
        }
        // de esta forma, podemos recibir el id directamente
        // o un objeto con _id
        // como se usa en el filtro del select2 y este pasa
        // el objeto contacto, usamos así la misma función
        if (contactoId !== undefined && contactoId._id) {
            contactoId = contactoId._id;
        }
        if (!contactoId) {
            return false;
        }

        var found = false;

        for (var i = 0; i < $scope.instancia.asistencia.length; i++) {
            if ($scope.instancia.asistencia[i].contactoId == contactoId) {
                found = true;
                break;
            }
        }

        return !found;
    };

    $scope.agregarParticipante = function (c) {
        if (self.puedeAgregar(c)) {
            $scope.instancia.asistencia.push({
                contactoId: c,
                clasificacion: "otros",
                asistio: "Si",
                confirmo: "No"
            });

            // @diego: ponemos el combo en nada
            self.buscador = "";
        }
    };

    $scope.agregarParticipanteMaestro = function (c) {
        if ($scope.instancia.asistenciaMaestro) {
            $scope.instancia.asistenciaMaestro.push({
                contactoId: c,
                clasificacion: "otros",
                asistio: "Si",
                confirmo: "No"
            });

            // @diego: ponemos el combo en nada
            self.buscador2 = "";
        }
    };
    
    
})
.controller("ORMReunionLlamadosEditableCtrl", function ($scope, $rootScope, $routeParams, $window, ORMInstanciaReunion, ORMOrganigrama, ORMReunion, Contactos) {
    $scope.contactos = Contactos.listar();
    $scope.jurisdicciones = ORMOrganigrama.query();
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    $scope.instancia = ORMInstanciaReunion.get({_id: $routeParams._id}, function(){
        $scope.reunion = ORMReunion.get({_id: $scope.instancia.reunion}, function(){
            if (!$scope.instancia.llamados) {
                $scope.instancia.llamados = $scope.reunion.llamados;
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
                $scope.maestro = ORMReunion.get({_id: idMaestro}, function(){
                    $scope.instancia.llamadosMaestro = $scope.maestro.llamados;
                    $scope.vistaLlamados = [];
                    angular.forEach($scope.instancia.llamados, function (p){
                        $scope.vistaLlamados.push({
                            p: p,
                            c: Contactos.buscarPorId(p.contactoId)
                        });
                    });
                    $scope.vistaMaestro = [];
                    angular.forEach($scope.instancia.llamadosMaestro, function (p){
                        $scope.vistaMaestro.push({
                            p: p,
                            c: Contactos.buscarPorId(p.contactoId)
                        });
                    });
                });
            } else if (!$scope.instancia.llamadosMaestro) {
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
                $scope.maestro = ORMReunion.get({_id: idMaestro}, function(){
                    $scope.instancia.llamadosMaestro = $scope.maestro.llamados;
                    $scope.vistaLlamados = [];
                    angular.forEach($scope.instancia.llamados, function (p){
                        $scope.vistaLlamados.push({
                            p: p,
                            c: Contactos.buscarPorId(p.contactoId)
                        });
                    });
                    $scope.vistaMaestro = [];
                    angular.forEach($scope.instancia.llamadosMaestro, function (p){
                        $scope.vistaMaestro.push({
                            p: p,
                            c: Contactos.buscarPorId(p.contactoId)
                        });
                    });
                });
            } else {
                $scope.vistaLlamados = [];
                angular.forEach($scope.instancia.llamados, function (p){
                    $scope.vistaLlamados.push({
                        p: p,
                        c: Contactos.buscarPorId(p.contactoId)
                    });
                });
                $scope.vistaMaestro = [];
                angular.forEach($scope.instancia.llamadosMaestro, function (p){
                    $scope.vistaMaestro.push({
                        p: p,
                        c: Contactos.buscarPorId(p.contactoId)
                    });
                });
            }
        });
    });
    
    $scope.getNumber = function(num) {
        return new Array(num);   
    };
    var self = this;
    
    $scope.edit = function() {
        self.editando = true;
    };
    
    $scope.save = function() {
        $scope.instancia.$save(function() {
            self.editando = false;
        });
    };
    
    $scope.buscarTelefono = function(nombre, contacto) {
        if (!contacto.telefonos) {
            return "";
        }
        else {
            for (var i = 0; i < contacto.telefonos.length; i++) {
                var em = contacto.telefonos[i];

                if ((em.nombre == nombre) && (em.interno)) {
                    return em.valor + " Int. " + em.interno;
                } else if (em.nombre == nombre) {
                    return em.valor;
                }
            }
        }

        return "";
    };
    
})
.controller("ORMReunionLlamadosCtrl", function ($scope, $rootScope, $routeParams, $window, ORMInstanciaReunion, ORMReunion, Contactos, ORMOrganigrama) {
    $scope.instancia = ORMInstanciaReunion.get({_id: $routeParams._id}, function(){
        $scope.reunion = ORMReunion.get({_id: $scope.instancia.reunion}, function(){
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
            $scope.maestro = ORMReunion.findById({
                _id: idMaestro
            }, function () {
                self.vistaMaestro = [];
                angular.forEach($scope.maestro.llamados, function (p){
                        self.vistaMaestro.push({
                            p: p,
                            c: Contactos.buscarPorId(p.contactoId)
                        });
                    });
            });
        });
    });
    
    $scope.imprimir = function () {
        $window.print(); 
    };
    
    $scope.contactos = Contactos.listar();
    $scope.jurisdicciones = ORMOrganigrama.query();
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    
    var self = this;
    
    $scope.$watch('reunion.llamados', function (llamados){
        self.vistaLlamados = [];

        if (llamados) {
            angular.forEach(llamados, function (p){
                self.vistaLlamados.push({
                    p: p,
                    c: Contactos.buscarPorId(p.contactoId)
                });
            });
        }
    }, true);
    
    
    $scope.buscarCorreo = function(nombre, contacto) {
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
    
    $scope.buscarTelefono = function(nombre, contacto) {
        if (!contacto.telefonos) {
            return "";
        }
        else {
            for (var i = 0; i < contacto.telefonos.length; i++) {
                var em = contacto.telefonos[i];

                if ((em.nombre == nombre) && (em.interno)) {
                    return em.valor + " Int. " + em.interno;
                } else if (em.nombre == nombre) {
                    return em.valor;
                }
            }
        }

        return "";
    };
    
})
.controller("ORMMaestroReunionCtrl", function ($scope, $routeParams, ORMReunion, ORMInstanciaReunion, ORMOrganigrama, ORMTema, ORMColoresPorTipo, Contactos, ORMContacto, $rootScope, $modal, $window) {
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
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
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    
    $scope.buscarTelefono = function(nombre, contacto) {
        if (!contacto.telefonos) {
            return "";
        }
        else {
            for (var i = 0; i < contacto.telefonos.length; i++) {
                var em = contacto.telefonos[i];

                if ((em.nombre == nombre) && (em.interno)) {
                    return em.valor + " Int. " + em.interno;
                } else if (em.nombre == nombre) {
                    return em.valor;
                }
            }
        }

        return "";
    };
    
    $scope.tab = "participantes";
    
    $scope.eliminarParticipante = function (p) {
      $scope.reunion.participantes.splice($scope.reunion.participantes.indexOf(p), 1);
    };
    
    $scope.eliminarLlamado = function (p) {
      $scope.reunion.llamados.splice($scope.reunion.llamados.indexOf(p), 1);
    };
    
    $scope.eliminarCalendario = function (p) {
      $scope.reunion.calendario.splice($scope.reunion.calendario.indexOf(p), 1);
    };
    
    $scope.eliminarTema = function (p) {
      $scope.reunion.temas.splice($scope.reunion.temas.indexOf(p), 1);
    };
    
    $scope.subir = function (p) {
      var posicion = $scope.reunion.participantes.indexOf(p);
      if (posicion > 0) {
          $scope.reunion.participantes.splice(posicion, 1);
          $scope.reunion.participantes.splice(posicion - 1,0,p);
      }
    };
    
    $scope.subirLlamado = function (p) {
      var posicion = $scope.reunion.llamados.indexOf(p);
      if (posicion > 0) {
          $scope.reunion.llamados.splice(posicion, 1);
          $scope.reunion.llamados.splice(posicion - 1,0,p);
      }
    };
    
    $scope.edit = function () {
        $scope.editando = true;
    };

    $scope.save = function () {
        $scope.reunion.$save(function() {
            $scope.editando = false;
        });
    };

    // @diego: por algún motivo, funciona masomenos bien así
    var formatTipoReunionCombo = function (object, container, query) {
        if (object.id != '') {
            var html = '<div style="width: 10px;height:10px;margin-right:4px;display:inline-block; background-color: '+ (ORMColoresPorTipo()[object.id] || 'grey') +'"></div>' + object.text;
            console.log(html);
            return html;
        } else {
            return object.text;
        }
    };
    

    
    $scope.jurisdicciones = ORMOrganigrama.query();
    $scope.contactos = Contactos.listar();


//VER ACA COMO VA!!!
//UN WATCH DE TIPOMAESTRO
    $scope.$watch('tipoMaestro', function (t) {
        var idMaestro;
        if ($scope.tipoMaestro == "seguimiento") {
            idMaestro = "5249c2913dacd74127000001";
        } else if ($scope.tipoMaestro == "transversales") {
            idMaestro = "53075d93491f2d02e0d14813";
        } else if ($scope.tipoMaestro == "presupuesto") {
            idMaestro = "53075dc7491f2d02e0d14815";
        } else if ($scope.tipoMaestro == "especificas") {
            idMaestro = "53075d79491f2d02e0d14812";
        } else if ($scope.tipoMaestro == "planeamiento") {
            idMaestro = "53075db4491f2d02e0d14814";
        } else if ($scope.tipoMaestro == "coordinacion") {
            idMaestro = "53075ddc491f2d02e0d14816";
        } else if ($scope.tipoMaestro == "planLargoPlazo") {
            idMaestro = "553f971d41e6232024e2933d";
        } else if ($scope.tipoMaestro == "proyectosEspeciales") {
            idMaestro = "55e472739e8ff113c48a8f19";
        } else if ($scope.tipoMaestro == "eventuales") {
            idMaestro = "5486de0c41e6231858ad5329";
        }
        $scope.reunion = ORMReunion.findById({
            _id : idMaestro
        }, function () {
            
            if (!angular.isArray($scope.reunion.participantes)) {
                $scope.reunion.participantes = [];
            }

            if (!$scope.reunion.cita) {
                $scope.reunion.cita = {
                    para: [],
                    cc: [],
                    cco: [],
                    exclusivos: []
                };
            }
    
            if (!$scope.reunion.temario) {
                $scope.reunion.temario = {
                    para: [],
                    cc: [],
                    cco: [],
                    exclusivos: []
                };
            }
            if (!$scope.reunion.minuta) {
                $scope.reunion.minuta = {
                    para: [],
                    cc: [],
                    cco: [],
                    exclusivos: []
                };
            }
            if (!$scope.reunion.propuestaTemario) {
                $scope.reunion.propuestaTemario = {
                    para: [],
                    cc: [],
                    cco: [],
                    exclusivos: []
                };
            }
        });
    });
    
//ACA TERMINA EL WATCH

    
    $scope.tipoReunionSelect2 = {
        formatResult: formatTipoReunionCombo
    };
    
    $scope.switchStar = function(contacto) {
        if (contacto.star) {
            contacto.star = false;
        } else {
            contacto.star = true;
        }
    };
    
    $scope.buscarCorreo = function(nombre, contacto) {
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
    
    $scope.$watch('reunion.participantes', function (participantes){
        $scope.vistaParticipantes = {
            responsable: [],
            jefeGabinete: [],
            ejecutivo: [],
            otros: [],
            participante: [],
            privada: [],
            gestion: [],
            exclusivo: [],
            legislador: []
        };

        if (participantes) {
            angular.forEach(participantes, function (p){
                // @diego: Por default, lo mandamos a 'otros'
                var donde = $scope.vistaParticipantes.otros;

                if (p.clasificacion == 'responsable') {
                    donde = $scope.vistaParticipantes.responsable;
                } else if (p.clasificacion == 'jefeGabinete') {
                    donde = $scope.vistaParticipantes.jefeGabinete;
                } else if (p.clasificacion == 'ejecutivo') {
                    donde = $scope.vistaParticipantes.ejecutivo;
                } else if (p.clasificacion == 'participante') {
                    donde = $scope.vistaParticipantes.participante;
                } else if (p.clasificacion == 'gestion') {
                    donde = $scope.vistaParticipantes.gestion;
                } else if (p.clasificacion == 'privada') {
                    donde = $scope.vistaParticipantes.privada;
                } else if (p.clasificacion == 'legislador') {
                    donde = $scope.vistaParticipantes.legislador;
                } else if (p.clasificacion == 'exclusivo') {
                    donde = $scope.vistaParticipantes.exclusivo;
                }

                donde.push({
                    p: p,
                    c: Contactos.buscarPorId(p.contactoId)
                });
                
                if (p.star) {
                    $scope.agregarLlamado(p.contactoId);
                }
            });
        }
    }, true);
    
    
    $scope.$watch('reunion.llamados', function (llamados){
        $scope.vistaLlamados = [];
        if (llamados) {
            angular.forEach(llamados, function (p){
                $scope.vistaLlamados.push({
                    p: p,
                    c: Contactos.buscarPorId(p.contactoId)
                });
            });
        }
    }, true);
    
    
    $scope.$watch('reunion.calendario', function (calendario){
        $scope.vistaCalendario = [];
        if (calendario) {
            angular.forEach(calendario, function (p){
                $scope.vistaCalendario.push({
                    p: p,
                    c: Contactos.buscarPorId(p.contactoId)
                });
            });
        }
    }, true);
    
    
    $scope.temaPorId = function (id) {
      for (var i = 0; i < $scope.temas.length; i++) {
          if ($scope.temas[i]._id == id)
          {
              return $scope.temas[i];
          }
      }  
    };

    // @diego: Esto lo usamos en el combo de selección que está debajo de 
    $scope.puedeAgregar = function (contactoId) {
        if (!$scope.reunion.participantes) {
            // @diego: Si todavía no está inicializada reunion.participantes
            // obviamente no podemos agregar items

            return;
        }
        // de esta forma, podemos recibir el id directamente
        // o un objeto con _id
        // como se usa en el filtro del select2 y este pasa
        // el objeto contacto, usamos así la misma función
        if (contactoId !== undefined && contactoId._id) {
            contactoId = contactoId._id;
        }
        if (!contactoId) {
            return false;
        }

        var found = false;

        for (var i = 0; i < $scope.reunion.participantes.length; i++) {
            if ($scope.reunion.participantes[i].contactoId == contactoId) {
                found = true;
                break;
            }
        }

        return !found;
    };
    
    $scope.puedeAgregarLlamado = function (contactoId) {
        if (!$scope.reunion.llamados) {
            return;
        }
        if (contactoId !== undefined && contactoId._id) {
            contactoId = contactoId._id;
        }
        if (!contactoId) {
            return false;
        }

        var found = false;

        for (var i = 0; i < $scope.reunion.llamados.length; i++) {
            if ($scope.reunion.llamados[i].contactoId == contactoId) {
                found = true;
                break;
            }
        }

        return !found;
    };

    $scope.agregarLlamado = function (c) {
        if(!$scope.reunion.llamados) {
            $scope.reunion.llamados = [];
        }
        if ($scope.puedeAgregarLlamado(c)) {
            $scope.reunion.llamados.push({
                contactoId: c
            });
            $scope.buscador2 = "";
        }
    };

    $scope.agregarParticipante = function (c) {
        // @diego: Primero chequeamos si se puede
        if ($scope.puedeAgregar(c)) {
            // @diego: Al agregarlo al modelo, como tenemos un 
            // $watch('reunion.participnates', function () {}, true)
            // (el tercer parámetro en true indica que chequea por cambios
            // por igualdad, no sólo por referencia)
            $scope.reunion.participantes.push({
                contactoId: c,
                clasificacion: "otros"
            });

            // @diego: ponemos el combo en nada
            $scope.buscador = "";
        }
    };
    
    $scope.puedeAgregarCalendario = function (contactoId) {
        if (!$scope.reunion.calendario) {
            return;
        }
        if (contactoId !== undefined && contactoId._id) {
            contactoId = contactoId._id;
        }
        if (!contactoId) {
            return false;
        }

        var found = false;

        for (var i = 0; i < $scope.reunion.calendario.length; i++) {
            if ($scope.reunion.calendario[i].contactoId == contactoId) {
                found = true;
                break;
            }
        }

        return !found;
    };

    $scope.agregarCalendario = function (c) {
        if(!$scope.reunion.calendario) {
            $scope.reunion.calendario = [];
        }
        if ($scope.puedeAgregarCalendario(c)) {
            $scope.reunion.calendario.push({
                contactoId: c
            });
            $scope.buscador2 = "";
        }
    };
    
    $scope.crearContacto = function(confirmado, contacto) {
        if (confirmado) {
            contacto.apellidos = (contacto.apellidos || '').toUpperCase();
            contacto.$save();

            $scope.contactos = Contactos.listar();
        }
        else {
            $modal({template: '/views/orm/modalNuevoContacto.html', persist: true, show: true, scope: $scope.$new()});
        }
    };
});