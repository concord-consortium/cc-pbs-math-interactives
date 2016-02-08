define([
    "graph-template",
    "lang-json",
    "constants"

], function(template, langJson, constants) {
    var oView = Backbone.View.extend({
        "initialize": function(data) {
            this.constants = new constants();
            this.accJson = langJson.accJSON;
            this.accManager = data.accManager;
            this.listenTo(this.model, "setSliderToolTip", this.setSliderToolTip);
            this.listenTo(this.model, "OnPopupVisibilityChange", this.OnPopupVisibilityChange);
            this.listenTo(this.model, "onExpressionDataChanged", this.onExpressionDataChanged);
            this.listenTo(this.model, "onLineAdded", this.onLineAdded);
            this.listenTo(this.model, "lineVisibilityChanged", this.onLineVisibilityChange);
            this.listenTo(this.model, "OnLineDataDragged", this.updateGraphView);
            this.listenTo(this.model, "OnSliderDataChange", this.OnSliderDataChange);
            this.listenTo(this.model, "OnGridOptionsChange", this.renderGraphOnChange);
            this.listenTo(this.model, "OnAxesLabelChange", this.changeAxesLabel);
            this.listenTo(this.model, "OnLinePropsChange", this.handleLineProps);
            this.listenTo(this.model, "onSelectingEquationPanel", this.onSelectingEquationPanel);
            this.listenTo(this.model, "onDeselectingEquationPanel", this.onDeselectingEquationPanel);
            this.graphAccText = "";
        },

        "render": function() {
            var gt = Handlebars.templates['graph-template']({}).trim();

            this.gridGraphView = null;
            this.graphPoints = [];
            this.linePoints = [];
            this.graphLine = null;
            this.shapeType = 2;
            this.fillColor = 0x9b9b9b;
            this.lineColor = 0x9b9b9b;
            this.pointRadius = 4;
            this.invisiblePointRadius = 0;
            this.sliderPointRadius = 6;
            this.snapToGrid = false;
            this.renderGraphOnChange();
        },

        /**
         * on equation panel selection, change visibility of all line points to true of that equation panel
         * @param  {[object]} data [data about current selected panel]
         */
        "onSelectingEquationPanel": function(data) {
            if (data.eqPanelId === this.model.constants.INVALID_VALUE || !this.model.EqPanelData[data.eqPanelId].bIsEnable) {
                return;
            }

            var lineData = this.model.EqPanelData[data.eqPanelId].lineData,
                sources, src, key;

            for (key in lineData) {
                sources = lineData[key].graphLine.sources;
                for (src in sources) {
                    sources[src].changeObjectVisibility(true);
                }
            }
        },

        /**
         * on equation panel deselection, change visibility of all line points to false of that equation panel
         * @param  {[object]} data [data about panel to deselect]
         */
        "onDeselectingEquationPanel": function(data) {
            if (data.eqPanelId === this.model.constants.INVALID_VALUE || !this.model.EqPanelData[data.eqPanelId].bIsEnable) {
                return;
            }

            var lineData = this.model.EqPanelData[data.eqPanelId].lineData,
                sources, src, key;

            for (key in lineData) {
                sources = lineData[key].graphLine.sources;
                for (src in sources) {
                    sources[src].changeObjectVisibility(false);
                }
            }
        },

        "setAccOn": function() {
            if (this.accManager !== null && this.accManager.isAccessibilityOn) {
                this.setAccOnGraph();
            }
        },

        /**
         * [on adding a line render the graph object]
         * @param  {[type]} strEQPanel [equation panel id]
         * @param  {[type]} lineId     [line id]
         */
        "onLineAdded": function(strEQPanel, lineId) {
            this.renderGraphObjects(strEQPanel, lineId);
        },

        /**
         * set slider point data
         * @param  {[object]} data [slider point position]
         */
        "setSliderToolTip": function(data) {
            this.model.SetSliderPointData({
                "xPos": this.model.sliderValue
            }, data.affectedEqPanelId);
        },

        /**
         * [on change of slider point data]
         */
        "OnSliderDataChange": function() {
            var value1;
            for (value1 in this.model.EqPanelData) {
                this.addSliderPointOnReqdLines(value1, "line1");
            }
        },

        "updateGraphAcc": function(accText) {
            this.graphAccText = accText;
        },

        "setAccOnGraph": function() {
            var axis = this.model.gridOptions.gridLimits,
                xAxisUpper = axis.xUpper,
                yAxisUpper = axis.yUpper,
                xAxisLower = axis.xLower.safe_toFixed(2),
                yAxisLower = axis.yLower.safe_toFixed(2),
                arrParam = [xAxisLower, xAxisUpper, yAxisLower, yAxisUpper];
            this.accManager.setAccText(this.$el, this.graphAccText, arrParam);
        },

        "renderGraphOnChange": function(isGridOptionsChanged) {

            this.resetGrid();

            var value1, value2;
            for (value1 in this.model.EqPanelData) {
                for (value2 in this.model.EqPanelData[value1].lineData) {
                    this.renderGraphObjects(value1, value2, isGridOptionsChanged);
                }
                this.addSliderPointOnReqdLines(value1, "line1");
                this.model.SetSliderPointData({
                    "xPos": this.model.sliderValue
                }, value1, !isGridOptionsChanged);
            }

            if (this.accManager !== null && this.accManager.isAccessibilityOn) {
                this.setAccOn();
            }
        },

        /**
         * on line visibility change
         * @param  {[object]} data [data abt equation panel]
         * @return {[type]}      [description]
         */
        "onLineVisibilityChange": function(data) {
            var EqPanelData = this.model.EqPanelData[data.affectedEqPanelId],
                lineData = EqPanelData.lineData,
                key, sources, src,
                canvasCoords;

            for (key in lineData) {
                lineData[key].graphLine.changeObjectVisibility(EqPanelData.bIsEnable);

                sources = lineData[key].graphLine.sources;
                for (src in sources) {
                    sources[src].changeObjectVisibility(EqPanelData.bIsEnable);
                }
            }

            //set slider point data
            this.model.SetSliderPointData({
                "xPos": this.model.sliderValue
            }, data.affectedEqPanelId, true);
        },

        "onExpressionDataChanged": function(lineData) {
            var graphLine = lineData.graphLine,
                linePoints = graphLine.shapeObject.shape.points,
                gridGraphModel = graphLine.gridGraphView.model,
                sources = graphLine.sources,
                graphCoords, canvasCoords, ctr,
                noOfSources = sources.length,
                tempCtr;

            switch (graphLine.lineType) {
                case 0:
                    // For ray
                    for (ctr = 0; ctr < noOfSources; ctr++) {
                        graphCoords = {};
                        canvasCoords = {};

                        tempCtr = graphLine.isPositiveInfinity ? ctr : (ctr === 0 ? 1 : 0);

                        graphCoords.x = lineData["x" + (tempCtr + 1)];
                        graphCoords.y = lineData["y" + (tempCtr + 1)];
                        canvasCoords = gridGraphModel.convertToCanvasCoordinates(graphCoords);
                        sources[ctr].shapeObject.shape.x = canvasCoords.x;
                        sources[ctr].shapeObject.shape.y = canvasCoords.y;
                        linePoints[2 * ctr] = canvasCoords.x;
                        linePoints[2 * ctr + 1] = canvasCoords.y;
                        if (ctr === 0) {
                            graphLine.canvasCoord1.x = canvasCoords.x;
                            graphLine.canvasCoord1.y = canvasCoords.y;
                        } else {
                            graphLine.canvasCoord2.x = canvasCoords.x;
                            graphLine.canvasCoord2.y = canvasCoords.y;
                        }
                    }
                    graphLine.updateRayInfinity();
                    graphLine.updateArrowHead();
                    break;
                case 1:
                    // For segment
                    for (ctr = 0; ctr < noOfSources; ctr++) {
                        graphCoords = {};
                        canvasCoords = {};
                        graphCoords.x = lineData["x" + (ctr + 1)];
                        graphCoords.y = lineData["y" + (ctr + 1)];
                        canvasCoords = gridGraphModel.convertToCanvasCoordinates(graphCoords);
                        sources[ctr].shapeObject.shape.x = canvasCoords.x;
                        sources[ctr].shapeObject.shape.y = canvasCoords.y;
                        linePoints[2 * ctr] = canvasCoords.x;
                        linePoints[2 * ctr + 1] = canvasCoords.y;
                        if (ctr === 0) {
                            graphLine.canvasCoord1.x = canvasCoords.x;
                            graphLine.canvasCoord1.y = canvasCoords.y;
                        } else {
                            graphLine.canvasCoord2.x = canvasCoords.x;
                            graphLine.canvasCoord2.y = canvasCoords.y;
                        }
                    }
                    break;
            }

            graphLine._setHitArea(linePoints);

            // on line data change
            this.model.trigger("OnLineDatachange", {
                "affectedEqPanelId": this.model.idSelectedEqPanel
            });
            // set slider point data
            this.model.trigger("setSliderToolTip", {
                "affectedEqPanelId": this.model.idSelectedEqPanel
            });


            graphLine.gridGraphView._refreshGridGraph();
        },

        /**
         * while line is being dragged update the graph view.
         * @param  {[object]} data [data about current equation panel]
         */
        "updateGraphView": function(data) {
            var equationPanelData = this.model.EqPanelData[this.model.idSelectedEqPanel],
                lineData = equationPanelData.lineData[equationPanelData.idSelectedLine];

            if (lineData.graphLine.lineType !== 0) {
                lineData.slope = this.model.getSlope(lineData);
            }
            lineData.displacement = this.model.getIntercept(lineData);
            lineData.expressionSlopeIntercept = this.model.getSlopeInterceptExp(lineData);
            lineData.expressionPointSlope = this.model.getPointSlopeExp(lineData);

            //on line data change
            this.model.trigger("OnLineDatachange", {
                "affectedEqPanelId": data.affectedEqPanelId
            });
            // update slider point data.
            this.model.trigger("setSliderToolTip", {
                "affectedEqPanelId": data.affectedEqPanelId
            });
        },

        "renderGraphObjects": function(strEQPanel, lineId, isGridOptionsChanged) {
            var model = this.model,
                oLine = model.EqPanelData[strEQPanel],
                oLineData = oLine.lineData,
                value = null,
                sources, key;

            if (oLineData[lineId].lineTypeId === this.constants.NEG_INFINITY_RAY) {
                this.drawRay({
                    x: oLineData[lineId].x2,
                    y: oLineData[lineId].y2
                }, oLine.color, 1, false, oLine, lineId, isGridOptionsChanged);
            } else if (oLineData[lineId].lineTypeId === this.constants.POS_INFINITY_RAY) {
                this.drawRay({
                    x: oLineData[lineId].x1,
                    y: oLineData[lineId].y1
                }, oLine.color, 1, true, oLine, lineId, isGridOptionsChanged);
            } else {
                this.drawLine([{
                    x: oLineData[lineId].x1,
                    y: oLineData[lineId].y1
                }, {
                    x: oLineData[lineId].x2,
                    y: oLineData[lineId].y2
                }], oLine.color, 1, oLine, lineId);
            }

            // if equation panel is visible change line and its sources point visibility to true
            if (oLine.bIsEnable) {
                this.graphLine.changeObjectVisibility(oLine.bIsEnable);
                if (model.idSelectedEqPanel === strEQPanel) {
                    sources = this.graphLine.sources;
                    for (key in sources) {
                        sources[key].changeObjectVisibility(oLine.bIsEnable);
                    }
                }
            }
            // if gridoptions are changed, the if a line was selected previously then select
            // the same line on re rendering the graph
            if (isGridOptionsChanged) {
                if (model.selectedLine && model.selectedLine.lineId === lineId &&
                    model.selectedLine.equationPanelData.idEquationPanel === strEQPanel) {
                    this.graphLine.selectLine();
                }
            } else if (oLine.bIsEnable) {
                this.graphLine.selectLine();
            }
            // update line source point style based on currently selected equation panel
            this.graphLine.updateSourcePointStyle(oLineData[lineId]);
        },

        "drawLine": function(graphPoints, color, thickness, equationPanelData, lineId) {
            var pointPlotted, i;

            this.graphLine = this.gridGraphView.addLineToGraph(graphPoints[0], graphPoints[1], color, thickness, 1);
            this.graphLine.equationPanelData = equationPanelData;
            this.graphLine.lineId = lineId;
            this.graphLine.graphView = this;
            this.graphLine.gridGraphView = this.gridGraphView;
            equationPanelData.lineData[this.graphLine.lineId].graphLine = this.graphLine;

            for (i = 0; i < graphPoints.length; i++) {
                pointPlotted = this.gridGraphView.addPointToGraph(graphPoints[i], this.fillColor, this.lineColor, this.pointRadius, null, 1);

                pointPlotted.gridGraphView = this.gridGraphView;
                pointPlotted.graphView = this;
                this.linePoints.push(graphPoints[i]);
                this.graphLine.sources.push(pointPlotted);
                pointPlotted.offspring = this.graphLine;
            }
        },

        "drawRay": function(graphPoint1, color, thickness, isPositiveInfinity, equationPanelData, lineId, isGridOptionsChanged) {
            var graphPoint2, pointPlotted,
                graphPoints = [],
                lineData = equationPanelData.lineData[lineId],
                noOfPoints, i;

            graphPoint2 = isPositiveInfinity ? this.getHighGraphPointFromSlope(lineData.slope, lineData.displacement) : this.getLowGraphPointFromSlope(lineData.slope, lineData.displacement);


            this.graphLine = this.gridGraphView.addLineToGraph(graphPoint1, graphPoint2, color, thickness, 0);
            this.graphLine.lineId = lineId;
            this.graphLine.isPositiveInfinity = isPositiveInfinity;
            this.graphLine.equationPanelData = equationPanelData;
            this.graphLine.graphView = this;
            this.graphLine.gridGraphView = this.gridGraphView;
            equationPanelData.lineData[lineId].graphLine = this.graphLine;

            graphPoints.push(graphPoint1, graphPoint2);
            noOfPoints = graphPoints.length;


            for (i = 0; i < noOfPoints; i++) {
                if (i === (noOfPoints - 1)) {
                    pointPlotted = this.gridGraphView.addPointToGraph(graphPoints[i], this.fillColor, this.lineColor, this.invisiblePointRadius, null, 2);
                } else {
                    pointPlotted = this.gridGraphView.addPointToGraph(graphPoints[i], this.fillColor, this.lineColor, this.pointRadius, null, 2);
                }
                pointPlotted.gridGraphView = this.gridGraphView;
                pointPlotted.graphView = this;
                this.linePoints.push(graphPoints[i]);
                this.graphLine.sources.push(pointPlotted);
                pointPlotted.offspring = this.graphLine;
            }
        },

        "getHighGraphPoint": function(graphPoint) {
            this.graphPointNew = {
                    x: graphPoint.x + 1,
                    y: graphPoint.y + 1
                },
                gridLimits = this.model.gridOptions.gridLimits;
            if (this.graphPointNew.x < gridLimits.xUpper && this.graphPointNew.y < gridLimits.yUpper) {
                this.getHighGraphPoint(this.graphPointNew);
            }
            return this.graphPointNew;
        },

        "getHighGraphPointFromSlope": function(slope, displacement) {
            var gridLimits = this.model.gridOptions.gridLimits,
                x = gridLimits.xUpper,
                y = slope * x + displacement;

            return {
                x: x,
                y: y
            };
        },

        "getLowGraphPointFromSlope": function(slope, displacement) {
            var gridLimits = this.model.gridOptions.gridLimits,
                x = gridLimits.xLower,
                y = slope * x + displacement;

            return {
                x: x,
                y: y
            };
        },

        "getLowGraphPoint": function(graphPoint) {
            this.graphPointNew = {
                    x: graphPoint.x - 1,
                    y: graphPoint.y - 1
                },
                gridLimits = this.model.gridOptions.gridLimits;
            if (this.graphPointNew.x > gridLimits.xLower && this.graphPointNew.y > gridLimits.yLower) {
                this.getLowGraphPoint(this.graphPointNew);
            }
            return this.graphPointNew;
        },

        "addSliderPointOnLine": function() {

            this.renderGraphOnChange();

        },

        /**
         * add slider point for each equation panel.
         * @param  {[string]} strEQPanel [equation panel id]
         * @param  {[string]} lineId     [line id]
         */
        "addSliderPointOnReqdLines": function(strEQPanel, lineId) {
            var oLine = this.model.EqPanelData[strEQPanel],
                oLineData = oLine.lineData,
                value = null,
                pointPlotted,
                graphPoint,
                $plgLabel,
                bIsPointwithinRange = false;

            graphPoint = {
                x: oLine.xSliderPointPos,
                y: oLine.ySliderPointPos
            };
            pointPlotted = this.gridGraphView.addPointToGraph(graphPoint, this.fillColor, this.lineColor, this.sliderPointRadius, null, 2);
            oLine.sliderPoint = pointPlotted;
            pointPlotted.gridGraphView = this.gridGraphView;
            pointPlotted.graphView = this;

            this.gridGraphView.bringToFront(graphPoint);

            oLine.oCoordLabel = this.gridGraphView.createSliderPointCoords(graphPoint);

            bIsPointwithinRange = true;

            if (bIsPointwithinRange && oLine.bIsEnable) {
                $('.plg-obj-oval-background.' + strEQPanel).show().css('top', (pointPlotted.canvasCoord.y - 29) + 'px');
            }
            if (!oLine.bIsEnable) {
                oLine.oCoordLabel.visible = false;
                pointPlotted.changeObjectVisibility(false);
            }
        },

        "handleLineProps": function() {

        },

        "changeAxesLabel": function() {
            var textObjAxes = this.model.textObjAxes,
                textXPoint, textYPoint;
            textObjAxes.textObjXAxis.text = (String(this.model.xAxisLabel));
            textObjAxes.textObjYAxis.text = (String(this.model.yAxisLabel));

            textXPoint = new PIXI.Point(390 / 2 - textObjAxes.textObjXAxis.width / 2, 375);
            textYPoint = new PIXI.Point(0, 390 / 2 + textObjAxes.textObjYAxis.width / 2);

            textObjAxes.textObjXAxis.position = textXPoint;
            textObjAxes.textObjYAxis.position = textYPoint;

            this.gridGraphView._refreshGridGraph();
        },

        "resetGrid": function() {
            if (this.gridGraphView == null) {
                this.gridGraphView = GridGraphComponent.Views.GridView.createGridGraph(this.model.gridOptions);
                this.model.textObjAxes = this.gridGraphView.createAxesLabels(this.model.xAxisLabel, this.model.yAxisLabel);
            } else {
                this.gridGraphView.model = new GridGraphComponent.Models.GridModel(this.model.gridOptions);
                this.gridGraphView.render();
                this.model.textObjAxes = this.gridGraphView.createAxesLabels(this.model.xAxisLabel, this.model.yAxisLabel);
            }
        }
    });
    // Our module now returns our view
    return oView;
});
