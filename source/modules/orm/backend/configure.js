exports = module.exports = function(app, conf) {
    // configurar la api para enviar mails
    require('./email.js')(app, conf);
    
    // configurar la api para descargar los contactos como vcf
    require('./vcf.js')(app, conf);
    
    // CSV de contactos
    require('express-csv');
    app.get('/api/contactos-csv/download', function(req, res) {
        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            
            db.collection('orm.organigrama').find({}).toArray(function(err, nombresJurisdicciones) {

                var jurisdiccionPorId = function(id) {
                    for (var i = 0; i < nombresJurisdicciones.length; i++) {
                        if (nombresJurisdicciones[i]._id == id) {
                            return nombresJurisdicciones[i];
                        }
                    }
                };
                
                var valorCorreo = function(c, tipo) {
                    if (c.correos) {
                        for (var i = 0; i < c.correos.length; i++) {
                            if (c.correos[i].nombre == tipo) {
                                return c.correos[i].valor;
                            }
                        }
                        return '';
                    }
                };
                
                var valorTelefono = function(c, tipo) {
                    if (c.telefonos) {
                        for (var i = 0; i < c.telefonos.length; i++) {
                            if (c.telefonos[i].nombre == tipo) {
                                return c.telefonos[i].valor;
                            }
                        }
                        return '';
                    }
                };
                
                var all = [
                    ["Apellido", "Nombre", "Segundo Nombre", "Dependencia", "Cargo", "Organismo", "Correo Oficial", "Correo Alternativo", "Teléfono Directo", "Teléfono Alternativo", "Conmutador", "Celular Laboral", "Celular Alternativo"]
                ];
                db.collection('orm.contactos').find({}).each(function(err, item) {
                    if (err) {
                        res.status(503);
                        console.log(err);
                        return res.end();
                    }
    
                    if (item) {
                        all.push([item.apellidos, item.nombre, item.segundoNombre, item.organigrama && jurisdiccionPorId(item.organigrama) && jurisdiccionPorId(item.organigrama).nombreCompleto, item.cargo, item.organigrama && jurisdiccionPorId(item.organigrama) && jurisdiccionPorId(item.organigrama).sigla, valorCorreo(item, 'Email oficial'), valorCorreo(item, 'Email alternativo'), valorTelefono(item, 'Telefono directo'), valorTelefono(item, 'Telefono alternativo'), valorTelefono(item, 'Conmutador'), valorTelefono(item, 'Celular laboral'), valorTelefono(item, 'Celular alternativo')]);
                    }
                    else {
                        res.setHeader("Content-Disposition", "attachment; filename=\"contactos.csv\"");
                        res.csv(all);
                    }
                });
            });
        });
    });
};
