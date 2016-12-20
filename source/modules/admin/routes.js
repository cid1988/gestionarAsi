exports = module.exports = {
	'/admin': {
		allowed: ['admin.users'],
		views: {
			'body@': {
				templateUrl: '/views/admin/admin.html'
			},
			'navbar-extra-left@': {
				templateUrl: '/views/admin/navbar.html'
			}
		}
	},
	'/admin/users': {
		section: 'users',
		allowed: ['admin.users'],
		title: 'Administrar usuarios',
		parents: ['/admin'],
		views: {
			'body@': {
				templateUrl: '/views/admin/users/list.html'
			},
			'navbar-extra-left@': {
				templateUrl: '/views/admin/navbar.html'
			}
		}
	},
	'/admin/data': {
		section: 'data',
		allowed: ['admin.data'],
		title: 'Adminsitrar datos',
		parents: ['/admin'],
		views: {
			'body@': {
				templateUrl: '/views/admin/data/index.html'
			},
			'navbar-extra-left@': {
				templateUrl: '/views/admin/navbar.html'
			}
		}
	},
	'/admin/reportes': {
		section: 'data',
		allowed: ['admin.reportes'],
		title: 'Reportes',
		parents: ['/admin'],
		views: {
			'body@': {
				templateUrl: '/views/admin/reportes/tiempo.html'
			},
			'navbar-extra-left@': {
				templateUrl: '/views/admin/navbar.html'
			}
		}
	},
	'/admin/users/:username': {
		section: 'users',
		allowed: ['admin.users'],
		title: 'Modificar usuario',
		parents: ['/admin', '/admin/users'],
		views: {
			'body@': {
				templateUrl: '/views/admin/users/edit.html'
			},
			'navbar-extra-left@': {
				templateUrl: '/views/admin/navbar.html'
			}
		}
	},
	'/admin/users/:username/changeJurisdiccion': {
		section: 'users',
		allowed: ['admin.users'],
		title: 'Cambiar jurisdiccion',
		parents: ['/admin', '/admin/users'],
		views: {
			'body@': {
				templateUrl: '/views/admin/users/changeJurisdiccion.html'
			},
			'navbar-extra-left@': {
				templateUrl: '/views/admin/navbar.html'
			}
		}
	},
	'/admin/users/:username/changePassword': {
		section: 'users',
		allowed: ['admin.users'],
		title: 'Cambiar contraseña',
		parents: ['/admin', '/admin/users'],
		views: {
			'body@': {
				templateUrl: '/views/admin/users/changePassword.html'
			},
			'navbar-extra-left@': {
				templateUrl: '/views/admin/navbar.html'
			}
		}
	}
};