/**
 * Draw Observation Tool - Class to handle the basic drawings.
 *
 * @class DrawObsTool
 *
 * */
define([
    "ArcGIS/config/ArcGIS_Dojo_Loader_Config",
    "dojo/_base/declare",
    "dojo/_base/event",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/on",
    "esri/Color",
    "esri/geometry/Multipoint",
    "esri/geometry/Point",
    "esri/graphic",
    "esri/layers/GraphicsLayer",
    "esri/SpatialReference",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/PictureMarkerSymbol",
    "esri/toolbars/draw",
    "esri/toolbars/edit"
], function(
    ArcGIS_Dojo_Loader_Config,
    declare,
    event,
    dojoDom,
    dojoStyle,
    on,
    Color,
    Multipoint,
    Point,
    Graphic,
    GraphicsLayer,
    SpatialReference,
    SimpleFillSymbol,
    SimpleLineSymbol,
    SimpleMarkerSymbol,
    PictureMarkerSymbol,
    Draw,
    Edit
) {
    "use strict";

    return declare(null, {
        
        app: null,
        allowMultiGeometry: false,
        drawPoint: false,
        drawMultiPoint: false,
        drawPolygon: false,
        drawPolyline: false,
        drawFreehandPolygon: false,
        drawFreehandPolyline: false,

        pointSymbolUrl: "",
        pointSymbolWidth: 24,
        pointSymbolHeight: 24,
        outlineColour: "#000000",
        outlineAlpha: 100,
        fillColour: "#000000",
        fillAlpha: 25,

        // Internal variables.
        _map: null,
        _drawLayer: null,
        _drawToolbar: null,
        _editToolbar: null,

        constructor: function(args) {
            declare.safeMixin(this, args);

            if (this.app != null)
            {
                this._map = this.app._map;
            }

            this.init();
        },

        init: function() {
            // Remove the unneeded buttons...
            this._removeDrawTools();

            // wire up the buttons
            var btnElements = document.querySelectorAll("#arcgisw_drawObsHeader button");
            btnElements.forEach( function(d) {
                if( d.id == "arcgisw_drawObsClearBtn" )
                {
                    on(d, "click",  dojo.hitch(this, this._clearGraphics));
                }
                else
                {
                    on(d, "click",  dojo.hitch(this, this._drawGraphic));
                }
            }, this);

            //arcgisw_drawObsClearBtn

            // Listen to the map click...
            this._map.on("click", dojo.hitch(this, this._onMapClick));

            this._drawToolbar = new Draw(this._map);
            on(this._drawToolbar, "draw-complete", dojo.hitch(this, this._addToMap));

            // add Edit tool to make graphics movable
            this._editToolbar = new Edit(this._map);
            this._editToolbar.on("graphic-move-stop", dojo.hitch(this, this._onGraphicMoved));

            // check zoom level to tell whether the draw button should be enabled
            var mapZoomLevel = this._map.getZoom();
            this.enableDrawTools(this.minZoomDrawTools <= mapZoomLevel);

            this._drawLayer = new GraphicsLayer({id: "Draw Observation Tool Layer"});
            this._map.addLayer(this._drawLayer);

            // Activate the toolbar when you click on a graphic
            this._drawLayer.on("click", dojo.hitch(this, this._onLayerClick));
        },

        _removeDrawTools: function() {
            if (!this.drawPoint)
            {
                dojo.destroy("arcgisw_drawObsPointBtn");
            }

            if (!this.drawMultiPoint)
            {
                dojo.destroy("arcgisw_drawObsMultiPointBtn");
            }

            if (!this.drawPolyline)
            {
                dojo.destroy("arcgisw_drawObsPolylineBtn");
            }

            if (!this.drawPolygon)
            {
                dojo.destroy("arcgisw_drawObsPolygonBtn");
            }

            if (!this.drawFreehandPolyline)
            {
                dojo.destroy("arcgisw_drawObsFreehandPolylineBtn");
            }

            if (!this.drawFreehandPolygon)
            {
                dojo.destroy("arcgisw_drawObsFreehandPolygonBtn");
            }

            if (!this.drawLine)
            {
                dojo.destroy("arcgisw_drawObsLineBtn");
            }
        },

        _onMapClick: function(evt) {
            // Deactivate the edit tool...
            this._deativateTool();
        },

        _onLayerClick: function(evt) {
            event.stop(evt);

            // Disable the map popup...
            this.app._enableMapPopup(false);

            // Activate the toolbar...
            this._editGraphic(evt.graphic);
        },

        _drawGraphic: function(evt) {
            if (!this.allowMultiGeometry)
            {
                this._drawLayer.clear();
            }

            var tool = evt.target.textContent.toUpperCase().replace(/ /g, "_");
            this._drawToolbar.activate(Draw[tool]);

            // Disable the map popup...
            this.app._enableMapPopup(false);
        },

        _editGraphic: function(graphic) {
            this._editToolbar.activate(Edit.EDIT_VERTICES | Edit.MOVE | Edit.ROTATE | Edit.SCALE, graphic);
        },

        _clearGraphics: function() {
            this._drawLayer.clear();
        },

        _onGraphicMoved: function(evt) {
            this._updateGraphicsJSONValue(this._drawLayer.graphics);
        },

        _deativateTool: function() {
            if (this._editToolbar.getCurrentState().tool > 0)
            {
                this._editToolbar.deactivate();
            }
        },

        _addToMap: function(evt) {
            var symbol;
            this._drawToolbar.deactivate();

            // Symbolize the graphic...
            if ( (evt.geometry.type === "point" || evt.geometry.type === "multipoint") &&
                 this.pointSymbolUrl.length > 0 )
            {
                symbol = new PictureMarkerSymbol();
                symbol.setUrl(this.pointSymbolUrl);
                symbol.setWidth(this.pointSymbolWidth);
                symbol.setHeight(this.pointSymbolHeight);
            }
            else
            {
                // Use the color schemes
                var colour = new Color(this.fillColour);
                colour.a = this.fillAlpha / 100;
                var outlineColour = new Color(this.outlineColour);
                outlineColour.a = this.outlineAlpha / 100;

                var outline = new SimpleLineSymbol();
                outline.setColor(outlineColour);

                switch (evt.geometry.type) {
                    case "point":
                    case "multipoint":
                        symbol = new SimpleMarkerSymbol();
                        symbol.setColor(colour);
                        symbol.setOutline(outline);
                        symbol.setSize(this.pointSymbolWidth);
                        break;
                    case "polyline":
                        symbol = outline;
                        break;
                    default:
                        symbol = new SimpleFillSymbol();
                        symbol.setColor(colour);
                        symbol.setOutline(outline);
                        break;
                }
            }
            
            var graphic = new Graphic(evt.geometry, symbol);
            this._drawLayer.add(graphic);

            // Re-enable the map popup...
            this.app._enableMapPopup(true);

            // Update the Mendix values...
            this._updateGraphicsJSONValue(this._drawLayer.graphics);
        },

        enableDrawTools: function(isEnabled) {
            dojoDom.byId("arcgisw_drawObsTools").disabled = !isEnabled;
            dojoStyle.set("arcgisw_drawObsMainWindow", "display", isEnabled ? "block" : "none");
        },

        _updateGraphicsJSONValue: function(graphics) {
            var graphicsObject = [];

            graphics.forEach(function(graphic) {
                // Is the graphic a point? If so, it needs to be a multipoint for the output.
                if (graphic.geometry.type == "point")
                {
                    var sr = new SpatialReference(graphic.geometry.spatialReference.toJson());
                    var newPoint = new Point(graphic.geometry.toJson());

                    var multiPoint = new Multipoint(sr);
                    multiPoint.addPoint(newPoint);

                    graphicsObject.push(multiPoint.toJson());
                }
                else
                {
                    graphicsObject.push(graphic.geometry.toJson());
                }
            });

            var graphicsJson;
            if (this.allowMultiGeometry)
            {
                graphicsJson = JSON.stringify(graphicsObject);
            }
            else
            {
                graphicsJson = JSON.stringify(graphicsObject[0]);
            }

            this.app._contextObj.set(this.app.drawObsGraphicsJSON, graphicsJson);
        }

    });
});
