exports = module.exports = [{
	name: 'SalasReuniones',
	collectionName: 'salasreuniones',
	url: '/salasreuniones/:_id',
	params: {
		_id: '@_id'
	},
	actions: {
		list: {
			urls: ['/salasreuniones'],
			kind: 'find'
		},
		findById: {
			kind: 'findOne'
		},
		save: {
			urls: ['/salasreuniones','/salasreuniones/:_id'],
			kind: 'findAndModify'
		},
		delete: {
			kind: 'remove'
		}
	}
},{
	name: 'SalasReunionesPisos',
	collectionName: 'salasreuniones.pisos',
	url: '/salasreuniones.pisos/:_id',
	params: {
		_id: '@_id'
	},
	actions: {
		list: {
			urls: ['/salasreuniones.pisos'],
			kind: 'find'
		},
		findById: {
			kind: 'findOne'
		},
		save: {
			urls: ['/salasreuniones.pisos','/salasreuniones.pisos/:_id'],
			kind: 'findAndModify'
		},
		delete: {
			kind: 'remove'
		}
	}
},{
	name: 'SalasReunionesInstancia',
	collectionName: 'salasreuniones.instancias',
	url: '/salasreuniones.instancias/:_id',
	params: {
		_id: '@_id'
	},
	actions: {
		list: {
			urls: ['/salasreuniones.instancias'],
			kind: 'find'
		},
		findById: {
			kind: 'findOne'
		},
		save: {
			urls: ['/salasreuniones.instancias','/salasreuniones.instancias/:_id'],
			kind: 'findAndModify'
		},
		delete: {
			kind: 'remove'
		}
	}
},{
	name: 'SalasReunionesUsuariosPorPiso',
	collectionName: 'salasreuniones.usuariosPiso',
	url: '/salasreuniones.usuariosPiso/:_id',
	params: {
		_id: '@_id'
	},
	actions: {
		list: {
			urls: ['/salasreuniones.usuariosPiso'],
			kind: 'find'
		},
		findById: {
			kind: 'findOne'
		},
		save: {
			urls: ['/salasreuniones.usuariosPiso','/salasreuniones.usuariosPiso/:_id'],
			kind: 'findAndModify'
		},
		delete: {
			kind: 'remove'
		}
	}
}];