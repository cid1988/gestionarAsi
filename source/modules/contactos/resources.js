exports = module.exports = [{
    name: 'ORMContacto',
    collectionName: 'orm.contactos',
    url: '/orm.contactos/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/orm.contactos'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/orm.contactos','/orm.contactos/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},
{
    name: 'ORMContactoCaptura',
    collectionName: 'orm.contactos.capturas',
    url: '/orm.contactos.captura/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/orm.contactos.captura'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/orm.contactos.captura','/orm.contactos.captura/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];