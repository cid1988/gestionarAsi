exports = module.exports = {
    '/cgestion/administracion/:_id': {
        title: 'CGestion - Administracion',
        section: 'cgestion.administracion',
        allowed: ['cgestion'],
        views: {
            'body@': {
                templateUrl: '/views/cgestion/detalleAdministracion.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/cgestion/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/cgestion/administracion': {
        title: 'CGestion - Administracion',
        section: 'cgestion.administracion',
        allowed: ['cgestion'],
        views: {
            'body@': {
                templateUrl: '/views/cgestion/administracion.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/cgestion/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/cgestion/:_id': {
        title: 'CGestion',
        section: 'cgestion',
        allowed: ['cgestion'],
        views: {
            'body@': {
                templateUrl: '/views/cgestion/detalle.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/cgestion/navbar.html'
            }
        },
        reloadOnSearch: false,
    },
    '/cgestion': {
        title: 'CGestion',
        section: 'cgestion',
        allowed: ['cgestion'],
        views: {
            'body@': {
                templateUrl: '/views/cgestion/index.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/cgestion/navbar.html'
            }
        },
        reloadOnSearch: false,
    }
};