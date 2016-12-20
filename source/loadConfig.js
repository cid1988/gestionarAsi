exports = module.exports = function() {
    var nconf = require('nconf');

    nconf.argv().file({
        file: require('path').join(__dirname, 'config.json')
    });

    nconf.defaults({
        'http': {
            'port': 8080
        },
        'mongo': {
            'database': 'bag2',
            'hostname': 'localhost',
            'auth': false,
            'username': '',
            'password': '',
            'autoreconnect': true,
            "port": 27017
        },
        'cookies': {
            'secret': '1234567890'
        },
        'session': {
            'secret': '1234567890',
            'key': 'express.sid'
        }
    });

    nconf.overrides({
        glue: {
            modules: {
                path: require('path').join(__dirname, 'modules')
            }
        }
    });
    return nconf;
};