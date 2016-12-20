exports = module.exports = {
    '/jurisdicciones': {
        section: 'jurisdicciones',
        title: 'Jurisdicciones',
        allowed: ['jurisdicciones'],
        reloadOnSearch: false,
        views: {
            'body@': {
                templateUrl: '/views/jurisdicciones/index.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/jurisdicciones/navbar.html'
            }
        }
    },
    '/jurisdicciones/nueva': {
        section: 'jurisdicciones',
        allowed: ['jurisdicciones'],
        title: 'Nuevo',
        reloadOnSearch: false,
        parents: ['/jurisdicciones'],
        views: {
            'body@': {
                templateUrl: '/views/jurisdicciones/nueva.html',
                controller: 'NuevaJurisdiccionCtrl'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/jurisdicciones/navbar.html'
            }
        }
    },
    '/jurisdicciones/:_id': {
        section: 'jurisdicciones',
        allowed: ['jurisdicciones'],
        title: 'Detalle',
        reloadOnSearch: false,
        parents: ['/jurisdicciones'],
        views: {
            'body@':{
                templateUrl: '/views/jurisdicciones/detalle.html',
                controller: 'VerJurisdiccionCtrl'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/jurisdicciones/navbar.html'
            }
        }
    }
};