angular.module('bag2.forms', []).directive('forminput', function() {
    return {
        require: '?ngModel',
        restrict: 'E',
        compile: function(element, attrs) {
            if (attrs.title) {
                var htmlText = '<div class="control-group ' + '">' + '<label class="control-label">' + attrs['title'] + ':</label>' + '<div class="controls">' + (attrs.hasOwnProperty('lines') ? '<textarea style="width:100%"' : '<input ' + ((attrs.hasOwnProperty('fullwidth') && 'style="width: 100%"') || '') + 'class="' + ((attrs.hasOwnProperty('span') && 'span' + attrs.span) || 'span6') + '"') + (attrs.hasOwnProperty('required') ? ' required ' : '') + 'placeholder="' + attrs['placeholder'] + '" ' + (attrs.hasOwnProperty('readOnly') ? ' disabled ' : '') + (attrs.hasOwnProperty('password') ? ' type="password" ' : ' type="text" ') + (attrs.hasOwnProperty('date') ? ' datepicker=\"{&quot;format&quot;: &quot;dd/mm/yyyy&quot;}\" ' : '') + 'ng-model="' + attrs['ngModel'] + '" ' + 'name="' + (attrs.hasOwnProperty('name') ? attrs['name'] : attrs['ngModel']) + '" ' + (attrs.hasOwnProperty('lines') ? ' rows="' + attrs['lines'] + '" ' : '') + '>' + (attrs.hasOwnProperty('lines') ? '</textarea>' : '</input>') + '</div>' + '</div>';
                element.replaceWith(htmlText);
            }
            else {
                var htmlText = (attrs.hasOwnProperty('lines') ? '<textarea style="width:100%"' : '<input ' + ((attrs.hasOwnProperty('fullwidth') && 'style="width: 100%"') || '') + 'class="' + ((attrs.hasOwnProperty('span') && 'span' + attrs.span) || 'span6') + '"') + (attrs.hasOwnProperty('required') ? ' required ' : '') + 'placeholder="' + attrs['placeholder'] + '" ' + (attrs.hasOwnProperty('readOnly') ? ' disabled ' : '') + (attrs.hasOwnProperty('password') ? ' type="password" ' : ' type="text" ') + (attrs.hasOwnProperty('date') ? ' datepicker=\"{&quot;format&quot;: &quot;dd/mm/yyyy&quot;}\" ' : '') + 'ng-model="' + attrs['ngModel'] + '" ' + 'name="' + (attrs.hasOwnProperty('name') ? attrs['name'] : attrs['ngModel']) + '" ' + (attrs.hasOwnProperty('lines') ? ' rows="' + attrs['lines'] + '" ' : '') + '>' + (attrs.hasOwnProperty('lines') ? '</textarea>' : '</input>');
                element.replaceWith(htmlText);
            }
        }
    };
}).directive('yesno', function() {
    return {
        require: '?ngModel',
        restrict: 'E',
        locals: {
            'title': '@title',
            'tristate': '@tristate',
            'read-only': '@read-only'
        },
        compile: function(element, attrs) {
            var readonly = attrs.readOnly;
            var htmlText = (((attrs.title !== undefined) && '<div class="control-group"><label class="control-label">' + attrs.title + ':</label><div class="controls">') || '') + '<div class="btn-group" data-toggle="buttons-radio">' + '<button ' + (((readonly === undefined) && ('ng-click="' + attrs.ngModel + ' = \'si\'"')) || '') + ' ng-class="(' + attrs.ngModel + '==\'si\') && \'active btn-info\'" type="button" class="btn' + ((attrs.hasOwnProperty('readOnly') && ' disabled') || '') + '">Si</button>' + '<button ' + (((readonly == undefined) && ('ng-click="' + attrs.ngModel + ' = \'no\'"')) || '') + ' ng-class="(' + attrs.ngModel + '==\'no\') && \'active btn-info\'" type="button" class="btn' + ((attrs.hasOwnProperty('readOnly') && ' disabled') || '') + '">No</button>' + ((attrs.hasOwnProperty('tristate')) && '<button ' + (((readonly == undefined) && ('ng-click="' + attrs.ngModel + ' = \'noAplica\'"')) || '') + ' ng-class="(' + attrs.ngModel + '==\'noAplica\') && \'active btn-info\'"type="button" class="btn' + ((attrs.hasOwnProperty('readOnly') && ' disabled') || '') + '"' + '">No aplica</button>') + '</div>' + (((attrs.title !== undefined) && '</div></div>') || '');

            element.replaceWith(htmlText);
        }
    };
}).directive('compliance', function() {
    return {
        require: '?ngModel',
        restrict: 'E',
        locals: {
            'title': '@title',
            'tristate': '@tristate',
            'readonly': '@readonly'
        },
        compile: function(element, attrs) {
            var readonly = attrs.readonly;
            var htmlText = (((attrs.title !== undefined) && '<div class="control-group"><label class="control-label">' + attrs.title + ':</label><div class="controls">') || '') + '<div class="btn-group" data-toggle="buttons-radio">' + '<button ' + (((readonly === undefined) && ('ng-click="' + attrs.ngModel + ' = \'si\'"')) || '') + ' ng-class="(' + attrs.ngModel + '==\'si\') && \'active btn-success\'" type="button" class="btn' + ((attrs.hasOwnProperty('readonly') && ' disabled') || '') + '">Cumple</button>' + '<button ' + (((readonly === undefined) && ('ng-click="' + attrs.ngModel + ' = \'no\'"')) || '') + ' ng-class="(' + attrs.ngModel + '==\'no\') && \'active btn-danger\'" type="button" class="btn' + ((attrs.hasOwnProperty('readonly') && ' disabled') || '') + '">No cumple</button>' + ((attrs.hasOwnProperty('tristate')) && '<button ' + (((readonly === undefined) && ('ng-click="' + attrs.ngModel + ' = \'noAplica\'"')) || '') + ' ng-class="(' + attrs.ngModel + '==\'noAplica\') && \'active btn-success\'"type="button" class="btn' + ((attrs.hasOwnProperty('readonly') && ' disabled') || '') + '"' + '">No requiere</button>') + '</div>' + (((attrs.title !== undefined) && '</div></div>') || '');
            element.replaceWith(htmlText);
        }
    };
}).directive('popselect', function($compile, $timeout) {
    return {
        require: '?ngModel',
        restrict: 'A',
        replace: true,
        locals: {
            'title': '@title',
            'itemText': '@itemText',
            'source': '@source',
            'target': '@target',
            'single': '@single'
        },
        scope: true,
        link: function(scope, element, attrs, controller) {
            element.bind("click", function() {
                var s = scope.$new();

                s.title = attrs.title;

                var html = '<div class="modal hide fade"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h3>{{title}}</h3></div><div class="modal-body"><input class="searchFilter" type="text" placeholder="Buscar..." ng-model="filter.text" style="width: 515px" /><ul style="list-style-type: none;margin-left: 0;height: 300px; margin-bottom: 0;overflow-y: scroll;"><li style="margin-bottom: 4px" ng-repeat="item in source | filter:filter"><a style="margin-right: 4px" class="btn btn-small" ng-class="item.selected && \'btn-success active\'" ng-click="select(item)">&nbsp;</a>{{item.original.' + attrs.itemtext + '}}</li></ul><div class="modal-footer"><a data-dismiss="modal" class="btn">Cancelar</a>' + (((!attrs.hasOwnProperty('single')) && '<a ng-click="accept()" class="btn btn-success"><i class="icon-ok icon-white" ></i> Aceptar</a>') || '') + '</div></div>';
                var e = $compile(angular.element(html))(s);

                var setProperty = function(target, prop, value) {
                    var parts = prop.split(".");

                    while (parts.length > 1) {
                        var local = parts.shift();

                        target[local] = target[local] || {};
                        target = target[local];
                    }
                    target[parts.shift()] = value;
                };

                s.select = function(item) {
                    if (attrs.hasOwnProperty('single')) {
                        setProperty(scope.$parent, attrs.target, item.original);
                        e.modal('hide');
                    }
                    else {
                        item.selected = !item.selected;
                    }
                };
                s.accept = function() {
                    var newTarget = [];
                    s.source.forEach(function(item) {
                        if (item.selected) {
                            newTarget.push(item.original);
                        }
                    });

                    setProperty(scope.$parent, attrs.target, newTarget);

                    e.modal('hide');
                };
                var updateItems = function() {
                    var source = scope.$eval(attrs.source);
                    var newSource = [];

                    if (source) {
                        var target = scope.$eval(attrs.target);

                        source.forEach(function(item) {
                            var selected = false;
                            if (!attrs.hasOwnProperty('single')) {
                                if (target && target instanceof Array) {
                                    target.forEach(function(selectedItem) {
                                        if ((selectedItem == item) || (selectedItem._id && (selectedItem._id == item._id))) {
                                            selected = true;
                                        }
                                    });
                                }
                            }
                            else if (target == item) {
                                selected = true;
                            }

                            newSource.push({
                                original: item,
                                selected: selected,
                                text: item[attrs.itemtext]
                            });
                        });
                    }
                    else {
                        s.source = [];
                    }

                    s.source = newSource;
                };

                scope.$watch(attrs.source, updateItems);
                updateItems();

                $timeout(function() {
                    e.modal('show').on('shown', function() {
                        e.find('.searchFilter').focus();
                    });
                });
            });
        }
    };
}).directive('formselect', function() {
    return {
        require: '?ngModel',
        restrict: 'E',
        compile: function(element, attrs) {
            var textMember = attrs.hasOwnProperty('textmember') ? attrs.textmember : 'nombre';
            var htmlText = (attrs.hasOwnProperty('title') ? '<div class="control-group">' + '<label class="control-label">' + attrs.title + ':</label>' + '<div class="controls">' : '') + '<div class="btn-group">' + '<a class="btn dropdown-toggle ' + ((!attrs.hasOwnProperty('span') && 'span3') || ('span' + attrs.span)) + '" data-toggle="dropdown" href="#" ' + 'ng-model="' + attrs.ngModel + '"' + '>' + '<span ng-hide="' + attrs.ngModel + '">' + attrs.placeholder + '</span>' + '{{' + attrs.ngModel + '.' + textMember + '}}' + '<span class="caret pull-right"></span>' + '</a>' + '<ul class="dropdown-menu">' + '<li ng-repeat="i in ' + attrs.source + '">' + '<a tabindex="-1"' + ' ng-click="' + attrs.ngModel + '=i" ' + 'href="javascript:">' + '{{i.' + textMember + '}} ' + '</a>' + '</li>' + '</ul>' + (attrs.hasOwnProperty('title') ? '</div>' + '</div>' + '</div>' : '');
            element.replaceWith(htmlText);

            return function($scope, element, attrs, ngModelCtrl) {
                var val = $scope.$eval(attrs.ngModel);

                if (attrs.hasOwnProperty('required')) {
                    var isValid = val && val._id !== undefined;

                    ngModelCtrl.$setValidity('required',
                    isValid);

                    var toggle = element.find('.dropdown-toggle');
                    if (isValid) {
                        toggle.removeClass('ng-invalid');
                        toggle.addClass('ng-valid');
                    }
                    else {
                        toggle.removeClass('ng-valid');
                        toggle.addClass('ng-invalid');
                    }
                }

                $scope.$watch(attrs.ngModel, function(newValue, oldValue) {
                    if (attrs.hasOwnProperty('required')) {
                        var val = newValue;
                        var isValid = val && val._id && val._id !== 0;
                        var toggle = element.find('.dropdown-toggle');
                        if (isValid) {
                            toggle.removeClass('ng-invalid');
                            toggle.addClass('ng-valid');
                        }
                        else {
                            toggle.removeClass('ng-valid');
                            toggle.addClass('ng-invalid');
                        }

                        ngModelCtrl.$setValidity('required',
                        isValid);
                    }
                });
            };
        }
    };
}).directive('openlayers', function($timeout) {
    var updateExtent = function(map, extent) {
        if (map) {
            if (map.getNumLayers() > 0) {
                if (extent) {
                    map.zoomToExtent(extent, true);
                }
                else {
                    map.zoomToExtent(new OpenLayers.Bounds(-6555979.5748401, - 4125512.2276949, - 6451566.5942213, - 4100135.1343087), true);
                }
            }
        }
    };

    return {
        restrict: 'A',
        require: '?ngModel',
        scope: {
            model: '=ngModel',
            markers: '=markers',
            features: '=olFeatures',
            extent: '=olExtent',
            selectedIndexes: '=olSelectedIndexes',
            style: "=olStyle",
            currentTool: '=currentTool'
        },
        link: function(scope, element, attrs, ngModelCtrl) {
            var format = new OpenLayers.Format.WKT(),
                vectors,
                drawControls,
                options = {
                    maxResolution: 0.58,
                    units: 'm',
                    maxExtent: new OpenLayers.Bounds(-6555979.5748401, - 4125512.2276949, - 6451566.5942213, - 4100135.1343087),
                    restrictedExtent: new OpenLayers.Bounds(-6555979.5748401, - 4125512.2276949, - 6451566.5942213, - 4100135.1343087),
                    controls: [
                    new OpenLayers.Control.PanZoom(),
                    new OpenLayers.Control.Navigation(),
                    new OpenLayers.Control.ArgParser(),
                    new OpenLayers.Control.Attribution()],
                    projection: new OpenLayers.Projection("EPSG:900913"),
                    displayProjection: new OpenLayers.Projection("EPSG:4326"),
                },
                map = new OpenLayers.Map(attrs.id, options),
                updateFromModel = function() {
                    $timeout(function() {
                        var boundModel = scope.$eval(attrs.ngModel);
                        if (vectors) {
                            vectors.removeFeatures(vectors.features);
                            vectors.selectedFeatures = [];

                            var features = scope.features;
                            if (features) {
                                for (var i = 0; i < features.length; i++) {
                                    var feature = format.read(features[i].wkt);

                                    if (feature) {
                                        feature.attributes = angular.copy(features[i].attributes);

                                        var pointMatches = features[i].wkt.match(/POINT[^)]*\)/gi);
                                        for (var k = 0; k < pointMatches.length; k++) {
                                            var coordMatches = pointMatches[k].match(/[-\d\.]+/gi);

                                            var lon = coordMatches[0];
                                            var lat = coordMatches[1];

                                            var lonLat = new OpenLayers.LonLat(lon, lat).transform(
                                            options.displayProjection, options.projection);

                                            var pointFeature = new OpenLayers.Feature.Vector(
                                            new OpenLayers.Geometry.Point(lonLat.lon,
                                            lonLat.lat), null);

                                            pointFeature.attributes = feature.attributes;

                                            vectors.addFeatures(pointFeature);
                                        }

                                        if (scope.selectedIndexes !== undefined && scope.selectedIndexes instanceof Array) {
                                            scope.selectedIndexes.forEach(function(index) {
                                                if (index == i) vectors.selectedFeatures.push(feature);
                                            });

                                            for (var j = 0; j < scope.selectedIndexes.length; j++) {
                                                if (scope.selectedIndexes[j] == i) {
                                                    vectors.selectedFeatures.push(feature);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            vectors.redraw();
                        }

                        updateExtent(map, scope.extent);
                    });
                };

            map.events.register("moveend", map, function(evt) {
                if ((!scope.extent) || !scope.extent.equals(map.getExtent()) || (JSON.toString(scope.extent) != JSON.toString(map.getExtent()))) {
                    scope.extent = map.getExtent();
                }
            });
            map.events.register("move", map, function(evt) {
                if ((!scope.extent) || !scope.extent.equals(map.getExtent()) || (JSON.toString(scope.extent) != JSON.toString(map.getExtent()))) {
                    scope.extent = map.getExtent();
                }
            });

            scope.$watch('features', function(newValue, oldValue) {
                updateFromModel();
            }, true);
            scope.$watch('selectedIndexes', function(newValue, oldValue) {
                updateFromModel();
            }, true);
            scope.$on('openlayers-updateSize', function() {
                map.updateSize();
            });

            scope.$watch('extent', function(newValue, oldValue) {
                if (newValue != oldValue && !(newValue && newValue.equals(oldValue))) {
                    updateExtent(map, newValue);
                }
                console.log(scope.extent);
            });

            $timeout(function() {
                var tiles_url = "/api/tiles/";

                var tilelite_layer = new OpenLayers.Layer.OSM("Ciudad de Buenos Aires", tiles_url + '${z}/${x}/${y}.png');
                tilelite_layer.attribution = "";

                var vectorAttrs = {};

                vectors = new OpenLayers.Layer.Vector("Vector Layer", vectorAttrs);

                scope.$watch('style', function(newValue) {
                    vectors.addOptions({
                        styleMap: new OpenLayers.StyleMap(newValue)
                    });

                    vectors.redraw();
                }, true);

                var markersLayer = new OpenLayers.Layer.Markers('markers', {});

                scope.$watch('markers', function(newValue) {
                    $timeout(function() {
                        for (var i = markersLayer.markers.length; i >= 0; i--) {
                            if (markersLayer.markers[i]) {
                                markersLayer.removeMarker(markersLayer.markers[i]);
                            }
                        }

                        if (newValue) {
                            newValue.forEach(function(marker) {
                                var size = new OpenLayers.Size(marker.size.w, marker.size.h);
                                var offset = new OpenLayers.Pixel(marker.offset.x, marker.offset.y);
                                var icon = new OpenLayers.Icon(marker.src, size, offset);
                                var format = new OpenLayers.Format.WKT();
                                var geom = format.read(marker.wkt);

                                if (geom && geom.geometry) geom.geometry.transform(options.displayProjection, options.projection);

                                markersLayer.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(geom.geometry.x, geom.geometry.y), icon));
                            });
                        }

                        markersLayer.redraw();
                    });
                }, true);

                map.addLayers([tilelite_layer, vectors, markersLayer]);
                drawControls = {
                    point: new OpenLayers.Control.DrawFeature(
                    vectors, OpenLayers.Handler.Point),
                    line: new OpenLayers.Control.DrawFeature(
                    vectors, OpenLayers.Handler.Path),
                    polygon: new OpenLayers.Control.DrawFeature(
                    vectors, OpenLayers.Handler.Polygon),
                    clickselect: new OpenLayers.Control.SelectFeature(
                    vectors, {
                        clickout: false,
                        toggle: false,
                        multiple: false,
                        hover: false,
                        toggleKey: "ctrlKey",
                        multipleKey: "shiftKey",
                    }),
                    boxselect: new OpenLayers.Control.SelectFeature(
                    vectors, {
                        clickout: false,
                        toggle: false,
                        multiple: false,
                        hover: false,
                        toggleKey: "ctrlKey", // ctrl key removes from selection
                        multipleKey: "shiftKey", // shift key adds to selection
                        box: true
                    }),
                    selecthover: new OpenLayers.Control.SelectFeature(
                    vectors, {
                        multiple: false,
                        hover: true,
                        toggleKey: "ctrlKey", // ctrl key removes from selection
                        multipleKey: "shiftKey" // shift key adds to selection
                    })
                };

                scope.$watch('currentTool', function(newValue, oldValue) {
                    if (newValue == 'point') {
                        drawControls.point.activate();
                    }
                    else {
                        drawControls.point.deactivate();
                    }

                    if (newValue == 'line') {
                        drawControls.line.activate();
                    }
                    else {
                        drawControls.line.deactivate();
                    }

                    if (newValue == 'polygon') {
                        drawControls.polygon.activate();
                    }
                    else {
                        drawControls.polygon.deactivate();
                    }

                    if (newValue == 'boxselect') {
                        drawControls.boxselect.activate();
                    }
                    else {
                        drawControls.boxselect.deactivate();
                    }

                    if (newValue == 'clickselect') {
                        drawControls.clickselect.activate();
                    }
                    else {
                        drawControls.clickselect.deactivate();
                    }
                });


                drawControls.point.events.on({
                    'featureadded': function(event) {
                        var cloned = event.feature.clone();

                        cloned.geometry.transform(
                        options.projection, options.displayProjection);

                        scope.$emit('newFeature', cloned, format.write(cloned));
                        vectors.removeFeatures([event.feature]);
                    }
                });
                drawControls.line.events.on({
                    'featureadded': function(event) {
                        scope.$emit('newFeature', event.feature, format.write(event.feature));
                        vectors.removeFeatures([event.feature]);
                    }
                });
                drawControls.polygon.events.on({
                    'featureadded': function(event) {
                        scope.$emit('newFeature', event.feature, format.write(event.feature));
                        vectors.removeFeatures([event.feature]);
                    }
                });

                for (var key in drawControls) {
                    map.addControl(drawControls[key]);
                }

                vectors.events.on({
                    'featureselected': function(event) {
                        var selected = [];
                        if (scope.features) {
                            for (var j = 0; j < event.feature.layer.features.length; j++) {
                                if (event.feature.layer.selectedFeatures.indexOf(event.feature.layer.features[j]) >= 0) {
                                    selected.push(j);
                                }
                            }
                        }
                        scope.$emit('selectionChanged', selected);
                        scope.$digest();
                    }
                });

                updateFromModel();
            });

            scope.$watch('model', function(newValue) {
                newValue.zoomOut = function() {
                    map.zoomOut();
                };
                newValue.extentFor = function(feature) {
                    if (feature && feature.wkt) {
                        var geom = format.read(feature.wkt)[0].geometry;

                        geom.transform(options.displayProjection, options.projection);
                        geom.calculateBounds();

                        return geom.bounds;
                    }
                    else return undefined;
                };
            });
        }
    };
}).directive('buttonToggle', function($timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, element, attr, ctrl) {
            var classToToggle = attr.buttonToggle;
            element.bind('click', function() {
                var checked = ctrl.$viewValue;
                $scope.$apply(function(scope) {
                    ctrl.$setViewValue(!checked);
                });
            });

            $scope.$watch(attr.ngModel, function(newValue, oldValue) {
                $timeout(function() {
                    element.toggleClass(classToToggle, newValue);
                });
            });
        }
    };
});