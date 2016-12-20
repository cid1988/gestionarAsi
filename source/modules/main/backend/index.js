exports = module.exports = function(app, conf) {
    var path = require('path');
    app.get('/', function(req, res) {
        res.sendfile(path.join(__dirname, "..", "frontend", "index.html"));
    });
};