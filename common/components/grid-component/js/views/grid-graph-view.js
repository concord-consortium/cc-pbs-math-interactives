(function() {
    "use strict";
    GridGraphComponent.Views.GridView = Backbone.View.extend({
        /**
         * Graphics object which is used to draw shapes on canvas
         * @peoperty pixiGraphics
         * @type {any}
         * @default null
         */
        "pixiGraphics": null,

        /**
         * Renderer object which is used to render canvas
         * @peoperty pixiRenderer
         * @type {any}
         * @default null
         */
        "pixiRenderer": null,

        /**
         * Denotes whether origin is visible for current canvas area and grid limits
         * @property isOriginVisible
         * @type boolean
         * @default false
         */
        "isOriginVisible": false,

        "drawShapesObj": null,

        "_lastViewRefresh": null,

        "_refreshTimer": null,

        /**
         * Initializes view
         *
         * @method initialize
         * @public
         */
        "initialize": function initialize() {
            this.render();
        },

        /**
         * Renders view
         *
         * @method render
         * @return {Backbone.View} current view object
         * @public
         */
        "render": function render() {
            this._resetGridGraph();
            return this;
        },

        /**
         * Resets grid graph
         */
        "_resetGridGraph": function _resetGridGraph() {
            this._createPixiRenderer();
            this.isOriginVisible = this.model.isPointVisible({
                "x": 0,
                "y": 0
            });
            this._plotGridLines();
            this._plotAxes();
            this._bindInterctionEvents();
            this._refreshGridGraph();
        },

        "_refreshGridGraph": function _refreshGridGraph() {

            var currentTime = new Date().getTime(),
                diff, CUT_OFF = 50;

            if (this._lastViewRefresh) {
                diff = currentTime - this._lastViewRefresh;
            }

            if (diff && diff < CUT_OFF) {
                if (this._refreshTimer) {
                    return;
                }
                this._refreshTimer = setInterval($.proxy(this._refreshGridGraph, this), CUT_OFF - diff);
                return;
            }

            if (this._refreshTimer) {
                clearInterval(this._refreshTimer);
                this._refreshTimer = null;
            }


            this._lastViewRefresh = currentTime;
            this.pixiRenderer.render(this.pixiGraphics);
        },

        /**
         * Creates Pixi renderer and graphics objects
         *
         * @method _createPixiRenderer
         * @private
         */
        "_createPixiRenderer": function _createPixiRenderer() {
            if (this.pixiRenderer) {
                this.$el.empty();
                this.pixiGraphics.destroy();
                this.pixiRenderer.destroy();
                this.pixiGraphics = this.pixiRenderer = this.drawShapesObj = null;
            }
            this.pixiGraphics = new PIXI.Graphics();
            this.pixiRenderer = /*PIXI.autoDetectRenderer*/ new PIXI.CanvasRenderer(this.model.get('canvasWidth'), this.model.get('canvasHeight'), {
                "backgroundColor": this.model.get('backgroundColor'),
                "antialias": true
            });
            this.pixiRenderer.view.className = "grid-graph-canvas";

            this.pixiGraphics.interactive = true;
            this.pixiGraphics.hitArea = new PIXI.Rectangle(0, 0, this.pixiRenderer.width, this.pixiRenderer.height);
            this.drawShapesObj = new ShapesComponent.DrawShapes({
                "pixiRenderer": this.pixiRenderer,
                "pixiGraphics": this.pixiGraphics
            });
            this.$el.html(this.pixiRenderer.view);
        },

        /**
         * Defines callback functions on graphics object for canvas events
         */
        "_bindInterctionEvents": function _bindInterctionEvents() {
            var shapeEvents = ShapesComponent.DrawShapes.PRIMITIVE_SHAPE_EVENTS;

            this.pixiGraphics.mouseover = $.proxy(function(eventData) {
                this._onMouseOver(eventData);
            }, this);

            this.pixiGraphics.mousedown = $.proxy(function(eventData) {
                this._onMouseDown(eventData);
                this.pixiGraphics.mousemove = null;
                this.pixiGraphics.mousemove = $.proxy(function(eventData) {
                    this._onMouseMove(eventData);
                }, this);
            }, this);

            this.pixiGraphics.mouseup = $.proxy(function(eventData) {
                this._onMouseUp(eventData);
                this.pixiGraphics.mousemove = null;
            }, this);

            this.pixiGraphics.mouseout = $.proxy(function(eventData) {
                this._onMouseOut(eventData);
            }, this);

            this.pixiGraphics.touchstart = $.proxy(function(eventData) {
                this._onTouchStart(eventData);
                this.pixiGraphics.touchmove = null;
                this.pixiGraphics.touchmove = $.proxy(function(eventData) {
                    this._onTouchMove(eventData);
                }, this);
            }, this);

            this.pixiGraphics.touchend = $.proxy(function(eventData) {
                this._onTouchEnd(eventData);
                this.pixiGraphics.touchmove = null;
            }, this);

            $(this.drawShapesObj).off(shapeEvents.SHAPE_MOUSEOVER).on(shapeEvents.SHAPE_MOUSEOVER, $.proxy(function(event, eventData, graphicObj) {
                this.trigger(shapeEvents.SHAPE_MOUSEOVER, eventData, graphicObj);
            }, this));

            $(this.drawShapesObj).off(shapeEvents.SHAPE_MOUSEDOWN).on(shapeEvents.SHAPE_MOUSEDOWN, $.proxy(function(event, eventData, graphicObj) {
                this.trigger(shapeEvents.SHAPE_MOUSEDOWN, eventData, graphicObj);
            }, this));

            $(this.drawShapesObj).off(shapeEvents.SHAPE_MOUSEOUT).on(shapeEvents.SHAPE_MOUSEOUT, $.proxy(function(event, eventData, graphicObj) {
                this.trigger(shapeEvents.SHAPE_MOUSEOUT, eventData, graphicObj);
            }, this));

            $(this.drawShapesObj).off(shapeEvents.SHAPE_MOUSEUP).on(shapeEvents.SHAPE_MOUSEUP, $.proxy(function(event, eventData, graphicObj) {
                this.trigger(shapeEvents.SHAPE_MOUSEUP, eventData, graphicObj);
            }, this));
        },

        /**
         * Handler for mouse move event
         * @param {any} eventData, object containing originalEvent, point data
         */
        "_onMouseMove": function _onMouseMove(eventData) {
            var canvasPoint = eventData.data.global,
                graphPoint = null;
            if (eventData.target.hitArea.contains(canvasPoint.x, canvasPoint.y)) {
                graphPoint = this.model.convertToGraphCoordinates(canvasPoint);
                this.trigger(GridGraphComponent.Views.GridView.GRAPH_EVENTS_NAMESPACE.GRID_GRAPH_MOUSEMOVE, graphPoint, canvasPoint);
            }
        },

        /**
         * Handler for mouse over event
         * @param {any} eventData, object containing originalEvent, point data
         */
        "_onMouseOver": function _onMouseOver(eventData) {
            var canvasPoint = eventData.data.global,
                graphPoint = this.model.convertToGraphCoordinates(canvasPoint);
            this.trigger(GridGraphComponent.Views.GridView.GRAPH_EVENTS_NAMESPACE.GRID_GRAPH_MOUSEOVER, graphPoint, canvasPoint);
        },

        /**
         * Handler for mouse down event
         * @param {any} eventData, object containing originalEvent, point data
         */
        "_onMouseDown": function _onMouseDown(eventData) {
            var canvasPoint = eventData.data.global,
                model = this.model,
                plgMainModel = model.mainModel,
                graphPoint = model.convertToGraphCoordinates(canvasPoint);
            if (this.model.mainModel.selectedLine) {
                this.model.mainModel.selectedLine.deselectLine();
                this.model.mainModel.trigger("OnDeselectLine", {});
            }

            // For hiding points of all equations of previously selected equation panel
            if (plgMainModel.idSelectedEqPanel !== plgMainModel.constants.INVALID_VALUE) {
                plgMainModel.trigger("onDeselectingEquationPanel", {
                    "eqPanelId": plgMainModel.idSelectedEqPanel
                });
            }

            // on clicking on grid selected equation panel gets deselcted.
            plgMainModel.idSelectedEqPanel = plgMainModel.constants.INVALID_VALUE;

            this.trigger(GridGraphComponent.Views.GridView.GRAPH_EVENTS_NAMESPACE.GRID_GRAPH_MOUSEDOWN, graphPoint, canvasPoint);
        },

        /**
         * Handler for mouse up event
         * @param {any} eventData, object containing originalEvent, point data
         */
        "_onMouseUp": function _onMouseUp(eventData) {
            var canvasPoint = eventData.data.global,
                graphPoint = this.model.convertToGraphCoordinates(canvasPoint);
            this.trigger(GridGraphComponent.Views.GridView.GRAPH_EVENTS_NAMESPACE.GRID_GRAPH_MOUSEUP, graphPoint, canvasPoint);
        },

        /**
         * Handler for mouse out event
         * @param {any} eventData, object containing originalEvent, point data
         */
        "_onMouseOut": function _onMouseOut(eventData) {
            var canvasPoint = eventData.data.global,
                graphPoint = this.model.convertToGraphCoordinates(canvasPoint);
            this.trigger(GridGraphComponent.Views.GridView.GRAPH_EVENTS_NAMESPACE.GRID_GRAPH_MOUSEOUT, graphPoint, canvasPoint);
        },

        /**
         * Handler for touch start event
         * @param {any} eventData, object containing originalEvent, point data
         */
        "_onTouchStart": function _onTouchStart(eventData) {
            var canvasPoint = eventData.data.global,
                model = this.model,
                plgMainModel = model.mainModel,
                graphPoint = model.convertToGraphCoordinates(canvasPoint);
            if (this.model.mainModel.selectedLine) {
                this.model.mainModel.selectedLine.deselectLine();
                this.model.mainModel.trigger("OnDeselectLine", {});
            }

            // For hiding points of all equations of previously selected equation panel
            if (plgMainModel.idSelectedEqPanel !== plgMainModel.constants.INVALID_VALUE) {
                plgMainModel.trigger("onDeselectingEquationPanel", {
                    "eqPanelId": plgMainModel.idSelectedEqPanel
                });
            }

            // on clicking on grid selected equation panel gets deselcted.
            plgMainModel.idSelectedEqPanel = plgMainModel.constants.INVALID_VALUE;

            this.trigger(GridGraphComponent.Views.GridView.GRAPH_EVENTS_NAMESPACE.GRID_GRAPH_TOUCHSTART, graphPoint, canvasPoint);
        },

        /**
         * Handler for touch end event
         * @param {any} eventData, object containing originalEvent, point data
         */
        "_onTouchEnd": function _onTouchEnd(eventData) {
            var canvasPoint = eventData.data.global,
                graphPoint = this.model.convertToGraphCoordinates(canvasPoint);
            this.trigger(GridGraphComponent.Views.GridView.GRAPH_EVENTS_NAMESPACE.GRID_GRAPH_TOUCHEND, graphPoint, canvasPoint);
        },

        /**
         * Handler for touch move event
         * @param {any} eventData, object containing originalEvent, point data
         */
        "_onTouchMove": function _onTouchMove(eventData) {
            var canvasPoint = eventData.data.global,
                graphPoint = this.model.convertToGraphCoordinates(canvasPoint);
            this.trigger(GridGraphComponent.Views.GridView.GRAPH_EVENTS_NAMESPACE.GRID_GRAPH_TOUCHMOVE, graphPoint, canvasPoint);
        },

        /**
         * Draws axes lines on canvas
         *
         * @method _plotAxes
         * @private
         */
        "_plotAxes": function _plotAxes() {
            if (this.isOriginVisible && this.model.get('showAxes')) {
                var origin = this.model.get('canvasOrigin'),
                    canvasWidth = this.model.get('canvasWidth'),
                    canvasHeight = this.model.get('canvasHeight');

                this.pixiGraphics.beginFill()
                    .lineStyle(2, this.model.get('gridAxesColor'), 1)
                    .moveTo(0, origin.y)
                    .lineTo(canvasWidth, origin.y)
                    .moveTo(origin.x, 0)
                    .lineTo(origin.x, canvasHeight)
                    .endFill();
                /*if (this.model.get('showIntervalLabels')) {
                    this._createAndAddTextLabelObject(0, {
                        "x": 0,
                        "y": 0
                    }, {
                        "font": this.model.get('labelsFontSize') + " " + this.model.get('labelsFontFamily'),
                        "fill": this.model.get('labelsFontColor')
                    }, true);
                }*/
            }
        },

        /**
         * Plots grid lines on canvas
         *
         * @method _plotGridLines
         * @private
         */
        "_plotGridLines": function _plotGridLines() {
            var gridLimits = this.model.get('gridLimits'),
                xInterval = this.model.get("xInterval"),
                yInterval = this.model.get("yInterval"),
                canvasWidth = this.model.get('canvasWidth'),
                canvasHeight = this.model.get('canvasHeight'),
                xPoint = this.model.getNearestMultipleOfInterval(gridLimits.xLower, xInterval),
                yPoint = this.model.getNearestMultipleOfInterval(gridLimits.yLower, yInterval),
                xConst,
                yConst,
                canvasOrigin = this.model.get('canvasOrigin'),
                showGridLines = this.model.get('showGridLines'),
                showLabels = this.model.get('showIntervalLabels'),
                textProp = {
                    "font": this.model.get('labelsFontSize') + " " + this.model.get('labelsFontFamily'),
                    "fill": this.model.get('labelsFontColor')
                },
                xLabel = xPoint,
                yLabel = yPoint,
                gridLinesColor = this.model.get('gridLinesColor'),
                gridLinesAlpha = this.model.get('gridLinesAlpha');

            //start grid line plotting
            this.pixiGraphics
                .beginFill(gridLinesColor, gridLinesAlpha)
                .lineStyle(1, gridLinesColor, gridLinesAlpha);

            //Plot horizontal grid lines
            if (showGridLines) {
                while (xPoint <= gridLimits.xUpper) {
                    this._drawLine({
                        "x": xPoint,
                        "y": gridLimits.yLower
                    }, {
                        "x": xPoint,
                        "y": gridLimits.yUpper
                    });
                    xPoint += xInterval;
                }

                //Plot vertical grid lines
                while (yPoint <= gridLimits.yUpper) {
                    this._drawLine({
                        "x": gridLimits.xLower,
                        "y": yPoint
                    }, {
                        "x": gridLimits.xUpper,
                        "y": yPoint
                    });
                    yPoint += yInterval;
                }
            }

            if (showLabels) {
                if (this.isOriginVisible) {
                    xConst = yConst = 0;
                } else {
                    xConst = canvasOrigin.x >= canvasWidth ? gridLimits.xUpper : gridLimits.xLower;
                    yConst = canvasOrigin.y <= 0 ? gridLimits.yUpper : gridLimits.yLower;
                }
                while (xLabel <= gridLimits.xUpper) {
                    if (xLabel !== 0) {
                        this._createAndAddTextLabelObject(xLabel, {
                            "x": xLabel,
                            "y": yConst
                        }, textProp, true);
                    }
                    xLabel += xInterval;
                }
                while (yLabel <= gridLimits.yUpper) {
                    if (yLabel !== 0) {
                        this._createAndAddTextLabelObject(yLabel, {
                            "x": xConst,
                            "y": yLabel
                        }, textProp, false);
                    }
                    yLabel += yInterval;
                }
            }

            this.pixiGraphics.endFill();
        },

        /**
         * Creates and adds labels for intervals on x and y axes
         *
         * @method _createAndAddTextLabelObject
         * @param {any} text, text for label whose value can be of type string or number
         * @param {any} position, object containing x and y positions of text
         * @param {any} textProp, styling properties for the text
         * @param {boolean} isXLabel, to check whether the label is x axis or y axis label
         * @return {PIXI.Text} textObj, Pixi text object
         * @private
         */
        "_createAndAddTextLabelObject": function _createAndAddTextLabelObject(text, position, textProp, isXLabel) {
            var textObj = new PIXI.Text(text, textProp),
                canvasPosition = this.model.convertToCanvasCoordinates(position),
                xAdjust = this._getXAdjust(canvasPosition.x, textObj, isXLabel),
                yAdjust = this._getYAdjust(canvasPosition.y, textObj, isXLabel),
                textPoint = new PIXI.Point(canvasPosition.x - xAdjust, canvasPosition.y - yAdjust);
            textObj.position = textPoint;

            this.pixiGraphics.addChild(textObj);
            return textObj;
        },

        "createAxesLabels": function createAxesLabels(txtXAxes, txtYAxes) {
            var textProp = {
                    "font": this.model.get('labelsFontSize') + " " + this.model.get('labelsFontFamily'),
                    "fill": this.model.get('labelsFontColor')
                },
                textObjXAxis = new PIXI.Text(txtXAxes, textProp),
                textObjYAxis = new PIXI.Text(txtYAxes, textProp),
                textXPoint = new PIXI.Point(390 / 2 - textObjXAxis.width / 2, 375),
                textYPoint = new PIXI.Point(0, 390 / 2 + textObjYAxis.width / 2);

            textObjXAxis.position = textXPoint;
            textObjYAxis.position = textYPoint;

            textObjYAxis.rotation = -90 * Math.PI / 180;

            this.pixiGraphics.addChild(textObjXAxis);
            this.pixiGraphics.addChild(textObjYAxis);

            this._refreshGridGraph();

            return {
                "textObjXAxis": textObjXAxis,
                "textObjYAxis": textObjYAxis
            };
        },

        "createSliderPointCoords": function(graphPoint) {
            var textProp = {
                    "font": this.model.get('labelsFontSize') + " " + this.model.get('labelsFontFamily'),
                    "fill": this.model.get('labelsFontColor')
                },
                textObj = new PIXI.Text('(' + (graphPoint.x).toFixed(1) + ', ' + (graphPoint.y).toFixed(1) + ')', textProp),
                canvasPosition = this.model.convertToCanvasCoordinates(graphPoint),
                xAdjust = this._getXAdjust(canvasPosition.x, textObj, true),
                yAdjust = this._getYAdjust(canvasPosition.y, textObj, true),
                textPoint = new PIXI.Point(canvasPosition.x + xAdjust / 2, canvasPosition.y - textObj.height / 2);

            textObj.position = textPoint;

            this.pixiGraphics.addChild(textObj);

            this._refreshGridGraph();

            return textObj;
        },

        /**
         * Calculates and returns adjustment for x position of text label
         *
         * @param {number} xPos, x position of the text object
         * @param {PIXI.Text} textObj, text object for which adjustment is to be calculated
         * @param {boolean} isXLabel, to check whether the label is x axis or y axis label
         * @return {number} adjustment for x position
         * @private
         */
        "_getXAdjust": function _getXAdjust(xPos, textObj, isXLabel) {
            var width = textObj.getBounds().width;

            if (isXLabel) {
                if (xPos + width > this.model.get('canvasWidth')) {
                    return width;
                }
                if (xPos - width / 2 < 0) {
                    return 0;
                }
                return width / 2;
            }

            if (xPos - width < 0) {
                return 0;
            }
            return width;
        },

        /**
         * Calculates and returns adjustment for y position of text label
         * @param {number} yPos, y position of the text object
         * @param {PIXI.Text} textObj, text object for which adjustment is to be calculated
         * @param {boolean} isXLabel, to check whether the label is x axis or y axis label
         * @return {number}
         * @private
         */
        "_getYAdjust": function _getYAdjust(yPos, textObj, isXLabel) {
            var height = textObj.getBounds().height;

            if (yPos + height > this.model.get('canvasHeight')) {
                return height;
            }

            if (!isXLabel) {
                if (yPos - height / 2 < 0) {
                    return 0;
                }
                return height / 2;
            }
            return 0;
        },

        /**
         * Draws line from first point to second point
         *
         * @method _drawLine
         * @param {any} point1, object containing x and y coordinates of first point
         * @param {any} point2, object containing x and y coordinates of second point
         * @return {boolean} true if atleast one point is visible else returns false
         * @private
         */
        "_drawLine": function _drawLine(point1, point2) {
            if (this.model.isPointVisible(point1) || this.model.isPointVisible(point2)) {
                var canvasPoint1 = this.model.convertToCanvasCoordinates(point1),
                    canvasPoint2 = this.model.convertToCanvasCoordinates(point2);
                this.pixiGraphics
                    .moveTo(canvasPoint1.x, canvasPoint1.y)
                    .lineTo(canvasPoint2.x, canvasPoint2.y);
                return true;
            }
            return false;
        },

        /**
         * Changes background color attribute of model
         * @param {number} backgroundColor, color for background in zero-x notation
         * @param {boolean} shouldRefresh, if true graph will be re-rendered
         */
        "changeBackgroundColor": function changeBackgroundColor(backgroundColor, shouldRefresh) {
            this.model.set('backgroundColor', backgroundColor);
            if (shouldRefresh) {
                this._resetGridGraph();
            }
        },

        /**
         * Changes grid line color attribute of model
         * @param {number} gridLineColor, color for grid lines in zero-x notation
         * @param {boolean} shouldRefresh, if true graph will be re-rendered
         */
        "changeGridLinesColor": function changeGridLinesColor(gridLineColor, shouldRefresh) {
            this.model.set('gridLinesColor', gridLineColor);
            if (shouldRefresh) {
                this._resetGridGraph();
            }
        },

        /**
         * Changes label color attribute of model
         * @param {number} gridLabelsColor, color for grid lines in zero-x notation
         * @param {boolean} shouldRefresh, if true graph will be re-rendered
         */
        "changeLabelsColor": function changeLabelsColor(gridLabelsColor, shouldRefresh) {
            this.model.set('labelsFontColor', gridLabelsColor);
            if (shouldRefresh) {
                this._resetGridGraph();
            }
        },

        /**
         * Changes axes color attribute of model
         * @param {number} gridAxesColor, color for axes in zero-x notation
         * @param {boolean} shouldRefresh, if true graph will be re-rendered
         */
        "changeGridAxesColor": function changeGridAxesColor(gridAxesColor, shouldRefresh) {
            this.model.set('gridAxesColor', gridAxesColor);
            if (shouldRefresh) {
                this._resetGridGraph();
            }
        },

        /**
         * Changes canvas height attribute of model
         * @param {number} canvasHeight, height of the canvas
         * @param {boolean} shouldRefresh, if true graph will be re-rendered
         */
        "changeCanvasHeight": function changeCanvasHeight(canvasHeight, shouldRefresh) {
            this.model.set('canvasHeight', canvasHeight);
            if (shouldRefresh) {
                this._resetGridGraph();
            }
        },

        /**
         * Changes canvas width attribute of model
         * @param {number} canvasWidth, width of the canvas
         * @param {boolean} shouldRefresh, if true graph will be re-rendered
         */
        "changeCanvasWidth": function changeCanvasWidth(canvasWidth, shouldRefresh) {
            this.model.set('canvasWidth', canvasWidth);
            if (shouldRefresh) {
                this._resetGridGraph();
            }
        },

        /**
         * Changes x interval attribute of model
         * @param {number} xInterval, new x interval
         * @param {boolean} shouldRefresh, if true graph will be re-rendered
         */
        "changeXInterval": function changeXInterval(xInterval, shouldRefresh) {
            this.model.set('xInterval', xInterval);
            if (shouldRefresh) {
                this._resetGridGraph();
            }
        },

        /**
         * Changes y interval attribute of model
         * @param {number} yInterval, new y interval
         * @param {boolean} shouldRefresh, if true graph will be re-rendered
         */
        "changeYInterval": function changeYInterval(yInterval, shouldRefresh) {
            this.model.set('yInterval', yInterval);
            if (shouldRefresh) {
                this._resetGridGraph();
            }
        },

        /**
         * Changes show axes attribute of model
         * @param {boolean} showAxes, if true axes will be shown or otherwise
         * @param {boolean} shouldRefresh, if true graph will be re-rendered
         */
        "showHideAxes": function showHideAxes(showAxes, shouldRefresh) {
            this.model.set('showAxes', showAxes);
            if (shouldRefresh) {
                this._resetGridGraph();
            }
        },

        /**
         * Changes show grid lines attribute of model
         * @param {boolean} showGridLines, if true grid lines will be shown or otherwise
         * @param {boolean} shouldRefresh, if true graph will be re-rendered
         */
        "showHideGridLines": function showHideGridLines(showGridLines, shouldRefresh) {
            this.model.set('showGridLines', showGridLines);
            if (shouldRefresh) {
                this._resetGridGraph();
            }
        },

        /**
         * Changes show interval labels attribute of model
         * @param {boolean} showIntervalLabels, if true labels will be shown or otherwise
         * @param {boolean} shouldRefresh, if true graph will be re-rendered
         */
        "showHideIntervalLabels": function showHideIntervalLabels(showIntervalLabels, shouldRefresh) {
            this.model.set('showIntervalLabels', showIntervalLabels);
            if (shouldRefresh) {
                this._resetGridGraph();
            }
        },

        /**
         * Sets grid limits fot the grid
         * @param {any} gridLimits, object containing new grid limits
         * @param {boolean} shouldRefresh, if true graph will be re-rendered
         */
        "setGridLimits": function setGridLimits(gridLimits, shouldRefresh) {
            var prevGridLimits = this.model.get('gridLimits'),
                xLower = gridLimits.xLower || prevGridLimits.xLower,
                xUpper = gridLimits.xUpper || prevGridLimits.xUpper,
                yLower = gridLimits.yLower || prevGridLimits.yLower,
                yUpper = gridLimits.yUpper || prevGridLimits.yUpper,
                newGridLimits = {
                    "xLower": Number(xLower),
                    "xUpper": Number(xUpper),
                    "yLower": Number(yLower),
                    "yUpper": Number(yUpper)
                };
            this.model.set('gridLimits', newGridLimits);
            if (shouldRefresh) {
                this._resetGridGraph();
            }
        },

        "addPointToGraph": function addPointToGraph(graphPoint, fillColor, lineColor, radius, snapToGrid, pointType) {
            var graphCoord = this.snapPointToGrid(graphPoint, snapToGrid),
                canvasCoord = this.model.convertToCanvasCoordinates(graphCoord),
                pointObj = this.drawShapesObj.plotPoint({
                    "canvasCoord": canvasCoord,
                    "fillColor": fillColor,
                    "lineColor": lineColor,
                    "radius": radius,
                    "graphCoord": graphCoord,
                    "pointType": pointType
                });
            return pointObj;
        },

        "addLineToGraph": function addLineToGraph(graphPoint1, graphPoint2, lineColor, lineWidth, lineType) {
            var canvasCoord1 = this.model.convertToCanvasCoordinates(graphPoint1),
                canvasCoord2 = this.model.convertToCanvasCoordinates(graphPoint2),
                lineObj = this.drawShapesObj.plotLine({
                    "canvasCoord1": canvasCoord1,
                    "canvasCoord2": canvasCoord2,
                    "lineColor": lineColor,
                    "lineWidth": lineWidth,
                    "lineType": lineType
                });
            return lineObj;
        },

        "moveLineEnd": function moveLineEnd(lineObj, graphPoint) {
            var canvasCoord = this.model.convertToCanvasCoordinates(graphPoint);
            this.drawShapesObj.moveLineEnd(lineObj, canvasCoord);
        },

        "bringToFront": function bringToFront(graphicsObj) {
            this.drawShapesObj.bringToFront(graphicsObj);
        },

        "snapPointToGrid": function _snapPointToGrid(graphPoint, snapToGrid) {
            if (!snapToGrid) {
                return graphPoint;
            }
            var newGraphPoint = {
                    "x": GridGraphComponent.Models.GridModel.roundNumber(graphPoint.x),
                    "y": GridGraphComponent.Models.GridModel.roundNumber(graphPoint.y)
                },
                xInterval = this.model.get('xInterval'),
                yInterval = this.model.get('yInterval'),
                nearestXInterval = GridGraphComponent.Models.GridModel.roundNumber(newGraphPoint.x / xInterval) * xInterval,
                nearestYInterval = GridGraphComponent.Models.GridModel.roundNumber(newGraphPoint.y / yInterval) * yInterval;
            newGraphPoint = {
                "x": nearestXInterval,
                "y": nearestYInterval
            };
            return newGraphPoint;
        }


    }, {
        /**
         * Creates and returns instance of grid graph view
         * @param {any} gridOptions, option object for initializing model
         * @return {GridGraphView} gridGraphView, instance of grid view
         */
        "createGridGraph": function createGridGraph(gridOptions) {
            if (!gridOptions.containerId) {
                console.log("PLEASE PROVIDE CONTAINER ID FOR GRAPH");
                return;
            }
            var containerId = "#" + gridOptions.containerId,
                gridGraphModel = new GridGraphComponent.Models.GridModel(gridOptions),
                gridGraphView = new GridGraphComponent.Views.GridView({
                    "model": gridGraphModel,
                    "el": containerId
                });
            return gridGraphView;
        },

        /**
         * Namespace for graph events
         * @type {any}
         */
        "GRAPH_EVENTS_NAMESPACE": GridGraphComponent.Models.GridModel.GRAPH_EVENTS
    });
})(GridGraphComponent);
