angular.module('bag2.admin-reportes', [])
.controller('ReporteTiempoCtrl', function($rootScope, $scope, User, ORMTemario, ORMInstanciaReunion, ORMOrganigrama, ORMReunion, $modal, $window) {
    $scope.filtro2 = "";
    $scope.temarios = ORMTemario.query();
    $scope.users = User.query();
    var  hoy = new Date();
    hoy = hoy.getTime() - 28800000;
    //$scope.userTicks = UserTick.query();
    $scope.jurisdicciones = ORMOrganigrama.query();
    $scope.instancias = ORMInstanciaReunion.query({
        $or:JSON.stringify([
            {desdeDate:{$lt: hoy}},
        ]),
    });
    $scope.orden = 'desdeDate';
    $scope.tablaJurisdicciones = [];
    
    
    $scope.dameTiempo = function (hasta, desde) {
        var horas = Math.floor((hasta - desde) / 3600000);
        var minutos = Math.floor(((hasta - desde) % 3600000) / 60000);
        if (minutos < 10) {
            return horas + "hs 0" + minutos + "min";
        } else {
            return horas + "hs " + minutos + "min";
        }
    };
    
    $scope.dameFecha = function (desde) {
        var fecha = new Date(desde);
        var devolver = fecha.getDate() + "/";
        if ((fecha.getMonth() + 1) < 10) {
            devolver = devolver + "0" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear() + " a las " + fecha.getHours() + ":";
        } else {
            devolver = devolver + (fecha.getMonth() + 1) + "/" + fecha.getFullYear() + " a las " + fecha.getHours() + ":";
        }
        if (fecha.getMinutes() < 10) {
            devolver = devolver + "0" + fecha.getMinutes() + "hs";
        } else {
            devolver = devolver + fecha.getMinutes() + "hs";
        }
        return devolver;
    };
    
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

}).controller ('AppPermisosCtrl', function ($scope, UserPermission)
{
    
    $scope.tab = 'permiso';
    //query usuarios
    $scope.usuarios = UserPermission.query();
    
});