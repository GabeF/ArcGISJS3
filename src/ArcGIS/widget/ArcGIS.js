define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",
    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",
    "dojo/text!ArcGIS/widget/template/ArcGIS.html",
    "ArcGIS/config/ArcGIS_Dojo_Loader_Config",

], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent, widgetTemplate, ArcGIS_Dojo_Loader_Config) {
    "use strict";

    return declare("ArcGIS.widget.ArcGIS", [_WidgetBase, _TemplatedMixin], {

        autoLoad: false,
        timeout: 1000,
        templateString: widgetTemplate,

        widgetBase: null,

        // Internal variables.
        _handles: null,
        _contextObj: null,
        _map: null,

        constructor: function () {
            this._handles = [];

        },

        postCreate: function () {
            logger.debug(this.id + ".postCreate");

            this.x = "hi there from postcreate";

            // Load a sample base map
            require(ArcGIS_Dojo_Loader_Config, ["esri/map",
                "esri/urlUtils",
                "esri/arcgis/utils",
                "esri/dijit/Legend",
                "esri/dijit/Scalebar",
                "dojo/text!esri/dijit/Search/templates/Search.html",
                "esri/dijit/Search",
                "esri/layers/FeatureLayer",
                "esri/InfoTemplate",
                "esri/dijit/BasemapGallery",
                "esri/dijit/LayerList",
                "esri/dijit/HomeButton",
                "esri/toolbars/draw",
                "esri/graphic",
                "esri/symbols/SimpleMarkerSymbol",
                "esri/symbols/SimpleLineSymbol",
                "esri/symbols/SimpleFillSymbol",
                "esri/dijit/Measurement",
                "esri/toolbars/edit",
                "dojo/_base/event",
                "dojo/dom-construct",
                "dojo/on",
                "dojo/dom-class",
                "dojo/parser",
                "ArcGIS/config/mapConfig",
            ], dojo.hitch(this, function (Map,
                urlUtils,
                arcgisUtils,
                Legend,
                Scalebar,
                _SearchTemplate,
                Search,
                FeatureLayer,
                InfoTemplate,
                BasemapGallery,
                LayerList,
                HomeButton,
                Draw,
                Graphic,
                SimpleMarkerSymbol,
                SimpleLineSymbol,
                SimpleFillSymbol,
                Measurement,
                Edit,
                event,
                domConstruct,
                on,
                domClass,
                parser,
                Map_Config
            ) {

                // webmap for DSRA DP270
                var mapid = "02ca94fa08e243eaa250d7268194b3cf";

                // map is hosted on dsraenterprise2 NOT arcgis.com
                arcgisUtils.arcgisUrl = "https://dsraenterprise2.canadacentral.cloudapp.azure.com/portal/sharing/content/items";

                this.Map_Config = Map_Config;

                arcgisUtils.createMap(mapid, "map").then(
                    dojo.hitch(this, function (response) {

                        var map = response.map;

                        this._map = map;
                        this._response = response;

                        // add Edit tool to make graphics movable
                        var editToolbar = new Edit(map);

                        //Activate the toolbar when you click on a graphic
                        map.graphics.on("click", function (evt) {
                            event.stop(evt);
                            activateToolbar(evt.graphic);
                        });

                        //deactivate the toolbar when you click outside a graphic
                        map.on("click", function (evt) {
                            editToolbar.deactivate();
                        });

                        function activateToolbar(graphic) {


                            editToolbar.activate(0 | Edit.MOVE | Edit.ROTATE | Edit.SCALE, graphic);
                        }


                        // shouldn't this be closer to the end?
                        this.set("loaded", true);



                        //add the scalebar
                        if (false) {
                            var scalebar = new Scalebar({
                                map: map,
                                scalebarUnit: "english"
                            });
                        }

                        if (this.showMeasureTools) {

                            // 
                            var el = document.getElementsByClassName("measureTools")[0];
                            el.style.display = "block";

                            // grab the measure tool container
                            var measureToolContainer = document.getElementById("measureToolContainer");

                            // create a node inside it for the measure tool
                            var node = domConstruct.create("div");

                            // place that node in the Dom as the first child of the container
                            domConstruct.place(node, measureToolContainer, "first");

                            // create and connect measure tool to its div (that lives in Mendix)
                            var measurement = new Measurement({
                                map: map
                            }, node);

                            // start up the tool 
                            measurement.startup();

                            on(el, "click", function () {

                                domClass.toggle(this, "btn-clicked");

                                var is_tool_visible = ("block" == measureToolContainer.style.display);

                                if (is_tool_visible) {
                                    measureToolContainer.style.display = "none";
                                } else {
                                    measureToolContainer.style.display = "block";
                                }
                            })
                        }




                        // setup multi source search
                        var search = new Search({
                            map: response.map,
                            enableButtonMode: true,
                            showInfoWindowOnSelect: true,
                            enableInfoWindow: true
                        }, "search");

                        //Set the sources for the search widget

                        // note: this line will automatically add the default GEO services
                        var sources = search.get("sources");

                        // loop over the search config objects (defined in the JSON)
                        var searchSources = this.Map_Config.values.searchConfig.sources;
                        var numberOfSources = searchSources.length;

                        for (var i = 0; i < numberOfSources; i++) {
                            var source = searchSources[i];
                            // only care about feature layers (default GEO already there)
                            if ('undefined' == typeof source.flayerId) {
                                continue;
                            }

                            var fl = new FeatureLayer(source.url);
                            source.featureLayer = fl;
                            sources.push(source);
                        }

                        //Set the sources above to the search widget
                        search.set("sources", sources);

                        search.startup();

                        if (this.showBaseMaps) {
                            var el = document.getElementsByClassName("baseMaps")[0];
                            el.style.display = "block";
                            var basemapGallery = new BasemapGallery({
                                showArcGISBasemaps: true,
                                map: response.map,
                            }, "basemapGallery");
                            basemapGallery.startup();
                        }

                        // layer tool bar

                        // this line says:
                        // is tool_layers defined in the JSON
                        // if so, use that value.  if not, use the value from the XML config

                        var showLayerTools_reconcile = ('undefined' !== typeof this.Map_Config.values.tool_layers) ? this.Map_Config.values.tool_layers : this.showLayerTools;

                        if (showLayerTools_reconcile) {
                            var el = document.getElementsByClassName("layerTools")[0];
                            el.style.display = "block";
                            var myWidget = new LayerList({
                                    map: response.map,
                                    layers: arcgisUtils.getLayerList(response)
                                },
                                "layerList"
                            );
                            myWidget.startup();
                        }

                        var home = new HomeButton({
                            map: response.map
                        }, "HomeButton");
                        home.startup();

                        if (this.showDrawTools) {
                            var el = document.getElementsByClassName("drawTools")[0];
                            el.style.display = "block";

                            var toolbar = new Draw(response.map);
                            toolbar.on("draw-end", addToMap);

                            // wire up the buttons (NEEDS BETTER SELECTOR!)
                            document.querySelectorAll("#header button").forEach(function (d) {
                                d.addEventListener("click", activateTool);
                            })
                        }

                        function activateTool() {
                            var tool = this.textContent.toUpperCase().replace(/ /g, "_");
                            toolbar.activate(Draw[tool]);
                            response.map.hideZoomSlider();

                        }

                        function addToMap(evt) {
                            var symbol;
                            toolbar.deactivate();
                            response.map.showZoomSlider();

                            switch (evt.geometry.type) {
                                case "point":
                                case "multipoint":
                                    symbol = new SimpleMarkerSymbol();
                                    break;
                                case "polyline":
                                    symbol = new SimpleLineSymbol();
                                    break;
                                default:
                                    symbol = new SimpleFillSymbol();
                                    break;
                            }
                            var graphic = new Graphic(evt.geometry, symbol);
                            response.map.graphics.add(graphic);
                        }

                    }));

            }))
        },

        update: function (obj, callback) {
            logger.debug(this.id + ".update");
            this._contextObj = obj;

            // set zoom level to current zoom level
            this._contextObj.set("CurrentZoomLevel", this._map.getZoom());

            // hook up listener to zoom-end event

            this._map.on("zoom-end", dojo.hitch(this, function () {
                this._contextObj.set("CurrentZoomLevel", this._map.getZoom());

            }))

            //after map loads, connect to listen to mouse move & drag events
            this._map.on("mouse-move", dojo.hitch(this, showCoordinates));

            // connect arcgis objects to Mendix entities
            this._response.itemInfo.itemData.operationalLayers[0].layerObject.on("click", dojo.hitch(this, function (evt) {

                this._contextObj.set("GlobalID", evt.graphic.attributes.globalid);
                this._contextObj.set("AssetAsJSON", JSON.stringify(evt.graphic.attributes, null, 2));
            }));

            function showCoordinates(evt) {
                //the map is in web mercator but display coordinates in geographic (lat, long)
                require(ArcGIS_Dojo_Loader_Config, ["esri/geometry/webMercatorUtils"], dojo.hitch(this, function (webMercatorUtils) {
                    var mp = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
                    this._contextObj.set("MouseLat", mp.y.toFixed(8));
                    this._contextObj.set("MouseLon", mp.x.toFixed(8));
                }));
                //display mouse coordinates

            }

            this._resetSubscriptions();
            this._updateRendering(callback);
        },

        _resetSubscriptions: function () {
            var _objectHandle = null,
                _attrHandle = null,
                _validationHandle = null;
            // Release handles on previous object, if any.
            if (this._handles) {
                this._handles.forEach(function (handle, i) {
                    mx.data.unsubscribe(handle);
                });
                this._handles = [];
            }
            // When a mendix object exists create subscribtions.
            if (this._contextObj) {

                _objectHandle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: dojo.hitch(this, function (guid) {

                        console.log("context entity has updated");

                        /*
                        require(ArcGIS_Dojo_Loader_Config, ["esri/geometry/Point", "esri/SpatialReference"], dojo.hitch(this, function (Point, SpatialReference) {
                            var p = new Point(parseFloat(this._contextObj.get("ZoomToLon")), parseFloat(this._contextObj.get("ZoomToLat")), new SpatialReference({
                                wkid: 4326
                            }));
                            this._map.centerAndZoom(p, 16);

                            //this._updateRendering();
                        }))
                        */


                    })
                });

                var subscription = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    attr: "Switch_ZoomToLatLon",
                    callback: dojo.hitch(function (guid, attr, value) {
                        console.log("Object with guid " + guid + " had its attribute " +
                            attr + " change to " + value);

                        require(ArcGIS_Dojo_Loader_Config, ["esri/geometry/Point", "esri/SpatialReference"], dojo.hitch(this, function (Point, SpatialReference) {
                            var p = new Point(parseFloat(this._contextObj.get("ZoomToLon")), parseFloat(this._contextObj.get("ZoomToLat")), new SpatialReference({
                                wkid: 4326
                            }));
                            this._map.centerAndZoom(p, 16);

                            //this._updateRendering();
                        }))


                    })
                });

                var subscription = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    attr: "Switch_ZoomToGlobalID",
                    callback: dojo.hitch(function (guid, attr, value) {
                        console.log("Object with guid " + guid + " had its attribute " +
                            attr + " change to " + value);

                        require(ArcGIS_Dojo_Loader_Config, ["esri/tasks/QueryTask", "esri/tasks/query", "esri/SpatialReference"], dojo.hitch(this, function (QueryTask, Query, SpatialReference) {
                            var query = new Query();
                            var queryTask = new QueryTask("https://dsraenterprise2.canadacentral.cloudapp.azure.com/server/rest/services/Hosted/ASSET_POINT/FeatureServer/0");
                            var spatialRef = new SpatialReference({
                                wkid: 4326
                            });

                            function queryTaskExecuteCompleteHandler(queryResults) {
                                console.log("complete", queryResults);
                            }

                            function queryTaskErrorHandler(queryError) {
                                console.log("error", queryError.error.details);
                            }

                            query.outFields = ["*"];
                            query.returnGeometry = true;
                            query.where = "globalid='" + this._contextObj.get("ZoomToGlobalId") + "'";
                            query.outSpatialReference = spatialRef;
                            //query.like("{5FD85F2B-3D34-4E5B-8551-0344EA35BCA6}")
                            //query.where("objectid='10'");
                            queryTask.on("complete", queryTaskExecuteCompleteHandler);
                            queryTask.on("error", queryTaskErrorHandler);
                            queryTask.execute(query);

                        }))



                    })
                });



                var subscription = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    attr: "CurrentZoomLevel",
                    callback: dojo.hitch(function (guid, attr, value) {
                        console.log("Object with guid " + guid + " had its attribute " +
                            attr + " change to " + value);

                        this._map.setZoom(value);



                    })
                });

                this._handles = [_objectHandle, subscription];
            }
        },

        resize: function (box) {
            logger.debug(this.id + ".resize");
        },

        uninitialize: function () {
            logger.debug(this.id + ".uninitialize");
        },

        _updateRendering: function (callback) {
            logger.debug(this.id + "._updateRendering");

            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");
            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }

            this._executeCallback(callback, "_updateRendering");
        },

        // Shorthand for running a microflow
        _execMf: function (mf, guid, cb) {
            logger.debug(this.id + "._execMf");
            if (mf && guid) {
                mx.ui.action(mf, {
                    params: {
                        applyto: "selection",
                        guids: [guid]
                    },
                    callback: lang.hitch(this, function (objs) {
                        if (cb && typeof cb === "function") {
                            cb(objs);
                        }
                    }),
                    error: function (error) {
                        console.debug(error.description);
                    }
                }, this);
            }
        },

        // Shorthand for executing a callback, adds logging to your inspector
        _executeCallback: function (cb, from) {
            logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

require(["ArcGIS/widget/ArcGIS"]);
