exports = module.exports = function(app, conf) {
    var path = require('path'),
        db = require('../../../db.js');

    db.setConf(conf);
    db.getDbInstance(function(err, db) {
        app.post('/api/files/upload', function(req, res) {
            var uploadPath;
            if (req.files.file) path = req.files.file.path;
            else uploadPath = req.files.qqfile.path;

            var mongodb = require('mongodb');
            var oid = new mongodb.ObjectID();
            var gs = new mongodb.GridStore(db, oid.toString(), "w", {});
            gs.open(function(err, gs) {
                if (err) {
                    console.log(err);
                    res.status(503);
                    res.end();
                }
                else {
                    gs.writeFile(uploadPath, function(err, gs) {
                        if (err) {
                            console.log(err);
                            res.status(503);
                            res.end();
                        }
                        else {
                            gs.close();
                            res.json({
                                ok: true,
                                id: oid.toString(),
                                success: true
                            });
                        }
                    });
                }
            });
        });
        app.get('/api/upload/:id', function(req, res) {
            var mongodb = require('mongodb');
            var gs = new mongodb.GridStore(db, req.params.id, "r", {});
            gs.open(function(err, gs) {
                if (gs) {
                    gs.read(function(err, data) {
                        if (err) {
                            console.log(err);
                            res.status(503);
                            res.end();
                        }
                        else {
                            res.setHeader('Cache-Control', 'max-age=28800');
                            res.write(data);
                            res.end();
                        }
                    });
                }
                else {
                    res.status(404);
                    res.end();
                }
            });
        });
    });
};