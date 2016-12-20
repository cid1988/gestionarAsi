'use strict';

angular.module('bag2.admin.users',[])
.controller('UsersCtrl', function($scope, User, ORMContacto) {
	$scope.users = User.query();
	$scope.contactosTodos = ORMContacto.query();
	$scope.elemento = {};

	$scope.eliminar = function(confirmado, u) {
		if (confirmado) {
			$scope.elemento.$delete(function() {
				$scope.users = User.query();
			});
		}
		else {
			$scope.elemento = u;
			$("#confirmarEliminar").modal('show');
		}
	};

	$scope.$on('new-user', function() {
		$scope.users = User.query();
	});

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

	$scope.fTrim = function (str) {
		var cadena = "";
		if (str) {
			for (var i = 0; i < str.length; i++) {
				if (str.charAt(i)=="@") {
					cadena=str.substring(0,i);
				}
			}
		}
		return cadena;
	};

	$scope.unirUsers = function() {
		angular.forEach($scope.users, function(u) {
			if (!u.idContacto) {
				angular.forEach($scope.contactosTodos, function(c) {
					if (u.username == $scope.fTrim($scope.valorCorreo(c))) {
						u.idContacto = c._id;
						u.$save();
					}
				});
			}
		});
	};

}).controller('NewUserCtrl', function($scope, User, Contactos, ORMContacto, ORMOrganigrama) {
	$scope.contactos = Contactos.listar();
	$scope.organigrama = ORMOrganigrama.query();
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

	$scope.fTrim = function (str) {
		var cadena = "";
		if (str) {
			for (var i = 0; i < str.length; i++) {
				if (str.charAt(i)=="@") {
					cadena=str.substring(0,i);
				}
			}
		}
		return cadena;
	};
	$scope.$watch('user.idContacto', function (idContacto){
		if (idContacto) {
			$scope.contacto = ORMContacto.get({
				_id : idContacto
			}, function() {
				if ($scope.fTrim($scope.valorCorreo($scope.contacto))) {
					$scope.user.username = $scope.fTrim($scope.valorCorreo($scope.contacto));
				}
			});
		}
	});
	$scope.save = function() {
		$scope.user.$save(function() {
			$scope.user = new User();
			$scope.$emit('new-user');
		});
	};
	$scope.user = new User();
}).controller('EditUserCtrl', function($scope, $http, User, UserPermission, $location, Permission, $routeParams) {
	var self = this;

	self.allPermissions = [];
	$http.get('/api/allPermissions').success(function (allPermissions) {
	   self.allPermissions = allPermissions;
	   for(var i=0; i<self.allPermissions.length; i++)
	   {
		   self.allPermissions[i].group=self.allPermissions[i].name.split("-", 1)[0];
	   }
	});

	$scope.$watch('filtro.group', function (valor){

		if (valor)
		{
			$scope.variable=true;
		}
		else
		{
			$scope.variable=false;
		}
	});

	$scope.tocaron=function(event)
	{
		if($scope.filtro.name.length>0)
		{
			$scope.variable=true;
		}
		else
		{
			$scope.variable=false;
		}
	};

	var anterior="";
	$scope.seRepite=function(permiso)
	{
		if(permiso.group!=anterior)
		{
			anterior=permiso.group;
			return true;
		}
		else
		{
			anterior=permiso.group;
			return false;
		}
	};

	$scope.segundaParte=function(valor)
	{
		if(valor.indexOf("-")==-1)
		{
			return valor;
		}
		else
		{
			return valor.split("-",2)[1];
		}
	};

	$scope.user = User.findByName({
		username: $routeParams.username
	});
	$scope.userPermissions = UserPermission.findByName({
		username: $routeParams.username
	}, function() {
		if (!$scope.userPermissions.permissions) $scope.userPermissions.permissions = [];
	});
	$scope.save = function () {
		// $scope.user.$save();
		$scope.userPermissions.$save();
		$location.url('/admin/users');
	};
}).controller('EditUserPermissionsCtrl', function($scope) {
	$scope.remove = function(p) {
		$scope.userPermissions.permissions.splice($scope.userPermissions.permissions.indexOf(p), 1);
	};
}).controller('AddPermissionCtrl', function($scope) {
	var self = this;

	$scope.tienePermiso = function(usuario, key) {
		try
		{
			for(var i = 0; i < $scope.userPermissions.permissions.length; i++) {
				if ($scope.userPermissions.permissions[i] == key){
					return true;
				}
			}
		}
		catch(Exception)
		{

		}
		return false;
	};

	$scope.cambiarPermiso = function(usuario, key) {
		if ($scope.tienePermiso(usuario, key)) {
			$scope.userPermissions.permissions.splice($scope.userPermissions.permissions.indexOf(key), 1);
		} else {
			$scope.userPermissions.permissions.push(key);
		}
	};

	$scope.comprobarPermisos = function(permisosRol){
		var total = 0;
		for(var r=0;r<permisosRol.length;r++){
			for(var p=0;p<$scope.userPermissions.permissions.length;p++) {
				if(permisosRol[r] == $scope.userPermissions.permissions[p]){
					total = total + 1;
				}
			}
		}
		if(total == permisosRol.length){
			return true;
		}else{
			return false;
		}
	};

	$scope.cambiarRol = function(permisosRol,prioridad){
		if($scope.comprobarPermisos(permisosRol)){
			//Si tiene los permisos que corresponden al rol los saco
			permisosRol.forEach(function(rol){
				$scope.userPermissions.permissions.splice($scope.userPermissions.permissions.indexOf(rol), 1);
			})
		}else{
			//Sino los agrego pero solo los que no estan
			permisosRol.forEach(function(rol){
				var encontrado = false;
				for (var p = 0;p < $scope.userPermissions.permissions.length; p++) {
					if(rol == $scope.userPermissions.permissions[p]){
						encontrado = true;
						break;
					}
				}
				if(!encontrado){
					$scope.userPermissions.permissions.push(rol);
				}
			})
		}
	};

	$scope.tienePermisoRol = function(roles){
		var total = 0;
		for(var r=0;r<roles.length;r++){
			for(var p=0;p<$scope.userPermissions.permissions.length;p++) {
				if(roles[r] == $scope.userPermissions.permissions[p]){
					total = total + 1;
				}
			}
		}
		if(total == roles.length){
			return true;
		}else{
			return false;
		}
	};

	$scope.filtroRol = function(permiso){
		if(permiso.rol){
			return true;
		}else{
			return false;
		}
	};

	$scope.filtroPermiso = function(permiso){
		if(!permiso.rol){
			return true;
		}else{
			return false;
		}
	};

}).controller('ChangePasswordCtrl', function($scope, User, $location, $routeParams, $http) {
	$scope.user = User.findByName({
		username: $routeParams.username
	});
	$scope.save = function () {
		$http.post('/api/admin/changePassword', {
			username: $routeParams.username,
			newPassword: $scope.newPassword
		})
		.success(function() {
			/* $scope.alerts.push({
				type:'success',
				message: 'Se cambió la contraseña correctamente'
			}); */
			$location.url('/admin/users');
		})
		.error(function() {
			/* $scope.alerts.push({
				type:'success',
				message: 'Se cambió la contraseña correctamente'
			}); */
		});
	};
}).controller('ChangeJurisdiccionCtrl', function($scope, User, $location, $routeParams, $http, ORMOrganigrama) {
	$scope.user = User.findByName({
		username: $routeParams.username
	});
	$scope.organigrama = ORMOrganigrama.query();

	$scope.organigramaPorId = function (id) {
	  for (var i = 0; i < $scope.organigrama.length; i++) {
		  if ($scope.organigrama[i]._id == id)
		  {
			  return $scope.organigrama[i];
		  }
	  }
	};

	$scope.save = function () {
		$scope.user.$save({}, function() {
			$location.url('/admin/users');
		});
	};
});
