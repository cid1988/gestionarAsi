exports = module.exports = function(usuario, clave, callback) {
    // return callback(null, usuario);
    
    var urlWsdl = "http://10.10.1.50/webservice/validar.php?wsdl";

    var soap = require('soap');
    var args = {
        email: usuario + '@buenosaires.gob.ar',
        clave: clave
    };
    soap.createClient(urlWsdl, function(err, client) {
        err && console.log(err) && callback && callback(err);
        if (!err) {
            client.validar(args, function(err, result) {
                err && console.log(err) && callback && callback(err);
                if (!err) {
                    if (result.
                    return ==1) {
                        callback(null, usuario);
                    }
                    else {
                        callback(null, false);
                    }
                }
            });
        }
    });
};