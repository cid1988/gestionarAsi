exports.arrayContains = function (a, obj) {
    var i = a.length;
    while (i--) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
};

var merge = function (obj1, obj2) {
    var objNew = {};

    for (var key in obj1) {
        objNew[key] = obj1[key];
    }

    for (var key2 in obj2) {
        if (obj2[key2] instanceof Array) {
            if (objNew[key2] !== undefined) {
                objNew[key2] = objNew[key2].concat(obj2[key2]);
            }
            else {
                objNew[key2] = obj2[key2];
            }
        }
        else {
            objNew[key2] = merge(objNew[key2], obj2[key2]);
        }
    }

    return objNew;
};

exports.merge = merge;

exports.flattenPermissions = function(user) {
    var flatPermissions = {};
    if (user.permisos) {
        user.permisos.forEach(function(permiso) {
            for (var entry in permiso) {
                if (entry != 'nombre' && entry != '_id') {
                    flatPermissions[entry] = true;
                }
            }
        });
    }
    user.flatPermissions = flatPermissions;

    return user;
};

exports.arrayUnique = function (array) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j]) a.splice(j, 1);
        }
    }

    return a;
};
