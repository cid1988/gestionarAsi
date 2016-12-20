var collections = {};
module.exports = function(permissionsProvider, dbProvider) {
  return {
    user: function(usuario) {
      return {
        collection: function(name) {
          return {
            update: function() {
              var original = [];
              for (var i = 0; i < arguments.length; i++) {
                original[i] = arguments[i];
              }
              var callback = arguments[arguments.length - 1];
              permissionsProvider.get(usuario, function(err, permisos) {
                if (err) return callaback(err);
                if (!permisos) return callback(null, []);
                if (!permisos.length) return callback(null, []);
                var collection = collections[name] || (collections[name] = dbProvider.collection(name));
                var filtro = original[0],
                  filtros = [];
                if (permisos.indexOf(name + ':update:*') > -1) {
                  // tiene permisos para hacer find en toda la colección
                  collection.update.apply(collection, original);
                } else {
                  // no tiene permiso para hacer find en toda la colección
                  for (var i = 0; i < permisos.length; i++) {
                    var prefijoPermisos = name + ':update:';
                    if (permisos[i].indexOf(prefijoPermisos) === 0) {
                      // Este es un permiso sobre esta colección
                      var filtroDelPermiso = permisos[i].slice(prefijoPermisos.length);
                      filtros.push(JSON.parse(filtroDelPermiso));
                    }
                  }
                  if (filtros.length == 0) {
                    // no tiene ningún permiso sobre esta colección
                    // no devolvemos ningún resultado
                    return callback(null, []);
                  } else {
                    var filtroCompleto = {
                      $and: [{
                          $or: filtros
                        },
                        filtro
                      ]
                    };
                    original[0] = filtroCompleto;
                    return collection.update.apply(collection, original);
                  }
                }
              });
            },
            remove: function() {
              var original = [];
              for (var i = 0; i < arguments.length; i++) {
                original[i] = arguments[i];
              }
              var callback = arguments[arguments.length - 1];
              permissionsProvider.get(usuario, function(err, permisos) {
                if (err) return callaback(err);
                if (!permisos) return callback(null, []);
                if (!permisos.length) return callback(null, []);
                var collection = collections[name] || (collections[name] = dbProvider.collection(name));
                var filtro = original[0],
                  filtros = [];
                if (permisos.indexOf(name + ':remove:*') > -1) {
                  // tiene permisos para hacer find en toda la colección
                  collection.remove.apply(collection, original);
                } else {
                  // no tiene permiso para hacer find en toda la colección
                  for (var i = 0; i < permisos.length; i++) {
                    var prefijoPermisos = name + ':remove:';
                    if (permisos[i].indexOf(prefijoPermisos) === 0) {
                      // Este es un permiso sobre esta colección
                      var filtroDelPermiso = permisos[i].slice(prefijoPermisos.length);
                      filtros.push(JSON.parse(filtroDelPermiso));
                    }
                  }
                  if (filtros.length == 0) {
                    // no tiene ningún permiso sobre esta colección
                    // no devolvemos ningún resultado
                    return callback(null, []);
                  } else {
                    var filtroCompleto = {
                      $and: [{
                          $or: filtros
                        },
                        filtro
                      ]
                    };
                    original[0] = filtroCompleto;
                    return collection.remove.apply(collection, original);
                  }
                }
              });
            },
            insert: function() {
              var original = [];
              for (var i = 0; i < arguments.length; i++) {
                original[i] = arguments[i];
              }
              
              var callback = arguments[arguments.length - 1];
              permissionsProvider.get(usuario, function(err, permisos) {
              console.log(arguments);
                if (err) return callback(err);
                if (!permisos) return callback(new Error('No tiene permisos'));
                if (!permisos.length) return callback(new Error('No tiene permisos'));
                if (permisos.indexOf(name + ':insert') == -1) return callback(new Error('No tiene permisos'));
                var collection = collections[name] || (collections[name] = dbProvider.collection(name));
                collection.insert.apply(collection, original);
              });
            },
            find: function() {
              var original = [];
              for (var i = 0; i < arguments.length; i++) {
                original[i] = arguments[i];
              }
              var callback = arguments[arguments.length - 1];
              permissionsProvider.get(usuario, function(err, permisos) {
                if (err) return callaback(err);
                if (!permisos) return callback(null, []);
                if (!permisos.length) return callback(null, []);
                var collection = collections[name] || (collections[name] = dbProvider.collection(name));
                var filtro = original[0],
                  filtros = [];
                if (permisos.indexOf(name + ':find:*') > -1) {
                  // tiene permisos para hacer find en toda la colección
                  collection.find.apply(collection, original);
                } else {
                  // no tiene permiso para hacer find en toda la colección
                  for (var i = 0; i < permisos.length; i++) {
                    var prefijoPermisos = name + ':find:';
                    if (permisos[i].indexOf(prefijoPermisos) === 0) {
                      // Este es un permiso sobre esta colección
                      var filtroDelPermiso = permisos[i].slice(prefijoPermisos.length);
                      filtros.push(JSON.parse(filtroDelPermiso));
                    }
                  }
                  if (filtros.length == 0) {
                    // no tiene ningún permiso sobre esta colección
                    // no devolvemos ningún resultado
                    return callback(null, []);
                  } else {
                    var filtroCompleto = {
                      $and: [{
                          $or: filtros
                        },
                        filtro
                      ]
                    };
                    original[0] = filtroCompleto;
                    return collection.find.apply(collection, original);
                  }
                }
              });
            },
            findAndModify: function() {
              var original = [];
              for (var i = 0; i < arguments.length; i++) {
                original[i] = arguments[i];
              }
              var callback = arguments[arguments.length - 1];
              permissionsProvider.get(usuario, function(err, permisos) {
                if (err) return callaback(err);
                if (!permisos) return callback(null, []);
                if (!permisos.length) return callback(null, []);
                var collection = collections[name] || (collections[name] = dbProvider.collection(name));
                var filtro = original[0],
                  filtros = [];
                if (permisos.indexOf(name + ':findAndModify:*') > -1) {
                  // tiene permisos para hacer find en toda la colección
                  collection.find.apply(collection, original);
                } else {
                  // no tiene permiso para hacer find en toda la colección
                  for (var i = 0; i < permisos.length; i++) {
                    var prefijoPermisos = name + ':findAndModify:';
                    if (permisos[i].indexOf(prefijoPermisos) === 0) {
                      // Este es un permiso sobre esta colección
                      var filtroDelPermiso = permisos[i].slice(prefijoPermisos.length);
                      filtros.push(JSON.parse(filtroDelPermiso));
                    }
                  }
                  if (filtros.length == 0) {
                    // no tiene ningún permiso sobre esta colección
                    // no devolvemos ningún resultado
                    return callback(null, []);
                  } else {
                    var filtroCompleto = {
                      $and: [{
                          $or: filtros
                        },
                        filtro
                      ]
                    };
                    original[0] = filtroCompleto;
                    return collection.findAndModify.apply(collection, original);
                  }
                }
              });
            }
          }
        }
      };
    }
  };
};
