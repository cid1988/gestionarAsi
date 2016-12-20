exports = module.exports = [
	/*
		crear/editar salas
 		crear/editar reuniones
  		eliminar salas
  		eliminar reuniones
  		administrador
  		acceso (lectura)

  		Recepcionista
  			-acceso

  		Logistica
  			-acceso
  			-crear/editar salas

  		Administrador
  			-acceso
  			-crear/editar reuniones

  		Sistemas
  			-crear/editar salas
  			-crear/editar reuniones
  			-eliminar salas
  			-eliminar reuniones
			-administrador
  			-acceso
  	*/

	//Permisos
	{
  		name: 'Salas de Reuniones - Crear/Editar Salas',
  		key: 'salasreuniones.crearEditarSalas',
  		rol: false
	},{
  		name: 'Salas de Reuniones - Crear/Editar Reuniones',
  		key: 'salasreuniones.crearEditarReuniones',
  		rol: false
	},{
  		name: 'Salas de Reuniones - Eliminar Salas',
  		key: 'salasreuniones.eliminarSalas',
  		rol: false
	},{
  		name: 'Salas de Reuniones - Eliminar reuniones',
  		key: 'salasreuniones.eliminarReuniones',
  		rol: false
	},{
  		name: 'Salas de Reuniones - Admin',
  		key: 'salasreuniones.administrador',
  		rol: false
	},
	//Roles
	{
  		name: 'Salas de Reuniones - Recepcionista',
  		rol: true,
  		prioridad:0,
  		roles: ['salasreuniones']
	},{
  		name: 'Salas de Reuniones - Logística',
  		rol: true,
  		prioridad:1,
  		roles: ['salasreuniones','salasreuniones.crearEditarSalas']
	},{
  		name: 'Salas de Reuniones - Administrador',
  		rol: true,
  		prioridad:2,
  		roles: ['salasreuniones','salasreuniones.crearEditarReuniones']
	},{
  		name: 'Salas de Reuniones - Sistemas',
  		rol: true,
  		prioridad:3,
  		roles: ['salasreuniones','salasreuniones.crearEditarSalas','salasreuniones.crearEditarReuniones','salasreuniones.eliminarSalas','salasreuniones.eliminarReuniones','salasreuniones.administrador']
	},
	// Permiso obligatorio al final de acceso
	{
  		name: 'Salas de Reuniones - Acceso',
  		key: 'salasreuniones',
  		rol: false
	}
];