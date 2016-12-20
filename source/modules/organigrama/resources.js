exports = module.exports = [{
    name: 'ORMOrganigrama',
    collectionName: 'orm.organigrama',
    url: '/orm.organigrama/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/orm.organigrama'],
            kind: 'find'
        },
        findByInstancia: {
            kind: 'findOne'
        },
        save: {
            urls: ['/orm.organigrama','/orm.organigrama/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];