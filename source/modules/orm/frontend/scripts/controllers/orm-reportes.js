angular.module('bag2.orm-reportes', ["bag2.orm", "bag2.restApi"])
.controller("ORMReunionEstadisticasCtrl", function ($scope, $rootScope, ORMReunion, ORMTemario, ORMMinuta, ORMInstanciaReunion, $routeParams) {
    $scope.estadisticas = [];
    
    $scope.fecha = {
        desde : "",
        hasta : ""
    };
    
    $scope.totales = {
        cantidad : 0,
        cantAsistencia : 0,
        cantLlamados : 0,
        cantTemarios : 0,
        cantTemas : [],
        cantMinutas : 0,
        cantPresentaciones : 0,
        cantCompromisos : 0,
        cantMm : 0,
        cantHrl : 0,
        cantFm : 0,
        cantMev : 0,
        cantPdl : 0,
        desvio : 0,
    };
    
    $scope.temarios = ORMTemario.query();
    
    $scope.temasTemario = function(idInstancia) {
        for (var i = 0; i < $scope.temarios.length; i++) {
            if ($scope.temarios[i].instancia == idInstancia)
            {
                if ($scope.temarios[i].temas) {
                    var canti = [];
                    angular.forEach($scope.temarios[i].temas, function (t) {
                        if (t.agregado == "si") {
                            canti.push(t);
                        }
                    });
                    return canti;
                }
            }
        }  
        return [];
    };
    
    $scope.totalesCantidad = function(lista) {
        var total = 0;
        for (var i = 0; i < lista.length; i++) {
            total = total + lista[i].cantidad;
        }  
        return total;
    };
    
    $scope.eliminateDuplicates = function(arr) {
        var i, j,
        len=arr.length,
        out=[],
        sin=true;
        for (i=0;i<len;i++) {
            sin=true;
            for (j=(i+1);j<len;j++) {
                if (arr[i].temaId == arr[j].temaId) {
                    sin = false;
                }
            }
            if (sin) {
                out.push(arr[i]);
            }
        }
        return out;
    };
    
    $scope.tieneTemario = function (i) {
        var valor = false;
        angular.forEach($scope.temarios, function(t) {
            if (t.instancia == i._id) {
                valor = true;
            }
        });
        return valor;
    };
    $scope.minutas = ORMMinuta.query();
    $scope.tieneMinuta = function (i) {
        var valor = false;
        angular.forEach($scope.minutas, function(m) {
            if (m.instancia == i._id) {
                valor = true;
            }
        });
        return valor;
    };
    $scope.tienePresentaciones = function (i) {
        var valor = false;
        angular.forEach($scope.minutas, function(m) {
            if (m.instancia == i._id) {
                if (m.presentaciones) {
                    valor = true;
                }
            }
        });
        return valor;
    };
    $scope.cantCompromisos = function (i) {
        var valor = 0;
        angular.forEach($scope.minutas, function(m) {
            if (m.instancia == i._id) {
                if (m.compromisos) {
                    valor = m.compromisos.length;
                }
            }
        });
        return valor;
    };
    
    $scope.porcentaje = function(a, b) {
        if ((a === 0) || (b === 0)) {
            return 0;
        } else {
            var porcentaje = a / b * 100;
            return porcentaje.toFixed(2);
        }
    };
    $scope.reuniones = ORMReunion.query({}, function(){
        angular.forEach($scope.reuniones, function(r) {
            $scope.estadisticas.push({
                id : r._id,
                nombre : r.nombre,
                tipo : r.tipo,
                participantes: r.participantes && "Si" || "No",
                llamados: r.llamados && "Si" || "No",
                cantidad : 0,
                cantAsistencia : 0,
                cantLlamados : 0,
                cantTemarios : 0,
                cantTemas : [],
                cantMinutas : 0,
                cantPresentaciones : 0,
                cantCompromisos : 0,
                cantMm : 0,
                cantHrl : 0,
                cantFm : 0,
                cantMev : 0,
                cantPdl : 0,
                desvio : 0,
            });
        });
        $scope.instancias = ORMInstanciaReunion.query({}, function(){
            angular.forEach($scope.instancias, function (i){
                angular.forEach($scope.estadisticas, function (r){
                    if (i.reunion == r.id) {
                        r.cantidad = r.cantidad + 1;
                        $scope.totales.cantidad = $scope.totales.cantidad + 1;
                        if (i.llamados) {
                            r.cantLlamados = r.cantLlamados + 1;
                            $scope.totales.cantLlamados = $scope.totales.cantLlamados + 1;
                        }
                        if (i.asistencia) {
                            r.cantAsistencia = r.cantAsistencia + 1;
                            $scope.totales.cantAsistencia = $scope.totales.cantAsistencia + 1;
                        }if (i.mm) {
                            r.cantMm = r.cantMm + 1;
                            $scope.totales.cantMm = $scope.totales.cantMm + 1;
                        }
                        if (i.fm) {
                            r.cantFm = r.cantFm + 1;
                            $scope.totales.cantFm = $scope.totales.cantFm + 1;
                        }
                        if (i.mev) {
                            r.cantMev = r.cantMev + 1;
                            $scope.totales.cantMev = $scope.totales.cantMev + 1;
                        }
                        if (i.pdl) {
                            r.cantPdl = r.cantPdl + 1;
                            $scope.totales.cantPdl = $scope.totales.cantPdl + 1;
                        }
                        if (i.hrl) {
                            r.cantHrl = r.cantHrl + 1;
                            $scope.totales.cantHrl = $scope.totales.cantHrl + 1;
                        }
                        if ($scope.tieneDesvio(i.desdeHora, i.desdeHoraReal)) {
                            r.desvio = r.desvio + 1;
                            $scope.totales.desvio = $scope.totales.desvio + 1;
                        }
                        if ($scope.tieneTemario(i)) {
                            r.cantTemarios = r.cantTemarios + 1;
                            $scope.totales.cantTemarios = $scope.totales.cantTemarios + 1;
                        }
                        if ($scope.tieneMinuta(i)) {
                            r.cantMinutas = r.cantMinutas + 1;
                            $scope.totales.cantMinutas = $scope.totales.cantMinutas + 1;
                            r.cantCompromisos = r.cantCompromisos + $scope.cantCompromisos(i);
                            $scope.totales.cantCompromisos = $scope.totales.cantCompromisos + $scope.cantCompromisos(i);
                        }
                        if ($scope.tienePresentaciones(i)) {
                            r.cantPresentaciones = r.cantPresentaciones + 1;
                            $scope.totales.cantPresentaciones = $scope.totales.cantPresentaciones + 1;
                        }
                        r.cantTemas = r.cantTemas.concat($scope.temasTemario(i._id));
                        $scope.totales.cantTemas = $scope.totales.cantTemas.concat($scope.temasTemario(i._id));
                    }
                });
            });
        });
    });
    
    $scope.tieneDesvio = function(desdeHora, desdeHoraReal) {
        if (desdeHora && desdeHoraReal) {
            var desdeHora1=desdeHora.split(":");
            var desdeHoraReal1=desdeHoraReal.split(":");
            var horatotale = [];
            for(var a=0;a<2;a++) {
                desdeHora1[a]=(isNaN(parseInt(desdeHora1[a])))?0:parseInt(desdeHora1[a]);
                desdeHoraReal1[a]=(isNaN(parseInt(desdeHoraReal1[a])))?0:parseInt(desdeHoraReal1[a]);
            }
            horatotale[0]=(desdeHoraReal1[0]-desdeHora1[0]);
            horatotale[1]=(desdeHoraReal1[1]-desdeHora1[1]);
            if ((horatotale[0] === 0) && (horatotale[1] > 5)) {
                return true;
            } else if ((horatotale[0] > 0) && (horatotale[1] > -55)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };
    
    $scope.$watch('fecha.desde', function (fecha){
        if (fecha) {
            $scope.estadisticas = [];
            var d = new Date(fecha.slice(6), fecha.slice(3,5)-1, fecha.slice(0,2), 0, 0, 0, 0);
            if ($scope.fecha.hasta) {
                var h = new Date($scope.fecha.hasta.slice(6), $scope.fecha.hasta.slice(3,5)-1, $scope.fecha.hasta.slice(0,2), 0, 0, 0, 0);
            } else {
                var h = new Date();
            }
            $scope.totales = {
                cantidad : 0,
                cantAsistencia : 0,
                cantLlamados : 0,
                cantTemarios : 0,
                cantTemas : [],
                cantMinutas : 0,
                cantPresentaciones : 0,
                cantCompromisos : 0,
                cantMm : 0,
                cantHrl : 0,
                cantFm : 0,
                cantMev : 0,
                cantPdl : 0,
                desvio : 0,
            };
            $scope.reuniones = ORMReunion.query({}, function(){
                angular.forEach($scope.reuniones, function(r) {
                    $scope.estadisticas.push({
                        id : r._id,
                        nombre : r.nombre,
                        tipo : r.tipo,
                        participantes: r.participantes && "Si" || "No",
                        llamados: r.llamados && "Si" || "No",
                        cantidad : 0,
                        cantAsistencia : 0,
                        cantLlamados : 0,
                        cantTemarios : 0,
                        cantTemas : [],
                        cantMinutas : 0,
                        cantPresentaciones : 0,
                        cantCompromisos : 0,
                        cantMm : 0,
                        cantHrl : 0,
                        cantFm : 0,
                        cantMev : 0,
                        cantPdl : 0,
                        desvio : 0,
                    });
                });
                $scope.instancias = ORMInstanciaReunion.query({
                        $and:JSON.stringify([
                            {desdeDate:{$gte: d.getTime()}},
                            {desdeDate:{$lte: h.getTime()}},
                        ]),
                    }, function(){
                    angular.forEach($scope.instancias, function (i){
                        angular.forEach($scope.estadisticas, function (r){
                            if (i.reunion == r.id) {
                                r.cantidad = r.cantidad + 1;
                                $scope.totales.cantidad = $scope.totales.cantidad + 1;
                                if (i.llamados) {
                                    r.cantLlamados = r.cantLlamados + 1;
                                    $scope.totales.cantLlamados = $scope.totales.cantLlamados + 1;
                                }
                                if (i.asistencia) {
                                    r.cantAsistencia = r.cantAsistencia + 1;
                                    $scope.totales.cantAsistencia = $scope.totales.cantAsistencia + 1;
                                }if (i.mm) {
                                    r.cantMm = r.cantMm + 1;
                                    $scope.totales.cantMm = $scope.totales.cantMm + 1;
                                }
                                if (i.fm) {
                                    r.cantFm = r.cantFm + 1;
                                    $scope.totales.cantFm = $scope.totales.cantFm + 1;
                                }
                                if (i.mev) {
                                    r.cantMev = r.cantMev + 1;
                                    $scope.totales.cantMev = $scope.totales.cantMev + 1;
                                }
                                if (i.pdl) {
                                    r.cantPdl = r.cantPdl + 1;
                                    $scope.totales.cantPdl = $scope.totales.cantPdl + 1;
                                }
                                if (i.hrl) {
                                    r.cantHrl = r.cantHrl + 1;
                                    $scope.totales.cantHrl = $scope.totales.cantHrl + 1;
                                }
                                if ($scope.tieneDesvio(i.desdeHora, i.desdeHoraReal)) {
                                    r.desvio = r.desvio + 1;
                                    $scope.totales.desvio = $scope.totales.desvio + 1;
                                }
                                if ($scope.tieneTemario(i)) {
                                    r.cantTemarios = r.cantTemarios + 1;
                                    $scope.totales.cantTemarios = $scope.totales.cantTemarios + 1;
                                }
                                if ($scope.tieneMinuta(i)) {
                                    r.cantMinutas = r.cantMinutas + 1;
                                    $scope.totales.cantMinutas = $scope.totales.cantMinutas + 1;
                                    r.cantCompromisos = r.cantCompromisos + $scope.cantCompromisos(i);
                                    $scope.totales.cantCompromisos = $scope.totales.cantCompromisos + $scope.cantCompromisos(i);
                                }
                                if ($scope.tienePresentaciones(i)) {
                                    r.cantPresentaciones = r.cantPresentaciones + 1;
                                    $scope.totales.cantPresentaciones = $scope.totales.cantPresentaciones + 1;
                                }
                                r.cantTemas = r.cantTemas.concat($scope.temasTemario(i._id));
                                $scope.totales.cantTemas = $scope.totales.cantTemas.concat($scope.temasTemario(i._id));
                            }
                        });
                    });
                });
            });
        }
    });
    
    $scope.$watch('fecha.hasta', function (fecha2){
        if (fecha2) {
            $scope.estadisticas = [];
            var h = new Date(fecha2.slice(6), fecha2.slice(3,5)-1, fecha2.slice(0,2), 0, 0, 0, 0);
            if ($scope.fecha.desde) {
                var d = new Date($scope.fecha.desde.slice(6), $scope.fecha.desde.slice(3,5)-1, $scope.fecha.desde.slice(0,2), 0, 0, 0, 0);
            } else {
                var d = new Date(1900, 1, 1, 0, 0, 0, 0);
            }
            $scope.totales = {
                cantidad : 0,
                cantAsistencia : 0,
                cantLlamados : 0,
                cantTemarios : 0,
                cantTemas : [],
                cantMinutas : 0,
                cantPresentaciones : 0,
                cantCompromisos : 0,
                cantMm : 0,
                cantHrl : 0,
                cantFm : 0,
                cantMev : 0,
                cantPdl : 0,
                desvio : 0,
            };
            $scope.reuniones = ORMReunion.query({}, function(){
                angular.forEach($scope.reuniones, function(r) {
                    $scope.estadisticas.push({
                        id : r._id,
                        nombre : r.nombre,
                        tipo : r.tipo,
                        participantes: r.participantes && "Si" || "No",
                        llamados: r.llamados && "Si" || "No",
                        cantidad : 0,
                        cantAsistencia : 0,
                        cantLlamados : 0,
                        cantTemarios : 0,
                        cantTemas : [],
                        cantMinutas : 0,
                        cantPresentaciones : 0,
                        cantCompromisos : 0,
                        cantMm : 0,
                        cantHrl : 0,
                        cantFm : 0,
                        cantMev : 0,
                        cantPdl : 0,
                        desvio : 0,
                    });
                });
                $scope.instancias = ORMInstanciaReunion.query({
                        $and:JSON.stringify([
                            {desdeDate:{$gte: d.getTime()}},
                            {desdeDate:{$lte: h.getTime()}},
                        ]),
                    }, function(){
                    angular.forEach($scope.instancias, function (i){
                        angular.forEach($scope.estadisticas, function (r){
                            if (i.reunion == r.id) {
                                r.cantidad = r.cantidad + 1;
                                $scope.totales.cantidad = $scope.totales.cantidad + 1;
                                if (i.llamados) {
                                    r.cantLlamados = r.cantLlamados + 1;
                                    $scope.totales.cantLlamados = $scope.totales.cantLlamados + 1;
                                }
                                if (i.asistencia) {
                                    r.cantAsistencia = r.cantAsistencia + 1;
                                    $scope.totales.cantAsistencia = $scope.totales.cantAsistencia + 1;
                                }if (i.mm) {
                                    r.cantMm = r.cantMm + 1;
                                    $scope.totales.cantMm = $scope.totales.cantMm + 1;
                                }
                                if (i.fm) {
                                    r.cantFm = r.cantFm + 1;
                                    $scope.totales.cantFm = $scope.totales.cantFm + 1;
                                }
                                if (i.mev) {
                                    r.cantMev = r.cantMev + 1;
                                    $scope.totales.cantMev = $scope.totales.cantMev + 1;
                                }
                                if (i.pdl) {
                                    r.cantPdl = r.cantPdl + 1;
                                    $scope.totales.cantPdl = $scope.totales.cantPdl + 1;
                                }
                                if (i.hrl) {
                                    r.cantHrl = r.cantHrl + 1;
                                    $scope.totales.cantHrl = $scope.totales.cantHrl + 1;
                                }
                                if ($scope.tieneDesvio(i.desdeHora, i.desdeHoraReal)) {
                                    r.desvio = r.desvio + 1;
                                    $scope.totales.desvio = $scope.totales.desvio + 1;
                                }
                                if ($scope.tieneTemario(i)) {
                                    r.cantTemarios = r.cantTemarios + 1;
                                    $scope.totales.cantTemarios = $scope.totales.cantTemarios + 1;
                                }
                                if ($scope.tieneMinuta(i)) {
                                    r.cantMinutas = r.cantMinutas + 1;
                                    $scope.totales.cantMinutas = $scope.totales.cantMinutas + 1;
                                    r.cantCompromisos = r.cantCompromisos + $scope.cantCompromisos(i);
                                    $scope.totales.cantCompromisos = $scope.totales.cantCompromisos + $scope.cantCompromisos(i);
                                }
                                if ($scope.tienePresentaciones(i)) {
                                    r.cantPresentaciones = r.cantPresentaciones + 1;
                                    $scope.totales.cantPresentaciones = $scope.totales.cantPresentaciones + 1;
                                }
                                r.cantTemas = r.cantTemas.concat($scope.temasTemario(i._id));
                                $scope.totales.cantTemas = $scope.totales.cantTemas.concat($scope.temasTemario(i._id));
                            }
                        });
                    });
                });
            });
        }
    });
})
.controller("ORMReunionAsistPartiCtrl", function ($scope, $rootScope, Contactos, ORMTemario, ORMInstanciaReunion, ORMReunion, $routeParams) {
    $scope.asistencias = [];
    $scope.participantes = [];
    var hoy = new Date();
    var hace3meses = hoy.getTime() - 7776000000;
    $scope.contactos = Contactos.listar();
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    function findFirst(source, test) {
        for (var i = 0; i < source.length; i++) {
            if (test(source[i])) {
                return source[i];
            }
        }
    
        return null;
    }
    $scope.tipoReunion = function (idReunion) {
        for (var i = 0; i < $scope.reuniones.length; i++) {
          if ($scope.reuniones[i]._id == idReunion)
          {
              return $scope.reuniones[i].tipo;
          }
      } 
    };
    $scope.reuniones = ORMReunion.query({});
    
    
    $scope.instancias2 = ORMInstanciaReunion.query({}, function(){
        angular.forEach($scope.instancias2, function(r) {
            if (r.desdeDate > hace3meses) {
                if ((r.asistencia) && ($scope.tipoReunion(r.reunion) == "seguimiento")) {
                    $scope.asistencias = $scope.asistencias.concat(r.asistencia, r.asistenciaMaestro);
                }
            }
        });
        $scope.armarParticipantes();
    });
    
    $scope.armarParticipantes = function() {
        $scope.asistencias.forEach(function(item) {
            if (item.asistio) {
                var parti = findFirst($scope.participantes, function(participante) {
                    return item.contactoId == participante.contactoId;
                });
                if (parti) {
                    if (item.asistio == "Si") {
                        parti.si += 1;
                    } else {
                        parti.no += 1;
                    }
                } else {
                    if (item.asistio == "Si") {
                        item.si = 1;
                        item.no = 0;
                    } else {
                        item.si = 0;
                        item.no = 1;
                    }
                    if ($scope.contactoPorId(item.contactoId)) {
                        item.nombre = $scope.contactoPorId(item.contactoId).apellidos + " " + $scope.contactoPorId(item.contactoId).nombre;
                        $scope.participantes.push(item);
                    }
                }
            }
        });
    };
    
})
.controller("ORMReunionReportePrincipalCtrl", function ($scope, $rootScope, Contactos, ORMReunion, ORMTemario, ORMInstanciaReunion, ORMReunion, $routeParams) {
    $scope.tab = "calendario";
    
})
.controller("ORMReunionReportesCtrl", function ($scope, $rootScope, Contactos, ORMTemario, ORMInstanciaReunion, ORMReunion, ORMOrganigrama, $routeParams) {
    $scope.reunionesInstancias = ORMInstanciaReunion.query();
    $scope.reuniones = ORMReunion.query();
    $scope.jurisdicciones = ORMOrganigrama.query();
    $scope.hoy = new Date();
    $scope.hoy = $scope.hoy.getTime() - 28800000;
    $scope.asistencias = [];
    $scope.participantes = [];
    $scope.orden = "orden";
    $scope.mails = [];
    $scope.meses = [ "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ];
    $scope.contactos = Contactos.listar();
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
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
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    $scope.colorReunion = function (dato) {
      if(dato) {
          return "#bbb";
      } else {
          return "white";
      }
    };
    
    $scope.ultimaReunion = function (id) {
      var fecha = "";
      var milisegundos = 0;
      for (var i = 0; i < $scope.reunionesInstancias.length; i++) {
          if ($scope.reunionesInstancias[i].reunion == id)
          {
              if ((milisegundos < $scope.reunionesInstancias[i].desdeDate) && ($scope.reunionesInstancias[i].desdeDate < $scope.hoy)) {
                  milisegundos = $scope.reunionesInstancias[i].desdeDate;
                  fecha = $scope.reunionesInstancias[i].fecha;
              }
          }
      }  
      return fecha;
    };
    
    $scope.fechaMes = function (desde) {
       var fecha = new Date(desde);
       return ($scope.meses[fecha.getMonth()] + "/" + fecha.getFullYear());
    };
    
   
    
    function findFirst(source, test) {
        for (var i = 0; i < source.length; i++) {
            if (test(source[i])) {
                return source[i];
            }
        }
    
        return null;
    }
    $scope.tipoReunion = function (idReunion) {
        for (var i = 0; i < $scope.reuniones.length; i++) {
          if ($scope.reuniones[i]._id == idReunion)
          {
              return $scope.reuniones[i].tipo;
          }
      } 
    };
    
})
.controller("ORMReunionReporteEstrellasCtrl", function ($scope, $rootScope, Contactos, ORMReunion, ORMTemario, ORMInstanciaReunion, ORMReunion, $routeParams) {
    $scope.reuniones = ORMReunion.query();
    $scope.estrellas = [];
    $scope.contactos = Contactos.listar();
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    $scope.puedeAgregar = function (contactoId) {
        if (!contactoId) {
            return false;
        }
        var found = false;
        for (var i = 0; i < $scope.estrellas.length; i++) {
            if ($scope.estrellas[i].id == contactoId) {
                found = true;
                break;
            }
        }
        return !found;
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
    $scope.reuniones = ORMReunion.query({}, function(){
        angular.forEach($scope.reuniones, function(r) {
            if (r.participantes) {
                angular.forEach(r.participantes, function (p){
                    if ((p.star) && ($scope.puedeAgregar(p.contactoId))) {
                        $scope.estrellas.push({
                            id: p.contactoId
                        });
                    }
                });
            }
        });
    });
    
})
.controller("ORMReunionReportesOtrosCtrl", function ($scope, $rootScope, Contactos, ORMReunion, ORMTemario, ORMInstanciaReunion, $routeParams) {
    $scope.instancias = ORMInstanciaReunion.query();
    $scope.reuniones = ORMReunion.query();
    $scope.mails = [];
    $scope.contactos = Contactos.listar();
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
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
    $scope.reuniones = ORMReunion.query({}, function(){
        angular.forEach($scope.reuniones, function(r) {
            if (r.participantes) {
                angular.forEach(r.participantes, function (p){
                    $scope.mails.push({
                        id: p.contactoId
                    });
                });
            }
        });
    });
    
})
.controller("ORMReportePorcentajeCtrl", function ($scope, $rootScope, Contactos, ORMReunion, ORMTemario, ORMInstanciaReunion, ORMReunion, $routeParams) {
    $scope.estadisticas = [];
    $scope.fecha = {
        desde : "",
        hasta : ""
    };
    
    $scope.puedeAgregar = function (contactoId, array) {
        if (!array) {

            return;
        }
        if (!contactoId) {
            return false;
        }

        var found = false;

        for (var i = 0; i < array.length; i++) {
            if (array[i] == contactoId) {
                found = true;
                break;
            }
        }

        return !found;
    };
    
    $scope.porcentaje = function(a, b) {
        if ((a === 0) || (b === 0)) {
            return 0;
        } else {
            var porcentaje = a / b * 100;
            return porcentaje.toFixed(2);
        }
    };
    
    $scope.promedio = function(a, b) {
        if ((a === 0) || (b === 0)) {
            return 0;
        } else {
            var promedio = a / b;
            if (a % b == 0) {
                return promedio;
            } else {
                return promedio.toFixed(2);
            }
        }
    };
    
    $scope.reuniones = ORMReunion.query({}, function(){
        angular.forEach($scope.reuniones, function(r) {
            if (!r.apagado) {
                $scope.estadisticas.push({
                    id : r._id,
                    nombre : r.nombre,
                    tipo : r.tipo,
                    partiUnicos : [],
                    cantReuniones : 0,
                    cantCitados : 0,
                    cantCitadosFalta : 0,
                    cantResponsables : 0,
                    cantResponsablesFalta : 0,
                    cantTemasNoTratados : 0,
                    cantidad : 0,
                    jurisdiccion : 0,
                    legisladores : 0,
                    funcionarios : 0,
                    control : 0,
                    jurisdiccionUnicos : [],
                    legisladoresUnicos : [],
                    funcionariosUnicos : [],
                    controlUnicos : [],
                });
            }
        });
        $scope.instancias = ORMInstanciaReunion.query({}, function(){
            angular.forEach($scope.instancias, function (i){
                angular.forEach($scope.estadisticas, function (r){
                    if (i.reunion == r.id) {
                        if (i.asistencia) {
                            r.cantReuniones = r.cantReuniones + 1;
                            r.cantTemasNoTratados = r.cantTemasNoTratados + i.temasNoTratados;
                            for (var x=0; x < i.asistencia.length; x++){
                                if (i.asistencia[x].asistio == "Si") {
                                    r.cantidad = r.cantidad + 1;
                                    if (i.asistencia[x].clasificacion == "legislador") {
                                        r.legisladores = r.legisladores + 1;
                                        if ($scope.puedeAgregar(i.asistencia[x].contactoId, r.partiUnicos)) {
                                            r.legisladoresUnicos.push(i.asistencia[x].contactoId);
                                            r.partiUnicos.push(i.asistencia[x].contactoId);
                                        }
                                    } else if ((i.asistencia[x].clasificacion == "responsable") || (i.asistencia[x].clasificacion == "jefeGabinete") || (i.asistencia[x].clasificacion == "participante") || (i.asistencia[x].clasificacion == "ejecutivo") || (i.asistencia[x].clasificacion == "exclusivo") || (i.asistencia[x].clasificacion == "privada")) {
                                        r.jurisdiccion = r.jurisdiccion + 1;
                                        if ($scope.puedeAgregar(i.asistencia[x].contactoId, r.partiUnicos)) {
                                            r.jurisdiccionUnicos.push(i.asistencia[x].contactoId);
                                            r.partiUnicos.push(i.asistencia[x].contactoId);
                                        }
                                    } else if ((i.asistencia[x].clasificacion == "otros") || (i.asistencia[x].clasificacion == "gestion")) {
                                        r.control = r.control + 1;
                                        if ($scope.puedeAgregar(i.asistencia[x].contactoId, r.partiUnicos)) {
                                            r.controlUnicos.push(i.asistencia[x].contactoId);
                                            r.partiUnicos.push(i.asistencia[x].contactoId);
                                        }
                                    }
                                }
                                if (i.asistencia[x].importante) {
                                    r.cantCitados = r.cantCitados + 1;
                                    if (i.asistencia[x].asistio == "No") {
                                        r.cantCitadosFalta = r.cantCitadosFalta + 1;
                                    }
                                }
                                if ((i.asistencia[x].clasificacion == "jefeGabinete") || (i.asistencia[x].clasificacion == "ejecutivo")) {
                                    if (!i.asistencia[x].importante) {
                                        r.cantCitados = r.cantCitados + 1;
                                        if (i.asistencia[x].asistio == "No") {
                                            r.cantCitadosFalta = r.cantCitadosFalta + 1;
                                        }
                                    }
                                }
                                if (i.asistencia[x].star) {
                                    r.cantResponsables = r.cantResponsables + 1;
                                    if (i.asistencia[x].asistio == "No") {
                                        r.cantResponsablesFalta = r.cantResponsablesFalta + 1;
                                    }
                                }
                            }
                        } 
                        if (i.asistenciaMaestro) {
                            for (var y=0; y < i.asistenciaMaestro.length; y++){
                                if (i.asistenciaMaestro[y].asistio == "Si") {
                                    r.cantidad = r.cantidad + 1;
                                    if (i.asistenciaMaestro[y].clasificacion == "legislador") {
                                        r.legisladores = r.legisladores + 1;
                                        if ($scope.puedeAgregar(i.asistenciaMaestro[y].contactoId, r.partiUnicos)) {
                                            r.legisladoresUnicos.push(i.asistenciaMaestro[y].contactoId);
                                            r.partiUnicos.push(i.asistenciaMaestro[y].contactoId);
                                        }
                                    } else if ((i.asistenciaMaestro[y].clasificacion == "responsable") || (i.asistenciaMaestro[y].clasificacion == "jefeGabinete") || (i.asistenciaMaestro[y].clasificacion == "participante") || (i.asistenciaMaestro[y].clasificacion == "ejecutivo") || (i.asistenciaMaestro[y].clasificacion == "exclusivo") || (i.asistenciaMaestro[y].clasificacion == "privada")) {
                                        r.jurisdiccion = r.jurisdiccion + 1;
                                        if ($scope.puedeAgregar(i.asistenciaMaestro[y].contactoId, r.partiUnicos)) {
                                            r.jurisdiccionUnicos.push(i.asistenciaMaestro[y].contactoId);
                                            r.partiUnicos.push(i.asistenciaMaestro[y].contactoId);
                                        }
                                    } else if ((i.asistenciaMaestro[y].clasificacion == "otros") || (i.asistenciaMaestro[y].clasificacion == "gestion")) {
                                        r.control = r.control + 1;
                                        if ($scope.puedeAgregar(i.asistenciaMaestro[y].contactoId, r.partiUnicos)) {
                                            r.controlUnicos.push(i.asistenciaMaestro[y].contactoId);
                                            r.partiUnicos.push(i.asistenciaMaestro[y].contactoId);
                                        }
                                    }
                                }
                            }
                        } 
                        if (i.mm) {
                            r.funcionarios = r.funcionarios + 1;
                            if ($scope.puedeAgregar("01", r.partiUnicos)) {
                                r.funcionariosUnicos.push("01");
                            }
                        }
                        if (i.fm) {
                            r.funcionarios = r.funcionarios + 1;
                            if ($scope.puedeAgregar("02", r.partiUnicos)) {
                                r.funcionariosUnicos.push("02");
                            }
                        }
                        if (i.mev) {
                            r.funcionarios = r.funcionarios + 1;
                            if ($scope.puedeAgregar("03", r.partiUnicos)) {
                                r.funcionariosUnicos.push("03");
                            }
                        }
                        if (i.pdl) {
                            r.funcionarios = r.funcionarios + 1;
                            if ($scope.puedeAgregar("04", r.partiUnicos)) {
                                r.funcionariosUnicos.push("04");
                            }
                        }
                        if (i.hrl) {
                            r.funcionarios = r.funcionarios + 1;
                            if ($scope.puedeAgregar("05", r.partiUnicos)) {
                                r.funcionariosUnicos.push("05");
                            }
                        }
                        if (i.edm) {
                            r.control = r.control + 1;
                            if ($scope.puedeAgregar("524dc08ccfc146672a000018", r.partiUnicos)) {
                                r.controlUnicos.push("524dc08ccfc146672a000018");
                                r.partiUnicos.push("524dc08ccfc146672a000018");
                            }
                        }
                    }
                });
            });
        });
    });
    
    $scope.$watch('fecha.desde', function (fecha){
        if (fecha) {
            $scope.estadisticas = [];
            var d = new Date(fecha.slice(6), fecha.slice(3,5)-1, fecha.slice(0,2), 0, 0, 0, 0);
            if ($scope.fecha.hasta) {
                var h = new Date($scope.fecha.hasta.slice(6), $scope.fecha.hasta.slice(3,5)-1, $scope.fecha.hasta.slice(0,2), 0, 0, 0, 0);
            } else {
                var h = new Date();
            }
            $scope.reuniones = ORMReunion.query({}, function(){
                angular.forEach($scope.reuniones, function(r) {
                    if (!r.apagado) {
                        $scope.estadisticas.push({
                            id : r._id,
                            nombre : r.nombre,
                            tipo : r.tipo,
                            partiUnicos : [],
                            cantReuniones : 0,
                            cantCitados : 0,
                            cantCitadosFalta : 0,
                            cantResponsables : 0,
                            cantResponsablesFalta : 0,
                            cantTemasNoTratados : 0,
                            cantidad : 0,
                            jurisdiccion : 0,
                            legisladores : 0,
                            funcionarios : 0,
                            control : 0,
                            jurisdiccionUnicos : [],
                            legisladoresUnicos : [],
                            funcionariosUnicos : [],
                            controlUnicos : [],
                        });
                    }
                });
                $scope.instancias = ORMInstanciaReunion.query({
                    $and:JSON.stringify([
                        {desdeDate:{$gte: d.getTime()}},
                        {desdeDate:{$lte: h.getTime()}},
                    ]),
                }, function(){
                    angular.forEach($scope.instancias, function (i){
                        angular.forEach($scope.estadisticas, function (r){
                            if (i.reunion == r.id) {
                                if (i.asistencia) {
                                    r.cantReuniones = r.cantReuniones + 1;
                                    r.cantTemasNoTratados = r.cantTemasNoTratados + i.temasNoTratados;
                                    for (var x=0; x < i.asistencia.length; x++){
                                        if (i.asistencia[x].asistio == "Si") {
                                            r.cantidad = r.cantidad + 1;
                                            if (i.asistencia[x].clasificacion == "legislador") {
                                                r.legisladores = r.legisladores + 1;
                                                if ($scope.puedeAgregar(i.asistencia[x].contactoId, r.partiUnicos)) {
                                                    r.legisladoresUnicos.push(i.asistencia[x].contactoId);
                                                    r.partiUnicos.push(i.asistencia[x].contactoId);
                                                }
                                            } else if ((i.asistencia[x].clasificacion == "responsable") || (i.asistencia[x].clasificacion == "jefeGabinete") || (i.asistencia[x].clasificacion == "participante") || (i.asistencia[x].clasificacion == "ejecutivo") || (i.asistencia[x].clasificacion == "exclusivo") || (i.asistencia[x].clasificacion == "privada")) {
                                                r.jurisdiccion = r.jurisdiccion + 1;
                                                if ($scope.puedeAgregar(i.asistencia[x].contactoId, r.partiUnicos)) {
                                                    r.jurisdiccionUnicos.push(i.asistencia[x].contactoId);
                                                    r.partiUnicos.push(i.asistencia[x].contactoId);
                                                }
                                            } else if ((i.asistencia[x].clasificacion == "otros") || (i.asistencia[x].clasificacion == "gestion")) {
                                                r.control = r.control + 1;
                                                if ($scope.puedeAgregar(i.asistencia[x].contactoId, r.partiUnicos)) {
                                                    r.controlUnicos.push(i.asistencia[x].contactoId);
                                                    r.partiUnicos.push(i.asistencia[x].contactoId);
                                                }
                                            }
                                        }
                                        if (i.asistencia[x].importante) {
                                            r.cantCitados = r.cantCitados + 1;
                                            if (i.asistencia[x].asistio == "No") {
                                                r.cantCitadosFalta = r.cantCitadosFalta + 1;
                                            }
                                        }
                                        if (i.asistencia[x].star) {
                                            r.cantResponsables = r.cantResponsables + 1;
                                            if (i.asistencia[x].asistio == "No") {
                                                r.cantResponsablesFalta = r.cantResponsablesFalta + 1;
                                            }
                                        }
                                    }
                                } 
                                if (i.asistenciaMaestro) {
                                    for (var y=0; y < i.asistenciaMaestro.length; y++){
                                        if (i.asistenciaMaestro[y].asistio == "Si") {
                                            r.cantidad = r.cantidad + 1;
                                            if (i.asistenciaMaestro[y].clasificacion == "legislador") {
                                                r.legisladores = r.legisladores + 1;
                                                if ($scope.puedeAgregar(i.asistenciaMaestro[y].contactoId, r.partiUnicos)) {
                                                    r.legisladoresUnicos.push(i.asistenciaMaestro[y].contactoId);
                                                    r.partiUnicos.push(i.asistenciaMaestro[y].contactoId);
                                                }
                                            } else if ((i.asistenciaMaestro[y].clasificacion == "responsable") || (i.asistenciaMaestro[y].clasificacion == "jefeGabinete") || (i.asistenciaMaestro[y].clasificacion == "participante") || (i.asistenciaMaestro[y].clasificacion == "ejecutivo") || (i.asistenciaMaestro[y].clasificacion == "exclusivo") || (i.asistenciaMaestro[y].clasificacion == "privada")) {
                                                r.jurisdiccion = r.jurisdiccion + 1;
                                                if ($scope.puedeAgregar(i.asistenciaMaestro[y].contactoId, r.partiUnicos)) {
                                                    r.jurisdiccionUnicos.push(i.asistenciaMaestro[y].contactoId);
                                                    r.partiUnicos.push(i.asistenciaMaestro[y].contactoId);
                                                }
                                            } else if ((i.asistenciaMaestro[y].clasificacion == "otros") || (i.asistenciaMaestro[y].clasificacion == "gestion")) {
                                                r.control = r.control + 1;
                                                if ($scope.puedeAgregar(i.asistenciaMaestro[y].contactoId, r.partiUnicos)) {
                                                    r.controlUnicos.push(i.asistenciaMaestro[y].contactoId);
                                                    r.partiUnicos.push(i.asistenciaMaestro[y].contactoId);
                                                }
                                            }
                                        }
                                    }
                                } 
                                if (i.mm) {
                                    r.funcionarios = r.funcionarios + 1;
                                    if ($scope.puedeAgregar("01", r.partiUnicos)) {
                                        r.funcionariosUnicos.push("01");
                                    }
                                }
                                if (i.fm) {
                                    r.funcionarios = r.funcionarios + 1;
                                    if ($scope.puedeAgregar("02", r.partiUnicos)) {
                                        r.funcionariosUnicos.push("02");
                                    }
                                }
                                if (i.mev) {
                                    r.funcionarios = r.funcionarios + 1;
                                    if ($scope.puedeAgregar("03", r.partiUnicos)) {
                                        r.funcionariosUnicos.push("03");
                                    }
                                }
                                if (i.pdl) {
                                    r.funcionarios = r.funcionarios + 1;
                                    if ($scope.puedeAgregar("04", r.partiUnicos)) {
                                        r.funcionariosUnicos.push("04");
                                    }
                                }
                                if (i.hrl) {
                                    r.funcionarios = r.funcionarios + 1;
                                    if ($scope.puedeAgregar("05", r.partiUnicos)) {
                                        r.funcionariosUnicos.push("05");
                                    }
                                }
                                if (i.edm) {
                                    r.control = r.control + 1;
                                    if ($scope.puedeAgregar("524dc08ccfc146672a000018", r.partiUnicos)) {
                                        r.controlUnicos.push("524dc08ccfc146672a000018");
                                        r.partiUnicos.push("524dc08ccfc146672a000018");
                                    }
                                }
                            }
                        });
                    });
                });
            });
        }
        
    });
    
    $scope.$watch('fecha.hasta', function (fecha2){
        if (fecha2) {
            $scope.estadisticas = [];
            var h = new Date(fecha2.slice(6), fecha2.slice(3,5)-1, fecha2.slice(0,2), 0, 0, 0, 0);
            if ($scope.fecha.desde) {
                var d = new Date($scope.fecha.desde.slice(6), $scope.fecha.desde.slice(3,5)-1, $scope.fecha.desde.slice(0,2), 0, 0, 0, 0);
            } else {
                var d = new Date(1900, 1, 1, 0, 0, 0, 0);
            }
            $scope.reuniones = ORMReunion.query({}, function(){
                angular.forEach($scope.reuniones, function(r) {
                    if (!r.apagado) {
                        $scope.estadisticas.push({
                            id : r._id,
                            nombre : r.nombre,
                            tipo : r.tipo,
                            partiUnicos : [],
                            cantReuniones : 0,
                            cantCitados : 0,
                            cantCitadosFalta : 0,
                            cantResponsables : 0,
                            cantResponsablesFalta : 0,
                            cantTemasNoTratados : 0,
                            cantidad : 0,
                            jurisdiccion : 0,
                            legisladores : 0,
                            funcionarios : 0,
                            control : 0,
                            jurisdiccionUnicos : [],
                            legisladoresUnicos : [],
                            funcionariosUnicos : [],
                            controlUnicos : [],
                        });
                    }
                });
                $scope.instancias = ORMInstanciaReunion.query({
                    $and:JSON.stringify([
                        {desdeDate:{$gte: d.getTime()}},
                        {desdeDate:{$lte: h.getTime()}},
                    ]),
                }, function(){
                    angular.forEach($scope.instancias, function (i){
                        angular.forEach($scope.estadisticas, function (r){
                            if (i.reunion == r.id) {
                                if (i.asistencia) {
                                    r.cantReuniones = r.cantReuniones + 1;
                                    r.cantTemasNoTratados = r.cantTemasNoTratados + i.temasNoTratados;
                                    for (var x=0; x < i.asistencia.length; x++){
                                        if (i.asistencia[x].asistio == "Si") {
                                            r.cantidad = r.cantidad + 1;
                                            if (i.asistencia[x].clasificacion == "legislador") {
                                                r.legisladores = r.legisladores + 1;
                                                if ($scope.puedeAgregar(i.asistencia[x].contactoId, r.partiUnicos)) {
                                                    r.legisladoresUnicos.push(i.asistencia[x].contactoId);
                                                    r.partiUnicos.push(i.asistencia[x].contactoId);
                                                }
                                            } else if ((i.asistencia[x].clasificacion == "responsable") || (i.asistencia[x].clasificacion == "jefeGabinete") || (i.asistencia[x].clasificacion == "participante") || (i.asistencia[x].clasificacion == "ejecutivo") || (i.asistencia[x].clasificacion == "exclusivo") || (i.asistencia[x].clasificacion == "privada")) {
                                                r.jurisdiccion = r.jurisdiccion + 1;
                                                if ($scope.puedeAgregar(i.asistencia[x].contactoId, r.partiUnicos)) {
                                                    r.jurisdiccionUnicos.push(i.asistencia[x].contactoId);
                                                    r.partiUnicos.push(i.asistencia[x].contactoId);
                                                }
                                            } else if ((i.asistencia[x].clasificacion == "otros") || (i.asistencia[x].clasificacion == "gestion")) {
                                                r.control = r.control + 1;
                                                if ($scope.puedeAgregar(i.asistencia[x].contactoId, r.partiUnicos)) {
                                                    r.controlUnicos.push(i.asistencia[x].contactoId);
                                                    r.partiUnicos.push(i.asistencia[x].contactoId);
                                                }
                                            }
                                        }
                                        if (i.asistencia[x].importante) {
                                            r.cantCitados = r.cantCitados + 1;
                                            if (i.asistencia[x].asistio == "No") {
                                                r.cantCitadosFalta = r.cantCitadosFalta + 1;
                                            }
                                        }
                                        if (i.asistencia[x].star) {
                                            r.cantResponsables = r.cantResponsables + 1;
                                            if (i.asistencia[x].asistio == "No") {
                                                r.cantResponsablesFalta = r.cantResponsablesFalta + 1;
                                            }
                                        }
                                    }
                                } 
                                if (i.asistenciaMaestro) {
                                    for (var y=0; y < i.asistenciaMaestro.length; y++){
                                        if (i.asistenciaMaestro[y].asistio == "Si") {
                                            r.cantidad = r.cantidad + 1;
                                            if (i.asistenciaMaestro[y].clasificacion == "legislador") {
                                                r.legisladores = r.legisladores + 1;
                                                if ($scope.puedeAgregar(i.asistenciaMaestro[y].contactoId, r.partiUnicos)) {
                                                    r.legisladoresUnicos.push(i.asistenciaMaestro[y].contactoId);
                                                    r.partiUnicos.push(i.asistenciaMaestro[y].contactoId);
                                                }
                                            } else if ((i.asistenciaMaestro[y].clasificacion == "responsable") || (i.asistenciaMaestro[y].clasificacion == "jefeGabinete") || (i.asistenciaMaestro[y].clasificacion == "participante") || (i.asistenciaMaestro[y].clasificacion == "ejecutivo") || (i.asistenciaMaestro[y].clasificacion == "exclusivo") || (i.asistenciaMaestro[y].clasificacion == "privada")) {
                                                r.jurisdiccion = r.jurisdiccion + 1;
                                                if ($scope.puedeAgregar(i.asistenciaMaestro[y].contactoId, r.partiUnicos)) {
                                                    r.jurisdiccionUnicos.push(i.asistenciaMaestro[y].contactoId);
                                                    r.partiUnicos.push(i.asistenciaMaestro[y].contactoId);
                                                }
                                            } else if ((i.asistenciaMaestro[y].clasificacion == "otros") || (i.asistenciaMaestro[y].clasificacion == "gestion")) {
                                                r.control = r.control + 1;
                                                if ($scope.puedeAgregar(i.asistenciaMaestro[y].contactoId, r.partiUnicos)) {
                                                    r.controlUnicos.push(i.asistenciaMaestro[y].contactoId);
                                                    r.partiUnicos.push(i.asistenciaMaestro[y].contactoId);
                                                }
                                            }
                                        }
                                    }
                                } 
                                if (i.mm) {
                                    r.funcionarios = r.funcionarios + 1;
                                    if ($scope.puedeAgregar("01", r.partiUnicos)) {
                                        r.funcionariosUnicos.push("01");
                                    }
                                }
                                if (i.fm) {
                                    r.funcionarios = r.funcionarios + 1;
                                    if ($scope.puedeAgregar("02", r.partiUnicos)) {
                                        r.funcionariosUnicos.push("02");
                                    }
                                }
                                if (i.mev) {
                                    r.funcionarios = r.funcionarios + 1;
                                    if ($scope.puedeAgregar("03", r.partiUnicos)) {
                                        r.funcionariosUnicos.push("03");
                                    }
                                }
                                if (i.pdl) {
                                    r.funcionarios = r.funcionarios + 1;
                                    if ($scope.puedeAgregar("04", r.partiUnicos)) {
                                        r.funcionariosUnicos.push("04");
                                    }
                                }
                                if (i.hrl) {
                                    r.funcionarios = r.funcionarios + 1;
                                    if ($scope.puedeAgregar("05", r.partiUnicos)) {
                                        r.funcionariosUnicos.push("05");
                                    }
                                }
                            }
                        });
                    });
                });
            });
        }
        
    });
    
})
.controller('ORMReporteProximasCtrl', function($rootScope, $scope, ORMInstanciaReunion, ORMReunion, $modal, $window) {
    $scope.filtro2 = "";
    $scope.orden = 'desdeDate';
    var  mes = new Date();
    if (mes.getMonth() == 11) {
        $scope.month="/1";
        $scope.botonMes = "/1";
        var year=mes.getFullYear()+1;
    } else {
        $scope.month=mes.getMonth()+2;
        $scope.botonMes = mes.getMonth()+2;
        var year=mes.getFullYear();
    }
    mes = $scope.month+"/"+year;
    $scope.reuniones = ORMReunion.query();
    var armarFixture = function(mes) {
        $scope.instanciasMes = [];
        $scope.fixture = [];
        $scope.instancias = ORMInstanciaReunion.query({}, function(){
            angular.forEach($scope.instancias, function(i) {
                var tipoReunion = $scope.reunionPorId(i.reunion).tipo;
                if ((tipoReunion == "seguimiento") || (tipoReunion == "transversales") || (tipoReunion == "especificas")) {
                    if (i.fecha.search(mes) <= 1) {
                        if ($scope.proximaFecha(i.fecha, $scope.reunionPorId(i.reunion).frecuencia, i.desdeDate).search(mes) > 1) {
                            $scope.instanciasMes.push(i);
                        }
                    }
                }
            });
            var j = 0;
            for ( var i = 0, l = $scope.instanciasMes.length; i < l; i++ ) {
                if ($scope.reunionPorId($scope.instanciasMes[i].reunion).frecuencia == "1semana") {
                    $scope.fixture[j] = JSON.parse( JSON.stringify($scope.instanciasMes[i]));
                    $scope.fixture[j].desdeDate = $scope.fixture[j].desdeDate + 604800000;
                    j = j + 1;
                    $scope.fixture[j] = JSON.parse( JSON.stringify($scope.instanciasMes[i]));
                    $scope.fixture[j].desdeDate = $scope.fixture[j].desdeDate + 1209600000;
                    j = j + 1;
                    $scope.fixture[j] = JSON.parse( JSON.stringify($scope.instanciasMes[i]));
                    $scope.fixture[j].desdeDate = $scope.fixture[j].desdeDate + 1814400000;
                    j = j + 1;
                    $scope.fixture[j] = JSON.parse( JSON.stringify($scope.instanciasMes[i]));
                    $scope.fixture[j].desdeDate = $scope.fixture[j].desdeDate + 2419200000;
                    j = j + 1;
                } else if ($scope.reunionPorId($scope.instanciasMes[i].reunion).frecuencia == "2semanas") {
                    $scope.fixture[j] = JSON.parse( JSON.stringify($scope.instanciasMes[i]));
                    $scope.fixture[j].desdeDate = $scope.fixture[j].desdeDate + 1209600000;
                    j = j + 1;
                    $scope.fixture[j] = JSON.parse( JSON.stringify($scope.instanciasMes[i]));
                    $scope.fixture[j].desdeDate = $scope.fixture[j].desdeDate + 2419200000;
                    j = j + 1;
                    $scope.fixture[j] = JSON.parse( JSON.stringify($scope.instanciasMes[i]));
                    $scope.fixture[j].desdeDate = $scope.fixture[j].desdeDate + 3628800000;
                    var date = new Date($scope.fixture[j].desdeDate);
                    if (date.getDate() > 28) {
                        j = j + 1;
                    } else {
                        $scope.fixture.splice(j,1);
                    }
                } else if ($scope.reunionPorId($scope.instanciasMes[i].reunion).frecuencia == "3semanas") {
                    $scope.fixture[j] = JSON.parse( JSON.stringify($scope.instanciasMes[i]));
                    $scope.fixture[j].desdeDate = $scope.fixture[j].desdeDate + 1814400000;
                    j = j + 1;
                    $scope.fixture[j] = JSON.parse( JSON.stringify($scope.instanciasMes[i]));
                    $scope.fixture[j].desdeDate = $scope.fixture[j].desdeDate + 3628800000;
                    var date = new Date($scope.fixture[j].desdeDate);
                    if (date.getDate() > 20) {
                        j = j + 1;
                    } else {
                        $scope.fixture.splice(j,1);
                    }
                } else if ($scope.reunionPorId($scope.instanciasMes[i].reunion).frecuencia == "1mes") {
                    $scope.fixture[j] = JSON.parse( JSON.stringify($scope.instanciasMes[i]));
                    $scope.fixture[j].desdeDate = $scope.fixture[j].desdeDate + 2592000000;
                    j = j + 1;
                } else if ($scope.reunionPorId($scope.instanciasMes[i].reunion).frecuencia == "2meses") {
                    $scope.fixture[j] = JSON.parse( JSON.stringify($scope.instanciasMes[i]));
                    $scope.fixture[j].desdeDate = $scope.fixture[j].desdeDate + 5184000000;
                    j = j + 1;
                }
                
            }
        });
    };
    
    $scope.$watch('month', function() {
        $scope.semana = 0;
        mes = $scope.month+"/"+year;
        armarFixture(mes);
    }, true);
    
    $scope.orden = 'desdeDate';
    $scope.proximaFecha = function(fecha, frecuencia, desdeDate) {
        var fechaProx;
        if (frecuencia == "2meses") {
            fechaProx = new Date(desdeDate + 5184000000);
            return (fechaProx.getDate() + "/" + (fechaProx.getMonth()+1) + "/" + fechaProx.getFullYear());
        } else if (frecuencia == "1mes") {
            fechaProx = new Date(desdeDate + 2592000000);
            return (fechaProx.getDate() + "/" + (fechaProx.getMonth()+1) + "/" + fechaProx.getFullYear());
        } else if (frecuencia == "3semanas") {
            fechaProx = new Date(desdeDate + 1814400000);
            return (fechaProx.getDate() + "/" + (fechaProx.getMonth()+1) + "/" + fechaProx.getFullYear());
        } else if (frecuencia == "2semanas") {
            fechaProx = new Date(desdeDate + 1209600000);
            return (fechaProx.getDate() + "/" + (fechaProx.getMonth()+1) + "/" + fechaProx.getFullYear());
        } else if (frecuencia == "1semana") {
            fechaProx = new Date(desdeDate + 604800000);
            return (fechaProx.getDate() + "/" + (fechaProx.getMonth()+1) + "/" + fechaProx.getFullYear());
        } else if (frecuencia == "aPedido") {
            return "A pedido";
        } else {
            fechaProx = new Date(desdeDate);
            return (fechaProx.getDate() + "/" + (fechaProx.getMonth()+1) + "/" + fechaProx.getFullYear());
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
    $scope.contarSemana = function () {
        if ($scope.mostrarSemana) {
            $scope.semana = $scope.semana + 1;
            if (($scope.semana - 50) >= 0) {
                return ($scope.semana - 50);
            } else if (($scope.semana - 40) >= 0) {
                return ($scope.semana - 40);
            } else {
                return ($scope.semana - 30);
            }
        }
    };
    
    $scope.cambiarMes = function () {
        if ($scope.botonMes == "/1") {
            $scope.month = 12;
        } else {
            $scope.month = $scope.botonMes - 1;
        }
    };
    
    $scope.dameMes = function (num, resta) {
        if ((resta == 1) && (num == "/1")) {
            num = 12;
        } else if (resta == 1) {
            num = num - 1;
        }
        if (num == "/1") {
            return "Enero";
        } else if (num == 1) {
            return "Enero";
        } else if (num == 2) {
            return "Febrero";
        } else if (num == 3) {
            return "Marzo";
        } else if (num == 4) {
            return "Abril";
        } else if (num == 5) {
            return "Mayo";
        } else if (num == 6) {
            return "Junio";
        } else if (num == 7) {
            return "Julio";
        } else if (num == 8) {
            return "Agosto";
        } else if (num == 9) {
            return "Septiembre";
        } else if (num == 10) {
            return "Octubre";
        } else if (num == 11) {
            return "Noviembre";
        } else if (num == 12) {
            return "Diciembre";
        }
    };
    $scope.dameFecha = function (mili) {
        var date = new Date(mili);
        return (date.toString());
    };
    $scope.cortar = function(fechaNueva) {
        if ($scope.fechaVieja) {
            var v = (new Date($scope.fechaVieja)).getDay();
            var n = (new Date(fechaNueva)).getDay();
            var v2 = (new Date($scope.fechaVieja)).getDate();
            var n2 = (new Date(fechaNueva)).getDate();
        } else {
            var v = 6;
            var n = (new Date(fechaNueva)).getDay();
            var v2 = 0;
            var n2 = (new Date(fechaNueva)).getDate();
        }
        if (n < v) {
            $scope.fechaVieja = fechaNueva;
            $scope.mostrarSemana = true;
            return true;
        } else if ((n == v) && (n2 > v2)) {
            $scope.fechaVieja = fechaNueva;
            $scope.mostrarSemana = true;
            return true;
        } else {
            $scope.fechaVieja = fechaNueva;
            $scope.mostrarSemana = false;
            return false;
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
}).controller('HorariosCtrl', function($rootScope, $scope, ORMTemario, ORMInstanciaReunion, ORMOrganigrama, ORMReunion, $modal, $window) {
    $scope.filtro2 = "";
    $scope.temarios = ORMTemario.query();
    var  hoy = new Date();
    hoy = hoy.getTime() - 28800000;
    $scope.jurisdicciones = ORMOrganigrama.query();
    $scope.instancias = ORMInstanciaReunion.query({
        $or:JSON.stringify([
            {desdeDate:{$lt: hoy}},
        ]),
    });
    $scope.orden = 'desdeDate';
    $scope.tablaJurisdicciones = [];
    
    $scope.reuniones = ORMReunion.query(function(){
        for (var i = 0; i < $scope.reuniones.length; i++) {
            if ($scope.reuniones[i].jurisdiccion) {
                if ($scope.tablaJurisdicciones.indexOf($scope.reuniones[i].jurisdiccion) < 0)
                {
                    $scope.tablaJurisdicciones.push($scope.reuniones[i].jurisdiccion);
                }
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
    
    $scope.desvio = function(desdeHora, hastaHora, desdeHoraReal, hastaHoraReal) {
        if (desdeHora && hastaHora && desdeHoraReal && hastaHoraReal) {
            var desdeHora1=desdeHora.split(":");
            var hastaHora1=hastaHora.split(":");
            var desdeHoraReal1=desdeHoraReal.split(":");
            var hastaHoraReal1=hastaHoraReal.split(":");
            var horatotale = [];
            var horatotale2 = [];
            for(var a=0;a<2;a++) {
                desdeHora1[a]=(isNaN(parseInt(desdeHora1[a])))?0:parseInt(desdeHora1[a]);
                hastaHora1[a]=(isNaN(parseInt(hastaHora1[a])))?0:parseInt(hastaHora1[a]);
                desdeHoraReal1[a]=(isNaN(parseInt(desdeHoraReal1[a])))?0:parseInt(desdeHoraReal1[a]);
                hastaHoraReal1[a]=(isNaN(parseInt(hastaHoraReal1[a])))?0:parseInt(hastaHoraReal1[a]);
            }
            if (((desdeHoraReal1[0] == desdeHora1[0]) && (desdeHoraReal1[1] > desdeHora1[1])) || ((desdeHoraReal1[0] > desdeHora1[0]) && (desdeHoraReal1[1] > desdeHora1[1]))) {
                horatotale[0]=(desdeHoraReal1[0]-desdeHora1[0]);
                horatotale[1]=(desdeHoraReal1[1]-desdeHora1[1]);
            } else if (((desdeHoraReal1[0] < desdeHora1[0]) && (desdeHoraReal1[1] > desdeHora1[1])) || ((desdeHoraReal1[0] == desdeHora1[0]) && (desdeHoraReal1[1] < desdeHora1[1]))) {
                horatotale[0]=(desdeHora1[0]-desdeHoraReal1[0]);
                horatotale[1]=(desdeHora1[1]-desdeHoraReal1[1]);
            } else {
                horatotale[0]=(desdeHoraReal1[0]-desdeHora1[0]);
                horatotale[1]=(desdeHoraReal1[1]-desdeHora1[1]);
            }
            if (((hastaHoraReal1[0] == hastaHora1[0]) && (hastaHoraReal1[1] > hastaHora1[1])) || ((hastaHoraReal1[0] > hastaHora1[0]) && (hastaHoraReal1[1] > hastaHora1[1]))) {
                horatotale2[0]=(hastaHoraReal1[0]-hastaHora1[0]);
                horatotale2[1]=(hastaHoraReal1[1]-hastaHora1[1]);
            } else if (((hastaHoraReal1[0] < hastaHora1[0]) && (hastaHoraReal1[1] > hastaHora1[1])) || ((hastaHoraReal1[0] == hastaHora1[0]) && (hastaHoraReal1[1] < hastaHora1[1]))) {
                horatotale2[0]=(hastaHora1[0]-hastaHoraReal1[0]);
                horatotale2[1]=(hastaHora1[1]-hastaHoraReal1[1]);
            } else {
                horatotale2[0]=(hastaHoraReal1[0]-hastaHora1[0]);
                horatotale2[1]=(hastaHoraReal1[1]-hastaHora1[1]);
            }
            var horatotal=new Date()
            horatotal.setHours(horatotale[0]);
            horatotal.setMinutes(horatotale[1]);
            var horatotal2=new Date()
            horatotal2.setHours(horatotale2[0]);
            horatotal2.setMinutes(horatotale2[1]);
            return horatotal.getMinutes() + horatotal2.getMinutes();
        } else {
            return 0;
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
    
    $scope.jurisdiccionPorId = function (id) {
        for (var i = 0; i < $scope.jurisdicciones.length; i++) {
            if ($scope.jurisdicciones[i]._id == id)
            {
                return $scope.jurisdicciones[i];
            }
        }  
    };

})
.controller("ORMCalendarioTReportesCtrl", function ($scope, $rootScope, Contactos, ORMTemario, ORMInstanciaReunion, ORMReunion, $routeParams) {
    var hoy = new Date();
    if (hoy.getMonth() < 11) {
        var mesMasUno = hoy.getMonth() + 1;
        var anio = hoy.getFullYear();
    } else {
        var mesMasUno = 0;
        var anio = hoy.getFullYear() + 1;
    }
    var desde = new Date(hoy.getFullYear(), hoy.getMonth(), 1, 0, 0, 0, 0);
    var hasta = new Date(anio, mesMasUno, 1, 0, 0, 0, 0);
    
    var meses = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ];
    $scope.mes = meses[hoy.getMonth()];
    
    $scope.reuniones = ORMReunion.query();
    
    $scope.reunionPorId = function (id) {
        for (var i = 0; i < $scope.reuniones.length; i++) {
            if ($scope.reuniones[i]._id == id)
            {
                return $scope.reuniones[i];
            }
        }  
    };
    
    $scope.instancias = ORMInstanciaReunion.query({
            $and:JSON.stringify([
                {desdeDate:{$gte: desde.getTime()}},
                {desdeDate:{$lte: hasta.getTime()}},
            ]),
        }, function(){
        angular.forEach($scope.instancias, function (i){
            i.diaSemana = (new Date(i.desdeDate)).getDay();
            i.dia = (new Date(i.desdeDate)).getDate();
        });
    });
    
    $scope.dameReuniones = function (diaSemana, minDia, maxDia) {
        var textoRetorno = "";
        angular.forEach($scope.instancias.sort(function(a,b) { return a.desdeDate - b.desdeDate } ), function (i){
            if ((i.diaSemana == diaSemana) && (i.dia > minDia) && (i.dia < maxDia)) {
                if (textoRetorno === "") {
                    textoRetorno = "<center style='font-size: 18px;font-weight: 600;'>" + i.dia + "</center>";
                }
                textoRetorno = textoRetorno + "<hr style='border-top: 1px solid #BABABA;margin-bottom: 5px;'><center>" + i.desdeHora + " - " + i.hastaHora + "<br> " + $scope.reunionPorId(i.reunion).nombre + " (" + $scope.reunionPorId(i.reunion).tipo +")</center><hr style='border-top: 1px solid #BABABA;margin-top: 5px;'>";
            }
        });
        return textoRetorno;
    };
    
})
.controller("ORMReunionReportesCompletasCtrl", function ($scope, Contactos, ORMReunion, ORMTemario, ORMMinuta, ORMInstanciaReunion, ORMTema) {
    $scope.reunionesCompletas = [];
    $scope.orden = ["reunion", "desdeDate"];
    $scope.temas = ORMTema.query();
    $scope.hoy = new Date().getTime() - 80000000;
    $scope.contactos = Contactos.listar();
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    $scope.dameTemario = function (i) {
        var valor = "";
        angular.forEach($scope.temarios, function(t) {
            if (t.instancia == i._id) {
                valor = t.html;
            }
        });
        return valor;
    };
    $scope.temaPorId = function (id) {
      for (var i = 0; i < $scope.temas.length; i++) {
          if ($scope.temas[i]._id == id)
          {
              return $scope.temas[i];
          }
      }  
    };
    $scope.dameMinuta = function (i) {
        var valor = "";
        angular.forEach($scope.minutas, function(m) {
            if (m.instancia == i._id) {
                valor = m.html;
            }
        });
        return valor;
    };
    $scope.dameCompromisos = function (i) {
        var valor = [];
        angular.forEach($scope.minutas, function(m) {
            if (m.instancia == i._id) {
                valor = m.compromisos;
            }
        });
        return valor;
    };
    $scope.dameReunion = function (i) {
        var valor = {};
        angular.forEach($scope.reuniones, function(m) {
            if (m._id == i.reunion) {
                valor = m;
            }
        });
        return valor;
    };
    
    $scope.aMilisegundos = function (fecha) {
        if (fecha) {
            return (new Date(moment(fecha,"DD/MM/YYYY").format('MMMM DD YYYY, HH:mm:ss')).getTime());
        } else {
            return 0;
        }
    };
    
    $scope.dameParticipantes = function (i) {
        var participantes = [];
        if (i.asistencia) {
            angular.forEach(i.asistencia, function(a) {
                if ((a.asistio == "Si") && (participantes.indexOf(a.contactoId) == -1)) {
                    participantes.push(a.contactoId);
                }
            });
        }
        if (i.asistenciaMaestro) {
            angular.forEach(i.asistenciaMaestro, function(am) {
                if ((am.asistio == "Si") && (participantes.indexOf(am.contactoId) == -1)) {
                    participantes.push(am.contactoId);
                }
            });
        }
        if (i.hrl) {
            if (participantes.indexOf("521ca1acfc5dd9e60400000c") == -1) {
                participantes.push("521ca1acfc5dd9e60400000c");
            }
        }
        if (i.mev) {
            if (participantes.indexOf("524450b1295915d121000048") == -1) {
                participantes.push("524450b1295915d121000048");
            }
        }
        if (i.fm) {
            if (participantes.indexOf("5241bc4adb6224701f0000ad") == -1) {
                participantes.push("5241bc4adb6224701f0000ad");
            }
        }
        if (i.mm) {
            if (participantes.indexOf("5239c05e854f044118000045") == -1) {
                participantes.push("5239c05e854f044118000045");
            }
        }
        if (i.pdl) {
            if (participantes.indexOf("5225f57a338cd3f7030000bb") == -1) {
                participantes.push("5225f57a338cd3f7030000bb");
            }
        }
        return participantes;
    };
    
    $scope.temarios = ORMTemario.query({}, function(){
        $scope.minutas = ORMMinuta.query({}, function(){
            $scope.reuniones = ORMReunion.query({}, function(){
                $scope.instancias = ORMInstanciaReunion.query({
                    $and:JSON.stringify([
                        {desdeDate:{$gte: 1420070400000}},
                        {desdeDate:{$lte: 1451606399000}},
                    ]),
                }, function(){
                    angular.forEach($scope.instancias, function (i){
                        $scope.reunionesCompletas.push({
                            id : i._id,
                            reunion : $scope.dameReunion(i).nombre.replace(/\"/g, ""),
                            tipo : $scope.dameReunion(i).tipo,
                            participantes: $scope.dameParticipantes(i),
                            minuta: $scope.dameMinuta(i),
                            temario : $scope.dameTemario(i),
                            fecha : i.fecha,
                            desdeDate : i.desdeDate,
                            compromisos : $scope.dameCompromisos(i)
                        });
                    });
                });
            });
        });
    });
});