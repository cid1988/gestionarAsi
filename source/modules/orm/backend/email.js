// API para enviar mails (temario, minuta)
exports = module.exports = function(app, conf) {
	var mongo = require('mongodb');
	var db = require('../../../db');
	var emails = require('../../emails/backend/locals');
	db.setConf(conf);

	var enviarMensaje = function(contactos, asunto, listaPara, listaCC, listaCCO, listaExclusivos, principioHtml, temarioHtml, finHtml, adjunto, mailFrom, callback) {
		var contactosPorId = {};
        var Iconv  = require('iconv').Iconv;
        var iconv = new Iconv('UTF-8', 'US-ASCII//TRANSLIT');
        asunto = iconv.convert(asunto);
        
        if (mailFrom ==" ") {
            mailFrom = conf.temarios.email.from;
        }
        
        //var Buffer = require('buffer').Buffer;
        //var Iconv  = require('iconv').Iconv;
        //var assert = require('assert');
        
        //var iconv = new Iconv('UTF-8', 'ISO-8859-1');
        //var buffer = iconv.convert(asunto);
        //asunto = iconv.convert(new Buffer(asunto));
        //assert.equals(buffer.inspect(), asunto.inspect());
        
		contactos.forEach(function(c) {
			contactosPorId[c._id.toString()] = c;
		});
		
		var buscarCorreo = function(nombre, contacto) {
		    var emails = "";
            if (!contacto.correos) {
                return "";
            }
            else {
                for (var i = 0; i < contacto.correos.length; i++) {
                    var em = contacto.correos[i];
                    var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                    if (em.nombre == nombre) {
                        if ( !expr.test(em.valor) ) {
                            
                        } else {
                            if (emails === "") {
                                emails = em.valor;
                            } else {
                                emails = emails + ", " + em.valor;
                            }
                        }
                    }
                    if (em.checkedCCO) {
                        if ( !expr.test(em.valor) ) {
                            
                        } else {
                            if (emails === "") {
                                emails = em.valor;
                            } else {
                                emails = emails + ", " + em.valor;
                            }
                        }
                    }
                }
            }
            return emails;
        };

		// En el formato 'Diego Pérez <eazel7@gmail.com>,Daniela Costa <dcosta@yahoo.com>
		var para = '';
		var cc = '';
		var cco = '';
		var exclusivos = '';
		//Aca le puse que todos los mails los ponga en cco porque no quieren que se vean.

		listaPara.forEach(function(p) {
			var contacto = contactosPorId[p.contactoId];

			if (buscarCorreo('Email oficial', contacto)) {
    			if (cco > '') {
    				cco += ',';
    			}
    			cco +=  buscarCorreo('Email oficial', contacto);
            }
		});

		listaCC.forEach(function(p) {
			var contacto = contactosPorId[p.contactoId];

			if (buscarCorreo('Email oficial', contacto)) {
    			if (cco > '') {
    				cco += ',';
    			}
    			cco +=  buscarCorreo('Email oficial', contacto);
            }
		});

		listaCCO.forEach(function(p) {
			var contacto = contactosPorId[p.contactoId];
			
            if (buscarCorreo('Email oficial', contacto)) {
    			if (cco > '') {
    				cco += ',';
    			}
    			cco +=  buscarCorreo('Email oficial', contacto);
            }
		});

		listaExclusivos.forEach(function(p) {
			var contacto = contactosPorId[p.contactoId];

			if (buscarCorreo('Email oficial', contacto)) {
    			if (cco > '') {
    				cco += ',';
    			}
    			cco += buscarCorreo('Email oficial', contacto);
            }
		});

		// ambos son html
		var html = principioHtml +
			temarioHtml +
			'<hr />' +
			'<br />' +
			finHtml;
		html = '<div style="font-size: 24px; font-family: Arial; line-height: 150%">' + html + '</div>';

		var texto = require('html-to-text').fromString(html, {
			wordwrap: 130
		});

		var emailMessage = emails.createMessage(
			mailFrom,
			asunto,
			texto, html, para, cc, cco, adjunto,
		// TODO: CC no implementado
		'');

		emails.sendMail(emailMessage, callback);
	};

	app.post(conf.api.prefix + '/orm/enviar-temario', function(req, res) {
		var payload = req.body;

		db.getDbInstance(function(err, db) {
			// Ahora db es una instancia de la base de datos, no un módulo
			if (err) {
				console.log(err);
				res.status(503);
				res.end();
			} else {
				db.collection('orm.temarios').findOne({
					_id: new mongo.ObjectID(payload.temarioId)
				}, function(err, temario) {
					if (err) {
						console.log(err);
						res.status(503);
						res.end();
					} else {
						var html = temario.html;
						var mailFrom = " ";
						
						if (payload.desdeEmail) {
						    var mailFrom = payload.desdeEmail;
						}

						db.collection('orm.reuniones.instancias').findOne({
							_id: new mongo.ObjectID(temario.instancia)
						}, function(err, instancia) {
							if (err) {
								console.log(err);
								res.status(503);
								res.end();
							} else {
								var queryContactos = {
									_id: {
										$in: []
									}
								};

								payload.para && payload.para.forEach(function(c) {
									queryContactos._id.$in.push(new mongo.ObjectID(c.contactoId));
								});

								payload.cc && payload.cc.forEach(function(c) {
									queryContactos._id.$in.push(new mongo.ObjectID(c.contactoId));
								});

								payload.cco && payload.cco.forEach(function(c) {
									queryContactos._id.$in.push(new mongo.ObjectID(c.contactoId));
								});

								payload.exclusivos && payload.exclusivos.forEach(function(c) {
									queryContactos._id.$in.push(new mongo.ObjectID(c.contactoId));
								});
								

								db.collection('orm.contactos').find(queryContactos, function(err, docs) {
									if (err) {
										console.log(err);
										res.status(503);
										res.end();
									} else {
										docs.toArray(function(err, contactos) {
											enviarMensaje(contactos,
												payload.asunto,
												payload.para,
												payload.cc,
												payload.cco,
												payload.exclusivos,
												payload.principioHtml,
												temario.html,
												payload.finHtml,
												payload.adjunto,
												mailFrom, function(err) {
												if (err) {
													console.log(err);
													res.status(503);
													res.end();
												} else {
													temario.enviado = {
														fecha:  new Date(),
														version: payload.version,
														para: payload.para,
														cc: payload.cc,
														cco: payload.cco,
														exclusivos: payload.exclusivos,
														asunto: payload.asunto,
														mensajeHtml: payload.mensajeHtml
													};

													console.log(temario);
													// el temario fue enviado correctamente
													db.collection('orm.temarios').save(temario,{
														safe: true
													}, function (err) {
														if (err) {
															console.log(err);
															res.status(503);
															res.end();
														} else {
															res.json({});
														}
													});
												}
											});
										});
									}
								});
							}
						});
					}
				});
			}
		});
	});
	
	var enviarSoporte = function(asunto, listaPara, listaCC, listaCCO, listaExclusivos, textoHtml, principioHtml, finHtml, adjunto, callback) {
        var Iconv  = require('iconv').Iconv;
        var iconv = new Iconv('UTF-8', 'US-ASCII//TRANSLIT');

		// En el formato 'Diego Pérez <eazel7@gmail.com>,Daniela Costa <dcosta@yahoo.com>
		var para = listaPara;
		var cc = '';
		var cco = '';
		var exclusivos = '';
		
		// ambos son html
		var html = textoHtml;

		var texto = require('html-to-text').fromString(html, {
			wordwrap: 130
		});

		var emailMessage = emails.createMessage(
			"BAGestion - ORM <orm@buenosaires.gob.ar>",
			asunto,
			texto, html, para, cc, cco, adjunto,
		// TODO: CC no implementado
		'');

		emails.sendMail(emailMessage, callback);
	};

	app.post(conf.api.prefix + '/orm/enviar-soporte', function(req, res) {
		var payload = req.body;

		db.getDbInstance(function(err, db) {
			// Ahora db es una instancia de la base de datos, no un módulo
			if (err) {
				console.log(err);
				res.status(503);
				res.end();
			} else {
				db.collection('orm.reuniones.instancias').findOne({
					_id: new mongo.ObjectID(payload.instanciaId)
				}, function(err, instancia) {
					if (err) {
						console.log(err);
						res.status(503);
						res.end();
					} else {
						enviarSoporte(payload.asunto,
							payload.para,
							payload.cc,
							payload.cco,
							payload.exclusivos,
							payload.mensajeHtml,
							payload.principioHtml,
							payload.finHtml,
							"", function(err) {
							if (err) {
								console.log(err);
								res.status(503);
								res.end();
							} else {
                                res.json({});
                            }
                        });
                    }
                });
			}
		});
	});
	
	
	var enviarCita = function(contactos, asunto, listaPara, listaCC, listaCCO, listaExclusivos, textoHtml, principioHtml, finHtml, adjunto, callback) {
		var contactosPorId = {};
        var Iconv  = require('iconv').Iconv;
        var iconv = new Iconv('UTF-8', 'US-ASCII//TRANSLIT');
        asunto = iconv.convert(asunto);
        
		contactos.forEach(function(c) {
			contactosPorId[c._id.toString()] = c;
		});
		
		var buscarCorreo = function(nombre, contacto) {
		    var emails = "";
            if (!contacto.correos) {
                return "";
            }
            else {
                for (var i = 0; i < contacto.correos.length; i++) {
                    var em = contacto.correos[i];
                    var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                    if (em.nombre == nombre) {
                        if ( !expr.test(em.valor) ) {
                            
                        } else {
                            if (emails === "") {
                                emails = em.valor;
                            } else {
                                emails = emails + ", " + em.valor;
                            }
                        }
                    }
                    if (em.checkedCCO) {
                        if ( !expr.test(em.valor) ) {
                            
                        } else {
                            if (emails === "") {
                                emails = em.valor;
                            } else {
                                emails = emails + ", " + em.valor;
                            }
                        }
                    }
                }
            }
            return emails;
        };

		// En el formato 'Diego Pérez <eazel7@gmail.com>,Daniela Costa <dcosta@yahoo.com>
		var para = '';
		var cc = '';
		var cco = '';
		var exclusivos = '';
		//Aca le puse que todos los mails los ponga en cco porque no quieren que se vean.

		listaPara.forEach(function(p) {
			var contacto = contactosPorId[p.contactoId];

			if (buscarCorreo('Email oficial', contacto)) {
    			if (cco > '') {
    				cco += ',';
    			}
    			cco +=  buscarCorreo('Email oficial', contacto);
            }
		});

		listaCC.forEach(function(p) {
			var contacto = contactosPorId[p.contactoId];

			if (buscarCorreo('Email oficial', contacto)) {
    			if (cco > '') {
    				cco += ',';
    			}
    			cco +=  buscarCorreo('Email oficial', contacto);
            }
		});

		listaCCO.forEach(function(p) {
			var contacto = contactosPorId[p.contactoId];
			
            if (buscarCorreo('Email oficial', contacto)) {
    			if (cco > '') {
    				cco += ',';
    			}
    			cco +=  buscarCorreo('Email oficial', contacto);
            }
		});

		listaExclusivos.forEach(function(p) {
			var contacto = contactosPorId[p.contactoId];

			if (buscarCorreo('Email oficial', contacto)) {
    			if (cco > '') {
    				cco += ',';
    			}
    			cco +=  buscarCorreo('Email oficial', contacto);
            }
		});

		// ambos son html
		var html = textoHtml; /*principioHtml +
			'<hr />' +
			'<br />' + "Hola Hola" +
			finHtml;
		html = '<div style="font-size: 24px; font-family: Arial; line-height: 150%">' + html + '</div>';*/

		var texto = require('html-to-text').fromString(html, {
			wordwrap: 130
		});

		var emailMessage = emails.createMessage(
			conf.citas.email.from,
			asunto,
			texto, html, para, cc, cco, adjunto,
		// TODO: CC no implementado
		'');

		emails.sendMail(emailMessage, callback);
	};

	app.post(conf.api.prefix + '/orm/enviar-cita', function(req, res) {
		var payload = req.body;

		db.getDbInstance(function(err, db) {
			// Ahora db es una instancia de la base de datos, no un módulo
			if (err) {
				console.log(err);
				res.status(503);
				res.end();
			} else {
				db.collection('orm.reuniones.instancias').findOne({
					_id: new mongo.ObjectID(payload.instanciaId)
				}, function(err, instancia) {
					if (err) {
						console.log(err);
						res.status(503);
						res.end();
					} else {
						var queryContactos = {
							_id: {
								$in: []
							}
						};

						payload.para && payload.para.forEach(function(c) {
							queryContactos._id.$in.push(new mongo.ObjectID(c.contactoId));
						});

						payload.cc && payload.cc.forEach(function(c) {
							queryContactos._id.$in.push(new mongo.ObjectID(c.contactoId));
						});

						payload.cco && payload.cco.forEach(function(c) {
							queryContactos._id.$in.push(new mongo.ObjectID(c.contactoId));
						});

						payload.exclusivos && payload.exclusivos.forEach(function(c) {
							queryContactos._id.$in.push(new mongo.ObjectID(c.contactoId));
						});

						db.collection('orm.contactos').find(queryContactos, function(err, docs) {
							if (err) {
								console.log(err);
								res.status(503);
								res.end();
							} else {
								docs.toArray(function(err, contactos) {
									enviarCita(contactos,
										payload.asunto,
										payload.para,
										payload.cc,
										payload.cco,
										payload.exclusivos,
										payload.mensajeHtml,
										payload.principioHtml,
										payload.finHtml,
										payload.adjunto, function(err) {
										if (err) {
											console.log(err);
											res.status(503);
											res.end();
										} else {
                                            db.collection('orm.citas').findOne({
                                                idInstancia: payload.instanciaId
                                            }, function(err, cita) {
                                                if (err) {
                                                    console.log(err);
                                                    res.status(503);
                                                    res.end();
                                                } else {
                                                    if (cita) {
                                                        cita.fecha=  new Date();
                                                        cita.version= payload.version;
                                                        cita.para= payload.para;
                                                        cita.cc= payload.cc;
                                                        cita.cco= payload.cco;
                                                        cita.exclusivos= payload.exclusivos;
                                                        cita.asunto= payload.asunto;
                                                        cita.mensajeHtml= payload.mensajeHtml;
    
                                                        console.log(cita);
                                                        // la cita fue enviada correctamente
                                                        db.collection('orm.citas').save(cita,{
                                                            safe: true
                                                        }, function (err) {
                                                            if (err) {
                                                                console.log(err);
                                                                res.status(503);
                                                                res.end();
                                                            } else {
                                                                res.json({});
                                                            }
                                                        });
                                                    } else {
                                                        var cita2 = {
                                                            idInstancia: payload.instanciaId,
                                                            fecha:  new Date(),
                                                            version: payload.version,
                                                            para: payload.para,
                                                            cc: payload.cc,
                                                            cco: payload.cco,
                                                            exclusivos: payload.exclusivos,
                                                            asunto: payload.asunto,
                                                            mensajeHtml: payload.mensajeHtml
                                                        };
            
                                                        console.log(cita2);
                                                        // la cita fue enviada correctamente
                                                        db.collection('orm.citas').insert(cita2,{
                                                            safe: true
                                                        }, function (err) {
                                                            if (err) {
                                                                console.log(err);
                                                                res.status(503);
                                                                res.end();
                                                            } else {
                                                                res.json({});
                                                            }
                                                        });
                                                    }
                                                }
                                            });
										}
									});
								});
							}
						});
					}
				});
			}
		});
	});
	
	
	
	var enviarMinuta = function(contactos, asunto, listaPara, listaCC, listaCCO, listaExclusivos, textoHtml, principioHtml, finHtml, adjunto, mailFrom, callback) {
		var contactosPorId = {};
        var Iconv  = require('iconv').Iconv;
        var iconv = new Iconv('UTF-8', 'US-ASCII//TRANSLIT');
        asunto = iconv.convert(asunto);
        
        if (mailFrom ==" ") {
            mailFrom = conf.temarios.email.from;
        }
        
		contactos.forEach(function(c) {
			contactosPorId[c._id.toString()] = c;
		});
		
		var buscarCorreo = function(nombre, contacto) {
		    var emails = "";
            if (!contacto.correos) {
                return "";
            }
            else {
                for (var i = 0; i < contacto.correos.length; i++) {
                    var em = contacto.correos[i];
                    var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                    if (em.nombre == nombre) {
                        if ( !expr.test(em.valor) ) {
                            
                        } else {
                            if (emails === "") {
                                emails = em.valor;
                            } else {
                                emails = emails + ", " + em.valor;
                            }
                        }
                    }
                    if (em.checkedCCO) {
                        if ( !expr.test(em.valor) ) {
                            
                        } else {
                            if (emails === "") {
                                emails = em.valor;
                            } else {
                                emails = emails + ", " + em.valor;
                            }
                        }
                    }
                }
            }
            return emails;
        };

		// En el formato 'Diego Pérez <eazel7@gmail.com>,Daniela Costa <dcosta@yahoo.com>
		var para = '';
		var cc = '';
		var cco = '';
		var exclusivos = '';
		//Aca le puse que todos los mails los ponga en cco porque no quieren que se vean.

		listaPara.forEach(function(p) {
			var contacto = contactosPorId[p.contactoId];

			if (buscarCorreo('Email oficial', contacto)) {
    			if (cco > '') {
    				cco += ',';
    			}
    			cco +=  buscarCorreo('Email oficial', contacto);
            }
		});

		listaCC.forEach(function(p) {
			var contacto = contactosPorId[p.contactoId];

			if (buscarCorreo('Email oficial', contacto)) {
    			if (cco > '') {
    				cco += ',';
    			}
    			cco +=  buscarCorreo('Email oficial', contacto);
            }
		});

		listaCCO.forEach(function(p) {
			var contacto = contactosPorId[p.contactoId];
			
            if (buscarCorreo('Email oficial', contacto)) {
    			if (cco > '') {
    				cco += ',';
    			}
    			cco +=  buscarCorreo('Email oficial', contacto);
            }
		});

		listaExclusivos.forEach(function(p) {
			var contacto = contactosPorId[p.contactoId];

			if (buscarCorreo('Email oficial', contacto)) {
    			if (cco > '') {
    				cco += ',';
    			}
    			cco +=  buscarCorreo('Email oficial', contacto);
            }
		});

		// ambos son html
		var html = textoHtml; /*principioHtml +
			'<hr />' +
			'<br />' + "Hola Hola" +
			finHtml;
		html = '<div style="font-size: 24px; font-family: Arial; line-height: 150%">' + html + '</div>';*/

		var texto = require('html-to-text').fromString(html, {
			wordwrap: 130
		});
		var emailMessage = emails.createMessage(
			mailFrom,
			asunto,
			texto, html, para, cc, cco, adjunto,
		// TODO: CC no implementado
		'');
		emails.sendMail(emailMessage, callback);
	};

	app.post(conf.api.prefix + '/orm/enviar-minuta', function(req, res) {
		var payload = req.body;

		db.getDbInstance(function(err, db) {
			// Ahora db es una instancia de la base de datos, no un módulo
			if (err) {
				console.log(err);
				res.status(503);
				res.end();
			} else {
				var mailFrom = " ";
				
				if (payload.desdeEmail) {
				    mailFrom = payload.desdeEmail;
				}
				db.collection('orm.minutas').findOne({
					_id: new mongo.ObjectID(payload.minutaId)
				}, function(err, minuta) {
					if (err) {
						console.log(err);
						res.status(503);
						res.end();
					} else {
						var queryContactos = {
							_id: {
								$in: []
							}
						};

						payload.para && payload.para.forEach(function(c) {
							queryContactos._id.$in.push(new mongo.ObjectID(c.contactoId));
						});

						payload.cc && payload.cc.forEach(function(c) {
							queryContactos._id.$in.push(new mongo.ObjectID(c.contactoId));
						});

						payload.cco && payload.cco.forEach(function(c) {
							queryContactos._id.$in.push(new mongo.ObjectID(c.contactoId));
						});

						payload.exclusivos && payload.exclusivos.forEach(function(c) {
							queryContactos._id.$in.push(new mongo.ObjectID(c.contactoId));
						});

						db.collection('orm.contactos').find(queryContactos, function(err, docs) {
							if (err) {
								console.log(err);
								res.status(503);
								res.end();
							} else {
								docs.toArray(function(err, contactos) {
									enviarMinuta(contactos,
										payload.asunto,
										payload.para,
										payload.cc,
										payload.cco,
										payload.exclusivos,
										payload.mensajeHtml,
										payload.principioHtml,
										payload.finHtml,
										payload.adjunto,
										mailFrom, function(err) {
										if (err) {
											console.log(err);
											res.status(503);
											res.end();
										} else {
											minuta.enviado = {
												fecha:  new Date(),
												version: payload.version
											};

											console.log(minuta);
											// la minuta fue enviado correctamente
											db.collection('orm.minutas').save(minuta,{
												safe: true
											}, function (err) {
												if (err) {
													console.log(err);
													res.status(503);
													res.end();
												} else {
													res.json({});
												}
											});
										}
									});
								});
							}
						});
					}
				});
			}
		});
	});
};
