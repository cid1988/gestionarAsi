// Función que publica los calendarios ICS
// la llama configure.js
exports = module.exports = function(app, conf) {
    var express = require('express');
    var auth = express.basicAuth(require('../../main/backend/validarLdap'));

    app.get('/api/orm-ical/:_id.ics', auth, function(req, res) {
        var usuario = req.remoteUser;

        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            if (err) {
                console.log('DB Error, /api/orm/ical is offline');
                res.status(503);
                res.end();
            }
            else {
                var c2d = require('./c2d.js');
                var uuid = require('uuid');
                var icalendar = require('icalendar');
                var buildEvent = require('./buildEvent.js');
                var filtroReuniones = {}, filtroInstancias = {};

                if (req.params._id != 'all') {
                    filtroReuniones._id = new(require('mongodb')).ObjectID(req.params._id);
                    filtroInstancias.reunion = req.params._id;
                }
                c2d(db, 'orm.reuniones', filtroReuniones, function(err, reuniones) {
                    c2d(db, 'orm.reuniones.instancias', filtroInstancias, function(err, instancias) {
                        c2d(db, 'orm.contactos', {}, function(err, contactos) {
                            var userContactoId;

                            for (var cId in contactos) {
                                var c2 = contactos[cId];

                                if (c2 && c2.correos) {
                                    for (var j = 0; j < c2.correos.length; j++) {
                                        if (c2.correos[j].nombre == 'Email oficial' && c2.correos[j].valor == usuario + '@buenosaires.gob.ar') {
                                            userContactoId = cId;
                                            console.log(c2);
                                            break;
                                        }
                                    }
                                }
                            }

                            var cal = new icalendar.iCalendar();
                            cal.addProperty('X-APPLE-CALENDAR-COLOR', '#0e95b3');
                            for (var i in instancias) {
                                i = instancias[i];
                            
                                var r = reuniones[i.reunion];
                                
                                var tienePermiso = false;
                                    
                                if (r && r.calendario) {
                                    for (var k = 0; k < r.calendario.length; k++) {
                                        if (r.calendario[k].contactoId == userContactoId) {
                                            tienePermiso = true;
                                            break;
                                        }
                                    }
                                }
                                
                                if (tienePermiso) {
                                    var descripcion = '';
                                    (i.temas || []).forEach(function(t) {
                                        descripcion += t.titulo + '\n';
                                    });
    
                                    var e = {
                                        uuid: r.uuid || (uuid.v4().toString()),
                                        asunto: r.nombre,
                                        descripcion: descripcion,
                                        desde: new Date(i.desdeDate),
                                        hasta: new Date(i.hastaDate),
                                        sequence: i.version || 1,
                                        ubicacion: i.ubicacion,
                                        organizadores: {},
                                        comprometidos: {},
                                        noComprometidos: {},
                                        sinConfirmar: {}
                                    };
    
                                    console.log(i);
                                    console.log(r);
    
                                    if (i.participantes) {
                                        // Participantes
                                        for (var pIndex = 0; pIndex < i.participantes.length; pIndex++) {
                                            var pId = i.participantes[pIndex].contactoId;
                                            var p = i.participantes[pId];
                                            var c = contactos[pId];
    
                                            if (p.rol == 'organizador') {
                                                e.organizadores[pId] = c;
                                            }
    
                                            switch (p.asistencia) {
                                            case 'comprometido':
                                                e.comprometidos[pId] = c;
                                                break;
                                            case 'noComprometido':
                                                e.sinConfirmar[pId] = c;
                                                break;
                                            case 'sinConfirmar':
                                                e.noComprometidos[pId] = c;
                                                break;
                                            default:
                                            }
                                        }
                                    }
    
                                    var event = buildEvent(e);
    
                                    cal.addComponent(event);
                                }
                            }

                            res.setHeader('Content-Type', 'text/calendar');
                            res.end(cal.toString());
                        });
                    });
                });
            }
        });
    });
};