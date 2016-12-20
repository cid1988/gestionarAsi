var mongo = require('mongodb');

var locals = {};

exports = module.exports = {
    setConf: function(newConf) {
        locals.conf = newConf;
    },
    getDbInstance: function(callback) {
        if (callback) {
            if (locals.dbInstance) {
                callback(null, locals.dbInstance);
            }
            else {
                var dbConn = "mongodb://" + locals.conf.mongo.hostname + ":" + locals.conf.mongo.port + "/" + locals.conf.mongo.database + "?w=1";

                mongo.Db.connect(dbConn, {
                    auto_reconnect: locals.conf.mongo.auto_reconnect
                }, function(err, db) {
                    if (err) {
                        callback(err);
                    }
                    else if (locals.conf.mongo.auth) {
                        db.authenticate(locals.conf.mongo.username, locals.conf.mongo.password, function(err, success) {
                            if (success) {
                                locals.dbInstance = db;
                                callback(null, db);
                            }
                            else {
                                callback(err);
                            }
                        });
                    }
                    else {
                        locals.dbInstance = db;
                        callback(null, db);
                    }
                });
            }
        }
    }
};