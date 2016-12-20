exports = module.exports = {
    '/contactos/reportes': {
        section: 'contactos',
        title: 'Reportes de contactos',
        name: 'estadisticas',
        allowed: ['contactos'],
        views: {
            'body@': {
                templateUrl: '/views/contactos/reportes.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/contactos/navbar.html'},
            'navbar-extra-right@': {}
        }
    },
    '/contactos': {
        section: 'contactos',
        title: 'Contactos',
        reloadOnSearch: false,
        allowed: ['contactos'],
        views: {
            'body@': {
                templateUrl: '/views/contactos/contactos.html',
            },
            'navbar-extra-left@': {
                templateUrl: '/views/contactos/navbar.html'
            },
            'navbar-extra-right@': {
                templateUrl: '/views/contactos/navbar-right.html'
            }
        }
    },
    '/contactos/nuevo': {
        section: 'contactos',
        title: 'Nuevo contacto',
        allowed: ['contactos'],
        edit: true,
        new: true,
        parents: ['/contactos'],
        views: {
            'body@': {
                templateUrl: '/views/contactos/nuevoContacto.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/contactos/navbar.html'
            }
        }
    },
    '/contactos/detalle/:_id': {
        section: 'contactos',
        title: 'Contacto',
        reloadOnSearch: false,
        parents: ['/contactos'],
        views: {
            'body@': {
                templateUrl: '/views/contactos/detalleContactos.html'
            },
            'navbar-extra-left@': {
                templateUrl: '/views/contactos/navbar.html'
            }
        }
    }
};