exports = module.exports = {
	'/salasreuniones': {
		title: 'Salas de Reuniones',
		name: 'salasreuniones',
		allowed: [ 'salasreuniones' ],
		reloadOnSearch: false,
		section: 'calendario',
		views: {
			'body@': {
				templateUrl: '/views/salasreuniones/calendario/calendario.html',
			},
			'navbar-extra-left@': {
				templateUrl: '/views/salasreuniones/navbar.html'
			},
			'navbar-extra-right@': {
				templateUrl: '/views/salasreuniones/calendario/navbar.html'
				}
		}
	},
	'/salasreuniones/registrosalas': {
		title: 'Salas de Reuniones - Registro Salas',
		name: 'registrosalas',
		section: 'calendario.registrosalas',
		views: {
			'body@': {
				templateUrl: '/views/salasreuniones/calendario/registrosalas.html',
			},
			'navbar-extra-left@': {
				templateUrl: '/views/salasreuniones/navbar.html'
			},
			'navbar-extra-right@': {}
		}
	},
	'/salasreuniones/reporte': {
		title: 'Salas de Reuniones - Reportes',
		name: 'salasreuniones',
		allowed: [ 'salasreuniones.administrador' ],
		section: 'calendario',
		views: {
			'body@': {
				templateUrl: '/views/salasreuniones/calendario/reporte.html',
			},
			'navbar-extra-left@': {
				templateUrl: '/views/salasreuniones/navbar.html'
			},
			'navbar-extra-right@': {}
		}
	},
	'/salasreuniones/consulta': {
		title: 'Salas de Reuniones - Consulta',
		name: 'consulta',
		section: 'calendario.consulta',
		views: {
			'body@': {
				templateUrl: '/views/salasreuniones/calendario/consulta.html',
			},
			'navbar-extra-left@': {
				templateUrl: '/views/salasreuniones/navbar.html'
			},
			'navbar-extra-right@': {}
		}
	},
	'/salasreuniones/:_id/print': {
		title: 'Reserva',
		name: 'reserva',
		allowed: [ 'salasreuniones' ],
		section: 'calendario',
		views: {
			'body@': {
				templateUrl: '/views/salasreuniones/calendario/print.html',
			},
			'navbar-extra-left@': {
				templateUrl: '/views/salasreuniones/navbar.html'
			},
			'navbar-extra-right@': {}
		}
	},
	'/salasreuniones/:_id/registro': {
		title: 'Registro',
		name: 'registro',
		allowed: [ 'salasreuniones.crearEditarReuniones', 'salasreuniones.administrador' ],
		section: 'calendario',
		views: {
			'body@': {
				templateUrl: '/views/salasreuniones/calendario/registro.html',
			},
			'navbar-extra-left@': {
				templateUrl: '/views/salasreuniones/navbar.html'
			},
			'navbar-extra-right@': {}
		}
	},
	'/salasreuniones/nuevo/': {
		title: 'Nueva sala',
		name: 'nueva',
		allowed: [ 'salasreuniones.crearEditarSalas' ],
		section: 'calendario',
		views: {
			'body@': {
				templateUrl: '/views/salasreuniones/v2/nuevo.html',
			},
			'navbar-extra-left@': {
				templateUrl: '/views/salasreuniones/navbar.html'
			},
			'navbar-extra-right@': {}
		}
	},
	'/salasreuniones/editar/:_id': {
		title: 'Editar sala',
		name: 'editarsala',
		allowed: [ 'salasreuniones.crearEditarSalas' ],
		section: 'calendario',
		views: {
			'body@': {
				templateUrl: '/views/salasreuniones/v2/editar.html',
			},
			'navbar-extra-left@': {
				templateUrl: '/views/salasreuniones/navbar.html'
			},
			'navbar-extra-right@': {}
		}
	},
	'/salasreuniones/registro': {
		title: 'Salas de Reuniones',
		name: 'registro',
		views: {
			'body@': {
				templateUrl: '/views/salasreuniones/registro.html',
			},
			'navbar-extra-left@': {},
			'navbar-extra-right@': {}
		}
	}
};