(function() {
    "use strict";
    ShapesComponent.Shapes.Point = function(options) {
        this.fillColor = options.fillColor || ShapesComponent.Shapes.Point.DEFAULT_COLOR;
        this.lineColor = options.lineColor || ShapesComponent.Shapes.Point.DEFAULT_LINE_COLOR;
        this.graphicsRenderer = new PIXI.Graphics();
        this.shapeType = options.shapeType;
        this.graphCoord = options.graphCoord;
        this.canvasCoord = options.canvasCoord;
        this.radius = typeof options.radius !== "undefined" ? options.radius : ShapesComponent.Shapes.Point.DEFAULT_RADIUS;
        this.shapeObject = null;
        this.offspring = null;
        this.gridGraphView = null;
        this.pointType = options.pointType
    };

    var PointPrototype = ShapesComponent.Shapes.Point.prototype;

    PointPrototype.createShape = function() {
        this.drawShape();
        if (this.pointType === 1) {
            this.bindEvents();
        }
    };

    PointPrototype.drawShape = function() {
        var circleObj = new PIXI.Circle(this.canvasCoord.x, this.canvasCoord.y, this.radius);
        this.shapeObject = this.graphicsRenderer
            .beginFill(this.fillColor, 0)
            .lineStyle(2, this.lineColor, 1)
            .drawShape(circleObj);
        this.graphicsRenderer.endFill();

        if ('ontouchstart' in window) {
            this._setHitArea();
        } else {
            this._setHitArea();
        }
        this.graphicsRenderer.visible = false;
    };

    /**
     * set hit area for point object
     */
    PointPrototype._setHitArea = function() {
        if (this.pointType === 2) {
            return;
        }
        if (this.graphicsRenderer.hitArea) {
            this.graphicsRenderer.hitArea.x = this.canvasCoord.x;
            this.graphicsRenderer.hitArea.y = this.canvasCoord.y;
        } else if ('ontouchstart' in window) {
            this.graphicsRenderer.hitArea = new PIXI.Circle(this.canvasCoord.x, this.canvasCoord.y, this.radius + 10);
        } else {
            this.graphicsRenderer.hitArea = new PIXI.Circle(this.canvasCoord.x, this.canvasCoord.y, this.radius + 5);
        }
    };

    /**
     * change point object visibility
     * @param  {[type]} visible [determines whether to hide or show the point object]
     */
    PointPrototype.changeObjectVisibility = function(visible) {
        this.graphicsRenderer.visible = visible;
        this.gridGraphView._refreshGridGraph();
    };

    /**
     * update point style
     * @param  {[type]} toFill [determines whether to fill the point object or not]
     */
    PointPrototype.changePointStyle = function(toFill) {
        if (toFill) {
            this.shapeObject.fillAlpha = 1;
        } else {
            this.shapeObject.fillAlpha = 0;
        }
        this.gridGraphView._refreshGridGraph();
    }

    /**
     * delete the point object
     */
    PointPrototype.delete = function() {
        this.graphicsRenderer.clear();

        this.graphicsRenderer.mousedown = null;
        this.graphicsRenderer.mousemove = null;
        this.graphicsRenderer.mouseup = null;
        this.graphicsRenderer.touchstart = null;
        this.graphicsRenderer.touchmove = null;
        this.graphicsRenderer.touchend = null;

        this.changeObjectVisibility(false);
    };

    /**
     * update point position while dragging
     * @param  {[type]} deltaX [change x position by deltaX]
     * @param  {[type]} deltaY [change y position by deltaY]
     */
    PointPrototype.update = function(deltaX, deltaY) {
        var graphPoints = {};
        this.shapeObject.shape.x += deltaX;
        this.shapeObject.shape.y += deltaY;
        this.canvasCoord.x = this.shapeObject.shape.x;
        this.canvasCoord.y = this.shapeObject.shape.y;

        graphPoints = this.gridGraphView.model.convertToGraphCoordinates(this.canvasCoord);

        this.graphCoord.x = Number(graphPoints.x.toFixed(1));
        this.graphCoord.y = Number(graphPoints.y.toFixed(1));

        this._setHitArea();

        this.gridGraphView._refreshGridGraph();
    };

    PointPrototype.bindEvents = function() {
        var eventsNamespace = ShapesComponent.DrawShapes.PRIMITIVE_SHAPE_EVENTS;
        this.graphicsRenderer.interactive = true;
        this.graphicsRenderer.touchstart = this.graphicsRenderer.mousedown = $.proxy(function(eventData) {
            var plgMainModel = this.graphView.model;

            eventData.stopPropagation();

            // For hiding points of all equations of previously selected equation panel
            if (plgMainModel.idSelectedEqPanel !== plgMainModel.constants.INVALID_VALUE &&
                plgMainModel.idSelectedEqPanel !== this.offspring.equationPanelData.idEquationPanel) {
                plgMainModel.trigger("onDeselectingEquationPanel", {
                    "eqPanelId": plgMainModel.idSelectedEqPanel
                });
            }

            plgMainModel.idSelectedEqPanel = this.offspring.equationPanelData.idEquationPanel;

            // For hiding points of all equations of currently selected equation panel
            plgMainModel.trigger("onSelectingEquationPanel", {
                "eqPanelId": plgMainModel.idSelectedEqPanel
            });

            this.offspring.selectLine();

            plgMainModel.trigger("changeEquationSelection", {
                "affectedEqPanelId": plgMainModel.idSelectedEqPanel,
                "idSelectedLine": this.offspring.lineId
            });

            this.downPosition = _.clone(eventData.data.global);

            $(this).trigger(eventsNamespace.SHAPE_MOUSEDOWN, eventData);

            this.graphicsRenderer.touchmove = this.graphicsRenderer.mousemove = null;
            this.graphicsRenderer.touchmove = this.graphicsRenderer.mousemove = $.proxy(function(eventData) {
                var deltaX, deltaY, indexOfCurrrentPoint, movingPoint, idlePoint,
                    indexOfOtherPoint, sources = this.offspring.sources;

                indexOfCurrrentPoint = this.offspring.sources.indexOf(this);
                indexOfOtherPoint = indexOfCurrrentPoint === 0 ? 1 : 0;
                movingPoint = sources[indexOfCurrrentPoint];
                idlePoint = sources[indexOfOtherPoint];

                eventData.stopPropagation();
                deltaX = eventData.data.global.x - this.downPosition.x;
                deltaY = eventData.data.global.y - this.downPosition.y;

                if (indexOfCurrrentPoint === 0 && movingPoint.shapeObject.shape.x + deltaX < idlePoint.shapeObject.shape.x ||
                    indexOfCurrrentPoint === 1 && movingPoint.shapeObject.shape.x + deltaX > idlePoint.shapeObject.shape.x) {
                    this.downPosition = _.clone(eventData.data.global);
                    this.update(deltaX, deltaY);
                    this.offspring.update();
                }
            }, this);

            window.ontouchend = window.onmouseup = $.proxy(function(eventData) {
                this.graphicsRenderer.touchmove = this.graphicsRenderer.mousemove = null;
                window.touchend = window.onmouseup = null;
                this.downPosition = null;
            }, this);
        }, this);

        this.graphicsRenderer.mouseover = $.proxy(function(eventData) {
            eventData.stopPropagation();
            $(this).trigger(eventsNamespace.SHAPE_MOUSEOVER, eventData);
        }, this);

        this.graphicsRenderer.mouseout = $.proxy(function(eventData) {
            eventData.stopPropagation();
            $(this).trigger(eventsNamespace.SHAPE_MOUSEOUT, eventData);
        }, this);

        this.graphicsRenderer.touchend = this.graphicsRenderer.mouseup = $.proxy(function(eventData) {
            eventData.stopPropagation();
            $(this).trigger(eventsNamespace.SHAPE_MOUSEUP, eventData);
            this.graphicsRenderer.touchmove = this.graphicsRenderer.mousemove = null;
            this.downPosition = null;
        }, this);
    };

    ShapesComponent.Shapes.Point.POINT_TYPE = {
        "SLIDER_POINT": 0,
        "POINT": 1,
        "RAY_POINT": 2
    };

    ShapesComponent.Shapes.Point.DEFAULT_COLOR = 0x000000;
    ShapesComponent.Shapes.Point.DEFAULT_LINE_COLOR = 0x9b9b9b;
    ShapesComponent.Shapes.Point.DEFAULT_RADIUS = 5;

})(ShapesComponent);
