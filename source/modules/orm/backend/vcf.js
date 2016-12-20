// Función que publica la descarga de contactos como VCF
// la llama configure.js
exports = module.exports = function(app, conf) {
    var buscarTelefono = function(nombre, contacto) {
        if (!contacto.telefonos) {
            return "";
        }
        else {
            for (var i = 0; i < contacto.telefonos.length; i++) {
                var tel = contacto.telefonos[i];

                if (tel.nombre == nombre) {
                    return tel.valor;
                }
            }
        }

        return "";
    };

    var buscarCorreo = function(nombre, contacto) {
        if (!contacto.correos) {
            return "";
        }
        else {
            for (var i = 0; i < contacto.correos.length; i++) {
                var em = contacto.correos[i];

                if (em.nombre == nombre) {
                    return em.valor;
                }
            }
        }

        return "";
    };

    var armarTarjeta = function(contacto) {
        console.log(buscarCorreo('Email oficial', contacto));
        return "BEGIN:VCARD\n" + "VERSION:2.1\n" + "N:" + contacto.apellidos + ";" + contacto.apellidos + "\n" + "FN:" + contacto.nombre + " " + contacto.apellidos + "\n" + "ORG:" + contacto.area + "\n" + "TITLE:" + contacto.cargo + "\n" + "PHOTO;GIF:\n" + "TEL;WORK;VOICE:" + buscarTelefono('Telefono laboral', contacto) + "\n" + "TEL;HOME;VOICE:" + buscarTelefono('Telefono alternativo', contacto) + "\n" + "ADR;WORK:;;calle y altura;GCABA;GCABA;99939;Argentina\n" + "LABEL;WORK;ENCODING=QUOTED-PRINTABLE:calle y altura=0D=0AGCABA, GCABA 99939=0D=0AArgentina\n" + "EMAIL;PREF;INTERNET:" + buscarCorreo('Email oficial', contacto) + "\n" + "REV:" + (new Date().toISOString()) + "Z\n" + "END:VCARD";
    };

    app.get('/api/orm-vcf/:id', function(req, res) {
        var id = req.params.id;
        console.log(id);
        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            if (err) {
                console.log(req.url + ': ' + err.toString());
                res.status(503);
                res.end();
            }
            else {
                var mongo = require('mongodb');
                db.collection('orm.contactos').findOne({
                    _id: new mongo.ObjectID(id)
                }, function(err, contacto) {
                    console.log(err, contacto);
                    var tarjeta = armarTarjeta(contacto);
                    res.setHeader("Content-Type", "text/vcard");
                    res.setHeader('Content-disposition', 'attachment; filename=' + req.params.id + '.vcf');

                    console.log('GET ' + req.url);
                    // var Buffer = require('buffer').Buffer;
                    var Iconv  = require('iconv').Iconv;

                    var iconv = new Iconv('UTF-8', 'ISO-8859-1');
                    var buffer = iconv.convert(tarjeta);
                    res.end(buffer);
                });
            }
        });
    });
};