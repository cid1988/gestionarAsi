angular.module('bag2.orm-nuevo-contacto-modal', []).controller('NuevoContactoModalCtrl', function($scope, $modal, $location, Contactos, ORMContacto, ORMOrganigrama, ORMListaTelefonos, ORMListaCorreos, ORMListaRoles, ORMListaTitulo, ORMServicios) {
    //Lista de contactos
    $scope.contactos = Contactos.listar(function() {});
    
    //Nuevo contacto
    $scope.nuevo = new ORMContacto({
        servicios: [],
        telefonos: [],
        correos: [],
        direcciones: [],
        roles: [],
    });

    //Setear el tab a abrir
    $scope.tab = 'identificacion',

    //Listado para el campo telefonos
    $scope.listaTelefonos = ORMListaTelefonos();

    //Listado para el campo correos
    $scope.listaCorreos = ORMListaCorreos();

    //Listado para el campo rol
    $scope.listaRoles = ORMListaRoles();

    //Listado para el campo titulo
    $scope.listaTitulo = ORMListaTitulo();

    //Lista de servicios
    $scope.listaServicios = ORMServicios.list();

    //Lista de organigrama
    $scope.organigrama = ORMOrganigrama.list();

    $scope.findById = function (lista, id) {
        if (lista && lista.length && id) {
            for (var i = 0; i < lista.length; i++) {
                if (lista[i]._id == id) {
                    return lista[i];
                }
            }
        }
    }

    //Lista de servicios para agregar en agregarDataServicio
    $scope.listaServ = new ORMServicios();

    //Subir nueva foto
    $scope.uploaded = [];
    $scope.$watch('uploaded', function() {
        if ($scope.uploaded.length > 0 && $scope.uploaded[0].ok) {
            $scope.nuevo.foto = $scope.uploaded[0].id;
        }
    }, true);

    //Agregar nuevos telefonos
    $scope.agregarTelefonos = function(dataTelefonos) {
        $scope.nuevo.telefonos.push($scope.dataTelefonos);
        $scope.dataTelefonos = {
            nombre: '',
            valor: '',
            interno: '',
        };
    };

    //Agregar nuevos correos
    $scope.agregarCorreos = function(dataCorreos) {
        $scope.nuevo.correos.push($scope.dataCorreos);
        $scope.dataCorreos = {
            nombre: '',
            valor: '',
        };
    };

    //Agregar nueva direccion
    $scope.agregarDireccion = function(dataDireccion) {
        $scope.dataDireccion.valorCalle = $('#calle-typeahead').val();
        $scope.nuevo.direcciones.push($scope.dataDireccion);
        $scope.dataDireccion = {
            valorCalle: '',
            valorAltura: '',
            valorBarrio: '',
            valorProvincia: '',
        };
    };

    //Agregar nuevos servicios
    $scope.agregarServicios = function(dataServicio) {
        if (!$scope.nuevo.servicios) {
            $scope.nuevo.servicios = [];
        }
        else {
            $scope.nuevo.servicios.push($scope.dataServicio);
            $scope.dataServicio = {
                nombre: '',
                pin: '',
            };
        }
    };

    //Agregar un nuevo servicio a la lista de servicios
    $scope.agregarDataServicio = function(dataNuevoServicio) {
        $scope.listaServ.$save($scope.dataNuevoServicio);
        $scope.listaServicios = ORMServicios.list();
        $scope.listaServ = new ORMServicios();
        $scope.dataNuevoServicio = {
            nombre: '',
        };
    };

    //Agregar nuevo rol
    $scope.agregarRol = function(dataRol) {
        $scope.nuevo.roles.push($scope.dataRol);
        $scope.dataRol = {
            nombre: '',
            valor: '',
        };
    };

    /*Guardar nuevo contacto
    $scope.guardar = function() {
        $scope.nuevo.apellidos = ($scope.nuevo.apellidos || '').toUpperCase();
        $scope.nuevo.$save(function() {
            $location.path('/orm/contactos/detalle/' + $scope.nuevo._id);
        });
    };*/
    
    
    
    //Guardar contacto solo el id
    $scope.guardar = function() {
        $scope.organigrama = $scope.nuevo.organigrama,
        $scope.nuevo.apellidos = ($scope.nuevo.apellidos || '').toUpperCase();
        $scope.nuevo.$save(function() {
            $location.path('/orm/contactos/detalle/' + $scope.nuevo._id);
        });
    };
    
    
    
    //Eliminar elementos de las listas
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    //Verificar por nombre / apellido duplicado
    $scope.$watch('nuevo.nombre + \' \' + nuevo.apellidos', function (nn) {
        var otros = ORMContacto.query({
            $or:JSON.stringify([{eliminado: {$exists:false}}]),
            nombre: JSON.stringify({ "$regex" : $scope.nuevo.nombre, "$options" : "-i" }),
            apellidos: JSON.stringify({ "$regex" : $scope.nuevo.apellidos, "$options" : "-i" })
        }, function () {
            var dup = false;
            var candidatos = [];
            
            for (var i = 0; i < otros.length; i++) {
                // Sólo si es otro contacto _id != _id
                if (otros[i]._id != $scope.nuevo._id) {
                    dup = true;
                    candidatos.push(otros[i]);
                }
            }
            
            $scope.nombreDuplicadoCandidatos = candidatos;
            $scope.nombreDuplicado = dup;
        });
    });
    
    //Buscar email duplicado
    $scope.$watch('nuevo.correos', function () {
       if ($scope.nuevo && $scope.nuevo.correos && $scope.nuevo.correos.length > 0) {
           var candidatos = [];
           
           for (var i = 0; i < $scope.nuevo.correos.length; i++) {
               var emailObj = $scope.nuevo.correos[i];
               
               if (emailObj.nombre == 'Email oficial') {
                   var otros = ORMContacto.query({
                       $or:JSON.stringify([{eliminado: {$exists:false}}]),
                       "correos": JSON.stringify({ $elemMatch: { valor: emailObj.valor } })
                   }, function () {
                       for (var j = 0; j < otros.length;j ++) {
                           if (otros[j]._id != $scope.nuevo._id) {
                               candidatos.push(otros[j]);
                           }
                       }
                       
                       $scope.emailDuplicado = candidatos.length > 0;
                       $scope.emailDuplicadoCandidatos = candidatos;
                   });
                   
                   break;
               }
               
               $scope.emailDuplicado = false;
               $scope.emailDuplicadoCandidatos = [];
           }
       } else {
           $scope.emailDuplicado = false;
       }
    }, true);
});