exports = module.exports = function(app, conf, callback) {
  var db = require('../db');
  db.setConf(conf);
  db.getDbInstance(function (err, db) {
    var modulesPath = conf.glue.modules.path,
    DBApi = require('./dbapi');

    var fs = require('fs');
    var path = require('path');
    var modules = fs.readdirSync(modulesPath);
    var express = require('express');
    var sendIndex = function(req, res) {
        var returnUrl = req.originalUrl;
        
        res.redirect('/?goTo=' + encodeURIComponent(returnUrl));
    };
    var allRoutes = {};
    var enabledModules = [];
    var allScriptRoutes = ['/scripts/service.js'];
    var allStates = [];
    

    modules.forEach(function(dir) {
        var localPath = path.join(modulesPath, dir, 'local.js');
        var locals = {};

        if (fs.existsSync(localPath)) {
            locals = require(localPath);
        }

        if (!locals.disabled) {
            enabledModules.push({
                modulePath: path.join(modulesPath, dir),
                name: dir,
                locals: locals
            });
        }
    });

    enabledModules.forEach(function(enabledModule) {
        var bootstrapPath = path.join(enabledModule.modulePath, 'backend', 'bootstrap.js');

        if (fs.existsSync(bootstrapPath)) {
            try{
            require(bootstrapPath)({
                enabledModules: enabledModules
            });
            } catch(e) {
                console.log('Error trying to bootstrap ' + enabledModule.name, e);
            }
        }
    });

    enabledModules.forEach(function(enabledModule) {
        var scriptsPath = path.join(enabledModule.modulePath, 'scripts.js');
        if (fs.existsSync(scriptsPath)) {
            var moduleScripts = require(scriptsPath);

            for (var i = 0; i < moduleScripts.length; i++) {
                var moduleScript = moduleScripts[i];
                allScriptRoutes[allScriptRoutes.length] = moduleScript;
            }
        }
    });
    
    conf.allScriptRoutes = allScriptRoutes;
    var allAngularModules = [];

    enabledModules.forEach(function(enabledModule) {
        var configurePath = path.join(enabledModule.modulePath, 'backend', 'configure.js');
        if (fs.existsSync(configurePath)) {
            require(configurePath)(app, conf);
        }

        var ngModulesPath = path.join(enabledModule.modulePath, 'ngmodules.js');
        if (fs.existsSync(ngModulesPath)) {
            allAngularModules.push.apply(allAngularModules, require(ngModulesPath));
        }

        var routesPath = path.join(enabledModule.modulePath, 'routes.js');

        if (fs.existsSync(routesPath)) {
//            console.log('routes for ' +  enabledModule.modulePath);
            var moduleRoutes = enabledModule.routes = require(routesPath);

            for (var r in moduleRoutes) {
//                console.log('adding route ' +  r);
                allRoutes[r] = moduleRoutes[r];

                app.use(r, sendIndex);
            }
        }

        app.use(express.static(path.join(enabledModule.modulePath, 'frontend')));
    });
    
    enabledModules.forEach(function(enabledModule) {
      var statesPath = path.join(enabledModule.modulePath, 'states.js');

      if (fs.existsSync(statesPath)) {
        var moduleStates = enabledModule.routes = require(statesPath);

        allStates = allStates.concat(moduleStates);
      }
    });
    
    app.get('/api/ui/angular-modules', function (req, res) {
      var arr = ['Mac', 'url', 'bag2.alerts', 'bag2.apps', 'bag2.app', 'bag2.navbar', 'bag2.checkUrl', 'bag2.search', 'bag2.restApi', 
      'bag2.dashboard','bag2.toArray', 'ngSanitize', 'onEnter', 'ck', 'colorpicker', 'ui.calendar', 'bag2.auth', 
      'ngUpload', 'ui.keypress', 'ngResource', 'ui.directives', 'ui.bootstrap', '$strap.directives', 'ui.state', 
      'bag2.page', 'bag2.login',  "bag2.notAllowed", "bag2.rte", "angular-datetime", "bag2.forms", "bag2.fineUploader", "bag2.defaults", 
      "bag2.filters", "bag2.editModel", "ui.route", "bag2.scopeAlias", "bag2.dhtmlxgantt"];
      arr.push.apply(arr, allAngularModules);

      res.json(arr);
    });

    app.get('/api/ui/states', function(req, res) {
      res.json(allStates);
    });

    app.get('/api/ui/routes', function(req, res) {
      res.json(allRoutes);
    });

    app.get('/api/ui/allScriptsRoutes.js', function(req, res) {
      res.json(allScriptRoutes);
    });
    
    var updateManifest = function () {
      manifest ='';
      manifest += 'CACHE MANIFEST\n';
      manifest += '# ' + new Date().valueOf()+  '\n';
      manifest += '/index.html\n';
      manifest += '/components/jquery/jquery.js\n';
      manifest += '/bootplus/docs/assets/css/bootplus.css\n';
      manifest += '/components/openlayers/OpenLayers.js\n';
      manifest += '/components/ckeditor/ckeditor.js\n';
      manifest += '/components/jquery-ui/ui/jquery-ui.js\n';
      manifest += '/components/macgyver/macgyver.js\n';
      manifest += '\n';
      manifest += 'CACHE:\n';
//        for(var r in allRoutes) {
//            if (r.indexOf(':') == -1) manifest += r + '\n';
//        }
      manifest += (allScriptRoutes || []).join('\n') + '\n';
      manifest += '\n';
  //    manifest += 'FALLBACK:\n';
  //    manifest += '\n';
      manifest += 'NETWORK:\n';
      manifest += 'offline.manifest\n';
      manifest += '*\n';
      manifest += '\n';
    };
    
    updateManifest();

//    setInterval(updateManifest, 30000);

    app.get('/offline.manifest', function (req, res) {
      console.log('app.appcache hit');
      res.setHeader('Content-Type', 'text/cache-manifest');
      res.send(manifest);
    });

    require('./serviceapi')(enabledModules, app, conf, callback);
  });
};
