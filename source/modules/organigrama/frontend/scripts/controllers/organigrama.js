angular.module('bag2.orm.organigrama', []).controller('ORMOrganigrama', function($scope, Contactos, $location, $rootScope, ORMContacto, ORMOrganigrama, ORMListaTratamiento, ORMListaNiveles, ORMListaCategorias, $modal) {//ABM Organigrama
    //Listado para el campo tratamiento
    $scope.listaTratamiento = ORMListaTratamiento();
    
    //Query organigrama para listado sin css
    $scope.organi = ORMOrganigrama.query();
    
    //Listado para el campo nivel
    $scope.listaNiveles = ORMListaNiveles();
    
    //Listado para el campo categoria
    $scope.listaCategorias = ORMListaCategorias();
    
    //Modal De vista de detalle y edicion de la reparticion
    $scope.modalDetalle = function(confirmado, r) {
        if (confirmado) {
            var subniveles = $scope.organi.subniveles || [];
            
            delete $scope.organi.subniveles;
            $scope.organi.$save(function (){
                $scope.organi.subniveles = subniveles;
            });
        }
        else {
            $scope.organi = ORMOrganigrama.get({_id: r}, function () {
                $modal({template: '/views/orm/organigrama/modalDetalleOrganigrama.html', persist: true, show: true, scope: $scope.$new()});
            });
        }
    };
    
    $scope.organigrama = ORMOrganigrama.query(function() {
        var orgDict = {};
        var org = $scope.organigrama;
        $scope.raices = [];
        
        for (var i = 0; i < org.length; i++) {
            orgDict[org[i]._id] = org[i];
        }
        
        $scope.fueraNivel = [];
        
        for (var _id in orgDict) {
            var jur = orgDict[_id];
            
            if (jur.superiorInmediato && jur.superiorInmediato) {
                var sup = orgDict[jur.superiorInmediato];
                
                if (!sup) {
                    console.log('No se encontró la jursidicción [' +  jur.superiorInmediato + '], que debería ser el superior inmediato de [' + jur._id + ']');
                } else {
                    if (!sup.subniveles) {
                        sup.subniveles = [];
                    }
                    
                    if (jur.categoria == 'Fuera nivel') {
                        $scope.fueraNivel.push(jur);
                    } else {
                        sup.subniveles.push(jur);
                    }
                }
            }
        }
        
        for (_id in orgDict) {
            if (orgDict[_id].superiorInmediato) {
                delete orgDict[_id];
            } else {
                $scope.raices.push(orgDict[_id]);
            }
        }
    });
    
//Detalle de la reparticion---------------------------------------------------------------------
}).controller('ORMDetalleOrganigrama', function($scope, $routeParams, $location, ORMListaNiveles, ORMListaCategorias, ORMOrganigrama) {//ABM Organigrama
    //Query de organigrama y el id del campo superiorInmediato
    $scope.organigrama = ORMOrganigrama.get({_id: $routeParams._id}, function(){
        $scope.superiorInmediato = ORMOrganigrama.get({_id: $scope.organigrama.superiorInmediato});
    });
    
    $scope.data = {
        cantidad : '',
        presupuesto : '',
        fecha : ''
    };
    
    //Query de organigrama
    $scope.organigramaSuperior = ORMOrganigrama.query();
    
    //Listado para el campo nivel
    $scope.listaNiveles = ORMListaNiveles();
    
    //Listado para el campo categoria
    $scope.listaCategorias = ORMListaCategorias();
    
    $scope.agregar = function() {
        if (!$scope.organigrama.empleados) {
            $scope.organigrama.empleados = [];
        }
        $scope.organigrama.empleados.push($scope.data);
        $scope.data = {
            cantidad : '',
            presupuesto : '',
            fecha : ''
        };
    };
    
    //Habilitar edicion
    $scope.editar = function() {
        $scope.editando = true;
        $scope.organigrama = angular.copy($scope.organigrama);
    };
    
    //Eliminar una reparticion
    $scope.eliminar = function(confirmado) {
        if (confirmado){
            $scope.organigrama.$delete(function() {
                $location.path('/organigrama');
            });
        }
        else {
            $("#modalEliminar").modal('show');
        }
    };
    
    //Guardar detalles
    $scope.guardar = function() {
        $scope.organigrama.superiorInmediato = $scope.organigrama.superiorInmediato,
        $scope.organigrama.$save(function() {
            $scope.editando = false;
        });
    };
    
    //Cancelar la vista del detalle
    $scope.cancelar = function() {
        $scope.editando = false;
        $location.path('/organigrama');
    };
    
    
    $scope.jurisdiccionPorId = function (id) {
        for (var i = 0; i < $scope.organigramaSuperior.length; i++) {
            if ($scope.organigramaSuperior[i]._id == id){
                return $scope.organigramaSuperior[i];
            }
        }
    };
    
//Nueva reparticion-------------------------------------------------------------------------------------------
}).controller('ORMNuevoOrganigrama', function($scope, $location, ORMListaTratamiento, ORMOrganigrama, ORMListaNiveles, ORMListaCategorias) {
    //Listado para el campo tratamiento
    $scope.listaTratamiento = ORMListaTratamiento();
    
    $scope.data = {
        cantidad : '',
        presupuesto : '',
        fecha : ''
    };
        
    //Nuevo organigrama
    $scope.organi = new ORMOrganigrama();
    
    //Query del organigrama
    $scope.organigrama = ORMOrganigrama.query();
    
    //Listado para el campo nivel
    $scope.listaNiveles = ORMListaNiveles();
    
    //Listado para el campo categoria
    $scope.listaCategorias = ORMListaCategorias();
    
    //Probando guardando id
    $scope.guardar = function() {
        //if ($scope.organi.nombreCompleto.length) {
            $scope.superiorInmediato = $scope.organigrama.superiorInmediato,
            $scope.organi.$save(function() {
                $location.path('/organigrama');
            });
        //}
    };
    
    //Cancelar vista de nueva reparticion
    $scope.cancelar = function() {
        $location.path('/organigrama');
        $scope.verNuevo=false;
    };
    
    $scope.agregar = function() {
        if (!$scope.organi.empleados) {
            $scope.organi.empleados = [];
        }
        $scope.organi.empleados.push($scope.data);
        $scope.data = {
            cantidad : '',
            presupuesto : '',
            fecha : ''
        };
    };
    
    //Mostrar formulario de carga de nueva reparticion
    $scope.mostrarNuevo = function() {
        $scope.tab='reparticion';
        $scope.verNuevo=true;
    };
    
//-----------------------------------------------------------------------------------------------
}).value('ORMListaNiveles', function() {
    return [{
            nombre: 'Ministerio'
        }, {
            nombre: 'Secretaría'
        }, {
            nombre: 'Subsecretaría'
        }, {
            nombre: 'Dirección general'
        },
    ];
}).value('ORMListaCategorias', function() { //
    return  [{
            nombre: 'Jurisdiccion'
        }, {
            nombre: 'Fuera nivel'
        }, {
            nombre: 'UAI'
        }, {
            nombre: 'UPE'
        }, {
            nombre: 'Agencias'
        },
    ];
}).controller('myController', function ($scope,ORMOrganigrama,$location) {
    
    $scope.index = 10;
    $scope.Message = "";
    var options = {};
    var items = [];
    
    $scope.organigrama = ORMOrganigrama.query({},function(){
        $scope.organigrama.forEach(function(org){
            var vertical = "";
            if(org.nivel == "Subsecretaría"){
                vertical = primitives.common.ChildrenPlacementType.Vertical
            }else{
                vertical = primitives.common.ChildrenPlacementType.Horizontal
            }
            items.push(
                new primitives.orgdiagram.ItemConfig({
                   id: org._id,
                   parent: org.superiorInmediato,
                   title: org.nombreCompleto,
                   itemTitleColor: $scope.setColor(org.nivel),
                   childrenPlacementType: vertical
                })
            );
        });
    });
    
    $scope.setColor=function(nivel){
        if(nivel=="Ministerio"){
            return "#b5d9ea";
        }
        else if(nivel=="Secretaría"){
            return "#b8da83";
        }
        else if(nivel=="Subsecretaría"){
            return "#e3ca4b";
        }
        else if(nivel=="Dirección general"){
            return "#ff8b4c";
        }
        else{
            return "#b3b3b3";
        }
    };
    // var items = [
    //   new primitives.orgdiagram.ItemConfig({
    //       id: 0,
    //       parent: null,
    //       title: "Scott Aasrud",
    //       description: "Root",
    //       phone: "1 (416) 001-4567",
    //       email: "scott.aasrud@mail.com",
    //       image: "demo/images/photos/a.png",
    //       itemTitleColor: primitives.common.Colors.RoyalBlue
    //   })
    // ];
    
    options.items = items;
    options.cursorItem = 0;
    options.highlightItem = 0;
    options.hasSelectorCheckbox = primitives.common.Enabled.False;
    options.templates = [getContactTemplate()];
    options.defaultTemplateName = "contactTemplate";

    $scope.myOptions = options;

    // $scope.setCursorItem = function (item) {
    //   $scope.myOptions.cursorItem = item;
    // };

    // $scope.setHighlightItem = function (item) {
    //   $scope.myOptions.highlightItem = item;
    // };

    // $scope.deleteItem = function (index) {
    //   $scope.myOptions.items.splice(index, 1);
    // }

    // $scope.addItem = function (index, parent) {
    //   var id = $scope.index++;
    //   $scope.myOptions.items.splice(index, 0, new primitives.orgdiagram.ItemConfig({
    //       id: id,
    //       parent: parent,
    //       title: "New title " + id,
    //       description: "New description " + id,
    //       image: "demo/images/photos/b.png"
    //   }));
    // }

    $scope.onMyCursorChanged = function (){
       //$scope.Message = "onMyCursorChanged";
    }

    $scope.onMyHighlightChanged = function () {
       $scope.Message = "onMyHighlightChanged";
    }
    
    function getContactTemplate() {
       var result = new primitives.orgdiagram.TemplateConfig();
       result.name = "contactTemplate";

       result.itemSize = new primitives.common.Size(130, 45);
       result.minimizedItemSize = new primitives.common.Size(5, 5);
       result.minimizedItemCornerRadius = 5;
       result.highlightPadding = new primitives.common.Thickness(2, 2, 2, 2);
       
       var itemTemplate = jQuery(
        '<div class="bp-item bp-corner-all bt-item-frame">'
           + '<div name="titleBackground" class="bp-item bp-corner-all bp-title-frame" style="background: {{itemConfig.itemTitleColor}}; top: 2px; left: 2px; width: 125px; height: 40px;">'
                + '<div name="title" title="{{itemConfig.title}}" class="bp-item bp-title" style="background: {{itemConfig.itemTitleColor}};height: 100%; padding:2px 5px 0 5px; text-align:center !important; width:95%">{{itemConfig.title}}</div>'
           + '</div>'
        + '</div>'
       ).css({
           width: result.itemSize.width + "px",
           height: result.itemSize.height + "px"
       }).addClass("bp-item bp-corner-all bt-item-frame");
       result.itemTemplate = itemTemplate.wrap('<div>').parent().html();
       return result;
    }
}).directive('bpOrgDiagram', function ($compile) {
    function link(scope, element, attrs) {
       var itemScopes = [];

       var config = new primitives.orgdiagram.Config();
       angular.extend(config, scope.options);

       config.onItemRender = onTemplateRender;
       config.onCursorChanged = onCursorChanged;
       config.onHighlightChanged = onHighlightChanged;

       var chart = jQuery(element).orgDiagram(config);

       scope.$watch('options.highlightItem', function (newValue, oldValue) {
           var highlightItem = chart.orgDiagram("option", "highlightItem");
           if (highlightItem != newValue) {
               chart.orgDiagram("option", { highlightItem: newValue });
               chart.orgDiagram("update", primitives.orgdiagram.UpdateMode.PositonHighlight);
           }
       });

       scope.$watch('options.cursorItem', function (newValue, oldValue) {
           var cursorItem = chart.orgDiagram("option", "cursorItem");
           if (cursorItem != newValue) {
               chart.orgDiagram("option", { cursorItem: newValue });
               chart.orgDiagram("update", primitives.orgdiagram.UpdateMode.Refresh);
           }
       });

       scope.$watchCollection('options.items', function (items) {
           chart.orgDiagram("option", { items: items });
           chart.orgDiagram("update", primitives.orgdiagram.UpdateMode.Refresh);
       });

       function onTemplateRender(event, data) {
           var itemConfig = data.context;

           switch (data.renderingMode) {
               case primitives.common.RenderingMode.Create:
                   /* Initialize widgets here */
                   var itemScope = scope.$new();
                   itemScope.itemConfig = itemConfig;
                   $compile(data.element.contents())(itemScope);
                   if (!scope.$parent.$$phase) {
                       itemScope.$apply();
                   }
                   itemScopes.push(itemScope);
                   break;
               case primitives.common.RenderingMode.Update:
                   /* Update widgets here */
                   var itemScope = data.element.contents().scope();
                   itemScope.itemConfig = itemConfig;
                   break;
           }
       }

       function onButtonClick(e, data) {
           scope.onButtonClick();
           scope.$apply();
       }

       function onCursorChanged(e, data) {
           scope.options.cursorItem = data.context ? data.context.id : null;
           scope.onCursorChanged();
           scope.$apply();
       }

       function onHighlightChanged(e, data) {
           scope.options.highlightItem = data.context ? data.context.id : null;
           scope.onHighlightChanged();
           scope.$apply();
       }

    //   element.on('$destroy', function () {
    //       /* destroy items scopes */
    //       for (var index = 0; index < scope.length; index++) {
    //           itemScopes[index].$destroy();
    //       }

    //       /* destory jQuery UI widget instance */
    //       chart.remove();
    //   });
   };

    return {
       scope: {
           options: '=options',
           onCursorChanged: '&onCursorChanged',
           onHighlightChanged: '&onHighlightChanged',
       },
       link: link
    };
});