exports = module.exports = [{
        name: 'not-allowed',
        templateUrl: '/views/oneColumn.html',
        views: {
            'body@': {
                templateUrl: '/views/notAllowed.html',
            },
            'navbar-extra-left@': {},
            'navbar-extra-right@': {}
        }
    }, {
        url:'',
        name: 'dashboard',
        templateUrl: '/views/oneColumn.html',
        views: {
            'body@': {
                templateUrl: '/views/apps.html',
            },
            // 'navbar-extra-left@': {
            //     templateUrl: '/views/searchBar.html',  
            // },
            // 'navbar-extra-right@': {}
        }
    }
];