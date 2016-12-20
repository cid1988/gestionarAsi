var path = require('path'),
    fs = require('fs');

exports = module.exports = function (options) {
    var allResources = {};
    var enabledModules = options.enabledModules;
    enabledModules.forEach(function(mod) {
        var modName = mod.name;
        var appPath = path.join(mod.modulePath, 'app.js');
        if (fs.existsSync(appPath)) {
            modName = (require(appPath).name || mod.name);
        }
        
        var resourcesPath = path.join(mod.modulePath, 'resources.js');
        if (fs.existsSync(resourcesPath)) {
            var resources = require(resourcesPath);
            
            resources.forEach(function (r) {
                (allResources[modName] || (allResources[modName] = [])).push(r);
            });
        }
    });

    require('./locals').allResources = allResources;
};