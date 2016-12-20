var oid = require('mongodb').ObjectID;

exports = module.exports = {
    method: 'post',
    isArray: false,
    process: function(resource, action, req, res, db) {
        if (!require('./common').checkAuth(action, req)) {
            res.status(403);
            res.end();
        }
        else {
            db.getDbInstance(function(err, db) {
                function handleErr(err) {
                    if (err) {
                        console.log(err);
                        res.status(503);
                        res.end();
                    }
                }
                handleErr(err);
                if (!err) {
                    var query = {};

                    if (resource.params) {
                        for (var p in resource.params) {
                            if (req.params[p]) {
                                query[p] = req.params[p];
                            }
                        }
                    }

                    if (query._id && typeof query._id == 'string') {
                        // _id field should be of type ObjectID

                        query._id = new oid(query._id);
                    }

                    if (query._id === undefined || query._id === null) {
                        delete query._id;
                    }

                    var item = JSON.parse(JSON.stringify(req.body));
                    var isNew = (item._id === undefined || item._id === null);

                    // we cannot change the _id of a document
                    delete item._id;

                    if (action.beforeSave) {
                        var params = {
                            item: item,
                            isNew: isNew,
                            session: req.session
                        };
                        action.beforeSave(params);
                        if (params.newItem) {
                            item = params.newItem;
                        }
                    }

                    if (!isNew) {
                        db.collection(resource.collectionName || resource.name).findAndModify(query, {}, item, {
                            safe: true,
                            new: true,
                            upsert: false
                        }, function(err, doc) {
                            handleErr(err);
                            if (!err) {
                                res.json(doc);
                            }
                        });
                    }
                    else {
                        db.collection(resource.collectionName || resource.name).insert(item, {
                            w: 1,
                            safe: true
                        }, function(err, docs) {
                            handleErr(err);
                            if (!err) {
                                res.json(docs[0]);
                            }
                        });
                    }
                }
            });
        }
    }
};