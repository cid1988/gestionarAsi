angular.module('bag2.fullcalendar', []).directive('fullcalendar', function($timeout, $compile, $sanitize) {
    var quoteattr = function(s, preserveCR) {
        preserveCR = preserveCR ? '&#13;' : '\n';
        s = ('' + s) /* Forces the conversion to string. */
        .replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
        .replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
        .replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        /*
            You may add other replacements here for HTML only 
            (but it's not necessary).
            Or for XML, only if the named entities are defined in its DTD.
            */
.replace(/\r\n/g, preserveCR) /* Must be before the next replacement. */
        .replace(/[\r\n]/g, preserveCR);;
    };
    return {
        restrict: 'A',
        require: ['ngModel'],
        scope: {
            ngModel: '=',
            calendarObject: '='
        },
        link: function($scope, element, attributes) {
            var eventSource = angular.copy($scope.$eval('ngModel.events') || []);

            var model = $scope.ngModel;

            if (model) {
                model.element = element;
            }

            $scope.$watch('calendarObject', function(co) {
                if (co) {
                    co.goToDate = function(d) {
                        $(element).fullCalendar('gotoDate', d);
                    };
                }
            });

            model.refreshEvents = function() {
                element.fullCalendar('removeEventSource', eventSource);
                eventSource = angular.copy($scope.$eval('ngModel.events') || []);
                element.fullCalendar('addEventSource', eventSource);
                element.fullCalendar('rerenderEvents');
            };
            model.render = function() {
                $timeout(function() {
                    element.fullCalendar('render');
                });
            };
            var fc = angular.copy(model.viewConfig || {});
            angular.extend(fc, {
                firstHour: 9,
                snapMinutes: 15,
                monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado'],
                dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'],
                buttonText: {
                    prev: '&nbsp;&#9668;&nbsp;',
                    next: '&nbsp;&#9658;&nbsp;',
                    prevYear: '&nbsp;&lt;&lt;&nbsp;',
                    nextYear: '&nbsp;&gt;&gt;&nbsp;',
                    today: 'Hoy',
                    month: 'Mes',
                    week: 'Semana',
                    day: 'Dia'
                },
                titleFormat: {
                    month: 'MMMM yyyy',
                    week: "d [ yyyy]{ '&#8212;'[ MMM] d MMM yyyy}",
                    day: 'dddd, d MMM, yyyy'
                },
                columnFormat: {
                    month: 'ddd',
                    week: 'ddd d/M',
                    day: 'dddd d/M'
                },
                allDayText: '',
                axisFormat: 'H:mm',
                timeFormat: {
                    '': 'H(:mm)',
                    agenda: 'H:mm{ - H:mm}'
                }
            });
            fc.eventSources = [];
            var syncEvent = function(event) {
                if ($scope.ngModel && $scope.ngModel.events) {
                    var index = eventSource.indexOf(event);
                    if ($scope.ngModel.events[index]) {
                        $scope.ngModel.events[index].id = event.id;
                        $scope.ngModel.events[index].title = event.title;
                        $scope.ngModel.events[index].url = event.url;
                        $scope.ngModel.events[index].allDay = event.allDay;
                        $scope.ngModel.events[index].start = event.start;
                        $scope.ngModel.events[index].end = event.end;
                        $scope.ngModel.events[index].className = event.className;
                        $scope.ngModel.events[index].editable = event.editable;
                    }
                }
            };

            fc.eventDrop = function(event) {
                syncEvent(event);
                if (model.viewConfig && model.viewConfig.eventDrop) {
                    model.viewConfig.eventDrop(event);
                }
                $scope.$apply();
            };
            fc.eventResize = function(event) {
                syncEvent(event);
                if (model.viewConfig && model.viewConfig.eventResize) {
                    model.viewConfig.eventResize(event);
                }
                $scope.$apply();
            };
            fc.eventRender = function(event, element) {
                for (var k in event.css || {}) {
                    var v = event.css[k];
                    $(element).css(k, v);
                }
                if (event.html) {
                    $(element).find('.fc-event-inner').append($compile($('<div></div>').append($(event.html)).html())($scope.$new()));
                }
            };

            element.fullCalendar(fc);
            element.fullCalendar('addEventSource', eventSource);

            if ($scope.$parent.$modal) {
                $scope.$parent.$on('modal-shown', function() {
                    element.fullCalendar('render');
                });
            }
        }
    };
});