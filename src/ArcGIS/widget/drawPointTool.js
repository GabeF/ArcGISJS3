/**
 * Draw Point Tool - Class to handle the basic drawing of a point.
 *
 * @class DrawPointTool
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
    "esri/graphicsUtils",
    "esri/layers/GraphicsLayer", 
    "esri/symbols/SimpleFillSymbol",
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
    graphicsUtils,
    GraphicsLayer,
    SimpleFillSymbol,
    SimpleMarkerSymbol,
    Draw,
    Edit
) {
    "use strict";

    return declare(null, {
        
        app: null,
        allowMultiGeometry: false,

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
            // wire up the buttons
            var btnElements = document.querySelectorAll("#arcgisw_drawHeader button");
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

            this._drawLayer = new GraphicsLayer({id: "Draw Point Tool Layer"});
            this._map.addLayer(this._drawLayer);

            // Activate the toolbar when you click on a graphic
            this._drawLayer.on("click", dojo.hitch(this, this._onLayerClick));
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
            this._updateDroppedValue(evt.graphic);
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
                    symbol = new SimpleMarkerSymbol().setColor(new Color("#FFFF00"));
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
            this._updateDroppedValue(graphic);
        },

        enableDrawTools: function(isEnabled) {
            dojoDom.byId("arcgisw_drawTools").disabled = !isEnabled;
            dojoStyle.set("arcgisw_drawMainWindow", "display", isEnabled ? "block" : "none");
        },

        _updateDroppedValue: function(graphic) {
            var latitude, longitude;

            if (graphic.geometry.type === "point")
            {
                latitude = graphic.geometry.getLatitude();
                longitude = graphic.geometry.getLongitude();
            }
            else
            {
                var extent = graphicsUtils.graphicsExtent([graphic]);
                var center = extent.getCenter();
                latitude = center.getLatitude();
                longitude = center.getLongitude();
            }

            this.app._contextObj.set(this.app.droppedLatitude, latitude);
            this.app._contextObj.set(this.app.droppedLongitude, longitude);
        }

    });
});
