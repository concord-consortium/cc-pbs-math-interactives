(function() {
    "use strict";
    /**
     * Class for grid-graph model
     * @class GridGraphModel
     * @type {Backbone.Model}
     * @extend {Backbone.Model}
     */
    GridGraphComponent.Models.GridModel = Backbone.Model.extend({

        /**
         * Returns an object containing default attributes of the model
         *
         * @method defaults
         * @return {GridGraphModelAttrClass} object containing default properties
         * @private
         */
        "defaults": function defaults() {
            return {
                /**
                 * Background color of the canvas area
                 * @type {number}
                 * @default 0xffffff
                 */
                "backgroundColor": 0xffffff,

                /**
                 * Height of the canvas area
                 * @type {number}
                 * @default 0
                 */
                "canvasHeight": GridGraphComponent.Models.GridModel.DEFAULT_CANVAS_HEIGHT,

                /**
                 * Object containing canvas specific x and y coordinates of the origin (0, 0)
                 * @type {any}
                 * @default null
                 */
                "canvasOrigin": null,

                /**
                 * Width of the canvas area
                 * @type {number}
                 * @default 0
                 */
                "canvasWidth": GridGraphComponent.Models.GridModel.DEFAULT_CANVAS_HEIGHT,

                /**
                 * Id of the graph container
                 * @type {string}
                 * @default null
                 */
                "containerId": null,

                /**
                 * Color of the grid axes
                 * @type {number}
                 * @default 0x000000
                 */
                "gridAxesColor": 0x9b9b9b,

                /**
                 * Object containing uppermost and lowermost values of x and y coordinates
                 * @type {any}
                 * @default null
                 */
                "gridLimits": {
                    "xLower": -10,
                    "xUpper": 100,
                    "yLower": -10,
                    "yUpper": -100
                },

                /**
                 * Color of grid lines
                 * @type {number}
                 * @default 0x000000
                 */
                "gridLinesColor": 0x000000,

                /**
                 * Alpha for grid lines
                 * @type {number}
                 * @default 0.12
                 */
                "gridLinesAlpha": 0.12,

                /**
                 * Color of the text labels for the grid intervals
                 * @type {number}
                 * @default 0x000000
                 */
                "labelsFontColor": 0x000000,

                /**
                 * Font family of grpah labels
                 * @type {string}
                 * @default arial
                 */
                "labelsFontFamily": "Lato, Arial",

                /**
                 * Font size of graph labels
                 * @type {string}
                 * @default 12px
                 */
                "labelsFontSize": "12px",

                /**
                 * Denotes whether to show or hide the axes lines
                 * @type {boolean}
                 * @default true
                 */
                "showAxes": true,

                /**
                 * Denotes whether to show or hide the grid lines
                 * @type {boolean}
                 * @default true
                 */
                "showGridLines": true,

                /**
                 * Denotes whether to show or hide the axis labels
                 * @type {boolean}
                 * @default true
                 */
                "showIntervalLabels": true,

                /**
                 * Value of each interval on x-axis
                 * @type {string}
                 * @default null
                 */
                "xInterval": 10,

                /**
                 * Ratio of x-axis range to canvas width
                 * @type {number}
                 * @default null
                 */
                "xRatio": null,

                /**
                 * Value of each interval on y-axis
                 * @type {string}
                 * @default null
                 */
                "yInterval": 10,

                /**
                 * Ratio of y-axis range to canvas height
                 * @type {number}
                 * @default null
                 */
                "yRatio": null
            };
        },

        /**
         * Initializes the model
         *
         * @method initialize
         * @public
         */
        "initialize": function initialize(gridOptions) {
            this.listenTo(this, "change", this._calculateAndSetGridData);
            this._calculateAndSetGridData();
            this.mainModel = gridOptions.mainModel;
        },

        /**
         * Performs necessary calculations and sets respective attributes of the model
         * Calculations include calculation of coordinates for canvas origin, grid limits and graph area to grid limits ratio
         *
         * @method _calculateAndSetGridData
         * @private
         */
        "_calculateAndSetGridData": function _calculateAndSetGridData() {
            var gridLimits = this.get('gridLimits'),
                xLower = gridLimits.xLower,
                xUpper = gridLimits.xUpper,
                yLower = gridLimits.yLower,
                yUpper = gridLimits.yUpper,
                canvasWidth = this.get('canvasWidth'),
                canvasHeight = this.get('canvasHeight'),
                canvasOrigin,
                xRatio = 0,
                yRatio = 0;
            xRatio = Math.abs(xUpper - xLower) / canvasWidth;
            yRatio = Math.abs(yUpper - yLower) / canvasHeight;
            canvasOrigin = this._getCanvasOrigin(xRatio, yRatio, gridLimits);
            this.set({
                "canvasOrigin": canvasOrigin,
                "xRatio": xRatio,
                "yRatio": yRatio
            });
        },

        /**
         * Calculates and returns canvas specific coordinates of origin
         *
         * @method _getCanvasOrigin
         * @param {number} xRatio, ratio of x-axis range to canvas width
         * @param {number} yRatio, ratio of y-axis range to canvas height
         * @param {any} gridLimits
         * @return {any} object containing canvas specific coordinates of origin
         */
        "_getCanvasOrigin": function _getCanvasOrigin(xRatio, yRatio, gridLimits) {
            var xCanvasOrigin = -gridLimits.xLower / xRatio,
                yCanvasOrigin = this.get('canvasHeight') + gridLimits.yLower / yRatio;
            return {
                "x": xCanvasOrigin,
                "y": yCanvasOrigin
            };
        },

        /**
         * Converts graph specific coordinates to canvas specific coordinates
         *
         * @method convertToCanvasCoordinates
         * @param {any} graphPoint object containing x and y graph coordinates
         * @return {any} canvasPoint object containing canvas x and y coordinates
         * @public
         */
        "convertToCanvasCoordinates": function convertToCanvasCoordinates(graphPoint) {
            var canvasOrigin = this.get('canvasOrigin'),
                canvasPoint = {
                    "x": canvasOrigin.x + graphPoint.x / this.get('xRatio'),
                    "y": canvasOrigin.y - graphPoint.y / this.get('yRatio')
                };
            return canvasPoint;
        },

        /**
         * Converts canvas specific coordinates to graph specific coordinates
         *
         * @method convertToGraphCoordinates
         * @param {any} canvasPoint object containing x and y canvas coordinates
         * @return {any} graphPoint object containing graph x and y coordinates
         * @public
         */
        "convertToGraphCoordinates": function convertToGraphCoordinates(canvasPoint) {
            var canvasOrigin = this.get('canvasOrigin'),
                graphPoint = {
                    "x": (canvasPoint.x - canvasOrigin.x) * this.get('xRatio'),
                    "y": (canvasOrigin.y - canvasPoint.y) * this.get('yRatio')
                };
            return graphPoint;
        },

        /**
         * Calculates if a graph point is visible for current grid limits
         *
         * @method isPointVisible
         * @param {any} graphPoint, x and y coordinates of point
         * @return {boolean} isVisible, true if point is inside grid and vice versa
         */
        "isPointVisible": function isPointVisible(graphPoint) {
            var isVisible = false,
                gridLimits = this.get('gridLimits');

            if (graphPoint.x <= gridLimits.xUpper && graphPoint.x >= gridLimits.xLower &&
                graphPoint.y <= gridLimits.yUpper && graphPoint.y >= gridLimits.yLower) {
                isVisible = true;
            }
            return isVisible;
        },

        /**
         * Calculates and returns multiple of a number that is greter than and nearest to a value
         *
         * @method getNearestMultipleOfInterval
         * @param {number} value, number from which nearest multiple is to be calculated
         * @param {number} interval, number whose multiple is to be found
         * @return {number} nearestMultiple, multiple of interval nearest to a value
         */
        "getNearestMultipleOfInterval": function getNearestMultipleOfInterval(value, interval) {
            var remainder = value % interval,
                diff = remainder <= 0 ? remainder : interval - remainder,
                nearestMultiple = value + diff * this.getSignOfNumber(value);
            return nearestMultiple;
        },

        /**
         * Returns sign of a number
         *
         * @method getSignOfNumber
         * @param {number} val, number whose sign is to be determined
         * @return {number}, 0 if value is zero, -1 if value is negative, 1 if value is positive
         */
        "getSignOfNumber": function getSignOfNumber(val) {
            return val ? val < 0 ? -1 : 1 : 0;
        }
    }, {
        /**
         * List of graph events
         * @type {Object}
         */
        "GRAPH_EVENTS": {
            "GRID_GRAPH_MOUSEMOVE": "grid-graph-mousemove",
            "GRID_GRAPH_MOUSEDOWN": "grid-graph-mousedown",
            "GRID_GRAPH_MOUSEUP": "grid-graph-mouseup",
            "GRID_GRAPH_MOUSEOVER": "grid-graph-mouseover",
            "GRID_GRAPH_MOUSEOUT": "grid-graph-mouseout",
            "GRID_GRAPH_TOUCHSTART": "grid-graph-touchstart",
            "GRID_GRAPH_TOUCHEND": "grid-graph-touchend",
            "GRID_GRAPH_TOUCHMOVE": "grid-graph-touchmove"
        },

        /**
         * Rounds number upto specified decimal places
         *
         * @method roundNumber
         * @param {number} input number to be rounded
         * @param {number} noOfDecimalPlaces degree upto which number should be rounded
         * @return {number} rounded number
         * @public
         */
        "roundNumber": function roundNumber(input, noOfDecimalPlaces) {
            var divisionFactor = noOfDecimalPlaces ? Math.pow(10, noOfDecimalPlaces) : Math.pow(10, 0);
            return Math.round(input * divisionFactor) / divisionFactor;
        },

        "DEFAULT_CANVAS_WIDTH": 400,
        "DEFAULT_CANVAS_HEIGHT": 400
    });
})(GridGraphComponent);
