exports = module.exports = function(app, conf){
	// configurar la api para enviar mails
	require('./reuniones.js')(app, conf);
};