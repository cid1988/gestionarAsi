angular.module('bag2.pickDate',[]).factory('pickDate', function($modal) {
    return function($scope, events, newEventTitle, acceptCallback) {
        var modalScope = $scope.$new();
        var events = events;

        // Este es el único evento editable
        modalScope.nuevoEvento = {
            title: newEventTitle,
            editable: true,
            color: $scope.reunion.color
        };

        modalScope.aceptar = function() {
            // Llamo al callback con el resultado
            acceptCallback(modalScope.nuevoEvento);
        };

        modalScope.calendar = {
            events: events,
            viewConfig: {
                height: 450,
                editable: true,
                defaultView: 'agendaWeek',
                header: {
                    left: 'month agendaWeek',
                    center: 'title',
                    right: 'today prev,next'
                },
                dayClick: function(date, allDay, c, d) {
                    // Si es la primera vez que hacemos click,
                    // el evento no está en la lista y hay que agregarlo
                    if (events.indexOf(modalScope.nuevoEvento) == -1) {
                        events.push(modalScope.nuevoEvento);
                    }

                    // actualizamos la fecha de inicio
                    modalScope.nuevoEvento.start = date;
                    
                    // no hay eventos todo un día, el alcance es manejar
                    // reuniones
                    modalScope.nuevoEvento.allDay = false;

                    // así informamos a la directiva del calendario
                    // que refresque la vista
                    modalScope.calendar.refreshEvents();
                }
            }
        };

        $modal({
            template: '/views/orm/calendario/elegirFecha.html',
            persist: true,
            show: true,
            backdrop: 'static',
            scope: modalScope
        });
    };
});
