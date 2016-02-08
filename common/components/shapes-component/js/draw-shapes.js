(function() {
    "use strict";

    ShapesComponent.DrawShapes = function(options) {
        this.pixiRenderer = options.pixiRenderer;
        this.pixiGraphics = options.pixiGraphics;
        this.lineArray = [];
        if (!this.pixiGraphics.hitArea) {
            this.pixiGraphics.hitArea = new PIXI.Rectangle(0, 0, this.pixiRenderer.width, this.pixiRenderer.height);
        }
    };

    var DrawShapesPrototype = ShapesComponent.DrawShapes.prototype;

    DrawShapesPrototype.plotPoint = function(pointOptions) {
        var pointObj = new ShapesComponent.Shapes.Point(pointOptions);
        pointObj.createShape();
        this.pixiGraphics.addChild(pointObj.graphicsRenderer);
        this.pixiRenderer.render(this.pixiGraphics);
        this.bindEventOnGraphicsObject(pointObj);
        return pointObj;
    };

    DrawShapesPrototype.plotLine = function(options) {
        var lineOptions = $.extend({}, options, {
                "canvasWidth": this.pixiRenderer.width,
                "canvasHeight": this.pixiRenderer.height
            }),
            lineObj = new ShapesComponent.Shapes.Line(lineOptions);
        lineObj.createShape();
        this.lineArray.push(lineObj);
        this.pixiGraphics.addChild(lineObj.graphicsRenderer);
        this.pixiRenderer.render(this.pixiGraphics);
        return lineObj;
    };

    DrawShapesPrototype.moveLineEnd = function(lineObj, canvasCoord) {
        lineObj.moveLineEnd(canvasCoord);
        this.pixiRenderer.render(this.pixiGraphics);
    };

    DrawShapesPrototype.bringToFront = function(shapeObj) {
        var graphicsData = this.pixiGraphics.children,
            objIndex = graphicsData.indexOf(shapeObj.graphicsRenderer),
            objArrayLength = graphicsData.length,
            frontObjArray = null;
        if (objIndex === objArrayLength - 1) {
            return;
        }

        frontObjArray = graphicsData.splice(objIndex, 1);
        graphicsData.push(frontObjArray[0]);
        this.pixiRenderer.render(this.pixiGraphics);
    };

    DrawShapesPrototype.bindEventOnGraphicsObject = function(shapeObj) {
        var eventsNamespace = ShapesComponent.DrawShapes.PRIMITIVE_SHAPE_EVENTS;
        $(shapeObj)
            .off(eventsNamespace.SHAPE_MOUSEOVER)
            .on(eventsNamespace.SHAPE_MOUSEOVER, $.proxy(function(event, eventData) {
                $(this).trigger(eventsNamespace.SHAPE_MOUSEOVER, [eventData, shapeObj]);
            }, this))
            .off(eventsNamespace.SHAPE_MOUSEOUT)
            .on(eventsNamespace.SHAPE_MOUSEOUT, $.proxy(function(event, eventData) {
                $(this).trigger(eventsNamespace.SHAPE_MOUSEOUT, [eventData, shapeObj]);
            }, this))
            .off(eventsNamespace.SHAPE_MOUSEDOWN)
            .on(eventsNamespace.SHAPE_MOUSEDOWN, $.proxy(function(event, eventData) {
                $(this).trigger(eventsNamespace.SHAPE_MOUSEDOWN, [eventData, shapeObj]);
            }, this))
            .off(eventsNamespace.SHAPE_MOUSEUP)
            .on(eventsNamespace.SHAPE_MOUSEUP, $.proxy(function(event, eventData) {
                $(this).trigger(eventsNamespace.SHAPE_MOUSEUP, [eventData, shapeObj]);
            }, this))
            .off(eventsNamespace.SHAPE_TOUCHSTART)
            .on(eventsNamespace.SHAPE_TOUCHSTART, $.proxy(function(event, eventData) {
                $(this).trigger(eventsNamespace.SHAPE_TOUCHSTART, [eventData, shapeObj]);
            }, this))
            .off(eventsNamespace.SHAPE_TOUCHEND)
            .on(eventsNamespace.SHAPE_TOUCHEND, $.proxy(function(event, eventData) {
                $(this).trigger(eventsNamespace.SHAPE_TOUCHEND, [eventData, shapeObj]);
            }, this))
            .off(eventsNamespace.SHAPE_TOUCHMOVE)
            .on(eventsNamespace.SHAPE_TOUCHMOVE, $.proxy(function(event, eventData) {
                $(this).trigger(eventsNamespace.SHAPE_TOUCHMOVE, [eventData, shapeObj]);
            }, this));
    };

    ShapesComponent.DrawShapes.PRIMITIVE_SHAPE_EVENTS = {
        "SHAPE_MOUSEOVER": "shape-mouseover",
        "SHAPE_MOUSEOUT": "shape-mouseout",
        "SHAPE_MOUSEDOWN": "shape-mousedown",
        "SHAPE_MOUSEUP": "shape-mouseup",
        "SHAPE_TOUCHSTART": "shape-touchstart",
        "SHAPE_TOUCHEND": "shape-touchend",
        "SHAPE_TOUCHMOVE": "shape-touchmove"
    };
})(ShapesComponent);
