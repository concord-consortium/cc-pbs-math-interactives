(function() {
    "use strict";
    ShapesComponent.Shapes.Line = function(options) {
        this.graphicsRenderer = new PIXI.Graphics();
        this.canvasWidth = options.canvasWidth;
        this.canvasHeight = options.canvasHeight;
        this.shapeType = options.shapeType;
        this.lineType = options.lineType || ShapesComponent.Shapes.Line.LINE_TYPE.LINE;
        this.canvasCoord1 = options.canvasCoord1;
        this.canvasCoord2 = options.canvasCoord2;
        this.arrowHead1 = null;
        this.arrowHead2 = null;
        this.lineColor = options.lineColor || ShapesComponent.Shapes.Line.DEFAULT_LINE_COLOR;
        this.lineWidth = options.lineWidth || ShapesComponent.Shapes.Line.DEFAULT_LINE_WIDTH;
        this.lineAlpha = options.lineAlpha || ShapesComponent.Shapes.Line.DEFAULT_LINE_ALPHA;
        this.lineSlope = null;
        this.yIntercept = null;
        this.sources = [];
        this.downPosition = {};
        this.gridGraphView = null;
        this.graphView = null;
        this.lineId = null;
        this.isPositiveInfinity = null;
        this.isSelected = null;
    };

    var LinePrototype = ShapesComponent.Shapes.Line.prototype;

    LinePrototype.createShape = function() {
        this.drawShape();
        this.bindEvents();
    };

    LinePrototype.bindEvents = function() {
        this.graphicsRenderer.interactive = true;
        this.graphicsRenderer.buttonMode = true;
        this.graphicsRenderer.mouseover = $.proxy(function(eventData) {
            eventData.stopPropagation();
        }, this);

        this.graphicsRenderer.mouseout = $.proxy(function(eventData) {
            eventData.stopPropagation();
        }, this);

        this.graphicsRenderer.touchstart = this.graphicsRenderer.mousedown = $.proxy(function(eventData) {
            var plgMainModel = this.graphView.model;

            eventData.stopPropagation();

            // For hiding points of all equations of previously selected equation panel
            if (plgMainModel.idSelectedEqPanel !== plgMainModel.constants.INVALID_VALUE &&
                plgMainModel.idSelectedEqPanel !== this.equationPanelData.idEquationPanel) {
                plgMainModel.trigger("onDeselectingEquationPanel", {
                    "eqPanelId": plgMainModel.idSelectedEqPanel
                });
            }

            plgMainModel.idSelectedEqPanel = this.equationPanelData.idEquationPanel;

            // For hiding points of all equations of currently selected equation panel
            plgMainModel.trigger("onSelectingEquationPanel", {
                "eqPanelId": plgMainModel.idSelectedEqPanel
            });

            this.selectLine();

            plgMainModel.trigger("changeEquationSelection", {
                "affectedEqPanelId": plgMainModel.idSelectedEqPanel,
                "idSelectedLine": this.lineId
            });

            this.downPosition = _.clone(eventData.data.global);

            this.graphicsRenderer.touchmove = this.graphicsRenderer.mousemove = null;
            this.graphicsRenderer.touchmove = this.graphicsRenderer.mousemove = $.proxy(function(eventData) {
                var deltaX, deltaY, key;
                eventData.stopPropagation();
                deltaX = eventData.data.global.x - this.downPosition.x;
                deltaY = eventData.data.global.y - this.downPosition.y;
                this.downPosition = _.clone(eventData.data.global);
                for (key in this.sources) {
                    this.sources[key].update(deltaX, deltaY);
                }
                this.update();
            }, this);

            window.ontouchend = window.onmouseup = $.proxy(function(eventData) {
                this.graphicsRenderer.touchmove = this.graphicsRenderer.mousemove = null;
                window.touchend = window.onmouseup = null;
                this.downPosition = null;
            }, this);

        }, this);

        this.graphicsRenderer.touchend = this.graphicsRenderer.mouseup = $.proxy(function(eventData) {
            eventData.stopPropagation();
            this.graphicsRenderer.touchmove = this.graphicsRenderer.mousemove = null;
            this.downPosition = null;
        }, this);
    };

    /**
     * change line object visibility
     * @param  {[boolean]} visible [varaible that determines to show or hide the line object]
     */
    LinePrototype.changeObjectVisibility = function(visible) {
        var sources = this.sources,
            key;
        this.graphicsRenderer.visible = visible;

        this.gridGraphView._refreshGridGraph();
    };

    /**
     * update source point style based on the equation.
     * @param  {[object]} lineData [line data object]
     */
    LinePrototype.updateSourcePointStyle = function(lineData) {
        var sources = this.sources.slice(),
            len = sources.length,
            plgMainModel = this.graphView.model,
            ctr;

        if (lineData.lineTypeId === plgMainModel.constants.NEG_INFINITY_RAY) {
            sources = sources.reverse();
        }

        for (ctr = 0; ctr < len; ctr++) {
            if (ctr === 0) {
                sources[ctr].changePointStyle(lineData.xRangeLeftRelation === plgMainModel.constants.LESS_THAN_OR_EQUAL);
            } else if (ctr === 1) {
                sources[ctr].changePointStyle(lineData.xRangeRightRelation === plgMainModel.constants.LESS_THAN_OR_EQUAL);
            }
        }
    };

    /**
     * delete line object
     */
    LinePrototype.delete = function() {
        var key, model = this.graphView.model,
            sources = this.sources;
        for (key in sources) {
            sources[key].delete();
        }
        this.graphicsRenderer.clear();
        this.graphicsRenderer.hitArea = null;
        this.graphicsRenderer.mousedown = null;
        this.graphicsRenderer.mousemove = null;
        this.graphicsRenderer.mouseup = null;
        this.graphicsRenderer.touchstart = null;
        this.graphicsRenderer.touchmove = null;
        this.graphicsRenderer.touchend = null;

        this.changeObjectVisibility(false);

        if (model.selectedLine && this.lineId === model.selectedLine.lineId) {
            this.graphView.model.seelctedLine = null;
        }
    };

    /**
     * select line object
     */
    LinePrototype.selectLine = function() {
        var plgMainModel = this.graphView.model;
        if (plgMainModel.selectedLine && plgMainModel.selectedLine.lineId === this.lineId &&
            plgMainModel.idSelectedEqPanel !== plgMainModel.constants.INVALID_VALUE &&
            plgMainModel.idSelectedEqPanel === this.equationPanelData.idSelectedEqPanel) {
            return;
        }
        if (plgMainModel.selectedLine) {
            plgMainModel.selectedLine.deselectLine();
        }
        plgMainModel.selectedLine = this;
        this.equationPanelData.idSelectedLine = this.lineId;
        this.shapeObject.lineWidth = ShapesComponent.Shapes.Line.DEFAULT_SELECTED_LINE_WIDTH;
        this.isSelected = true;
        this.gridGraphView._refreshGridGraph();
        plgMainModel.trigger("onSelectLine");
    };

    /**
     * on deselecting a line
     */
    LinePrototype.deselectLine = function() {
        this.graphView.model.selectedLine = null;
        this.shapeObject.lineWidth = ShapesComponent.Shapes.Line.DEFAULT_LINE_WIDTH;
        this.isSelected = false;
        this.gridGraphView._refreshGridGraph();
    };

    /**
     * update ray arrow head position while dragging.
     */
    LinePrototype.updateArrowHead = function() {
        var arrowHeadPoints = this.arrowHead2.shape.points,
            canvasCoord = this.canvasCoord2,
            arrowPoints = this.getArrowPoints(canvasCoord);

        arrowHeadPoints[0] = canvasCoord.x;
        arrowHeadPoints[1] = canvasCoord.y;
        arrowHeadPoints[2] = arrowPoints[0];
        arrowHeadPoints[3] = arrowPoints[1];
        arrowHeadPoints[4] = arrowPoints[2];
        arrowHeadPoints[5] = arrowPoints[3];
    };

    /**
     * update ray infinity point
     */
    LinePrototype.updateRayInfinity = function() {
        var sources = this.sources,
            graphView = this.graphView,
            model = graphView.model,
            indexOfInfinityPoint, key,
            equationPanelData = this.equationPanelData,
            lineData = equationPanelData.lineData[equationPanelData.idSelectedLine],
            linePoints = this.shapeObject.shape.points;

        for (key in sources) {
            if (sources[key].shapeObject.shape.radius === 0) {
                indexOfInfinityPoint = Number(key);
                break;
            }
        }

        lineData.displacement = model.getIntercept(lineData);

        sources[indexOfInfinityPoint].graphCoord = this.isPositiveInfinity ? model.getHighGraphPointFromSlope(lineData.slope, lineData.displacement) : model.getLowGraphPointFromSlope(lineData.slope, lineData.displacement);

        if (this.isPositiveInfinity) {
            lineData["x2"] = sources[indexOfInfinityPoint].graphCoord.x;
            lineData["y2"] = sources[indexOfInfinityPoint].graphCoord.y;
        } else {
            lineData["x1"] = sources[indexOfInfinityPoint].graphCoord.x;
            lineData["y1"] = sources[indexOfInfinityPoint].graphCoord.y;
        }

        sources[indexOfInfinityPoint].canvasCoord = this.gridGraphView.model.convertToCanvasCoordinates(sources[indexOfInfinityPoint].graphCoord);

        linePoints[2 * indexOfInfinityPoint] = sources[indexOfInfinityPoint].canvasCoord.x;
        linePoints[2 * indexOfInfinityPoint + 1] = sources[indexOfInfinityPoint].canvasCoord.y;

        if (indexOfInfinityPoint === 0) {
            this.canvasCoord1.x = sources[indexOfInfinityPoint].canvasCoord.x;
            this.canvasCoord1.y = sources[indexOfInfinityPoint].canvasCoord.y;
        } else {
            this.canvasCoord2.x = sources[indexOfInfinityPoint].canvasCoord.x;
            this.canvasCoord2.y = sources[indexOfInfinityPoint].canvasCoord.y;
        }

    };

    /**
     * update line position while dragging
     */
    LinePrototype.update = function() {
        var sources = this.sources,
            model = this.graphView.model,
            currentSource, currentSourcePoints,
            graphPoints, equationPanelData = this.equationPanelData,
            lineData = equationPanelData.lineData[equationPanelData.idSelectedLine],
            linePoints = this.shapeObject.shape.points,
            len = sources.length,
            ctr = 0,
            key, tempCtr;

        switch (this.lineType) {
            case 0:
                //For Ray
                for (ctr = 0; ctr < len; ctr++) {
                    currentSource = sources[ctr];
                    currentSourcePoints = [currentSource.shapeObject.shape.x, currentSource.shapeObject.shape.y];

                    graphPoints = currentSource.graphCoord;

                    if (ctr === 0) {
                        this.canvasCoord1.x = currentSourcePoints[0];
                        this.canvasCoord1.y = currentSourcePoints[1];
                    } else {
                        this.canvasCoord2.x = currentSourcePoints[0];
                        this.canvasCoord2.y = currentSourcePoints[1];
                    }


                    linePoints[2 * ctr] = currentSourcePoints[0];
                    linePoints[2 * ctr + 1] = currentSourcePoints[1];


                    //For negtive infinity ray line data (x1, y1) is infinity point and (x2, y2) is starting point.
                    tempCtr = this.isPositiveInfinity ? ctr : (ctr === 0 ? 1 : 0);
                    lineData["x" + (tempCtr + 1)] = Number(graphPoints.x.toFixed(1));
                    lineData["y" + (tempCtr + 1)] = Number(graphPoints.y.toFixed(1));

                }

                this.updateRayInfinity();
                this.updateArrowHead();
                break;
            case 1:
                //For segment
                for (ctr = 0; ctr < len; ctr++) {
                    currentSource = sources[ctr];
                    currentSourcePoints = [currentSource.shapeObject.shape.x, currentSource.shapeObject.shape.y];

                    graphPoints = currentSource.graphCoord;

                    if (ctr === 0) {
                        this.canvasCoord1.x = currentSourcePoints[0];
                        this.canvasCoord1.y = currentSourcePoints[1];
                    } else {
                        this.canvasCoord2.x = currentSourcePoints[0];
                        this.canvasCoord2.y = currentSourcePoints[1];
                    }

                    linePoints[2 * ctr] = currentSourcePoints[0];
                    linePoints[2 * ctr + 1] = currentSourcePoints[1];
                    lineData["x" + (ctr + 1)] = Number(graphPoints.x.toFixed(1));
                    lineData["y" + (ctr + 1)] = Number(graphPoints.y.toFixed(1));
                }
                break;
        }


        for (key in model.equationPanelData) {
            if (this.idEquationPanel === key) {
                model.equationPanelData[key].idSelectedLine = this.lineId;
            } else {
                model.equationPanelData[key].idSelectedLine = "line1";
            }
        }

        // set hit are a of line after updatng line data
        this._setHitArea(linePoints);

        // while line is being dragged
        model.trigger("OnLineDataDragged", {
            "affectedEqPanelId": model.idSelectedEqPanel
        });

        this.gridGraphView._refreshGridGraph();
    };

    LinePrototype.drawShape = function() {
        var shapePolygon = null,
            arrowLineCoords = null,
            linePoints = null;

        this.lineSlope = (this.canvasCoord2.x - this.canvasCoord1.x) !== 0 ? (this.canvasCoord2.y - this.canvasCoord1.y) / (this.canvasCoord2.x - this.canvasCoord1.x) : 0;
        this.yIntercept = this.canvasCoord1.y - this.lineSlope * this.canvasCoord1.x;

        if (this.lineType === ShapesComponent.Shapes.Line.LINE_TYPE.LINE_SEGMENT) {
            linePoints = [this.canvasCoord1.x, this.canvasCoord1.y, this.canvasCoord2.x, this.canvasCoord2.y];
        } else {
            if (isNaN(this.lineSlope)) {
                return;
            }

            if (!isFinite(this.lineSlope)) {
                arrowLineCoords = {
                    "canvasCoord1": {
                        "x": this.canvasCoord1.x,
                        "y": 0
                    },
                    "canvasCoord2": {
                        "x": this.canvasCoord2.x,
                        "y": this.canvasHeight
                    }
                };
            } else {
                arrowLineCoords = {
                    "canvasCoord1": {
                        "x": this.canvasCoord1.x,
                        "y": this.canvasCoord1.y
                    },
                    "canvasCoord2": {
                        "x": this.canvasCoord2.x,
                        "y": this.canvasCoord2.y
                    }
                };
            }
            linePoints = [arrowLineCoords.canvasCoord1.x, arrowLineCoords.canvasCoord1.y, arrowLineCoords.canvasCoord2.x, arrowLineCoords.canvasCoord2.y];
        }

        if (this.shapeObject) {
            this.shapeObject.shape.points = linePoints;
        } else {
            shapePolygon = new PIXI.Polygon(linePoints);
            this.shapeObject = this.graphicsRenderer
                .beginFill(this.lineColor)
                .lineStyle(this.lineWidth, this.lineColor, this.lineAlpha)
                .drawShape(shapePolygon);
        }

        if (this.lineType === ShapesComponent.Shapes.Line.LINE_TYPE.LINE) {
            this.arrowHead2 = this._drawArrowHead(arrowLineCoords.canvasCoord2);
        }

        this._setHitArea(linePoints);
        this.graphicsRenderer.visible = false;
    };

    LinePrototype.moveLineEnd = function(canvasCoord) {
        var graphicsData = this.graphicsRenderer.graphicsData;
        if (this.arrowHead1 && this.arrowHead2) {
            delete graphicsData.splice(graphicsData.indexOf(this.arrowHead1), 1);
            delete graphicsData.splice(graphicsData.indexOf(this.arrowHead2), 1);
            this.arrowHead1 = null;
            this.arrowHead2 = null;
        }
        this.canvasCoord2 = canvasCoord;
        this.drawShape();
    };

    LinePrototype._getNewLineCoords = function() {
        var newLineCoords = {},
            point1 = null,
            point2 = null,
            xMin = 0,
            xMax = this.canvasWidth,
            yMin = 0,
            yMax = this.canvasHeight,
            newX = null,
            newY = null,
            slope = this.lineSlope,
            yIntercept = this.yIntercept;

        newY = slope * xMin + yIntercept;
        if (newY >= 0 && newY <= yMax) {
            point1 = {
                "x": xMin,
                "y": newY
            };
        }

        newY = slope * xMax + yIntercept;
        if (newY >= 0 && newY <= yMax) {
            if (point1) {
                point2 = {
                    "x": xMax,
                    "y": newY
                };
            } else {
                point1 = {
                    "x": xMax,
                    "y": newY
                };
            }
        }

        if (!point1 || !point2) {
            newX = (yMin - yIntercept) / slope;
            if (newX >= 0 && newX <= xMax) {
                if (point1) {
                    point2 = {
                        "x": newX,
                        "y": yMin
                    };
                } else {
                    point1 = {
                        "x": newX,
                        "y": yMin
                    };
                }
            }
        }

        if (!point1 || !point2) {
            newX = (yMax - yIntercept) / slope;
            if (newX >= 0 && newX <= xMax) {
                if (point1) {
                    point2 = {
                        "x": newX,
                        "y": yMax
                    };
                } else {
                    point1 = {
                        "x": newX,
                        "y": yMax
                    };
                }
            }
        }

        newLineCoords.canvasCoord1 = point1;
        newLineCoords.canvasCoord2 = point2;
        return newLineCoords;
    };

    LinePrototype.getArrowPoints = function(canvasCoords) {
        var isXPositive = this.canvasCoord1.x - canvasCoords.x >= 0 ? 1 : -1,
            isYPositive = this.canvasCoord1.y - canvasCoords.y >= 0 ? 1 : -1,
            ARROW_WIDTH = 10,
            angle = Math.abs(Math.atan(this.lineSlope)),
            midPoint = {
                "x": canvasCoords.x + ARROW_WIDTH * Math.cos(angle) * isXPositive,
                "y": canvasCoords.y + ARROW_WIDTH * Math.sin(angle) * isYPositive
            },
            arrowPoints = null;

        arrowPoints = this._getCoordsOnPerpendicularLineAtPoint(midPoint, ARROW_WIDTH / 2);

        return arrowPoints;
    };

    LinePrototype._drawArrowHead = function(canvasCoords) {
        var arrowTriangle = null,
            arrowObject = null,
            arrowPoints = this.getArrowPoints(canvasCoords);

        arrowTriangle = new PIXI.Polygon(canvasCoords.x, canvasCoords.y, arrowPoints[0], arrowPoints[1], arrowPoints[2], arrowPoints[3]);

        arrowObject = this.graphicsRenderer
            .beginFill(this.lineColor)
            .lineStyle(1, this.lineColor, this.lineAlpha)
            .drawShape(arrowTriangle);
        return arrowObject;
    };

    LinePrototype._getCoordsOnPerpendicularLineAtPoint = function(canvasCoord, distance) {
        var perpendicularSlope = -1 / this.lineSlope,
            perpendicularYIntercept = canvasCoord.y - perpendicularSlope * canvasCoord.x,
            perpendicularAngle = Math.atan(perpendicularSlope),
            perpPoint1x = null,
            perpPoint1y = null,
            perpPoint2x = null,
            perpPoint2y = null,
            perpPoints = [];

        if (this.lineSlope === 0) {
            perpPoint1x = canvasCoord.x;
            perpPoint1y = canvasCoord.y + distance;
            perpPoint2x = canvasCoord.x;
            perpPoint2y = canvasCoord.y - distance;
        } else {
            perpPoint1x = canvasCoord.x - distance * Math.cos(perpendicularAngle);
            perpPoint1y = perpendicularSlope * perpPoint1x + perpendicularYIntercept;
            perpPoint2x = canvasCoord.x + distance * Math.cos(perpendicularAngle);
            perpPoint2y = perpendicularSlope * perpPoint2x + perpendicularYIntercept;
        }

        perpPoints = [perpPoint1x, perpPoint1y, perpPoint2x, perpPoint2y];
        return perpPoints;
    };

    /**
     * find a point on segment having start and end point at a given distance
     * @param  {[object]} startPoint [start point object]
     * @param  {[object]} endPoint   [end point object]
     * @param  {[number]} distance   [distance from start point]
     * @return {[object]} retruns point object
     */
    LinePrototype.findSegmentPointAtADistance = function(startPoint, endPoint, distance) {
        var segmentDistance, ratio,
            pointX, pointY;

        segmentDistance = Math.sqrt(Math.pow(startPoint.x - endPoint.x, 2) + Math.pow(startPoint.y - endPoint.y, 2));
        ratio = segmentDistance === 0 ? 0 : distance / segmentDistance;
        pointX = (1 - ratio) * startPoint.x + ratio * endPoint.x;
        pointY = (1 - ratio) * startPoint.y + ratio * endPoint.y;
        return [pointX, pointY];
    };

    /**
     * [rotatePoint description]
     * @param  {[number]}  x       [point abcissa]
     * @param  {[number]}  y       [point ordinate]
     * @param  {[number]}  xc      [center point abcissa]
     * @param  {[number]}  yc      [center point ordinate]
     * @param  {[number]}  angle   [angle of rotation]
     * @param  {Boolean} isDeg   [is angle in degree]
     * @param  {[Boolean]}  reverse [determines clockwise or anticlockwise]
     * @return {[type]}          [return rotated point]
     */
    LinePrototype.rotatePoint = function(x, y, xc, yc, angle, isDeg, reverse) {
        if (isDeg) {
            angle *= Math.PI / 180; // 180 is pi radians
        }
        if (reverse) {
            angle *= -1;
        }
        var c = Math.cos(angle),
            s = Math.sin(angle),
            compXC = x - xc,
            compYC = y - yc;

        return [xc + compXC * c - compYC * s, yc + compXC * s + compYC * c];
    };

    LinePrototype._setHitArea = function(linePoints) {
        var endPoint1 = {
                "x": linePoints[0],
                "y": linePoints[1]
            },
            endPoint2 = {
                "x": linePoints[2],
                "y": linePoints[3]
            },
            hitAreaPoints1, hitAreaPoints2,
            hitAreaPoints3, hitAreaPoints4,
            hitAreaPoint;

        if ('ontouchstart' in window) {
            hitAreaPoint = this.findSegmentPointAtADistance(this.canvasCoord1, this.canvasCoord2, 10);
            hitAreaPoints1 = this.rotatePoint(hitAreaPoint[0], hitAreaPoint[1], this.canvasCoord1.x, this.canvasCoord1.y, 90, true, false);
            hitAreaPoints2 = this.rotatePoint(hitAreaPoint[0], hitAreaPoint[1], this.canvasCoord1.x, this.canvasCoord1.y, 90, true, true);

            hitAreaPoint = this.findSegmentPointAtADistance(this.canvasCoord2, this.canvasCoord1, 10);
            hitAreaPoints3 = this.rotatePoint(hitAreaPoint[0], hitAreaPoint[1], this.canvasCoord2.x, this.canvasCoord2.y, 90, true, false);
            hitAreaPoints4 = this.rotatePoint(hitAreaPoint[0], hitAreaPoint[1], this.canvasCoord2.x, this.canvasCoord2.y, 90, true, true);

        } else {
            hitAreaPoint = this.findSegmentPointAtADistance(this.canvasCoord1, this.canvasCoord2, 5);
            hitAreaPoints1 = this.rotatePoint(hitAreaPoint[0], hitAreaPoint[1], this.canvasCoord1.x, this.canvasCoord1.y, 90, true, false);
            hitAreaPoints2 = this.rotatePoint(hitAreaPoint[0], hitAreaPoint[1], this.canvasCoord1.x, this.canvasCoord1.y, 90, true, true);

            hitAreaPoint = this.findSegmentPointAtADistance(this.canvasCoord2, this.canvasCoord1, 5);
            hitAreaPoints3 = this.rotatePoint(hitAreaPoint[0], hitAreaPoint[1], this.canvasCoord2.x, this.canvasCoord2.y, 90, true, false);
            hitAreaPoints4 = this.rotatePoint(hitAreaPoint[0], hitAreaPoint[1], this.canvasCoord2.x, this.canvasCoord2.y, 90, true, true);
        }

        if (this.graphicsRenderer.hitArea) {
            this.graphicsRenderer.hitArea.points = [hitAreaPoints1[0], hitAreaPoints1[1], hitAreaPoints2[0], hitAreaPoints2[1], hitAreaPoints3[0], hitAreaPoints3[1], hitAreaPoints4[0], hitAreaPoints4[1]];
        } else {
            this.graphicsRenderer.hitArea = new PIXI.Polygon([hitAreaPoints1[0], hitAreaPoints1[1], hitAreaPoints2[0], hitAreaPoints2[1], hitAreaPoints3[0], hitAreaPoints3[1], hitAreaPoints4[0], hitAreaPoints4[1]]);
        }
    };

    ShapesComponent.Shapes.Line.LINE_TYPE = {
        "LINE": 0,
        "LINE_SEGMENT": 1
    };

    ShapesComponent.Shapes.Line.DEFAULT_LINE_COLOR = 0x000000;
    ShapesComponent.Shapes.Line.DEFAULT_LINE_WIDTH = 1;
    ShapesComponent.Shapes.Line.DEFAULT_SELECTED_LINE_WIDTH = 5;
    ShapesComponent.Shapes.Line.DEFAULT_LINE_ALPHA = 1;
})(ShapesComponent);
