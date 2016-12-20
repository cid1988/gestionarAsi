angular.module('bag2.navbar', []).controller('NavbarAuthCtrl', function($scope, $location, auth, User, ORMContacto) {
    $scope.loggedIn = undefined;
    $scope.login = function() {
        $location.url('/login');
    };
    $scope.logout = function() {
        auth.logout();
    };
    $scope.editarUsuario = function(){
    
        var user = User.get({
            username : $scope.username
        });
        console.log(user);
        
        if(user.idContacto){
                   $location.url('/contactos/detalle/' + user.idContacto);
               }else{
                    $scope.contacto = new ORMContacto({
                        servicios: [],
                        telefonos: [],
                        correos: [],
                        direcciones: [],
                        roles: [],
                    });
                    $scope.contacto.$save({},function(){
                       user.idContacto = $scope.contacto._id;
                       user.$save();
                       $location.url('/contactos/detalle/' + $scope.contacto._id); 
                   });
               }
        
        
        
        
    };
});
