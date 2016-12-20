exports = module.exports = function(app, conf) {
    app.post('/upload/*', function (req, res) {      
        var path;
        if (req.files.file) path = req.files.file.path; else path = req.files.qqfile.path;
        res.json({ok: true, id: require('path').basename(path), success: true });
    });
    app.get('/file/:id', function (req, res) {      
        res.sendfile(require('path').join(__dirname, '../../../uploads/' + req.params.id));
    });
};