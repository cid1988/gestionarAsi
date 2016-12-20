exports = module.exports = function(app, conf) {
    require('../../../db').setConf(conf);

    var allResources = require('./config').allResources;

    var knownActionKinds = {
        findAndModify: require('./actionKinds/findAndModify'),
        findOne: require('./actionKinds/findOne'),
        find: require('./actionKinds/find'),
        remove: require('./actionKinds/remove')
    };

    function createRestHandler(resource, actionName, action) {
        return function(req, res) {
            if (knownActionKinds[action.kind]) {
                var db = require('../../../db');

                knownActionKinds[action.kind].process(resource, action, req, res, db);
            }
            else {
                res.json({
                    resource: resource,
                    actionName: actionName,
                    action: action,
                    params: req.params
                });
            }
        };
    }

    allResources.forEach(function(r) {
        for (var a in r.actions) {
            var action = r.actions[a];

            var method;
            if (knownActionKinds[action.kind]) {
                method = knownActionKinds[action.kind].method;
            }
            else {
                method = action.method;
            }

            if (method) {
                var urls = action.urls || [r.url];

                urls.forEach(function(url) {
                    app[method](conf.api.prefix + url, createRestHandler(r, a, action));
                });
            }
            else {
                console.log('Ignoring resource:' + r.name + ', action: ' + a + ' due to lack of known http method');
            }
        }
    });

    function generateAngularScript(resources) {
        var script = 'angular.module(' + JSON.stringify(conf.restApi.angularModuleName) + ', [])';

        resources.forEach(function(r) {
            script += '.factory(' + JSON.stringify(r.name) + ', function ($resource) { return $resource(';
            script += JSON.stringify(conf.api.prefix + r.url) + ', ';
            script += JSON.stringify(r.params) + ', ';

            var actionsParams = {};
            for (var a in r.actions) {
                var action = r.actions[a];

                var method;
                var isArray;
                if (knownActionKinds[action.kind]) {
                    method = knownActionKinds[action.kind].method;
                    isArray = knownActionKinds[action.kind].isArray;
                }
                else {
                    method = action.method;
                    isArray = action.isArray;
                }

                actionsParams[a] = {
                    method: method,
                    isArray: isArray
                };
            }
            script += JSON.stringify(actionsParams);
            script += ');})';
        });

        script += ';';

        return script;
    }

    app.get(conf.api.prefix + '/restapi.js', function(req, res) {
        var script = generateAngularScript(allResources);

        res.contentType("text/javascript");

        res.send(200, script);
    });
};