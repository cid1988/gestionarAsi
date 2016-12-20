var path = require('path'),
    fs = require('fs');

exports = module.exports = function (options) {
    var allResources = [];
    var enabledModules = options.enabledModules;
    enabledModules.forEach(function (mod) {
        var collectionsPath = path.join(mod.modulePath, 'resources.js');
        if (fs.existsSync(collectionsPath)) {
            var resources = require(collectionsPath);
            
            allResources = allResources.concat(resources);
        }
    });
    
    require('./config').allResources = allResources;
};