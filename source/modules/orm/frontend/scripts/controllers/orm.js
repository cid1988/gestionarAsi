var roles = [{
        key: '',
        nombre: 'Ninguno'
    }, {
        key: 'responsable',
        nombre: 'Responsable'
    }, {
        key: 'jefeDeGabinete',
        nombre: 'Jefe de Gabinete'
    }, {
        key: 'ejecutivo',
        nombre: 'Ejecutivo'
    }, {
        key: 'participante',
        nombre: 'Participante'
    }, {
        key: 'asistente',
        nombre: 'Asistente'
    }, {
        key: 'privada',
        nombre: 'Privada'
    }, {
        key: 'gestion',
        nombre: 'Gestión'
    }
];

var rolesPorKey = {};
roles.forEach(function(r) {
    rolesPorKey[r.key] = r;
});

var tiposAsistencia = [{
        key: '',
        nombre: 'Ninguno'
    }, {
        key: 'sinConfirmar',
        nombre: 'Sin confirmar'
    }, {
        key: 'comprometido',
        nombre: 'Comprometido'
    }, {
        key: 'noComprometido',
        nombre: 'No comprometido'
    }
];

var tiposAsistenciaPorKey = {};
tiposAsistencia.forEach(function(r) {
    tiposAsistenciaPorKey[r.key] = r;
});

angular.module('bag2.orm', []).value('camposMailORM', function() {
    return [{
        nombre: 'Temario',
        campo: 'temario'
    }, {
        nombre: 'Propuesta de temario',
        campo: 'propuestaTemario'
    }, {
        nombre: 'Minuta',
        campo: 'minuta'
    }];
}).value('ORMRoles', function() {
    return roles;
})
.value('ORMListaTratamiento', function () {
    return [{
            nombre: 'Ninguno'
        }, {
            nombre: 'Sr.'
        }, {
            nombre: 'Sra.'
        }, {
            nombre: 'Srta.'
        },
    ];
})
.value('ORMListaTelefonos', function () {
    return [{
            nombre: 'Seleccionar'
        }, {
            nombre: 'Telefono directo'
        }, {
            nombre: 'Telefono alternativo'
        }, {
            nombre: 'Conmutador'
        }, {
            nombre: 'Celular laboral'
        }, {
            nombre: 'Celular alternativo'
        },
    ];
})
.value('ORMColoresPorTipo', function() {
    return {
          'seguimiento':'red',
          'transversales': 'green',
          'especificas': 'blue',
          'planeamiento': '#FFBF00',
          'presupuesto': 'violet',
          'coordinacion': 'grey',
          'planLargoPlazo': '#B4045F',
          'proyectosEspeciales': '#088A85',
          'eventuales': '#8A4B08'
        };
}).value('ORMRolesPorKey', function() {
    return rolesPorKey;
}).value('ORMTiposAsistenciaPorKey', function() {
    return tiposAsistenciaPorKey;
}).controller('ORMCtrl', function($scope) {}).service('ORMHelper', function($location) {
    var frecuencias = [{
            key: '1dia',
            nombre: 'Diaria'
        }, {
            key: '1semana',
            nombre: 'Cada semana'
        }, {
            key: '2semanas',
            nombre: 'Cada dos semanas'
        }, {
            key: '3semanas',
            nombre: 'Cada tres semanas'
        }, {
            key: '1mes',
            nombre: 'Todos los meses'
        }, {
            key: '2meses',
            nombre: 'Cada dos meses'
        }, {
            key: 'aPedido',
            nombre: 'A pedido'
        }
    ];
    return {
        verReunion: function(r) {
            $location.url('/orm/reuniones/' + r._id);
        },
        frecuencias: function() {
            return frecuencias;
        },
        tiposReuniones: function() {
            return ['seguimiento', 'especifica', 'presupuesto', 'gestion'];
        },
        nombreTipoReunion: function(tr) {
            switch (tr) {
                case 'seguimiento':
                    return 'Seguimiento';
                case 'transversasles':
                    return 'Transversales';
                case 'especificas':
                    return 'Especificas';
                case 'planeamiento':
                    return 'Planeamiento';
                case 'presupuesto':
                    return 'Presupuesto';
                case 'coordinacion':
                    return 'Coordinacion';
                case 'planLargoPlazo':
                    return 'Plan Largo Plazo';
                case 'proyectosEspeciales':
                    return 'Proyectos Especiales';
                case 'eventuales':
                    return 'Eventuales';
                default:
                    return tr;
            }
        },
        ver: function(r) {
            $location.url('/orm/reuniones/' + r._id);
        },
        editarReunion: function(r) {
            $location.url('/orm/reuniones/' + r._id + '/edit');
        }
    };
}).controller('ORMReunionInstanciaCtrl', function($scope, camposMailORM) {
    $scope.camposMail = camposMailORM();
}).controller('ORMAlarmasCtrl', function($scope, ORMReunion, ORMInstanciaReunion, AgendaInstancia) {
    $scope.fecha = new Date();
    $scope.color = "btn-success";
    $scope.color2 = "btn-success";
    $scope.faltan = "";
    $scope.faltan2 = "";
    $scope.reuniones = ORMReunion.query();
    $scope.refrescar = "";
    $scope.cambiaColor = 1;
    $scope.meses = [ "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ];
    var hoy = $scope.fecha.getTime() - 3600000;
    var siguiente = hoy + 604800000;
    $scope.instancias = ORMInstanciaReunion.query({
        soporte : true,
        $and:JSON.stringify([
            {desdeDate:{$gte: hoy}},
            {desdeDate:{$lte: siguiente}},
        ]),
    }, function() {
        var agendaInstancias = AgendaInstancia.query({
            agenda : "55cb5fad7c7e3a740910b0f9",
            $and:JSON.stringify([
                {desdeDate:{$gte: hoy}},
                {desdeDate:{$lte: siguiente}},
            ]),
        }, function() {
            $scope.instancias = $scope.instancias.concat(agendaInstancias);
            $scope.alerta = "";
            $scope.alerta2 = "";
            angular.forEach($scope.instancias, function (i){
                if ($scope.alerta === "") {
                    $scope.alerta = i;
                } else if ($scope.alerta.desdeDate > i.desdeDate) {
                    $scope.alerta2 = $scope.alerta;
                    $scope.alerta = i;
                } else if ($scope.alerta2 === "") {
                    $scope.alerta2 = i;
                } else if ($scope.alerta2.desdeDate > i.desdeDate) {
                    $scope.alerta2 = i;
                }
            });
            $scope.tiempoAReunion();
        });
    });
    
    $scope.sonido = document.getElementById("sonido");
    
    $scope.traerDatos = function () {
        var hoy = $scope.fecha.getTime() - 3600000;
        var siguiente = hoy + 604800000;
        $scope.reuniones = ORMReunion.query();
        $scope.instancias = ORMInstanciaReunion.query({
            soporte : true,
            $and:JSON.stringify([
                {desdeDate:{$gte: hoy}},
                {desdeDate:{$lte: siguiente}},
            ]),
        }, function(){
            var agendaInstancias = AgendaInstancia.query({
                agenda : "55cb5fad7c7e3a740910b0f9",
                $and:JSON.stringify([
                    {desdeDate:{$gte: hoy}},
                    {desdeDate:{$lte: siguiente}},
                ]),
            }, function() {
                $scope.instancias = $scope.instancias.concat(agendaInstancias);
                $scope.alerta = "";
                $scope.alerta2 = "";
                angular.forEach($scope.instancias, function (i){
                    if ($scope.alerta === "") {
                        $scope.alerta = i;
                    } else if ($scope.alerta.desdeDate > i.desdeDate) {
                        $scope.alerta2 = $scope.alerta;
                        $scope.alerta = i;
                    } else if ($scope.alerta2 === "") {
                        $scope.alerta2 = i;
                    } else if ($scope.alerta2.desdeDate > i.desdeDate) {
                        $scope.alerta2 = i;
                    }
                });
            });
        });
    };
    
    $scope.$watch("fecha.getMinutes()", function (p) {
        if ((p === 0) || (p == 10) || (p == 20) || (p == 30) || (p == 40) || (p == 50)) {
            $scope.traerDatos();
            $scope.tiempoAReunion();
        }
    });
    
    $scope.tiempoAReunion = function () {
        $scope.fecha = new Date();
        if ($scope.alerta) {
            var milisegundos = $scope.alerta.desdeDate - $scope.fecha.getTime();
            $scope.tiempoAReunion2();
            if ((milisegundos) > 0) {
                if ($scope.fecha.getTimezoneOffset() === 0) {
                    var d = new Date(milisegundos);
                } else {
                    var d = new Date(milisegundos+10800000);
                }
                var di = "";
                if (milisegundos > 604800000) {
                    di = "7 dias ";
                } else if (milisegundos > 518400000) {
                    di = "6 dias ";
                } else if (milisegundos > 432000000) {
                    di = "5 dias ";
                } else if (milisegundos > 345600000) {
                    di = "4 dias ";
                } else if (milisegundos > 259200000) {
                    di = "3 dias ";
                } else if (milisegundos > 172800000) {
                    di = "2 dias ";
                } else if (milisegundos > 86400000) {
                    di = "1 dia ";
                }
                var h = $scope.masCero(d.getHours());
                var m = $scope.masCero(d.getMinutes());
                $scope.faltan = "Faltan: " + di + h + "hs " + m + "min";
            } else {
                $scope.faltan = "Comenzó a las " + $scope.alerta.desdeHora + "hs";
            }
            if (milisegundos < (-3600000)) {
                $scope.traerDatos();
            } else if (milisegundos < (-900000)) {
                if ($scope.color != "btn-info") {
                    $scope.color = "btn-info";
                    $scope.cambiaColor = 0;
                } else if ($scope.cambiaColor === 0) {
                    $scope.cambiaColor = 1;
                    $scope.sonido.play();
                }
            } else if (milisegundos < (960000)) {
                if ($scope.color != "btn-danger") {
                    $scope.color = "btn-danger";
                    $scope.cambiaColor = 0;
                } else if ($scope.cambiaColor === 0) {
                    $scope.cambiaColor = 1;
                    $scope.sonido.play();
                }
            } else if (milisegundos < (1860000)) {
                if ($scope.color != "btn-warning") {
                    $scope.color = "btn-warning";
                    $scope.cambiaColor = 0;
                } else if ($scope.cambiaColor === 0) {
                    $scope.cambiaColor = 1;
                    $scope.sonido.play();
                }
            } else {
                $scope.color = "btn-success";
            }
        }
    };
    
    $scope.tiempoAReunion2 = function () {
        if ($scope.alerta2) {
                var milisegundos = $scope.alerta2.desdeDate - $scope.fecha.getTime();
            if ((milisegundos) > 0) {
                if ($scope.fecha.getTimezoneOffset() === 0) {
                    var d = new Date(milisegundos);
                } else {
                    var d = new Date(milisegundos+10800000);
                }
                var di = "";
                if (milisegundos > 604800000) {
                    di = "7 dias ";
                } else if (milisegundos > 518400000) {
                    di = "6 dias ";
                } else if (milisegundos > 432000000) {
                    di = "5 dias ";
                } else if (milisegundos > 345600000) {
                    di = "4 dias ";
                } else if (milisegundos > 259200000) {
                    di = "3 dias ";
                } else if (milisegundos > 172800000) {
                    di = "2 dias ";
                } else if (milisegundos > 86400000) {
                    di = "1 dia ";
                }
                var h = $scope.masCero(d.getHours());
                var m = $scope.masCero(d.getMinutes());
                $scope.faltan2 = "Faltan: " + di + h + "hs " + m + "min ";
            } else {
                $scope.faltan2 = "Comenzó a las " + $scope.alerta2.desdeHora + "hs";
            }
            if (milisegundos < (-3600000)) {
                $scope.traerDatos();
            } else if (milisegundos < (-900000)) {
                if ($scope.color2 != "btn-info") {
                    $scope.color2 = "btn-info";
                    $scope.cambiaColor = 0;
                } else if ($scope.cambiaColor === 0) {
                    $scope.cambiaColor = 1;
                    $scope.sonido.play();
                }
            } else if (milisegundos < (960000)) {
                if ($scope.color2 != "btn-danger") {
                    $scope.color2 = "btn-danger";
                    $scope.cambiaColor = 0;
                } else if ($scope.cambiaColor === 0) {
                    $scope.cambiaColor = 1;
                    $scope.sonido.play();
                }
            } else if (milisegundos < (1860000)) {
                if ($scope.color2 != "btn-warning") {
                    $scope.color2 = "btn-warning";
                    $scope.cambiaColor = 0;
                } else if ($scope.cambiaColor === 0) {
                    $scope.cambiaColor = 1;
                    $scope.sonido.play();
                }
            } else {
                $scope.color2 = "btn-success";
            }
        }
    };
    
    
    $scope.masCero = function (numero) {
        if (numero < 10) {
            return ("0" + numero);
        } else {
            return numero;
        }
    };
    
    $scope.aFecha = function (d) {
        return ($scope.masCero(d.getDate()) + "/" + $scope.meses[d.getMonth()] + "/" + d.getFullYear());
    };
    $scope.aHora = function (d) {
        if (d.getTimezoneOffset() === 0) {
            return ($scope.masCero(d.getHours()-3) + ":" + $scope.masCero(d.getMinutes()));
        } else {
            return ($scope.masCero(d.getHours()) + ":" + $scope.masCero(d.getMinutes()));
        }
    };
    
    $scope.instanciaPorId = function (id) {
      for (var i = 0; i < $scope.instancias.length; i++) {
          if ($scope.instancias[i]._id == id)
          {
              return $scope.instancias[i];
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
    
    setInterval($scope.tiempoAReunion,3000);
}).controller('ORMAlarmaTemarioCtrl', function($scope, ORMReunion, ORMInstanciaReunion, ORMTemario) {
    
    $scope.calcular = function(){
       //document.getElementById("scroller").style.top = "50px";
       
       //setTimeout ("alert( ' " + document.getElementById("scroller").style.top + "');" , 100); 
       
       alert(document.getElementById("scroller").offsetHeight);
    };
    
    $scope.fecha = new Date();
    $scope.color = "btn-success";
    $scope.faltan = "";
    $scope.reuniones = ORMReunion.query();
    $scope.refrescar = "";
    $scope.cambiaColor = 1;
    $scope.meses = [ "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ];
    var hoy = $scope.fecha.getTime() - 3600000;
    var siguiente = hoy + 604800000;
    $scope.temarios = ORMTemario.query({}, function() {
        $scope.instancias = ORMInstanciaReunion.query({
            $and:JSON.stringify([
                {desdeDate:{$gte: hoy}},
                {desdeDate:{$lte: siguiente}},
            ]),
        }, function() {
            $scope.alerta = "";
            angular.forEach($scope.instancias, function (i){
                if ($scope.tieneTemario(i._id)) {
                    if ($scope.alerta === "") {
                        $scope.alerta = i;
                    } else if ($scope.alerta.desdeDate > i.desdeDate) {
                        $scope.alerta = i;
                    }
                }
            });
        });
    });
    
    $scope.empezar = function ()
    {
        /// Texto en movimiento en la barra de estado
        var txt="Esta es la primera linea de texto que se desplaza "
        + "y esta es la segunda, aunque puedes poner "
        + "todas las que quieras.";
          window.status = txt;
          txt = txt.substring(1,txt.length) + txt.charAt(0);
          window.setTimeout("$scope.empezar()",100);
    }
    
    $scope.tieneTemario = function (id) {
      var  result = false;
      for (var i = 0; i < $scope.temarios.length; i++) {
          if ($scope.temarios[i].instancia == id)
          {
              result = true;
              break;
          }
      }
      return result;
    }; 
    
    $scope.traerDatos = function () {
        var hoy = $scope.fecha.getTime() - 3600000;
        var siguiente = hoy + 604800000;
        $scope.reuniones = ORMReunion.query();
        $scope.instancias = ORMInstanciaReunion.query({
            $and:JSON.stringify([
                {desdeDate:{$gte: hoy}},
                {desdeDate:{$lte: siguiente}},
            ]),
        }, function(){
            $scope.alerta = "";
            angular.forEach($scope.instancias, function (i){
                if ($scope.tieneTemario(i._id)) {
                    if ($scope.alerta === "") {
                        $scope.alerta = i;
                    } else if ($scope.alerta.desdeDate > i.desdeDate) {
                        $scope.alerta = i;
                    }
                }
            });
        });
    };
    
    $scope.$watch("fecha.getMinutes()", function (p) {
        if ((p === 0) || (p == 10) || (p == 20) || (p == 30) || (p == 40) || (p == 50)) {
            $scope.traerDatos();
        }
    });
    
    
    $scope.masCero = function (numero) {
        if (numero < 10) {
            return ("0" + numero);
        } else {
            return numero;
        }
    };
    
    $scope.aFecha = function (d) {
        return ($scope.masCero(d.getDate()) + "/" + $scope.meses[d.getMonth()] + "/" + d.getFullYear());
    };
    $scope.aHora = function (d) {
        if (d.getTimezoneOffset() === 0) {
            return ($scope.masCero(d.getHours()-3) + ":" + $scope.masCero(d.getMinutes()));
        } else {
            return ($scope.masCero(d.getHours()) + ":" + $scope.masCero(d.getMinutes()));
        }
    };
    
    $scope.instanciaPorId = function (id) {
      for (var i = 0; i < $scope.instancias.length; i++) {
          if ($scope.instancias[i]._id == id)
          {
              return $scope.instancias[i];
          }
      }  
    };
    
    $scope.temarioPorId = function (id) {
      for (var i = 0; i < $scope.temarios.length; i++) {
          if ($scope.temarios[i].instancia == id)
          {
              return $scope.temarios[i];
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
    
    $scope.actualizoFecha = function () {
      $scope.fecha = new Date();  
    };
    
    setInterval($scope.actualizoFecha,6000);
})
.service("Fechas", function () {
    return {
        hoyEnMs: function () {
            var d = new Date();
            d.setHours(0,0,0,0);

            return d.valueOf();
        }
    }
})
.service("Utilidades", function () {
    return {
        diccionario: function (lista) {
            var d = {};
            
            angular.forEach(lista, function (i) {
                if (i._id) {
                    d[i._id] = i;
                }
            });

            return d;
        }
    }
})
.service("Reuniones", function (ORMTiposAsistenciaPorKey, ORMInstanciaReunion, Fechas, ORMReunion) {
    return {
        tiposAsistenciaPorKey: function () {
            return ORMTiposAsistenciaPorKey;
        },
        series: function (callback) {
            return ORMReunion.list(callback);
        },
        proximasFechas: function (maximo, callback) {
            return ORMInstanciaReunion.list({
                desdeDate: JSON.stringify({
                  $gt: Fechas.hoyEnMs()
                })
            }, callback);
        },
        buscarPorId: function (_id) {
            var deferred = $q.defer();
            $http.get('/api/orm.reuniones/' + _id)
            .success(function (data) {
                deferred.resolve(new ORMReunion(data));
            }).error(function () {
                deferred.reject('HTTP error');
            });

            return deferred.promise;
        }
    }
})
.service("Contactos", function (ORMContacto) {
    return {
        buscarPorId: function (id, callback) {
            return ORMContacto.findById({
                _id: id
            }, callback);
        },
        traer: function (id, callback) {
            return ORMContacto.findById({
                _id: id
            }, callback);
        },
        listar: function (callback) {
            return ORMContacto.query({
                eliminado: JSON.stringify({$exists: false})
            }, callback);
        }
    }
})
.run(function($rootScope, ORMContacto, $modal) {
    ($rootScope.uiHelper || ($rootScope.uiHelper = {})).abrirTarjetaContacto = function(_id) {
        var s = $rootScope.$new();
        s.contacto = ORMContacto.findById({
            _id: _id
        });
        $modal({
            template: '/views/orm/contactos/popup.html',
            persist: true,
            show: true,
            backdrop: 'static',
            scope: s
        });
    };
})
.directive("listaEnvio", function () {
    return {
        restrict:"E",
        repalce: true,
        templateUrl:"/views/orm/lista-envio.html",
        scope: {
            contactos: "=",
            seleccionadosPara: "=",
            seleccionadosCc: "=",
            seleccionadosCco: "=",
            seleccionadosExclusivos: "=",
            permisoAgregar: "=",
            contactoAgregado: "="
        },
        link: function (scope, element, attributes) {
            scope.buscarCorreo = function(nombre, contacto) {
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
            
            scope.quitar = function (p, array) {
                array && p && array.splice(array.indexOf(p), 1);
            };
            
            scope.contactoPorId = function (id) {
              for (var i = 0; i < scope.contactos.length; i++) {
                  if (scope.contactos[i]._id == id)
                  {
                      return scope.contactos[i];
                  }
              }  
            };
            scope.agregaPara = function (p) {
                if (p) {
                    scope.seleccionadosPara.push({
                        contactoId: p
                    });
                    if (scope.contactoAgregado != "00") {
                        scope.contactoAgregado.push({
                            contactoId: p
                        });
                    }
                    scope.buscador.para = "";
                }
            };
            scope.agregaCC = function (p) {
                if (p) {
                    scope.seleccionadosCc.push({
                        contactoId: p
                    });
                    if (scope.contactoAgregado != "00") {
                        scope.contactoAgregado.push({
                            contactoId: p
                        });
                    }
                    scope.buscador.cc = "";
                }
            };
            scope.agregaCCO = function (p) {
                if (p) {
                    scope.seleccionadosCco.push({
                        contactoId: p
                    });
                    if (scope.contactoAgregado != "00") {
                        scope.contactoAgregado.push({
                            contactoId: p
                        });
                    }
                    scope.buscador.cco = "";
                }
            };
            scope.agregaExclusivo = function (p) {
                if (p) {
                    scope.seleccionadosExclusivos.push({
                        contactoId: p
                    });
                    scope.buscador.exclusivo = "";
                }
            };
        }
    };
});