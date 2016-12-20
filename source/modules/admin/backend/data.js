function checkPermissions(req) {
    if (req && req.session && req.session.user && req.session.user.permissions) {
        for (var j = 0; j < req.session.user.permissions.length; j++) {
            if ('master' == req.session.user.permissions[j] || 'admin.data' == req.session.user.permissions[j]) {
                return true;
            }
        }
    }

    return false;
}

exports = module.exports = function(app, conf) {
    app.get('/api/data/apps', function(req, res) {
        res.json(require('./locals.js').allResources);
    });
    app.post('/api/data-management/backup', function(req, res) {
        if (!checkPermissions(req)) {
            res.status(403);
            res.end();
            return;
        }

        var appsToBackup = req.body;
        var collectionsToBackup = [];
        var exported = {
            date: new Date(),
            apps: [],
            user: req.session.user.user,
            data: {}
        };

        var allResources = require('./locals.js').allResources;
        appsToBackup.forEach(function(appName) {
            for (var modName in allResources) {
                if (modName == appName) {
                    var moduleCollections = [];

                    allResources[modName].forEach(function(collection) {
                        moduleCollections.push(collection.collectionName);
                    });

                    exported.apps.push({
                        name: modName.name,
                        collections: moduleCollections
                    });

                    collectionsToBackup = collectionsToBackup.concat(moduleCollections);
                }
            }
        });

        var total = collectionsToBackup.length;

        function unref() {
            total -= 1;

            if (total === 0) {
                var current_date = (new Date()).valueOf().toString();
                var random = Math.random().toString();
                var crypto = require('crypto');
                var id = crypto.createHash('sha1').update(current_date + random).digest('hex');

                var jsonString = JSON.stringify(exported);

                var fs = require('fs');
                fs.writeFile(__dirname + "/../../../exported/" + id + '.bag', jsonString, function(err) {
                    if (err) {
                        console.log(err);
                        res.end(500, 'Cannot export data');
                    }
                    else {
                        res.json({
                            url: '/api/data-management/exported/' + id + '.bag'
                        });
                    }
                });
            }
        }
        require('../../../db').setConf(conf);
        require('../../../db').getDbInstance(function(err, db) {
            if (err) {
                res.end(503, 'Cannot export data');
            }
            else {
                collectionsToBackup.forEach(function(collectionName) {
                    db.collection(collectionName).find().toArray(function(err, results) {
                        exported.data[collectionName] = results;

                        unref();
                    });
                });
            }
        });
    });
    app.get('/api/data-management/exported/:id', function(req, res) {
        if (!checkPermissions(req)) {
            res.status(403).end();
            return;
        }

        var fs = require('fs');
        fs.readFile(__dirname + "/../../../exported/" + req.params.id, function read(err, data) {
            if (err) {
                throw err;
            }
            res.setHeader('Content-disposition', 'attachment; filename=' + req.params.id);
            res.send(data);
        });
    });
};