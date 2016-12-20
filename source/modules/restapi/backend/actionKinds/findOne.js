var oid = require('mongodb').ObjectID;
exports = module.exports = {
  method: 'get',
  isArray: false,
  process: function(resource, action, req, res, db) {
    if (!require('./common').checkAuth(action, req)) {
      res.status(403);
      res.end();
    } else {
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
              query[p] = req.params[p];
            }
          }
          if (query._id && typeof query._id == 'string') {
            query._id = new oid(query._id);
          }
          
          var collection;
          if (resource.checkUserDbPerm) {
            collection = require('./dbPermColl')({
              get: function (user, callback) {
                db
                .collection('users.permissions')
                .findOne({ username: user }, function (err, doc) {
                   if (err) return callback (err);
                   if (!doc) return callback(new Error('El usuario no existe'));
                   
                   callback(null, doc[resource.checkUserDbPerm]);
                });
              }
            }, db)
            .user(req.session.user.username)
            .collection(resource.collectionName || resource.name); 
          } else {
            collection = db.collection(resource.collectionName || resource.name);
          }
          
          collection.findOne(query, function(err, doc) {
            handleErr(err);
            if (!err) {
              res.json(doc || query);
            }
          });
        }
      });
    }
  }
};
