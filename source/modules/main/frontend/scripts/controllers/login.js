'use strict';

angular.module('bag2.login', []).controller('LoginCtrl', function($scope, $location, auth, $routeParams) {
	auth.checkLoginState();
	$scope.$on('logged-in', function() {
		if ($scope.returnTo)  {
			$location.url($scope.returnTo || '/salasreuniones');
		}
	});
	$scope.$on('auth-error', function () {
	   $scope.error = true;
		$scope.working = false;
	});
	$scope.$on('auth-start', function () {
		$scope.error = false;
		$scope.working = true;
	});

	var escribirCookie=function(nombre,valor)
	{
		var hoy=new Date(),
			monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

		  var expirar=( hoy.getDate() + (" ") + ( monthNames[(hoy.getMonth())] ) + (" ") + ( hoy.getFullYear() ) + (" ") + ( hoy.getHours()+4 )+ (":") + ( hoy.getMinutes() ) + (":00 GMT") );
		//var expirar=( hoy.getDate() + (" ") + ( monthNames[(hoy.getMonth())] ) + (" ") + ( hoy.getFullYear() ) + (" ") + ( hoy.getHours()+1 )+ (":") + ( hoy.getMinutes() ) + (":00 GMT")  );
		//Expira El dia actual, el mes actual, año actual, dentro de 1 hora, en los mismos minutos...
		document.cookie=(nombre+"="+valor+"; expires="+expirar);
	};

	var leerCookie=function(nombre)
	{
		var encontro=false;
		var cookies=document.cookie.split(";");

		for (var i=0; i<cookies.length; i++)
		{
			if ( (cookies[i].search(nombre) ) > -1)
			{
				var retornar=cookies[i].substring( (cookies[i].indexOf("=") )+1); //Retorna el valor de la cookie buscada
				return retornar;
			}
		}
		if(!encontro)
		{
			escribirCookie(nombre,"0");
			leerCookie(nombre);
		}

	};

	if(parseInt(leerCookie("intentosDeLoggeoBag"))>3)
	{
		$scope.mostrarCaptcha=true;
	}
	else
	{
		$scope.mostrarCaptcha=false;
	}

	$scope.login = function($event)
	{
		var contra = CryptoJS.AES.encrypt($scope.password, "BAGestion%1234");
		var valorDeCookie=parseInt(leerCookie("intentosDeLoggeoBag"));
/*
		$scope.returnTo = $location.search().returnTo || '/salasreuniones';
		auth.login($scope.username, contra);
		if ($event &&$event.preventDefault) {
			$event.preventDefault();
		}
*/

		if(valorDeCookie <= 3) //Si va menos de 3 intentos
		{
			escribirCookie("intentosDeLoggeoBag", (valorDeCookie+1) ); //Sumar 1 intento en la cookie

			$scope.returnTo = $location.search().returnTo || '/salasreuniones';
			auth.login($scope.username, contra);
			if ($event &&$event.preventDefault) {
				$event.preventDefault();
			}

			if(parseInt(leerCookie("intentosDeLoggeoBag"))>3) //Si ya escribio el 4 indicando el 4to intento
			{
				$scope.mostrarCaptcha=true;
			}
		}
		else if(grecaptcha.getResponse(widgetId1))//Si el captcha responde continuar
		{
			$scope.returnTo = $location.search().returnTo || '/apps';
			auth.login($scope.username, contra);
			if ($event &&$event.preventDefault) {
				$event.preventDefault();
			}
			grecaptcha.reset(widgetId1);//Reseteamos para que no quede validado
		}
		else
		{
			$scope.confirme=true;
			grecaptcha.reset(widgetId1);//Reseteamos para que no quede validado
		}

	};
});