exports = module.exports = function(app, conf) {
  app.post('/angulartics-pageTrack', function(req, res) {
    res.status(200);
    res.end();
    
    require('../../../db').setConf(conf);
    require('../../../db').getDbInstance(function(err, db) {
      db.collection('pageTracking')
        .insert({
          date: new Date().valueOf(),
          user: (req.session && req.session.user ? req.session.user.username : ''),
          data: req.body.path
        }, {
          safe: true
        }, function (err) {
          err && console.error('Error in POST /angulartics-pageTrack', err);
        });
    });
  });
  app.post('/angulartics-trackState', function(req, res) {
    res.status(200);
    res.end();
    
    require('../../../db').setConf(conf);
    require('../../../db').getDbInstance(function(err, db) {
      db.collection('stateTracking')
        .insert({
          date: new Date().valueOf(),
          user: (req.session && req.session.user ? req.session.user.username : ''),
          url: req.body.url,
          state: req.body.state
        }, {
          safe: true
        }, function (err) {
          err && console.error('Error in POST /angulartics-pageTrack', err);
        });
    });
  });
};
