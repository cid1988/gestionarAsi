exports = module.exports = {
    '/organigrama': {
        section: 'organigrama',
        title: 'Organigrama',
        reloadOnSearch: false,
        allowed: ['organigrama'],
        parents: ['/organigrama'],
        views: {
            'body@': {
                templateUrl: '/views/organigrama/abmOrganigrama.html',
            },
            'navbar-extra-right@': {
                templateUrl: '/views/organigrama/navbar-right.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/organigrama/navbar.html'
            }
        }
    },
    '/organigrama/detalle/:_id': {
        section: 'organigrama',
        title: 'Organigrama',
        reloadOnSearch: false,
        allowed: ['organigrama'],
        parents: ['/organigrama'],
        views: {
            'body@': {
                templateUrl: '/views/organigrama/detalleOrganigrama.html',
            },
            'navbar-extra-right@': {
                templateUrl: '/views/organigrama/navbar-right.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/organigrama/navbar.html'
            }
        }
    },
    '/organigrama/nuevo': {
        section: 'organigrama',
        title: 'Nuevo organigrama',
        allowed: ['organigrama'],
        edit: true,
        new: true,
        parents: ['/organigrama'],
        views: {
            'body@': {
                templateUrl: '/views/organigrama/nuevoOrganigrama.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/organigrama/navbar.html'
            }
        }
    }
};