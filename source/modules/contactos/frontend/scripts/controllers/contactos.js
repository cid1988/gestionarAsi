angular.module('bag2.orm.contacto', []).controller('ORMContacto', function($scope, $modal, Contactos, ORMContacto, ORMListaTelefonos, ORMOrganigrama) { //Lista de contactos

    //Query del campo organigrama
    $scope.organigrama = ORMOrganigrama.query();
    $scope.jurisdiccionPorId = function (id) {
        for (var i = 0; i < $scope.organigrama.length; i++) {
            if ($scope.organigrama[i]._id == id){
                return $scope.organigrama[i];
            }
        }
    };
    
    //Ordenar por correo oficial
    $scope.valorCorreo = function(c) {
        if (c.correos) {
            for (var i = 0; i < c.correos.length; i++) {
                if (c.correos[i].nombre == 'Email oficial') {
                    return c.correos[i].valor;
                }
            }
            return '';
        }
    };
    
    //Listado de contactos cargados
    $scope.contactos = Contactos.listar(function() {
        angular.forEach($scope.contactos, function (c){
            if (c.organigrama) {
                c.dependencia = $scope.jurisdiccionPorId(c.organigrama);
            }
        });
    });
    
    
    $scope.letraSeleccionada = "A";
    $scope.abecedario = ("ABCDEFGHIJKLMNÑOPQRSTUVWXYZ").split("");
    $scope.letra = function (c) {
        if ($scope.letraSeleccionada != "Todos") {
            if (c && c.apellidos && c.apellidos.length > 0 && c.apellidos[0].toLowerCase() == $scope.letraSeleccionada.toLowerCase()) 
            {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    };
    
    $scope.seleccionarLetra = function (l) {
        $scope.letraSeleccionada = l;
    };
    
    /*Guardar
    $scope.guardar = function() {
        $scope.contacto.$save(function() {
            $scope.editando = false;
            angular.extend($scope.$parent.contacto, $scope.contacto);
            delete $scope.contacto;
        });
    };*/
    
    /*Cancelar la vista del detalle
    $scope.cancelar = function() {
        delete $scope.contacto;
        $scope.editando = false;
    };*/
    
    //Modo edicion de contacto
    $scope.editar = function() {
        $scope.editando = true;
        $scope.contacto = angular.copy($scope.contacto);
    };
    
    //Ordenar por telefono conmutador
    $scope.valorConmutador = function(c) {
        if (c.telefonos) {
            for (var i = 0; i < c.telefonos.length; i++) {
                if (c.telefonos[i].nombre == 'Conmutador') {
                    return c.telefonos[i].valor + ' int. ' + c.telefonos[i].interno;
                }
            }
            return '';
        }
    };
    
    //Ordenar por correo oficial
    $scope.valorCorreo = function(c) {
        if (c.correos) {
            for (var i = 0; i < c.correos.length; i++) {
                if (c.correos[i].nombre == 'Email oficial') {
                    return c.correos[i].valor;
                }
            }
            return '';
        }
    };
    
    /*Ordenar por jurisdiccion
    $scope.valorJurisdiccion = function(c) {
        if (c.organigrama) {
            return c.organigrama.nombreCompleto;
        }
        return '';
    };*/
    

//Detalle de contactos---------------------------------------------------------------------------------
}).controller('ORMDetalleContactos', function($scope, $modal, $routeParams, Contactos, $location, ORMContacto, ORMServicios, ORMOrganigrama, ORMListaTelefonos, ORMListaCorreos, ORMListaRoles, ORMListaTitulo, ORMContactoCaptura, User) {
    //Query del contacto con el id
    $scope.contacto = ORMContacto.get({
        _id: $routeParams._id
    });
    
    // Traigo el user completo con el username.
    var user = User.get({
        username : $scope.username
    }, function(){
         if(user.idContacto == $routeParams._id){
               $scope.bool=  true;
          }else{
              $scope.bool = false;
          }
    });
       
     
    
    //$scope.auxiliar = ORMContacto.roles.find({ 'valor' :  $routeParams._id});
    $scope.auxiliar = ORMContacto.query({});
    
    $scope.filtro=function(ba) //Solo los que tengan roles.
    {
        try
        { 
            if(ba.roles.length>0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        catch(err)
        {
            return false;
        }
        
    };
    
    $scope.existeId=function(array)//i.roles Si id del seleccionado existe dentro del array
    {
        try
        {
            for(var i=0;i<=array.length; i++)
            {
                if(array[i].valor==$routeParams._id)
                {
                    return true;
                }
            }
            return false;
        }
        catch(err)
        {
            return false;
        }
        
    };
    
    $scope.filtroPorId=function(ba)//Si el campo en especifico es el del seleccionado
    {
        try
        {
            if(ba.valor==$routeParams._id)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        catch(err)
        {
            return false;
        }
        
    };

    $scope.findById = function (lista, id) {
        if (lista && lista.length && id) {
            for (var i = 0; i < lista.length; i++) {
                if (lista[i]._id == id) {
                    return lista[i];
                }
            }
        }
    };

    //Lista de contactos
    $scope.contactos = Contactos.listar(function() {});

    //Setear el tab a abrir
    $scope.tab = 'identificacion',

    $scope.dependenciaSuperior = function(idOrgani) {
        if (idOrgani) {
            for (var i = 0; i < $scope.organigramaSuperior.length; i++) {
                if ($scope.organigramaSuperior[i]._id == idOrgani){
                    return $scope.organigramaSuperior[i].nombreCompleto;
                }
            }
        }
    };
    
    $scope.jurisdiccionPorId = function (id) {
        for (var i = 0; i < $scope.organigramaSuperior.length; i++) {
            if ($scope.organigramaSuperior[i]._id == id){
                return $scope.organigramaSuperior[i];
            }
        }
    };
    
    $scope.contactoPorId = function (id) {
        for (var i = 0; i < $scope.contactos.length; i++) {
            if ($scope.contactos[i]._id == id){
                return $scope.contactos[i];
            }
        }
    };
    
    //Habilitar edicion
    $scope.editar = function() {
        $scope.editando = true;
        $scope.contacto = angular.copy($scope.contacto);
    };
    
    //Listado para el campo telefonos
    $scope.listaTelefonos = ORMListaTelefonos();

    //Listado para el campo telefonos
    $scope.listaCorreos = ORMListaCorreos();

    //Listado para el campo telefonos
    $scope.listaRoles = ORMListaRoles();

    //Listado para el campo telefonos
    $scope.listaTitulo = ORMListaTitulo();

    //Lista de servicios
    $scope.listaServicios = ORMServicios.list();

    //Lista de organigrama
    //$scope.organigrama = ORMOrganigrama.list();
    
    //Query de organigrama y el id del campo superiorInmediato
    $scope.contacto = ORMContacto.get({_id: $routeParams._id}, function(){
        $scope.organigrama = ORMOrganigrama.get({_id: $scope.contacto.organigrama});
    });
    
    //Lista de servicios para agregar en agregarDataServicio
    $scope.listaServ = new ORMServicios();
    
    //Subir foto
    $scope.uploaded = [];
    $scope.$watch('uploaded', function () {
        if ($scope.uploaded.length > 0 && $scope.uploaded[0].ok) {
            $scope.contacto.foto = $scope.uploaded[0].id;
            if($scope.contacto.captura){
                // Toma la el id de la foto anterior, para luego borrarla de la base de datos de captura.
                ORMContactoCaptura.remove({
                    _id : $scope.contacto.captura 
                });
                $scope.contacto.captura="";
            }
        }
    }, true);
    
    $scope.crearContacto = function(confirmado, contacto) {
        if (confirmado) {
            contacto.apellidos = (contacto.apellidos || '').toUpperCase();
            contacto.$save(function() {
                $scope.contactos = Contactos.listar();
            });
        }
        else {
            $modal({template: '/views/contactos/modalNuevoContacto.html', persist: true, show: true, scope: $scope.$new()});
        }
    };
    
    $scope.organigramaSuperior = ORMOrganigrama.query();
    
    //Guardar detalles
    $scope.guardar = function() {
        $scope.contacto.organigrama = $scope.contacto.organigrama,
        $scope.contacto.apellidos = ($scope.contacto.apellidos || '').toUpperCase();
        $scope.contacto.$save(function() {
            $scope.editando = false;
            //@Alex: Arreglar. 
            //angular.extend($scope.$parent.contacto, $scope.contacto);
            //delete $scope.contacto;
            $scope.contacto = ORMContacto.get({_id: $routeParams._id}, function(){
                $scope.organigrama = ORMOrganigrama.get({_id: $scope.contacto.organigrama});
            });
            //location.reload();
        });
    };
    
    //Cancelar la edicion del contacto
    $scope.cancelar = function() {
        $scope.contacto = ORMContacto.get({_id: $routeParams._id});
    };
    
    //Eliminar un contacto
    $scope.eliminar = function(confirmado) {
        if (confirmado){
            $scope.contacto.eliminado = true;
            $scope.contacto.$save(function(){
                $location.path('/contactos');
            });
        }
        else {
            $("#modalEliminar").modal('show');
        }
    };
    
    
    //Vincular un contacto
    $scope.vincular = function(confirmado, rol) {
        if (confirmado){
            $scope.contactoVinculo.roles.push($scope.dataRol);
            $scope.contactoVinculo.$save();
        }
        else {
            $scope.dataRol = {
                nombre: '',
                valor: $scope.contacto._id,
            };
            $("#modalVincular").modal('show');
        }
    };
    
    //Eliminar un contacto
    $scope.abrirContacto = function(idContacto) {
        $scope.contactoModal = $scope.findById($scope.contactos, idContacto);
        $scope.organigramaModal = ORMOrganigrama.get({_id: $scope.contactoModal.organigrama});
        $("#modalContacto").modal('show');
    };

    //Agregar telefonos
    $scope.agregarTelefonos = function(dataTelefonos) {
        if (!$scope.contacto.telefonos) {

        }
        else {
            $scope.contacto.telefonos.push($scope.dataTelefonos);
            $scope.dataTelefonos = {
                nombre: '',
                valor: '',
                interno: '',
                checked: '',
            };
        }
    };

    //Agregar correos
    $scope.agregarCorreos = function(dataCorreos) {
        if (!$scope.contacto.correos) {

        }
        else {
            $scope.contacto.correos.push($scope.dataCorreos);
            $scope.dataCorreos = {
                nombre: '',
                valor: '',
            };
        }
    };

    //Agregar direcciones
    $scope.agregarDireccion = function(dataDireccion) {
        if (!$scope.contacto.direcciones) {

        }
        else {
            $scope.dataDireccion.valorCalle = $('#calle-typeahead').val();
            $scope.contacto.direcciones.push($scope.dataDireccion);
            $scope.dataDireccion = {
                nombre: '',
                valorCalle: '',
                valorAltura: '',
                valorBarrio: '',
            };
        }
    };

    //Agregar servicios a la lista del contacto
    $scope.agregarServicios = function(dataServicio) {
        if (!$scope.contacto.servicios) {

        }
        else {
            $scope.contacto.servicios.push($scope.dataServicio);
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
        if (!(dataRol.nombre) || !(dataRol.valor)) {
            alert("No se puede cargar campos vacios");
        }
        else {
            $scope.contacto.roles.push($scope.dataRol);
            $scope.dataRol = {
                nombre: '',
                valor: '',
            };
        }
    };

    //Eliminar elementos de las listas
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    //Verificar por nombre / apellido duplicado
    $scope.$watch('contacto.nombre + \' \' + contacto.apellidos', function (nn) {
        if ($scope.contacto._id) {
            var otros = ORMContacto.query({
                $or:JSON.stringify([{eliminado: {$exists:false}}]),
                nombre: JSON.stringify({ "$regex" : $scope.contacto.nombre, "$options" : "-i" }),
                apellidos: JSON.stringify({ "$regex" : $scope.contacto.apellidos, "$options" : "-i" })
            }, function () {
                var dup = false;
                var candidatos = [];
                
                for (var i = 0; i < otros.length; i++) {
                    // Sólo si es otro contacto _id != _id
                    if (otros[i]._id != $scope.contacto._id) {
                        dup = true;
                        candidatos.push(otros[i]);
                    }
                }
                
                $scope.nombreDuplicadoCandidatos = candidatos;
                $scope.nombreDuplicado = dup;
            });
        }
    });
    
    // Buscar email duplicado
    $scope.$watch('contacto.correos', function () {
       if ($scope.contacto && $scope.contacto.correos && $scope.contacto.correos.length > 0) {
           var candidatos = [];
           
           for (var i = 0; i < $scope.contacto.correos.length; i++) {
               var emailObj = $scope.contacto.correos[i];
               
               if (emailObj.nombre == 'Email oficial') {
                   var otros = ORMContacto.query({
                       $or:JSON.stringify([{eliminado: {$exists:false}}]),
                       "correos": JSON.stringify({ $elemMatch: { valor: emailObj.valor } })
                   }, function () {
                       for (var j = 0; j < otros.length;j ++) {
                           if (otros[j]._id != $scope.contacto._id) {
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
    
    
    $scope.comprobarOrgani = function(enorganigrama){
        if($scope.contacto.enorganigrama == {$exists:false}){
            return alert("no")
        }
    };
    
    $scope.mostrarCamara = false;
    
    $scope.activarCamara = function(){
        
        $scope.mostrarCamara = true;
        
        navigator.myGetMedia = ( navigator.getUserMedia || 
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
    
        navigator.myGetMedia({video: true}, connect, error); 
            
        function connect(stream) {
            $scope.video = document.getElementById("my_video");
            $scope.video.src = window.URL ? window.URL.createObjectURL(stream) : stream;
            $scope.video.play();
        }
    
        function error(e){
            console.log(e);
        }  
    };
    
    $scope.mostrarImagen = false;
    
    $scope.tomarFoto = function(){
        $scope.mostrarImagen = true;
        var video  = document.getElementById('my_video');
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext("2d");
        //var cuadroImagen = document.getElementById('imgFoto');
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        $scope.image = {"demo" : {
            "type"  : "device",
            "image" : canvas.toDataURL("image/jpeg")
        }};
                       
        var success = function ( stream ) {
            video.src = stream;
        };
    
        var error = function ( err ) {
            alert("Hubo un error");
        };
        
        
    };
    
    $scope.guardarFotoComoPerfil = function(){
        var canvas = document.getElementById('canvas');
        var captura = new ORMContactoCaptura();
        
        if($scope.contacto.captura){
            
            // Toma la el id de la foto anterior, para luego borrarla de la base de datos de captura.
            ORMContactoCaptura.remove({
                _id : $scope.contacto.captura 
            });
            //Si tiene foto subida, la borra.
            if($scope.contacto.foto){
                $scope.contacto.foto = "";
            }
            // Pasa el canvas a base64, para luego guardarlo.
            captura.captura = canvas.toDataURL();
            // Variable auxiliar, que se actualiza con el watch para la visualización rápida.
            $scope.capturaBase64 = canvas.toDataURL();
            // Guardar la imagen en base64, y luego asígna el id de la captura, al campo "captura" de contacto.
            captura.$save({}, function(){
                $scope.contacto.captura = captura._id;
                $scope.contacto.$save();
            
                alert("Se guardo correctamente.");
            });
        }else{
            //Si tiene foto subida, la borra.
            if($scope.contacto.foto){
                $scope.contacto.foto = "";
            }
            // Pasa el canvas a base64, para luego guardarlo.
            captura.captura = canvas.toDataURL();
            // Guardar la imagen en base64, y luego asígna el id de la captura, al campo "captura" de contacto.
            captura.$save({}, function(){
                $scope.contacto.captura = captura._id;
                $scope.contacto.$save();
                alert("Se guardo correctamente.");
            });
        }
        
        
    };
    
    $scope.capturas = ORMContactoCaptura.query();
    
    $scope.capturaPorId = function(id){
        for (var i = 0; i < $scope.capturas.length; i++) {
            if ($scope.capturas[i]._id == id){
                return $scope.capturas[i];
            }
        }
    };
    
    $scope.descargarFoto = function() {
        downloadCanvas(document.getElementById('download'), 'canvas', 'test.png');
    };
    
    
    function downloadCanvas(link, canvasId, filename) {
        link.href = document.getElementById(canvasId).toDataURL();
        link.download = filename;
    }
    
   
    $scope.$watch('capturaBase64', function () {
        $scope.capturaPorId($scope.capturaBase64);
    }, true);
    
    
    
//Nuevo contacto---------------------------------------------------------------------------------------------
}).controller('ORMNuevoContacto', function($scope, $modal, $location, Contactos, ORMContacto, ORMOrganigrama, ORMListaTelefonos, ORMListaCorreos, ORMListaRoles, ORMListaTitulo, ORMServicios, ORMContactoCaptura) {
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
   
   
   $scope.setAltura=function()
   {
      if($scope.mostrarCamara)
      {
         return {
            width: "100%",
            height: document.getElementById("my_video").clientHeight+"px"
         };
      }
      else
      {
         return {
            width: "0px",
            height: "0px"
         };
      }
   };
         

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
    
    $scope.crearContacto = function(confirmado, contacto) {
        if (confirmado) {
            contacto.apellidos = (contacto.apellidos || '').toUpperCase();
            contacto.$save();

            $scope.contactos = Contactos.listar();
        }
        else {
            $modal({template: '/views/modalNuevoContacto.html', persist: true, show: true, scope: $scope.$new()});
        }
    };
    
    $scope.dependenciaSuperior = function(idOrgani) {
        if (idOrgani) {
            for (var i = 0; i < $scope.organigrama.length; i++) {
                if ($scope.organigrama[i]._id == idOrgani){
                    return $scope.organigrama[i].nombreCompleto;
                }
            }
        }
    };
    
    $scope.jurisdiccionPorId = function (id) {
        for (var i = 0; i < $scope.organigrama.length; i++) {
            if ($scope.organigrama[i]._id == id){
                return $scope.organigrama[i];
            }
        }
    };

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
            if($scope.contacto.captura){
                // Toma la el id de la foto anterior, para luego borrarla de la base de datos de captura.
                ORMContactoCaptura.remove({
                    _id : $scope.contacto.captura 
                });
            }
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
    
    
    //Guardar contacto solo el id
    $scope.guardar = function() {
        $scope.organigrama = $scope.nuevo.organigrama,
        $scope.nuevo.apellidos = ($scope.nuevo.apellidos || '').toUpperCase();
        $scope.nuevo.$save(function() {
            $location.path('/contactos/detalle/' + $scope.nuevo._id);
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
    
    $scope.mostrarCamara = false;
    
    $scope.activarCamara = function(){
        
        $scope.mostrarCamara = true;
        
        navigator.myGetMedia = ( navigator.getUserMedia || 
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
    
        navigator.myGetMedia({video: true}, connect, error); 
            
        function connect(stream) {
            $scope.video = document.getElementById("my_video");
            $scope.video.src = window.URL ? window.URL.createObjectURL(stream) : stream;
            $scope.video.play();
        }
    
        function error(e){
            console.log(e);
        }  
    };
    
    $scope.mostrarImagen = false;
    
    $scope.tomarFoto = function(){
        $scope.mostrarImagen = true;
        var video  = document.getElementById('my_video');
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext("2d");
        //var cuadroImagen = document.getElementById('imgFoto');
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        $scope.image = {"demo" : {
            "type"  : "device",
            "image" : canvas.toDataURL("image/jpeg")
        }};
                       
        var success = function ( stream ) {
            video.src = stream;
        };
    
        var error = function ( err ) {
            alert("Hubo un error");
        };
        
        
    };
    
    $scope.guardarFotoComoPerfil = function(){
        var canvas = document.getElementById('canvas');
        var ORMCapturas = new ORMContactoCaptura();
        
        if($scope.nuevo.captura){
            
            // Toma la el id de la foto anterior, para luego borrarla de la base de datos de captura.
            ORMContactoCaptura.remove({
                _id : $scope.contacto.captura 
            });
            //Si tiene foto subida, la borra.
            if($scope.nuevo.foto){
                $scope.nuevo.foto = "";
            }
            // Pasa el canvas a base64, para luego guardarlo.
            ORMCapturas.captura = canvas.toDataURL();
            // Variable auxiliar, que se actualiza con el watch para la visualización rápida.
            $scope.capturaBase64 = canvas.toDataURL();
            // Guardar la imagen en base64, y luego asígna el id de la captura, al campo "captura" de contacto.
            ORMCapturas.$save({}, function(){
                $scope.nuevo.captura = ORMCapturas._id;
                $scope.contacto.$save();
            
                alert("Se guardo correctamente.");
            });
        }else{
            //Si tiene foto subida, la borra.
            if($scope.nuevo.foto){
                $scope.nuevo.foto = "";
            }
            // Pasa el canvas a base64, para luego guardarlo.
            ORMCapturas.captura = canvas.toDataURL();
            // Variable auxiliar, que se actualiza con el watch para la visualización rápida.
            $scope.capturaBase64 = canvas.toDataURL();
            // Guardar la imagen en base64, y luego asígna el id de la captura, al campo "captura" de contacto.
            ORMCapturas.$save({}, function(){
                $scope.nuevo.captura = ORMCapturas._id;
                $scope.nuevo.$save();
                alert("Se guardo correctamente.");
            });
        }
        
        
    };
    
    $scope.capturas = ORMContactoCaptura.query();
    
    $scope.capturaPorId = function(id){
        for (var i = 0; i < $scope.capturas.length; i++) {
            if ($scope.capturas[i]._id == id){
                return $scope.capturas[i];
            }
        }
    };
    
    $scope.descargarFoto = function() {
        downloadCanvas(document.getElementById('download'), 'canvas', 'test.png');
    };
    
    
    function downloadCanvas(link, canvasId, filename) {
        link.href = document.getElementById(canvasId).toDataURL();
        link.download = filename;
    }
    
    $scope.$watch('capturaBase64', function () {
        $scope.capturaPorId($scope.capturaBase64);
    }, true);  
    
    //--------------------------------------------------------------------------------------------------
}).controller('ORMContactosReporte', function($scope, Contactos) {
    $scope.contactos = Contactos.listar();
    $scope.contactoPorId = function (id) {
        for (var i = 0; i < $scope.contactos.length; i++) {
            if ($scope.contactos[i]._id == id){
                return $scope.contactos[i];
            }
        }  
    };
}).value('ORMListaTelefonos', function() { //Listado de telefonos
    return [{
        nombre: 'Telefono directo'
    }, {
        nombre: 'Telefono alternativo'
    }, {
        nombre: 'Conmutador'
    }, {
        nombre: 'Celular laboral'
    }, {
        nombre: 'Celular alternativo'
    }, ];
}).value('ORMListaCorreos', function() { //Listado de correos
    return [{
        nombre: 'Email oficial'
    }, {
        nombre: 'Email alternativo'
    }, ];
}).value('ORMListaRoles', function() { //Listado de roles
    return [{
        nombre: 'Secretaria'
    }, {
        nombre: 'Asistente'
    }, {
        nombre: 'Jefe de gabinete'
    }, {
        nombre: 'Asesor'
    }, {
        nombre: 'Funcionario'
    }, ];
}).value('ORMListaTitulo', function() { //Listado de roles
    return [{
        nombre: 'Dr.'
    }, {
        nombre: 'Dra.'
    }, {
        nombre: 'Dir.'
    }, {
        nombre: 'Lic.'
    }, {
        nombre: 'Ing.'
    }, {
        nombre: 'Arq.'
    }, {
        nombre: 'Pres.'
    }, ];
})
.controller('NuevoContactoModalCtrl', function($scope, $modal, $location, Contactos, ORMContacto, ORMOrganigrama, ORMListaTelefonos, ORMListaCorreos, ORMListaRoles, ORMListaTitulo, ORMServicios) {
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
    
    //Guardar contacto solo el id
    $scope.guardar = function() {
        $scope.organigrama = $scope.nuevo.organigrama,
        $scope.nuevo.apellidos = ($scope.nuevo.apellidos || '').toUpperCase();
        $scope.nuevo.$save(function() {
            $location.path('/contactos/detalle/' + $scope.nuevo._id);
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