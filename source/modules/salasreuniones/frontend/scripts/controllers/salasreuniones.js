
angular.module('bag2.salasreuniones', [])
.value('SRRolesPorKey', function() {
    return rolesPorKey;
}).value('SRTiposAsistenciaPorKey', function() {
    return tiposAsistenciaPorKey;
});