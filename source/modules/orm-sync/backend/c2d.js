exports = module.exports = function(db, collectionName, query, callback) {
    var dict = {};
    db.collection(collectionName).find(query, function(err, docs) {
        if (err) {
            callback(err);
        }
        else {
            docs.each(function(err, e) {
                if (err) {
                    callback(err);
                }
                else if (e && e._id) {
                    dict[e._id.toString()] = e;
                }
                else if (e === null) {
                    callback(null, dict);
                }
            });
        }
    });
};