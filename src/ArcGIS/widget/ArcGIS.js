/**
 * This is a hack to be able to document standalone functions for Yuidoc.
 *
 * @class Main
 *
 * */
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
    "ArcGIS/config/ArcGIS_Dojo_Loader_Config"
], function(
    declare,
    _WidgetBase,
    _TemplatedMixin,
    dom,
    dojoDom,
    dojoProp,
    dojoGeometry,
    dojoClass,
    dojoStyle,
    dojoConstruct,
    dojoArray,
    lang,
    dojoText,
    dojoHtml,
    dojoEvent,
    widgetTemplate,
    ArcGIS_Dojo_Loader_Config
) {
    "use strict";

    return declare("ArcGIS.widget.ArcGIS", [_WidgetBase, _TemplatedMixin], {
        autoLoad: false,
        timeout: 1000,
        templateString: widgetTemplate,

        widgetBase: null,

        // Draw Point Tool properties from Mendix...
        drawPointSymbolUrl: "",
        drawPointSymbolWidth: 24,
        drawPointSymbolHeight: 24,
        drawPointOutlineColour: "#000000",
        drawPointOutlineAlpha: 100,
        drawPointFillColour: "#000000",
        drawPointFillAlpha: 25,

        // Observation Tool properties from Mendix...
        allowMultiGeometry: true,
        drawObsPointSymbolUrl: "",
        drawObsPointSymbolWidth: 24,
        drawObsPointSymbolHeight: 24,
        drawObsOutlineColour: "#000000",
        drawObsOutlineAlpha: 100,
        drawObsFillColour: "#000000",
        drawObsFillAlpha: 25,

        drawGraphicsJSON: "",

        // Internal variables.
        _handles: null,
        _contextObj: null,
        _map: null,
        _firstRun: true,

        _drawTool: null,
        _drawObsTool: null,

        constructor: function() {
            this._handles = [];
        },

        postCreate: function() {
            logger.debug(this.id + ".postCreate");

            // Load a sample base map
            require(ArcGIS_Dojo_Loader_Config, [
                "esri/map",
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
                "esri/dijit/Bookmarks",
                "esri/dijit/OverviewMap",
                "esri/toolbars/draw",
                "esri/graphic",
                "esri/symbols/SimpleMarkerSymbol",
                "esri/symbols/SimpleLineSymbol",
                "esri/symbols/SimpleFillSymbol",
                "esri/Color",
                "esri/dijit/Measurement",
                "esri/toolbars/edit",
                "esri/tasks/query",
                "dojo/_base/event",
                "dojo/dom-construct",
                "dojo/on",
                "dojo/dom-class",
                "dojo/parser",
                "ArcGIS/config/mapConfig",
                "ArcGIS/widget/drawPointTool",
                "ArcGIS/widget/drawObsTool"
            ], dojo.hitch(this, function(
                Map,
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
                Bookmarks,
                OverviewMap,
                Draw,
                Graphic,
                SimpleMarkerSymbol,
                SimpleLineSymbol,
                SimpleFillSymbol,
                Color,
                Measurement,
                Edit,
                Query,
                event,
                domConstruct,
                on,
                domClass,
                parser,
                Map_Config,
                DrawPointTool,
                DrawObsTool
            ) {
                // webmap for DSRA DP270

                //var mapid = "02ca94fa08e243eaa250d7268194b3cf";
                var mapid = this.webmapID;

                // map is hosted on dsraenterprise2 NOT arcgis.com
                // arcgisUtils.arcgisUrl = "https://dsraenterprise2.canadacentral.cloudapp.azure.com/portal/sharing/content/items";
                arcgisUtils.arcgisUrl = this.arcGISURL;

                this.Map_Config = Map_Config;

                arcgisUtils.createMap(mapid, "map").then(
                    dojo.hitch(this, function(response) {
                        var map = response.map;

                        this._map = map;
                        this._response = response;

                        var overviewMapDijit = new OverviewMap({
                            map: map,
                            attachTo: "bottom-right",
                            color: " #D84E13",
                            opacity: 0.4
                        });

                        overviewMapDijit.startup();

                        // set up legend
                        var legendLayers = arcgisUtils.getLegendLayers(
                            response
                        );

                        var legendDijit = new Legend(
                            {
                                map: map,
                                layerInfos: legendLayers
                            },
                            "legend"
                        );

                        legendDijit.startup();

                        // setup bookmarks

                        // the bookmarks are configured as a string in the Modeler, but could be easily
                        // modified to include pre-defined locations or, better yet,
                        // to let individual users save their own bookmarks
                        var bookmarks_list = JSON.parse(this.bookmarksJSON);

                        if (this.showBookmarks) {
                            var el = document.getElementsByClassName(
                                "bookmarks"
                            )[0];
                            el.style.display = "block";

                            var bookmarks = new Bookmarks(
                                {
                                    map: map,
                                    bookmarks: bookmarks_list,
                                    editable: true
                                },
                                document.getElementById("bookmarks")
                            );
                        }

                        // add Edit tool to make graphics movable
                        var editToolbar = new Edit(map);
                        this.editToolbar = editToolbar;

                        // asset layer
                        this._response.itemInfo.itemData.operationalLayers[0].layerObject.on(
                            "dbl-click",
                            function(evt) {
                                event.stop(evt);
                                activateToolbar(evt.graphic);
                            }
                        );

                        //deactivate the toolbar when you click outside a graphic
                        map.on("click", function(evt) {
                            editToolbar.deactivate();
                        });

                        function activateToolbar(graphic) {
                            editToolbar.activate(Edit.EDIT_VERTICES | Edit.MOVE | Edit.ROTATE | Edit.SCALE, graphic);
                        }

                        //add the scalebar
                        if (true) {
                            var scalebar = new Scalebar({
                                map: map,
                                scalebarUnit: "dual",
                                attachTo : "bottom-left"
                            });
                        }

                        if (this.showMeasureTools) {
                            //
                            var el = document.getElementsByClassName(
                                "measureTools"
                            )[0];
                            el.style.display = "block";

                            // grab the measure tool container
                            var measureToolContainer = document.getElementById(
                                "measureToolContainer"
                            );

                            // create a node inside it for the measure tool
                            var node = domConstruct.create("div");

                            // place that node in the Dom as the first child of the container
                            domConstruct.place(
                                node,
                                measureToolContainer,
                                "first"
                            );

                            // create and connect measure tool to its div (that lives in Mendix)
                            var measurement = new Measurement(
                                {
                                    map: map
                                },
                                node
                            );

                            // start up the tool
                            measurement.startup();

                            on(el, "click", function() {
                                domClass.toggle(this, "btn-clicked");

                                var is_tool_visible =
                                    "block" ==
                                    measureToolContainer.style.display;

                                if (is_tool_visible) {
                                    measureToolContainer.style.display = "none";
                                } else {
                                    measureToolContainer.style.display =
                                        "block";
                                }
                            });
                        }

                        /**
                         Configures Search Object
                        @function Search
                        @param {Object} bounds The original bounds.
                        @param {number} dx X  offset.
                        @param {number} dy Y  offset.
                        @return {Object} The newly calculated bounds.
                        @example
                           model.set('foo', 'bar');
                        */
                        var search = new Search(
                            {
                                map: response.map,
                                enableButtonMode: true,
                                showInfoWindowOnSelect: true,
                                enableInfoWindow: true
                            },
                            "search"
                        );

                        //Set the sources for the search widget

                        // note: this line will automatically add the default GEO services
                        var sources = search.get("sources");

                        // loop over the search config objects (defined in the JSON)
                        var searchSources = this.Map_Config.values.searchConfig
                            .sources;
                        var numberOfSources = searchSources.length;

                        for (var i = 0; i < numberOfSources; i++) {
                            var source = searchSources[i];
                            // only care about feature layers (default GEO already there)
                            if ("undefined" == typeof source.flayerId) {
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
                            var el = document.getElementsByClassName(
                                "baseMaps"
                            )[0];
                            el.style.display = "block";
                            var basemapGallery = new BasemapGallery(
                                {
                                    showArcGISBasemaps: true,
                                    map: response.map
                                },
                                "basemapGallery"
                            );
                            basemapGallery.startup();
                        }

                        // layer tool bar

                        // this line says:
                        // is tool_layers defined in the JSON
                        // if so, use that value.  if not, use the value from the XML config

                        var showLayerTools_reconcile =
                            "undefined" !==
                            typeof this.Map_Config.values.tool_layers
                                ? this.Map_Config.values.tool_layers
                                : this.showLayerTools;

                        if (showLayerTools_reconcile) {
                            var el = document.getElementsByClassName(
                                "layerTools"
                            )[0];
                            el.style.display = "block";
                            var myWidget = new LayerList(
                                {
                                    map: response.map,
                                    layers: arcgisUtils.getLayerList(response)
                                },
                                "layerList"
                            );
                            myWidget.startup();
                        }

                        var home = new HomeButton(
                            {
                                map: response.map
                            },
                            "HomeButton"
                        );
                        home.startup();

                        if (this.showDrawTools)
                        {    
                            dojoStyle.set("arcgisw_drawTools", "display", this.showDrawTools ? "block" : "none");
                            this._drawTool = new DrawPointTool({
                                app: this,
                                pointSymbolUrl: this.drawPointSymbolUrl,
                                pointSymbolWidth: this.drawPointSymbolWidth,
                                pointSymbolHeight: this.drawPointSymbolHeight,
                                outlineColour: this.drawPointOutlineColour,
                                outlineAlpha: this.drawPointOutlineAlpha,
                                fillColour: this.drawPointFillColour,
                                fillAlpha: this.drawPointFillAlpha,
                            });
                        }

                        if (this.showObsDrawTools)
                        {
                            dojoStyle.set("arcgisw_drawObsTools", "display", this.showDrawTools ? "block" : "none");
                            this._drawObsTool = new DrawObsTool({
                                app: this,
                                allowMultiGeometry: this.allowMultiGeometry,
                                drawPoint: this.drawObsPoint,
                                drawMultiPoint: this.drawObsMultiPoint,
                                drawPolygon: this.drawObsPolygon,
                                drawPolyline: this.drawObsPolyline,
                                drawFreehandPolygon: this.drawObsFreehandPolygon,
                                drawFreehandPolyline: this.drawObsFreehandPolyline,
                                pointSymbolUrl: this.drawObsPointSymbolUrl,
                                pointSymbolWidth: this.drawObsPointSymbolWidth,
                                pointSymbolHeight: this.drawObsPointSymbolHeight,
                                outlineColour: this.drawObsOutlineColour,
                                outlineAlpha: this.drawObsOutlineAlpha,
                                fillColour: this.drawObsFillColour,
                                fillAlpha: this.drawObsFillAlpha,
                            });
                        }

                        // Declared loaded after all asynchronous calls in post create have
                        // been initiated. this is especially important if the object
                        // is accessed in the update method.
                        this.set("loaded", true);
                    })
                );
            }));
        },

        update: function(obj, callback) {
            logger.debug(this.id + ".update");

            this._contextObj = obj;

            if (this.initialZoomToGUID != "") {
                // zoom if this is the first time here
                if (this._firstRun) {
                    this._firstRun = false;

                    require(ArcGIS_Dojo_Loader_Config, [
                        "esri/tasks/query",
                        "esri/SpatialReference",
                        "esri/layers/FeatureLayer",
                        "esri/symbols/SimpleFillSymbol",
                        "esri/symbols/SimpleLineSymbol",
                        "esri/symbols/SimpleMarkerSymbol",
                        "esri/Color",
                        "esri/symbols/PictureMarkerSymbol",
                        "esri/graphic"
                    ], dojo.hitch(this, function(
                        Query,
                        SpatialReference,
                        FeatureLayer,
                        SimpleFillSymbol,
                        SimpleLineSymbol,
                        SimpleMarkerSymbol,
                        Color,
                        PictureMarkerSymbol,
                        Graphic
                    ) {
                        var query = new Query();
                        query.where =
                            "globalid = '" +
                            this._contextObj.get(this.initialZoomToGUID) +
                            "'";

                        this._response.itemInfo.itemData.operationalLayers[0].layerObject.selectFeatures(
                            query,
                            FeatureLayer.SELECTION_NEW,
                            dojo.hitch(this, function(results) {
                                var symbol = new SimpleMarkerSymbol({
                                    color: [255, 255, 255, 0],
                                    size: 12,
                                    angle: 0,
                                    xoffset: 0,
                                    yoffset: 0,
                                    type: "esriSMS",
                                    style: "esriSMSCircle",
                                    outline: {
                                        color: [255, 255, 0, 255],
                                        width: 5,
                                        type: "esriSLS",
                                        style: "esriSLSSolid"
                                    }
                                });

                                this._map.centerAndZoom(
                                    results[0].geometry,
                                    this.minZoomDrawTools
                                );

                                // var pictureMarkerSymbol = new PictureMarkerSymbol('https://js.arcgis.com/3.28/esri/dijit/Search/images/search-pointer.png?636970991852588460', 51, 51);
                                var graphic = new Graphic(
                                    results[0].geometry,
                                    symbol
                                );
                                this._map.graphics.add(graphic);

                                this._contextObj.set(
                                    this.guidToObjectID,
                                    results[0].attributes.objectid
                                );
                            })
                        );
                    }));
                }
            }

            // set zoom level to current zoom level
            this._contextObj.set(this.currentZoomLevel, this._map.getZoom());

            // hook up listener to zoom-end event
            this._map.on(
                "zoom-end",
                dojo.hitch(this, function() {
                    this._contextObj.set(
                        this.currentZoomLevel,
                        this._map.getZoom()
                    );

                    // check zoom level to tell whether the draw button should be enabled
                    var mapZoomLevel = this._map.getZoom();
                    if (this._drawTool != null) {
                        this._drawTool.enableDrawTools(this.minZoomDrawTools <= mapZoomLevel);
                    }

                    if (this._drawObsTool != null) {
                        this._drawObsTool.enableDrawTools(this.minZoomDrawTools <= mapZoomLevel);
                    }
                })
            );

            //after map loads, connect to listen to mouse move & drag events
            this._map.on("mouse-move", dojo.hitch(this, showCoordinates));

            // connect arcgis objects to Mendix entities
            this._response.itemInfo.itemData.operationalLayers[0].layerObject.on(
                "click",
                dojo.hitch(this, function(evt) {
                    this._contextObj.set(
                        "GlobalID",
                        evt.graphic.attributes.globalid
                    );
                    this._contextObj.set(
                        "AssetAsJSON",
                        JSON.stringify(evt.graphic.attributes, null, 2)
                    );
                })
            );

            /**
             * Fired when mouse moves
             *
             * @event mouse-move
             */
            function showCoordinates(evt) {
                //the map is in web mercator but display coordinates in geographic (lat, long)
                require(ArcGIS_Dojo_Loader_Config, [
                    "esri/geometry/webMercatorUtils"
                ], dojo.hitch(this, function(webMercatorUtils) {
                    var mp = webMercatorUtils.webMercatorToGeographic(
                        evt.mapPoint
                    );
                    this._contextObj.set("MouseLat", mp.y.toFixed(8));
                    this._contextObj.set("MouseLon", mp.x.toFixed(8));
                }));
                //display mouse coordinates
            }

            this._resetSubscriptions();
            this._updateRendering(callback);
        },

        _resetSubscriptions: function() {
            var _objectHandle = null,
                _attrHandle = null,
                _validationHandle = null;
            // Release handles on previous object, if any.
            if (this._handles) {
                this._handles.forEach(function(handle, i) {
                    mx.data.unsubscribe(handle);
                });
                this._handles = [];
            }
            // When a mendix object exists create subscribtions.
            if (this._contextObj) {
                _objectHandle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: dojo.hitch(this, function(guid) {
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
                    callback: dojo.hitch(function(guid, attr, value) {
                        console.log(
                            "Object with guid " +
                                guid +
                                " had its attribute " +
                                attr +
                                " change to " +
                                value
                        );

                        require(ArcGIS_Dojo_Loader_Config, [
                            "esri/geometry/Point",
                            "esri/SpatialReference"
                        ], dojo.hitch(this, function(Point, SpatialReference) {
                            var p = new Point(
                                parseFloat(this._contextObj.get("ZoomToLon")),
                                parseFloat(this._contextObj.get("ZoomToLat")),
                                new SpatialReference({
                                    wkid: 4326
                                })
                            );
                            this._map.centerAndZoom(p, 16);

                            //this._updateRendering();
                        }));
                    })
                });

                var subscription = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    attr: "Switch_ZoomToGlobalID",
                    callback: dojo.hitch(function(guid, attr, value) {
                        console.log(
                            "Object with guid " +
                                guid +
                                " had its attribute " +
                                attr +
                                " change to " +
                                value
                        );

                        require(ArcGIS_Dojo_Loader_Config, [
                            "esri/tasks/QueryTask",
                            "esri/tasks/query",
                            "esri/SpatialReference",
                            "esri/symbols/SimpleMarkerSymbol"
                        ], dojo.hitch(this, function(
                            QueryTask,
                            Query,
                            SpatialReference,
                            SimpleMarkerSymbol
                        ) {
                            var query = new Query();
                            var queryTask = new QueryTask(
                                "https://dsraenterprise2.canadacentral.cloudapp.azure.com/server/rest/services/Hosted/ASSET_POINT/FeatureServer/0"
                            );
                            var spatialRef = new SpatialReference({
                                wkid: 4326
                            });

                            function queryTaskExecuteCompleteHandler(
                                queryResults
                            ) {
                                console.log("complete", queryResults);

                                var symbol = new SimpleMarkerSymbol({
                                    color: [255, 255, 255, 0],
                                    size: 12,
                                    angle: 0,
                                    xoffset: 0,
                                    yoffset: 0,
                                    type: "esriSMS",
                                    style: "esriSMSCircle",
                                    outline: {
                                        color: [255, 255, 0, 255],
                                        width: 5,
                                        type: "esriSLS",
                                        style: "esriSLSSolid"
                                    }
                                });
                                this._map.centerAndZoom(
                                    queryResults.featureSet.features[0]
                                        .geometry,
                                    18
                                );

                                this._map.graphics.add(
                                    queryResults.featureSet.features[0].setSymbol(
                                        symbol
                                    )
                                );
                            }

                            function queryTaskErrorHandler(queryError) {
                                console.log("error", queryError.error.details);
                            }

                            query.outFields = ["*"];
                            query.returnGeometry = true;
                            query.where =
                                "globalid='" +
                                this._contextObj.get("ZoomToGlobalId") +
                                "'";
                            query.outSpatialReference = spatialRef;
                            //query.like("{5FD85F2B-3D34-4E5B-8551-0344EA35BCA6}")
                            //query.where("objectid='10'");
                            queryTask.on(
                                "complete",
                                dojo.hitch(
                                    this,
                                    queryTaskExecuteCompleteHandler
                                )
                            );
                            queryTask.on("error", queryTaskErrorHandler);
                            queryTask.execute(query);
                        }));
                    })
                });

                var subscription = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    attr: "CurrentZoomLevel",
                    callback: dojo.hitch(function(guid, attr, value) {
                        console.log(
                            "Object with guid " +
                                guid +
                                " had its attribute " +
                                attr +
                                " change to " +
                                value
                        );

                        this._map.setZoom(value);
                    })
                });

                this._handles = [_objectHandle, subscription];
            }
        },

        resize: function(box) {
            logger.debug(this.id + ".resize");
        },

        uninitialize: function() {
            logger.debug(this.id + ".uninitialize");
        },

        _updateRendering: function(callback) {
            logger.debug(this.id + "._updateRendering");

            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");
            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }

            this._executeCallback(callback, "_updateRendering");
        },

        // Shorthand for running a microflow
        _execMf: function(mf, guid, cb) {
            logger.debug(this.id + "._execMf");
            if (mf && guid) {
                mx.ui.action(
                    mf,
                    {
                        params: {
                            applyto: "selection",
                            guids: [guid]
                        },
                        callback: lang.hitch(this, function(objs) {
                            if (cb && typeof cb === "function") {
                                cb(objs);
                            }
                        }),
                        error: function(error) {
                            console.debug(error.description);
                        }
                    },
                    this
                );
            }
        },

        // Shorthand for executing a callback, adds logging to your inspector
        _executeCallback: function(cb, from) {
            logger.debug(
                this.id + "._executeCallback" + (from ? " from " + from : "")
            );
            if (cb && typeof cb === "function") {
                cb();
            }
        },

        _enableMapPopup: function(enable) {
            if (enable)
            {
                this._response.clickEventHandle = dojo.connect(this._map, "onClick", this._response.clickEventListener);
            }
            else
            {
                dojo.disconnect(this._response.clickEventHandle);
            }
        },

    });
});

require(["ArcGIS/widget/ArcGIS"]);
