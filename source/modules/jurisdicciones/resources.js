exports = module.exports = [{
    name: 'Jurisdiccion',
    collectionName: 'jurisdicciones',
    url: '/jurisdicciones/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/jurisdicciones'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/jurisdicciones','/jurisdicciones/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];