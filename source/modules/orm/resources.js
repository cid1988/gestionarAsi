exports = module.exports = [{
    name: 'ORMReunion',
    collectionName: 'orm.reuniones',
    url: '/orm.reuniones/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/orm.reuniones'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/orm.reuniones','/orm.reuniones/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},
{
    name: 'ORMGrupoReunion',
    collectionName: 'orm.gruposreuniones',
    url: '/orm.gruposreuniones/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/orm.gruposreuniones'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/orm.gruposreuniones','/orm.gruposreuniones/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},
{
    name: 'ORMServicios',
    collectionName: 'orm.servicios',
    url: '/orm.servicios/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/orm.servicios'],
            kind: 'find'
        },
        findByInstancia: {
            kind: 'findOne'
        },
        save: {
            urls: ['/orm.servicios','/orm.servicios/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ORMFechasEspeciales',
    collectionName: 'orm.fechasespeciales',
    url: '/orm.fechasespeciales/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/orm.fechasespeciales'],
            kind: 'find'
        },
        findByInstancia: {
            kind: 'findOne'
        },
        save: {
            urls: ['/orm.fechasespeciales','/orm.fechasespeciales/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ORMInstanciaReunion',
    collectionName: 'orm.reuniones.instancias',
    url: '/orm.reuniones.instancias/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/orm.reuniones.instancias'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/orm.reuniones.instancias','/orm.reuniones.instancias/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ORMTemario',
    collectionName: 'orm.temarios',
    url: '/orm.temarios/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/orm.temarios'],
            kind: 'find'
        },
        findByInstancia: {
            kind: 'findOne'
        },
        save: {
            urls: ['/orm.temarios','/orm.temarios/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ORMMinuta',
    collectionName: 'orm.minutas',
    url: '/orm.minutas/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/orm.minutas'],
            kind: 'find'
        },
        findByInstancia: {
            kind: 'findOne'
        },
        save: {
            urls: ['/orm.minutas','/orm.minutas/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ORMCita',
    collectionName: 'orm.citas',
    url: '/orm.citas/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/orm.citas'],
            kind: 'find'
        },
        findByInstancia: {
            kind: 'findOne'
        },
        save: {
            urls: ['/orm.citas','/orm.citas/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'ORMTema',
    collectionName: 'orm.temas',
    url: '/orm.temas/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/orm.temas'],
            kind: 'find'
        },
        findByInstancia: {
            kind: 'findOne'
        },
        save: {
            urls: ['/orm.temas','/orm.temas/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];