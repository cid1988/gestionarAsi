exports = module.exports = function(app, options) {
    app.post('/api/cambiarContrasenna/changePassword', function(req, res) {
        var hashed = require('password-hash').generate(req.body.newPassword);
        require('../../../db').getDbInstance(function(err, db) {
            if (err) {
                console.log(err);
                res.status(503);
                res.end();
            }
            else {
                db.collection('users').update(
                    {username: req.body.username},
                    {
                    $set: 
                    {
                        password: hashed
                    }
                }, 
                {
                    safe: true
                }, function(err) {
                    if (err) 
                    {
                        console.log(err);
                        res.status(503);
                    }
                    else
                    {
                        res.status(200);
                    }
                    res.end();
                });
            }
        });
    });
};