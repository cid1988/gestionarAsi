exports = module.exports = function(app, conf) {
    // configurar los calendarios ICS
    require('./ics.js')(app, conf);
};
