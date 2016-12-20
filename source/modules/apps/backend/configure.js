exports = module.exports = function(app) {
    var allApps = require('./locals').allApps;
    var allPermissions = require('./locals').allPermissions;

    app.get('/api/apps', function(req, res) {
        res.json(allApps);
    });
    
    app.get('/api/allPermissions', function(req, res) {
        res.json(allPermissions);
    });
};