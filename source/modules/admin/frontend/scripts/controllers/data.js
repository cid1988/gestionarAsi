angular.module("bag2.admin.data", [])
.controller("DataManagementCtrl", function ($scope, $http, $location) {
    $http.get('/api/data/apps').success(function(data) {
        $scope.apps = [];
        for (var appName in data) {
            $scope.apps.push({
                name: appName,
                collections: data[appName]
            });
        }
    });

    $scope.export = function() {
        var selectedApps = [];

        $scope.apps.forEach(function(app) {
            if (app.backup) {
                selectedApps.push(app.name);
            }
        });

        $scope.working = true;

        $http.post('/api/data-management/backup', selectedApps).success(function(data) {
            $scope.alerts.push({
                type: 'sucess',
                htmlMessage: '<span style="display: block;padding-bottom: 10px;"><a href="' + data.url + '" target="_blank" ng-show="!done" class="btn btn-info pull-right"><i class="icon-download icon-white"></i>&nbsp;Descargar backup</a>Los datos están listos para ser descargados</span>'
            });
            $scope.working = false;
        }).error(function() {
            $scope.done = false;
            $scope.alerts.push({
                type: 'error',
                message: 'Ha ocurrido un error intentando exportar los datos.'
            });
            $scope.working = false;
        });
    };

    $scope.$watch('uploaded', function(newValue) {
        if (!newValue || !newValue.length) {
            return;
        }

        var v = newValue[newValue.length - 1];

        $http.get('/api/data-management/inspect-upload/' + v.id).success(function(data) {
            $scope.importData = data;
        });


        $scope.import = function() {
            $scope.working = true;
            var appsSelection = [];

            $scope.importData.apps.forEach(function(app) {
                if (app.restore) {
                    appsSelection.push(app.name);
                }
            });

            $http.post('/api/data-management/import-upload/' + v.id, appsSelection).success(function(data) {
                $scope.working = false;
                $scope.alerts.push({
                    type: 'success',
                    message: 'Se han importado exitosamente los datos'
                });
            }).error(function() {
                $scope.working = false;
                $scope.alerts.push({
                    type: 'error',
                    message: 'Ha ocurrido un error intentando importar los datos'
                });
            });
        };
    });
});