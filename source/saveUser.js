var nconf = require('./loadConfig')();

var db = require('./db');

db.setConf(nconf.get());

var permissions = process.argv.splice(4);
var arguments = process.argv.splice(2);

if (arguments.length < 2) {
    console.log('not enough arguments');
    console.log('saveUser username password permission1 permission2 permission3');
}

var username = arguments[0];
var password = arguments[1];

db.getDbInstance(function(err, db) {
    if (err) {
        console.log(err);
        process.exit(-1);
        return;
    }
    var hashed = require('password-hash').generate(password);
    db.collection('users').findAndModify({
        username: username
    }, {}, {
        $set: {
            username: username,
            password: hashed
        }
    }, {
        upsert: true,
        safe: true
    }, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            db.collection('users.permissions').findAndModify({
                username: username
            }, {}, {
                $set: {
                    username: username,
                    permissions: permissions
                }
            }, {
                safe: true,
                upsert: true
            }, function(err) {
                if (err) {
                    console.log(err);
                }
                process.exit(0);
            });
        }
    });
});
