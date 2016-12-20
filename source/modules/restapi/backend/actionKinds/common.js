exports = module.exports = {
    noErr: function(err, res) {
        if (err) {
            console.log(err);
            res.status(503);
            res.end();
        }

        return !err;
    },
    checkAuth: function(action, req) {
        if (!action.allowed || (action.allowed && action.allowed.length === 0)) {
            return true;
        } else if (req.session && req.session.user && action.allowed && action.allowed.length > 0) {
            if (req.session.user.permissions) {
                for (var i = 0; i < action.allowed.length; i++) {
                    for (var j = 0; j < req.session.user.permissions.length; j++) {
                        if (action.allowed[i] == req.session.user.permissions[j]) {
                            return true;
                        }
                    }
                }
            }

            return false;
        }
    }
};