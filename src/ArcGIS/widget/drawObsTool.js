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
    "esri/graphic",
    "esri/layers/GraphicsLayer", 
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
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
    Graphic,
    GraphicsLayer,
    SimpleFillSymbol,
    SimpleLineSymbol,
    SimpleMarkerSymbol,
    Draw,
    Edit
) {
    "use strict";
    
    return declare(null, {
        
        app: null,
        allowMultiGeometry: false,
        drawPoint: false,
        drawPolygon: false,
        drawPolyline: false,
        drawFreehandPolygon: false,
        drawFreehandPolyline: false,

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
                on(d, "click",  dojo.hitch(this, this._drawGraphic));
            }, this);

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

            switch (evt.geometry.type) {
                case "point":
                case "multipoint":
                    symbol = new SimpleMarkerSymbol().setColor(new Color("#FFFF00"));
                    break;
                case "polyline":
                    symbol = new SimpleLineSymbol();
                    break;
                default:
                    symbol = new SimpleFillSymbol();
                    break;
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

            graphics.forEach(function(graphic){
                graphicsObject.push(graphic.toJson());
            });

            var graphicsJson = JSON.stringify(graphicsObject);
            this.app._contextObj.set(this.app.drawObsGraphicsJSON, graphicsJson);
        }

    });
});
