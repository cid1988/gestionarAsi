exports = module.exports = function(app, conf) {
	app.get('/api/auth/permissions', function(req, res) {
		if (req.session.user) {
			require('../../../db').setConf(conf);
			require('../../../db').getDbInstance(function(err, db) {
				if (err) {
					console.log(err);
					res.status(503);
					res.end();
				}
				else {
					db.collection('users.permissions').findOne({
						username: req.session.user.username
					}, function(err, user) {
						if (!err) {
							if (user && user.permissions) {
								res.json(user.permissions);
							}
							else {
								res.json([]);
							}
						}
						else {
							console.log(err);
							res.status(503);
							res.end();
						}
					});
				}
			});
		}
		else {
			res.status(403);

			res.end();
		}
	});
	app.post('/api/auth/login', function(req, res) {
		require('../../../db').getDbInstance(function(err, db) {
			if (err) {
				console.log(err);
				res.status(503);
				res.end();
			}
			else {
				var CryptoJS = require("crypto-js");
				var contra = CryptoJS.AES.decrypt(req.body.password, "BAGestion%1234");
				db.collection('users').findOne({
					username: req.body.username
				}, function(err, user) {
					if (user) {
						if (conf.bypassLdap) {

								if (require('password-hash').verify(contra.toString(CryptoJS.enc.Utf8), user.password)) {
									req.session.user = {
										username: user.username
									};

									db.collection('users.permissions').findOne({
										username: req.session.user.username
									}, function(err, user) {
										if (!err) {
											if (user) {
												req.session.user.permissions = user.permissions;
											}
											else {
												req.session.user.permissions = [];
											}

											res.json({
												username: req.session.user.username,
												permissions: req.session.user.permissions
											});
										}
										else {
											console.log(err);
											res.status(503);
											res.end();
										}
									});
								}
								else {
									res.status(401);
									res.end();
								}
						} else {
							require('./validarLdap')(req.body.username, contra.toString(CryptoJS.enc.Utf8), function(err, authSucceded) {
								err && console.log(err);
								if (!err && authSucceded) {
									req.session.user = {
										username: user.username
									};

									db.collection('users.permissions').findOne({
										username: req.session.user.username
									}, function(err, user) {
										err && console.log(err);
										if (!err) {
											if (user) {
												req.session.user.permissions = user.permissions;
											}
											else {
												req.session.user.permissions = [];
											}

											res.json({
												username: req.session.user.username,
												permissions: req.session.user.permissions
											});
										}
										else {
											console.log(err);
											res.status(503);
											res.end();
										}
									});
								}
								else {
									if (require('password-hash').verify(contra.toString(CryptoJS.enc.Utf8), user.password)) {
										req.session.user = {
											username: user.username
										};

										db.collection('users.permissions').findOne({
											username: req.session.user.username
										}, function(err, user) {
											if (!err) {
												if (user) {
													req.session.user.permissions = user.permissions;
												}
												else {
													req.session.user.permissions = [];
												}

												res.json({
													username: req.session.user.username,
													permissions: req.session.user.permissions
												});
											}
											else {
												console.log(err);
												res.status(503);
												res.end();
											}
										});
									}
									else {
										res.status(401);
										res.end();
									}
								}
							});
						}
					}
					else {
						res.status(503);
						res.end();
					}
				});
			}
		});
	});
	app.post('/api/auth/logout', function(req, res) {
		delete req.session.user;
		res.status(200);
		res.end();
	});
	app.get('/api/auth/status', function(req, res) {
		if (req.session.user) {
			res.json({
				isLoggedIn: true,
				username: req.session.user.username
			});
		}
		else {
			res.json({
				isLoggedIn: false
			});
		}
	});
};