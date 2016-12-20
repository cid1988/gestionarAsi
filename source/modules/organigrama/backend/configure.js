exports = module.exports = function(app, conf) {
    var doAll = function(db, res, nombresJurisdicciones) {
        
        var jurisdiccionPorId = function(id) {
            for (var i = 0; i < nombresJurisdicciones.length; i++) {
                if (nombresJurisdicciones[i]._id == id) {
                    return nombresJurisdicciones[i];
                }
            }
        };
        
        var all = [
            ["Nombre Completo", "Sigla", "Nivel", "Categoría", "Superior Inmediato"]
        ];
        db.collection('orm.organigrama').find({}).each(function(err, item) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            
            if (item) {
                all.push([
                item.nombreCompleto,
                item.sigla,
                item.nivel,
                item.categoria,
                item.superiorInmediato && jurisdiccionPorId(item.superiorInmediato) && jurisdiccionPorId(item.superiorInmediato).nombreCompleto]);
            }
            else {
                res.setHeader("Content-Disposition", "attachment; filename=\"organigrama.csv\"");
                res.csv(all);
            }
        });
    };
    
    require('express-csv');
    app.get('/api/organigrama-csv/download', function(req, res) {
        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            
            db.collection('orm.organigrama').find({}).toArray(function(err, nombresJurisdicciones) {
                doAll(db, res, nombresJurisdicciones);
            });
        });
    });
};