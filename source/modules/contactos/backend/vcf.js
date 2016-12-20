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
    var contador=0;
    var buscarDirecciones = function(tipo, contacto) {
      console.log("TIPO: "+tipo+"------------- CONTACTO NOMBRE y apellido: "+contacto.nombre+ " " +contacto.apellidos+" CONTADOR: "+contador);
       contador++;
        if (!contacto.direcciones) {
            return "";
        }
        else {
            if(!contacto.direcciones.length)
            {
               for (var i = 0; i < contacto.direcciones.length; i++) 
               {
                  var em = contacto.direcciones[i];

                  if(em.nombre)
                  {
                     if (em.nombre == tipo && tipo == 'Laboral') 
                     {
                        return em.valorCalle+" "+em.valorAltura+";"+em.valorBarrio+";"+em.valorProvincia+";"+em.valorCpostal+";"+em.valorPais;
                     } 
                     else if(tipo == 'Encode') 
                     {
                        return em.valorCalle+" "+em.valorAltura+"=0D=0A"+em.valorBarrio+","+em.valorProvincia+" "+em.valorCpostal+"=0D=0A"+em.valorPais;
                     }
                  }
               } 
            }
        }
        return "";
    };
    var buscarSexo = function(tipo) {
        switch(tipo){
            case 'Sr.':
                tipo =  2;
            break;
            case 'Sra.':
            case 'Srta.':
                tipo =  1;
            break;
            default:
                tipo =  '';
            break;
        }
        return tipo;
    };

    var armarTarjeta = function(contacto) {
        //console.log(buscarCorreo('Email oficial', contacto));
        if(contacto.nombre){ contacto.nombre = contacto.nombre; } else { contacto.nombre = ''; }
        if(contacto.apellidos){ contacto.apellidos = contacto.apellidos; } else { contacto.apellidos = ''; }
        if(contacto.area){ contacto.area = contacto.area; } else { contacto.area = ''; }
        if(contacto.cargo){ contacto.cargo = contacto.cargo; } else { contacto.cargo = ''; }
        
            return  "BEGIN:VCARD\n"+
                    "VERSION:2.1\n"+
                    "N;CHARSET=ISO-8859-1:"+contacto.apellidos+";"+contacto.nombre+";"+contacto.cargo+"\n"+
                    "FN;CHARSET=ISO-8859-1:"+contacto.nombre+" "+contacto.apellidos+"\n"+
                    "TITLE;CHARSET=ISO-8859-1;LANGUAGE=es-ES:"+contacto.cargo+"\n"+
                    "ORG;CHARSET=ISO-8859-1:"+contacto.area+"\n"+
                    "ADR;WORK;CHARSET=ISO-8859-1;LANGUAGE=es-ES:"+buscarDirecciones('Laboral', contacto)+"\n"+
                    "LABEL;WORK;CHARSET=ISO-8859-1;ENCODING=QUOTED-PRINTABLE;LANGUAGE=es-ES:"+buscarDirecciones('Encode', contacto)+"\n"+
                      //"PHOTO;GIF:\n"+
                    "EMAIL;PREF;WORK;INTERNET:"+buscarCorreo('Email oficial', contacto)+"\n"+
                    "TEL;WORK;VOICE:"+buscarTelefono('Telefono directo', contacto)+"\n"+
                    "TEL;HOME;VOICE:"+buscarTelefono('Telefono alternativo', contacto)+"\n"+
                    "X-WAB-GENDER:"+buscarSexo(contacto.tratamiento)+"\n"+
                    "REV:"+(new Date().toISOString())+"Z\n"+
                    "END:VCARD"+"\n";  
    };

    app.get('/api/orm-vcf/:id', function(req, res) {
        var id = req.params.id;
        //console.log(id);
        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            if (err) {
                console.log(req.url + ': ' + err.toString());
                res.status(503);
                res.end();
            }
            else {
                if(id == 'todos') {
                var tarjeta = '';
                db.collection('orm.contactos').find({}).each(function(err, contacto) {
                    if (err) {
                        res.status(503);
                        console.log(err);
                        return res.end();
                    }
                        
                    if (contacto) {
                        tarjeta += armarTarjeta(contacto);
                    }
                    else {
                        res.setHeader("Content-Type", "text/vcard");
                        res.setHeader('Content-disposition', 'attachment; filename=Todos los contactos.vcf');
                        //var Buffer = require('buffer').Buffer;
                        var Iconv  = require('iconv').Iconv;
                        var iconv = new Iconv('UTF-8', 'ISO-8859-1');

                        var buffer = iconv.convert(tarjeta);
                        res.end(buffer);
                    }
                });
                }else {
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
            }
        });
    });
};

