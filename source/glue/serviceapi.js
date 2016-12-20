var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
    FN_ARG_SPLIT = /,/,
    FN_ARG = /^\s*(_?)(\S+?)\1\s*$/,
    STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
    path = require('path'),
    fs = require('fs'),
    q = require('q'),
    DBApi = require('./dbapi');

function scriptFor (wrapped, fnName, url) {
  var jsmod = '';
  
  jsmod += fnName + ': function (' + wrapped.argNames.join (',') + ') {\n';
        
  jsmod += 'var defer = $q.defer();\n';
  jsmod += '$http.post(' + JSON.stringify(url) + ', {\n';
  
  for (var t = 0; t < wrapped.argNames.length; t++) {
    jsmod += wrapped.argNames[t] + ': ' + wrapped.argNames[t] + ',\n'
  }
  
  jsmod += '})\n'
  jsmod += '.success(defer.resolve)\n'
  jsmod += '.error(defer.reject);\n'
  
  jsmod += 'return defer.promise;\n';
  
  jsmod += '}\n';
  
  return jsmod;
}

function getArgNames(fn) {
  var argNames = [],
      fnText = fn.toString().replace(STRIP_COMMENTS, ''),
      argDecl = fnText.match(FN_ARGS),
      splitted = argDecl[1].split(FN_ARG_SPLIT);

  for (var i = 0; i < splitted.length; i++) {
    var arg = splitted[i];

    arg.replace(FN_ARG, function(all, underscore, name){
      argNames.push(name);
    });
  }

  return argNames;
}

function WrappedApiCall(fn, db) {
  this.argNames = getArgNames(fn);
  this.originalFn = fn;
}

function resolveFor(res) {
  return function (result) {
    res.json(result || null); 
  };
}

function rejectFor(res) {
  return function (err) {
    res.status(418);
    console.error(err);
    res.end(err.toString());
  };
}

function handlerFor(wrapped, db) {
  return function (req, res) {
    if (!req.body) {
      res.status(418);
      return res.end();
    }
    
    var fnArgs = [];
    
    for (var i = 0; i < wrapped.argNames.length; i++) {
      fnArgs.push(req.body[wrapped.argNames[i]]);
    }
    
    try {
      wrapped.originalFn.apply({
        resolve: resolveFor(res),
        reject: rejectFor(res),
        usuario: req.session.user.username,
        db: new DBApi(req.session.user.username, db)
      }, fnArgs)
    } catch (e) {
      console.error(e);
      res.status(418);
      res.end();
    }
  }
}

module.exports = function (modules, app, conf, callback) {
  require('../db').setConf(conf);
  
  var fullApi = {};
  
  require('../db').getDbInstance (function (err, db) {
    if (err) return callback (err);
    
    modules.forEach(function(mod) {
      var servicePath = path.join(mod.modulePath, 'backend', 'service.js');
      
      if (fs.existsSync(servicePath)) {
        var part = require(servicePath);
        
        for (var k in part) {
          if (typeof(part[k]) === 'function') {
            fullApi[k] = new WrappedApiCall(part[k]);
          }
        
          if (!fullApi[k]) fullApi[k] = {};
          
          for (var j in part[k]) {
            if (typeof(part[k][j]) === 'function') {
              fullApi[k][j] = new WrappedApiCall(part[k][j]);
            }
          }
        }
      }
    });
    
    
    for (var k in fullApi) {
      if (fullApi[k].constructor !== WrappedApiCall) {
        for (var j in fullApi[k]) {
          console.log('/api/svc/' + encodeURIComponent(k) + '/' + encodeURIComponent(j));
          app.post('/api/svc/'  + encodeURIComponent(k) + '/' + encodeURIComponent(j), handlerFor(fullApi[k][j], db));
        }
      } else if (fullApi[k].constructor === WrappedApiCall) {
        console.log('/api/svc/' + encodeURIComponent(k));
        app.post('/api/svc/' + encodeURIComponent(k), handlerFor(fullApi[k], db));
      }
    }
    
    var jsmod = 'angular.module(\'service-api\', [\'ng\'])\n';
    
    jsmod += '.service(\'API\', function ($http, $q) {\n';
    jsmod += 'return {\n';
    
    
    for (var k in fullApi) {
      if (fullApi[k].constructor === WrappedApiCall) {
        var wrapped = fullApi[k];
        
        jsmod += scriptFor(wrapped, k, '/api/svc/' + encodeURIComponent(k)) + ',';
      } else {
        jsmod += k + ': {\n';
        
        var jMethods = [];
        
        for (var j in fullApi[k]) {
          var wrapped = fullApi[k][j];
          
          jMethods.push(scriptFor(wrapped, j, '/api/svc/' + encodeURIComponent(k) + '/' + encodeURIComponent(j)));
        }
        jsmod += jMethods.join(',');
        
        jsmod += '}';
      }
    }
    
    jsmod += '};\n';
    jsmod += '});';
    
    app.get('/scripts/service.js', function (req, res) {
      res.end(jsmod);
    });
    
    callback();
  });
};
