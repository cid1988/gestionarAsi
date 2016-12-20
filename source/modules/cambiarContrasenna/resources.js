exports = module.exports = [{
    name: 'Users',
    collectionName: 'users',
    url: '/users/:username',
    params: 
    {
        username: '@username'
    },
    actions: 
    {
        list: 
        {
            urls: ['/users'],
            allowed: ['admin.users'],
            kind: 'find'
        },
        findByName: 
        {
            kind: 'findOne'
        },
        save: 
        {
            urls: ['/users','/users/:username'],
            kind: 'findAndModify'
        },
        delete: 
        {
            kind: 'remove'
        }
    }
}];