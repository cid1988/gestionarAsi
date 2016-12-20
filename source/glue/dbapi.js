var q = require('q');

function DBCollection(user, db, collectionName) {
  this.user = user;
  this.db = db;
  this.collectionName = collectionName;
};

DBCollection.prototype.find = function (predicate, sort, projection) {
  var defer = q.defer();
  
  try {
    this.db.collection(this.collectionName).find(predicate || {}, projection || {})
    .sort(sort)
    .toArray(function (err, docs) {
      if (err) return defer.reject(err);
      
      return defer.resolve(docs);
    });
  } catch (e) {
    defer.reject(e);
  }
  
  return defer.promise;
};

DBCollection.prototype.findOne = function (predicate) {
  var defer = q.defer();
  
  try {
    this.db.collection(this.collectionName).findOne(predicate || {}, function (err, doc) {
      if (err) return defer.reject(err);
      
      return defer.resolve(doc);
    });
  } catch (e) {
    defer.reject(e);
  }
  
  return defer.promise;
};

DBCollection.prototype.insert = function (newObject) {
  var defer = q.defer();
  
  try {
    this.db.collection(this.collectionName).insert(newObject || {}, function (err, doc) {
      if (err) return defer.reject(err);

      if (typeof(newObject) === 'object') return defer.resolve(doc[0]);
      
      return defer.resolve(doc);
    });
  } catch (e) {
    process.nextTick(function () {
      defer.reject(e);
    });
  }
  
  return defer.promise;
};

DBCollection.prototype.update = function (predicate, replacement) {
  var defer = q.defer();
  
  try {
    this.db.collection(this.collectionName).update(predicate || {}, replacement || {}, function (err) {
      if (err) return defer.reject(err);
      
      return defer.resolve();
    });
  } catch (e) {
    defer.reject(e);
  }
  
  return defer.promise;
};

DBCollection.prototype.remove = function (predicate) {
  var defer = q.defer();
  
  try {
    this.db.collection(this.collectionName).insert(predicate || {}, function (err) {
      if (err) return defer.reject(err);
      
      return defer.resolve();
    });
  } catch (e) {
    defer.reject(e);
  }
  
  return defer.promise;
};

function DBApi(user, db) {
  this.user = user;
  this.db = db;
};

DBApi.prototype.collection = function (collectionName) {
  return new DBCollection(this.user, this.db, collectionName);
};

module.exports = DBApi;
