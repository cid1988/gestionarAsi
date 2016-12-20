exports = module.exports = [{
    name: 'CGestion',
    collectionName: 'cgestion',
    url: '/cgestion/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/cgestion'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/cgestion','/cgestion/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
},{
    name: 'PlantillaCGestion',
    collectionName: 'cgestion.plantillas',
    url: '/cgestion.plantillas/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/cgestion.plantillas'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/cgestion.plantillas','/cgestion.plantillas/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];