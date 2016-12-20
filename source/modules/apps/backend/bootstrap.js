var path = require('path'),
    fs = require('fs');

exports = module.exports = function(options) {
    var allApps = [];
    var allPermissions = [];
    var enabledModules = options.enabledModules;
    
    enabledModules.forEach(function(mod) {
        var appPath = path.join(mod.modulePath, 'app.js');
        if (fs.existsSync(appPath)) {
            var app = require(appPath);

            if (app instanceof Array) {
                allApps = allApps.concat(app);
            }
            else {
                allApps.push(app);
            }
        }

        var permissionsPath = path.join(mod.modulePath, 'permissions.js');
        if (fs.existsSync(permissionsPath)) {
            var permissions = require(permissionsPath);

            if (permissions instanceof Array) {
                allPermissions = allPermissions.concat(permissions);
            }
            else {
                allPermissions.push(permissions);
            }
        }
    });

    require('./locals').allApps = allApps;
    require('./locals').allPermissions = allPermissions;
};