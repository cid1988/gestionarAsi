angular.module('bag2.cambiarContrasenna', [])
.controller ('cambiarContrasennaCtrl', function($scope, Users, $location, $routeParams, $http) 
{
    //usuario=objeto que guarda nombre de usuario y contraseña
    $scope.usuario = Users.get({username: $scope.username},function(){
           
    });
    $scope.save=function()
    {
        if($scope.nuevaContrasenna===$scope.nuevaRepetidaContrasenna)
        {
            $http.post('/api/cambiarContrasenna/changePassword', {
                username: $scope.usuario.username,
                newPassword: $scope.nuevaContrasenna,
            })
            .success(function() {
                $location.url('/');
            })
            .error(function() {
            });
        }
        else
        {
            alert("Las contraseñas no coinciden");
            $scope.nuevaRepetidaContrasenna="";
            $scope.set_style={'border': '1px solid #ff0000'};
        }
    };
});

