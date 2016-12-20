exports = module.exports = function(app, conf) {
    require('./index')(app, conf);
    require('./uploads')(app, conf);
    require('./login')(app, conf);
    require('./angulartics')(app, conf);
};
