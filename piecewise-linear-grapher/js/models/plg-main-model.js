define([
    "constants",
    "lang-json"
], function(constants, langJson) {
    var PLGMainModel = Backbone.Model.extend({

        "initialize": function() {
            this.constants = new constants();
            this.langJson = langJson;

            this.gridOptions = {
                "canvasWidth": this.constants.DEFAULT_CANVAS_WIDTH,
                "canvasHeight": this.constants.DEFAULT_CANVAS_HEIGHT,
                "containerId": "plg-grapher-control",
                "gridLimits": {
                    "xLower": this.constants.DEFAULT_GRID_X_LOWER_LIMIT,
                    "xUpper": this.constants.DEFAULT_GRID_X_UPPER_LIMIT,
                    "yLower": this.constants.DEFAULT_GRID_Y_LOWER_LIMIT,
                    "yUpper": this.constants.DEFAULT_GRID_Y_UPPER_LIMIT
                },
                "xInterval": this.constants.DEFAULT_X_INTERVAL,
                "yInterval": this.constants.DEFAULT_Y_INTERVAL,
                "mainModel": this
            };

            this.selectedLine = null;
            this.idSelectedModelObj = this.constants.OBJ_ROCKET - 1;
            this.factorXScale = 1;
            this.factorYScale = 1;
            this.idSelectedEqPanel = this.constants.ONE_EQ_PANEL;
            this.xAxisLabel = "";
            this.yAxisLabel = "";
            this.xUpClicks = 1;
            this.yUpClicks = 1;
            this.xLimitCounter = 0;
            this.yLimitCounter = 0;
            this.oneLimitCounter = 0;
            this.sliderValue = 1.0,
                this.oCoordLabel = null,
                this.EqPanelData = {
                    "one": {
                        "bIsEnable": true,
                        "color": this.constants.COLOR_ONE,
                        "idEquationPanel": "one",
                        "idSelectedLine": "line1",
                        "sliderPoint": null,
                        "title": "Linear Piecewise",
                        "lineCounter": 1,
                        "xhigh": 5.0,
                        "yhigh": 5.0,
                        "xlow": 0.0,
                        "ylow": 0.0,
                        "xSliderPointPos": 1.0,
                        "ySliderPointPos": 1.0,
                        "lineData": {
                            "line1": {
                                "x1": 0.0,
                                "y1": 0.0,
                                "x2": 5.0,
                                "y2": 5.0,
                                "idInterceptType": this.constants.SLOPE_INTERCEPT,
                                "xRangeLeftRelation": this.constants.LESS_THAN_OR_EQUAL,
                                "xRangeRightRelation": this.constants.LESS_THAN,
                                "bIsSelected": true,
                                "lineTypeId": this.constants.SEGMENT,
                                "slope": this.constants.DEFAULT_SLOPE,
                                "displacement": this.constants.DEFAULT_DISPLACEMENT,
                                "expressionSlopeIntercept": this.getSlopeInterceptExp(this.constants.DEFAULT_LINE_DATA),
                                "expressionPointSlope": this.getPointSlopeExp(this.constants.DEFAULT_LINE_DATA),
                                "sliderPoint": null,
                                "graphLine": null
                            }
                        }
                    },
                    "two": {
                        "bIsEnable": false,
                        "color": this.constants.COLOR_TWO,
                        "idEquationPanel": "two",
                        "idSelectedLine": "line1",
                        "sliderPoint": null,
                        "title": "Linear Piecewise",
                        "lineCounter": 1,
                        "xhigh": 5.0,
                        "yhigh": 5.0,
                        "xlow": 0.0,
                        "ylow": 0.0,
                        "xSliderPointPos": 1.0,
                        "ySliderPointPos": 1.0,
                        "lineData": {
                            "line1": {
                                "x1": 0.0,
                                "y1": 0.0,
                                "x2": 5.0,
                                "y2": 5.0,
                                "idInterceptType": this.constants.SLOPE_INTERCEPT,
                                "xRangeLeftRelation": this.constants.LESS_THAN_OR_EQUAL,
                                "xRangeRightRelation": this.constants.LESS_THAN,
                                "bIsSelected": true,
                                "lineTypeId": this.constants.SEGMENT,
                                "slope": this.constants.DEFAULT_SLOPE,
                                "displacement": this.constants.DEFAULT_DISPLACEMENT,
                                "expressionSlopeIntercept": this.getSlopeInterceptExp(this.constants.DEFAULT_LINE_DATA),
                                "expressionPointSlope": this.getPointSlopeExp(this.constants.DEFAULT_LINE_DATA),
                                "sliderPoint": null,
                                "graphLine": null
                            }
                        }
                    },
                    "three": {
                        "bIsEnable": false,
                        "color": this.constants.COLOR_THREE,
                        "idEquationPanel": "three",
                        "idSelectedLine": "line1",
                        "sliderPoint": null,
                        "title": "Linear Piecewise",
                        "lineCounter": 1,
                        "xhigh": 5.0,
                        "yhigh": 5.0,
                        "xlow": 0.0,
                        "ylow": 0.0,
                        "xSliderPointPos": 1.0,
                        "ySliderPointPos": 1.0,
                        "lineData": {
                            "line1": {
                                "x1": 0.0,
                                "y1": 0.0,
                                "x2": 5.0,
                                "y2": 5.0,
                                "idInterceptType": this.constants.SLOPE_INTERCEPT,
                                "xRangeLeftRelation": this.constants.LESS_THAN_OR_EQUAL,
                                "xRangeRightRelation": this.constants.LESS_THAN,
                                "bIsSelected": true,
                                "lineTypeId": this.constants.SEGMENT,
                                "slope": this.constants.DEFAULT_SLOPE,
                                "displacement": this.constants.DEFAULT_DISPLACEMENT,
                                "expressionSlopeIntercept": this.getSlopeInterceptExp(this.constants.DEFAULT_LINE_DATA),
                                "expressionPointSlope": this.getPointSlopeExp(this.constants.DEFAULT_LINE_DATA),
                                "sliderPoint": null,
                                "graphLine": null
                            }
                        }
                    },
                    "four": {
                        "bIsEnable": false,
                        "color": this.constants.COLOR_FOUR,
                        "idEquationPanel": "four",
                        "idSelectedLine": "line1",
                        "sliderPoint": null,
                        "title": "Linear Piecewise",
                        "lineCounter": 1,
                        "xhigh": 5.0,
                        "yhigh": 5.0,
                        "xlow": 0.0,
                        "ylow": 0.0,
                        "xSliderPointPos": 1.0,
                        "ySliderPointPos": 1.0,
                        "lineData": {
                            "line1": {
                                "x1": 0.0,
                                "y1": 0.0,
                                "x2": 5.0,
                                "y2": 5.0,
                                "idInterceptType": this.constants.SLOPE_INTERCEPT,
                                "xRangeLeftRelation": this.constants.LESS_THAN_OR_EQUAL,
                                "xRangeRightRelation": this.constants.LESS_THAN,
                                "bIsSelected": true,
                                "lineTypeId": this.constants.SEGMENT,
                                "slope": this.constants.DEFAULT_SLOPE,
                                "displacement": this.constants.DEFAULT_DISPLACEMENT,
                                "expressionSlopeIntercept": this.getSlopeInterceptExp(this.constants.DEFAULT_LINE_DATA),
                                "expressionPointSlope": this.getPointSlopeExp(this.constants.DEFAULT_LINE_DATA),
                                "sliderPoint": null,
                                "graphLine": null
                            }
                        }
                    }
                };
        },

        "updateGraphCoord": function(height, width){
            this.gridOptions.canvasWidth = width;
            this.gridOptions.canvasHeight = height;
        },

        "getSlopeInterceptExp": function(lineData) {
            var lineEqn = "",
                xRangeLeftRel = " &lt; ",
                xRangeRightRel = " &lt; ",
                xRangeLeft = lineData.x1.safe_toFixed(1),
                xRangeRight = lineData.x2.safe_toFixed(1);
            if (lineData.xRangeLeftRelation === this.constants.LESS_THAN_OR_EQUAL) {
                xRangeLeftRel = " &#8804; ";
            }
            if (lineData.xRangeRightRelation === this.constants.LESS_THAN_OR_EQUAL) {
                xRangeRightRel = " &#8804; ";
            }
            var slope = lineData.slope;
            slope = slope.safe_toFixed(2);
            var c = lineData.displacement;
            c = c.safe_toFixed(1);

            if (lineData.lineTypeId === this.constants.NEG_INFINITY_RAY) {
                xRangeLeft = this.langJson.NegInfinityText;
            } else if (lineData.lineTypeId === this.constants.POS_INFINITY_RAY) {
                xRangeRight = this.langJson.InfinityText;;
            }

            lineEqn = slope + " x" + " + " + c + " for " + xRangeLeft + xRangeLeftRel + "x" + xRangeRightRel + xRangeRight;

            return lineEqn;
        },

        "getPointSlopeExp": function(lineData) {
            var lineEqn = "",
                xRangeLeftRel = "&lt;",
                xRangeRightRel = "&lt;",
                xRangeLeft = lineData.x1.safe_toFixed(1),
                xRangeRight = lineData.x2.safe_toFixed(1),
                x_value = lineData.x1.safe_toFixed(1),
                y_value = lineData.y1.safe_toFixed(1);
            if (lineData.xRangeLeftRelation === this.constants.LESS_THAN_OR_EQUAL) {
                xRangeLeftRel = " &#8804; ";
            }
            if (lineData.xRangeRightRelation === this.constants.LESS_THAN_OR_EQUAL) {
                xRangeRightRel = " &#8804; ";
            }
            var slope = lineData.slope;
            slope = slope.safe_toFixed(2);

            if (lineData.lineTypeId === this.constants.NEG_INFINITY_RAY) {
                xRangeLeft = this.langJson.NegInfinityText;
                x_value = lineData.x2,
                    y_value = lineData.y2;

            } else if (lineData.lineTypeId === this.constants.POS_INFINITY_RAY) {
                xRangeRight = this.langJson.InfinityText;
            }

            lineEqn = slope + " (x" + " - " + x_value + ") + " + y_value + " for " + xRangeLeft + xRangeLeftRel + "x" + xRangeRightRel + xRangeRight;
            return lineEqn;

        },

        "getSlope": function(lineData) {
            return lineData.x2 - lineData.x1 === 0 ? 0 : Number(((lineData.y2 - lineData.y1) / (lineData.x2 - lineData.x1)).toFixed(2));
        },

        "getIntercept": function(lineData) {
            return Number((lineData.y1 - lineData.x1 * lineData.slope).toFixed(1));
        },

        "AddLine": function(oLineData) {

            this.EqPanelData[this.idSelectedEqPanel].lineCounter++;
            var lineName = "line" + this.EqPanelData[this.idSelectedEqPanel].lineCounter;
            oLineData.bIsSelected = true;
            oLineData.expressionSlopeIntercept = this.getSlopeInterceptExp(oLineData);
            oLineData.expressionPointSlope = this.getPointSlopeExp(oLineData);

            if (this.EqPanelData[this.idSelectedEqPanel].idSelectedLine !== this.constants.INVALID_VALUE) {
                this.EqPanelData[this.idSelectedEqPanel].lineData[this.EqPanelData[this.idSelectedEqPanel].idSelectedLine].bIsSelected = false;
            }
            this.EqPanelData[this.idSelectedEqPanel].idSelectedLine = lineName;
            this.EqPanelData[this.idSelectedEqPanel].lineData[lineName] = oLineData;

            if (this.EqPanelData[this.idSelectedEqPanel].xlow > oLineData.x1) {
                this.EqPanelData[this.idSelectedEqPanel].xlow = oLineData.x1;
            }

            if (this.EqPanelData[this.idSelectedEqPanel].ylow > oLineData.y1) {
                this.EqPanelData[this.idSelectedEqPanel].ylow = oLineData.y1;
            }

            if (this.EqPanelData[this.idSelectedEqPanel].xhigh < oLineData.x2) {
                this.EqPanelData[this.idSelectedEqPanel].xhigh = oLineData.x2;
            }

            if (this.EqPanelData[this.idSelectedEqPanel].yhigh < oLineData.y2) {
                this.EqPanelData[this.idSelectedEqPanel].yhigh = oLineData.y2;
            }

            // on adding a line
            this.trigger("onLineAdded", this.idSelectedEqPanel, lineName);
            // on line data change
            this.trigger("OnLineDatachange", {
                "affectedEqPanelId": this.idSelectedEqPanel
            });
            // set slider point data
            this.trigger("setSliderToolTip", {
                "affectedEqPanelId": this.idSelectedEqPanel
            });

        },

        "AddLineSegment": function() {

            if (this.idSelectedEqPanel === this.constants.INVALID_VALUE) {
                //alert("Please select any Equation panel before performing this operation.");
                return;
            }

            var oLineData = $.extend({}, this.constants.DEFAULT_LINE_DATA);
            if (this.EqPanelData[this.idSelectedEqPanel].idSelectedLine != this.constants.INVALID_VALUE) {
                var oCurSelectedLine = this.EqPanelData[this.idSelectedEqPanel].lineData[this.EqPanelData[this.idSelectedEqPanel].idSelectedLine];

                if (oCurSelectedLine.lineTypeId === this.constants.SEGMENT || oCurSelectedLine.lineTypeId === this.constants.NEG_INFINITY_RAY) {
                    oLineData.x1 = oCurSelectedLine.x2;
                    oLineData.y1 = oCurSelectedLine.y2;
                    oLineData.x2 = oLineData.x1 + this.gridOptions.xInterval;
                    oLineData.y2 = oLineData.y1 + this.gridOptions.yInterval;

                } else if (oCurSelectedLine.lineTypeId === this.constants.POS_INFINITY_RAY) {
                    oLineData.x2 = oCurSelectedLine.x1;
                    oLineData.y2 = oCurSelectedLine.y1;
                    oLineData.x1 = oLineData.x2 - this.gridOptions.xInterval;
                    oLineData.y1 = oLineData.y2 - this.gridOptions.yInterval;

                }
            } else {
                oLineData.x2 = oLineData.x1 + this.gridOptions.xInterval;
                oLineData.y2 = oLineData.y1 + this.gridOptions.yInterval;
            }

            oLineData.slope = this.getSlope(oLineData);
            oLineData.displacement = this.getIntercept(oLineData);

            this.AddLine(oLineData);
        },

        "AddPositiveInfinityRay": function() {
            if (this.idSelectedEqPanel === this.constants.INVALID_VALUE) {
                //alert("Please select any Equation panel before performing this operation.");
                return;
            }

            var oLineData = $.extend({}, this.constants.DEFAULT_LINE_DATA),
                oCurSelectedLine, graphHighPoint, gridOptions = this.gridOptions;

            if (this.EqPanelData[this.idSelectedEqPanel].idSelectedLine != this.constants.INVALID_VALUE) {
                oCurSelectedLine = this.EqPanelData[this.idSelectedEqPanel].lineData[this.EqPanelData[this.idSelectedEqPanel].idSelectedLine];

                if (oCurSelectedLine.lineTypeId === this.constants.SEGMENT || oCurSelectedLine.lineTypeId === this.constants.NEG_INFINITY_RAY) {
                    oLineData.x1 = oCurSelectedLine.x2;
                    oLineData.y1 = oCurSelectedLine.y2;

                } else if (oCurSelectedLine.lineTypeId === this.constants.POS_INFINITY_RAY) {
                    oLineData.x1 = oCurSelectedLine.x1;
                    oLineData.y1 = oCurSelectedLine.y1;
                }
            } else {
                oLineData.x1 = this.constants.DEFAULT_X1;
                oLineData.y1 = this.constants.DEFAULT_Y1;
            }

            oLineData.slope = gridOptions.yInterval / gridOptions.xInterval;
            oLineData.displacement = Number((oLineData.y1 - oLineData.slope * oLineData.x1).toFixed(1));

            graphHighPoint = this.getHighGraphPointFromSlope(oLineData.slope, oLineData.displacement);

            oLineData.x2 = graphHighPoint.x;
            oLineData.y2 = graphHighPoint.y;
            oLineData.lineTypeId = this.constants.POS_INFINITY_RAY;

            this.AddLine(oLineData);
        },

        "AddNegativeInfinityRay": function() {

            if (this.idSelectedEqPanel === this.constants.INVALID_VALUE) {
                //alert("Please select any Equation panel before performing this operation.");
                return;
            }

            var oLineData = $.extend({}, this.constants.DEFAULT_LINE_DATA),
                oCurSelectedLine, graphLowPoint, gridOptions = this.gridOptions;

            if (this.EqPanelData[this.idSelectedEqPanel].idSelectedLine != this.constants.INVALID_VALUE) {
                oCurSelectedLine = this.EqPanelData[this.idSelectedEqPanel].lineData[this.EqPanelData[this.idSelectedEqPanel].idSelectedLine];

                if (oCurSelectedLine.lineTypeId === this.constants.SEGMENT || oCurSelectedLine.lineTypeId === this.constants.POS_INFINITY_RAY) {
                    oLineData.x2 = oCurSelectedLine.x1;
                    oLineData.y2 = oCurSelectedLine.y1;

                } else if (oCurSelectedLine.lineTypeId === this.constants.NEG_INFINITY_RAY) {
                    oLineData.x2 = oCurSelectedLine.x2;
                    oLineData.y2 = oCurSelectedLine.y2;
                }
            } else {
                oLineData.x2 = this.constants.DEFAULT_X1;
                oLineData.y2 = this.constants.DEFAULT_Y1;
            }

            oLineData.slope = gridOptions.yInterval / gridOptions.xInterval;
            oLineData.displacement = Number((oLineData.y2 - oLineData.slope * oLineData.x2).toFixed(1));

            graphLowPoint = this.getLowGraphPointFromSlope(oLineData.slope, oLineData.displacement)

            oLineData.x1 = graphLowPoint.x;
            oLineData.y1 = graphLowPoint.y;

            oLineData.lineTypeId = this.constants.NEG_INFINITY_RAY;

            this.AddLine(oLineData);

        },

        "DeleteLine": function(data) {
            var graphLine = this.EqPanelData[data.EqPanelId].lineData[data.LineId].graphLine,
                gridGraphView = graphLine.gridGraphView,
                arrKeys;

            // delete current line
            graphLine.delete();

            // if current deleted line was selected
            if (this.selectedLine === graphLine) {
                this.selectedLine = null;
            }

            delete this.EqPanelData[data.EqPanelId].lineData[data.LineId];
            this.EqPanelData[data.EqPanelId].idSelectedLine = this.constants.INVALID_VALUE;
            this.EqPanelData[data.EqPanelId].xhigh = 0;
            this.EqPanelData[data.EqPanelId].yhigh = 0;

            // select the last line segment in equation panel
            arrKeys = Object.keys(this.EqPanelData[data.EqPanelId].lineData);
            if (arrKeys.length > 0) {
                if (this.selectedLine === null) {
                    this.EqPanelData[data.EqPanelId].idSelectedLine = arrKeys[arrKeys.length - 1];
                } else {
                    this.EqPanelData[data.EqPanelId].idSelectedLine = this.selectedLine.lineId;
                }
            }

            this.UpdateLowHigh(data);

            if (this.EqPanelData[data.EqPanelId].idSelectedLine != this.constants.INVALID_VALUE) {
                this.EqPanelData[data.EqPanelId].lineData[this.EqPanelData[data.EqPanelId].idSelectedLine].bIsSelected = true;
            }

            gridGraphView._refreshGridGraph();


        },

        "UpdateLowHigh": function(data) {
            var value = null;
            for (value in this.EqPanelData[data.EqPanelId].lineData) {


                if (this.EqPanelData[data.EqPanelId].xhigh < this.EqPanelData[data.EqPanelId].lineData[value].x2) {
                    this.EqPanelData[data.EqPanelId].xhigh = this.EqPanelData[data.EqPanelId].lineData[value].x2;
                }

                if (this.EqPanelData[data.EqPanelId].yhigh < this.EqPanelData[data.EqPanelId].lineData[value].y2) {
                    this.EqPanelData[data.EqPanelId].yhigh = this.EqPanelData[data.EqPanelId].lineData[value].y2
                }

                if (this.EqPanelData[data.EqPanelId].xlow > this.EqPanelData[data.EqPanelId].lineData[value].x1) {
                    this.EqPanelData[data.EqPanelId].xlow = this.EqPanelData[data.EqPanelId].lineData[value].x1;
                }

                if (this.EqPanelData[data.EqPanelId].ylow > this.EqPanelData[data.EqPanelId].lineData[value].y1) {
                    this.EqPanelData[data.EqPanelId].ylow = this.EqPanelData[data.EqPanelId].lineData[value].y1
                }
            }

        },

        "ChangeLineSelection": function(data) {
            this.EqPanelData[data.EqPanelId].lineData[this.EqPanelData[data.EqPanelId].idSelectedLine].bIsSelected = false;
            this.EqPanelData[data.EqPanelId].idSelectedLine = data.LineId;
            this.EqPanelData[data.EqPanelId].lineData[this.EqPanelData[data.EqPanelId].idSelectedLine].bIsSelected = true;

        },

        "SetEqPanelSelected": function(data) {
            var EqPanelData, idSelectedLine, graphLine;
            if (data.EqPanelId !== this.idSelectedEqPanel) {
                // For hiding points of all equations of previously selected equation panel
                if (this.idSelectedEqPanel !== this.constants.INVALID_VALUE &&
                    this.idSelectedEqPanel !== data.EqPanelId) {
                    this.trigger("onDeselectingEquationPanel", {
                        "eqPanelId": this.idSelectedEqPanel
                    });
                }

                this.idSelectedEqPanel = data.EqPanelId;

                // For hiding points of all equations of currently selected equation panel
                this.trigger("onSelectingEquationPanel", {
                    "eqPanelId": this.idSelectedEqPanel
                });
            }

            EqPanelData = this.EqPanelData[this.idSelectedEqPanel];
            idSelectedLine = EqPanelData.idSelectedLine;

            if (idSelectedLine !== -1) {
                graphLine = EqPanelData.lineData[idSelectedLine].graphLine;
            }
            if (this.selectedLine !== null && graphLine !== this.selectedLine) {
                this.selectedLine.deselectLine();
            }
            if (idSelectedLine !== -1 && graphLine && this.selectedLine !== graphLine) {
                graphLine.selectLine();
            }

            // on line data change
            this.trigger("OnLineDatachange", {
                "affectedEqPanelId": data.EqPanelId
            });
            // update slider point data
            this.trigger("setSliderToolTip", {
                "affectedEqPanelId": data.EqPanelId
            });

            //Used only to update acc text in main view.
            this.trigger("updateAccText", {
                "affectedEqPanelId": data.EqPanelId
            });
        },

        "ToggleEnableStatus": function(data) {
            if (this.EqPanelData[data.EqPanelId].bIsEnable === true) {
                this.EqPanelData[data.EqPanelId].bIsEnable = false;
            } else {
                this.EqPanelData[data.EqPanelId].bIsEnable = true;
                this.idSelectedEqPanel = data.EqPanelId;
            }

        },

        "ChangeTextData": function(data) {
            this.EqPanelData[data.EqPanelId].title = data.ChangeText;
        },

        "EquationExpressionChange": function(data) {

            var lineData = this.EqPanelData[data.affectedExpData.EqPanelId].lineData[data.affectedExpData.LineId],
                slope = lineData.slope,
                x1 = lineData.x1,
                x2 = lineData.x2,
                y1 = lineData.y1,
                y2 = lineData.y2,
                displacement = lineData.displacement;
            if (data.expType === "SIspinnerSlope" || data.expType === "PSspinnerSlope") {
                lineData.slope = data.curValue;
                slope = data.curValue;

                if (lineData.lineTypeId === this.constants.SEGMENT) {
                    lineData.y2 = slope * (x2 - x1) + y1;

                    lineData.displacement = y1 - slope * x1;
                } else if (lineData.lineTypeId === this.constants.POS_INFINITY_RAY) {
                    displacement = lineData.displacement = y1 - slope * x1;
                    var graphHigh = this.getHighGraphPointFromSlope(slope, displacement);
                    lineData.x2 = graphHigh.x;
                    lineData.y2 = graphHigh.y;
                } else if (lineData.lineTypeId === this.constants.NEG_INFINITY_RAY) {
                    displacement = lineData.displacement = y2 - slope * x2;
                    var graphLow = this.getLowGraphPointFromSlope(slope, displacement);
                    lineData.x1 = graphLow.x;
                    lineData.y1 = graphLow.y;
                }

            } else if (data.expType === "SIspinnerDisplacement") {
                lineData.displacement = data.curValue;
                displacement = data.curValue;



                if (lineData.lineTypeId === this.constants.SEGMENT) {
                    y1 = lineData.y1 = slope * x1 + displacement;
                    lineData.y2 = slope * x2 + displacement;
                    lineData.slope = this.getSlope(lineData);
                } else if (lineData.lineTypeId === this.constants.POS_INFINITY_RAY) {
                    lineData.y1 = slope * x1 + displacement;
                    lineData.y2 = slope * x2 + displacement;
                } else if (lineData.lineTypeId === this.constants.NEG_INFINITY_RAY) {
                    lineData.y1 = slope * x1 + displacement;
                    lineData.y2 = slope * x2 + displacement;
                }


            } else if (data.expType === "SIspinnerX1" || data.expType === "PSspinnerX1B") {

                if (lineData.lineTypeId === this.constants.SEGMENT && data.curValue >= x2) {
                    data.curValue = x1;
                }

                lineData.x1 = data.curValue;
                x1 = data.curValue;
                lineData.y1 = slope * x1 + displacement;

            } else if (data.expType === "PSspinnerX1A") {

                if (lineData.lineTypeId === this.constants.SEGMENT || lineData.lineTypeId === this.constants.POS_INFINITY_RAY) {

                    if (lineData.lineTypeId === this.constants.SEGMENT && data.curValue >= x2) {
                        // data.curValue = x2;
                        data.curValue = x1;
                    }

                    lineData.x1 = data.curValue;

                    lineData.x2 += data.curValue - x1;

                    x1 = data.curValue;
                } else {

                    lineData.x2 = data.curValue;
                    lineData.x1 += data.curValue - x2;
                    x2 = data.curValue;
                }

            } else if (data.expType === "SIspinnerX2" || data.expType === "PSspinnerX2") {

                if (lineData.lineTypeId === this.constants.SEGMENT && data.curValue <= x1) {
                    // data.curValue = x1;
                    data.curValue = x2;
                }

                lineData.x2 = data.curValue;
                x2 = data.curValue;
                lineData.y2 = slope * x2 + displacement;

            } else if (data.expType === "PSspinnerY1") {

                lineData.y1 = data.curValue;
                y1 = data.curValue;
                lineData.displacement = y1 - slope * x1;
                displacement = lineData.displacement;
                lineData.y2 = slope * x2 + displacement;

                if (lineData.lineTypeId === this.constants.SEGMENT || lineData.lineTypeId === this.constants.POS_INFINITY_RAY) {

                    lineData.y1 = data.curValue;

                    if (lineData.lineTypeId === this.constants.SEGMENT && data.curValue >= y2) {
                        data.curValue = y1;
                    }

                    lineData.y2 += data.curValue - y1;

                    y1 = data.curValue;

                } else {

                    lineData.y2 = data.curValue;

                    lineData.displacement += data.curValue - y2;
                    y2 = data.curValue;

                }

            }


            lineData.expressionSlopeIntercept = this.getSlopeInterceptExp(lineData);

            lineData.expressionPointSlope = this.getPointSlopeExp(lineData);

            this.UpdateLowHigh({
                "EqPanelId": data.affectedExpData.EqPanelId
            });
            this.trigger("onExpressionDataChanged", lineData);

            // on line data change.
            this.trigger("OnLineDatachange", {
                "affectedEqPanelId": data.affectedExpData.EqPanelId
            });
            // update slider point data
            this.trigger("setSliderToolTip", {
                "affectedEqPanelId": data.affectedExpData.EqPanelId
            });
        },

        /**
         * get ray high point using slope and displacement
         * @param  {[number]} slope        [slope of line]
         * @param  {[number]} displacement [y intercept of line]
         * @return {[type]}              [return graph high point for current line data]
         */
        "getHighGraphPointFromSlope": function(slope, displacement) {
            var gridLimits = this.gridOptions.gridLimits,
                x = gridLimits.xUpper,
                y = slope * x + displacement;

            return {
                x: x,
                y: y
            };
        },

        /**
         * get ray low point using slope and displacement
         * @param  {[number]} slope        [slope of line]
         * @param  {[number]} displacement [y intercept of line]
         * @return {[type]}              [return graph low point for current line data]
         */
        "getLowGraphPointFromSlope": function(slope, displacement) {
            var gridLimits = this.gridOptions.gridLimits,
                x = gridLimits.xLower,
                y = slope * x + displacement;

            return {
                x: x,
                y: y
            };
        },


        "ShowNextImage": function() {
            this.idSelectedModelObj += 1;
            if (this.idSelectedModelObj > 4) {
                this.idSelectedModelObj = 0;
            }

            this.trigger("OnModelObjectChange", {});
        },

        "ShowPreviousImage": function() {
            this.idSelectedModelObj -= 1;
            if (this.idSelectedModelObj < 0) {
                this.idSelectedModelObj = 4;
            }

            this.trigger("OnModelObjectChange", {});
        },

        "ChangeInterceptType": function(data) {
            this.EqPanelData[data.affectedExpData.EqPanelId].lineData[data.affectedExpData.LineId].idInterceptType = data.ChangedInterceptType;
            this.trigger("OnLineDatachange", {
                "affectedEqPanelId": data.affectedExpData.EqPanelId
            });
        },

        "ChangeToggleLeftRange": function(data) {
            var oLineData = this.EqPanelData[data.affectedExpData.EqPanelId].lineData[data.affectedExpData.LineId];
            oLineData.xRangeLeftRelation = data.ChangedToggleLeftRangeType;
            oLineData.expressionSlopeIntercept = this.getSlopeInterceptExp(oLineData);
            oLineData.expressionPointSlope = this.getPointSlopeExp(oLineData);

            // on line data change
            this.trigger("OnLineDatachange", {
                "affectedEqPanelId": data.affectedExpData.EqPanelId
            });
            // on change of equation left relation update line source point style
            oLineData.graphLine.updateSourcePointStyle(oLineData);
        },

        "CheckToggleRightRange": function(data) {
            var oLineData = this.EqPanelData[data.affectedExpData.EqPanelId].lineData[data.affectedExpData.LineId];
            oLineData.xRangeRightRelation = data.ChangedToggleRightRangeType;
            oLineData.expressionSlopeIntercept = this.getSlopeInterceptExp(oLineData);
            oLineData.expressionPointSlope = this.getPointSlopeExp(oLineData);

            // on line data change
            this.trigger("OnLineDatachange", {
                "affectedEqPanelId": data.affectedExpData.EqPanelId
            });
            // on change of equation right relation update line source point style
            oLineData.graphLine.updateSourcePointStyle(oLineData);
        },

        "PopupVisibilityChange": function(data) {
            this.trigger("OnPopupVisibilityChange", {
                "bIsVisible": data.bIsVisible,
                "popupName": data.popupName,
                "affectedExpData": data.affectedExpData
            });
        },

        "AxesLabelChange": function() {
            this.trigger("OnAxesLabelChange");
        },

        "AddSliderPointOnLine": function(data, showPopup) {
            this.SetSliderPointData(data, 'one', showPopup);
            this.SetSliderPointData(data, 'two', showPopup);
            this.SetSliderPointData(data, 'three', showPopup);
            this.SetSliderPointData(data, 'four', showPopup);
        },

        //whether slider point x position lies within the range of line data x position
        "containsPointX": function(lineData, xPos) {
            var x1, x2, rangeRelation;
            switch (lineData.lineTypeId) {
                case 1:
                    //For segement
                    x1 = lineData.x1;
                    x2 = lineData.x2;
                    break;
                case 2:
                    //For positive infinity ray
                    x1 = lineData.x1;
                    x2 = Number.POSITIVE_INFINITY;
                    break;
                case 3:
                    //For negative infinity ray
                    x1 = Number.NEGATIVE_INFINITY;
                    x2 = lineData.x2;
                    break;
            }

            rangeRelation = lineData.xRangeLeftRelation.toString() + lineData.xRangeRightRelation.toString();

            switch (rangeRelation) {
                case '22':
                    return x1 <= x2 && xPos > x1 && xPos < x2 || x2 <= x1 && xPos > x2 && xPos < x1;
                case '21':
                    return x1 <= x2 && xPos > x1 && xPos <= x2 || x2 <= x1 && xPos >= x2 && xPos < x1;
                case '12':
                    return x1 <= x2 && xPos >= x1 && xPos < x2 || x2 <= x1 && xPos > x2 && xPos <= x1;
                case '11':
                    return x1 <= x2 && xPos >= x1 && xPos <= x2 || x2 <= x1 && xPos >= x2 && xPos <= x1;
            }

        },

        //Are there different equation for same value of x
        "isOneToMany": function(data, strEQPanel) {

            var oLine = this.EqPanelData[strEQPanel],
                oLineData = oLine.lineData,
                value = null,
                canvasCoords,
                xPos = data.xPos,
                yPos = null,
                yValue = [],
                validationData = {
                    "oneToMany": false,
                    "isColliding": false,
                    "lineId": null,

                },
                $plgLabel = $('.plg-obj-oval-background.' + strEQPanel);

            for (value in oLineData) {
                if (this.containsPointX(oLineData[value], xPos)) {

                    yPos = Number((oLineData[value].slope * xPos + oLineData[value].displacement).toFixed(1));

                    if (yValue.length === 1) {
                        validationData.oneToMany = true;
                        validationData.lineId = null;
                        break;
                    } else {
                        yValue.push(yPos);
                        validationData.lineId = value;
                    }
                }
            }

            if (!validationData.oneToMany && validationData.lineId) {
                validationData.isColliding = true;
            }

            return validationData;
        },

        // set slider point data
        "SetSliderPointData": function(data, strEQPanel, showPopup) {
            var oLine = this.EqPanelData[strEQPanel],
                oLineData = oLine.lineData,
                value = null,
                canvasCoords,
                xPos = data.xPos,
                yPos = null,
                $plgLabel = $('.plg-obj-oval-background.' + strEQPanel),
                validationData,
                isEnabled = this.EqPanelData[strEQPanel].bIsEnable;

            this.sliderValue = data.xPos;
            validationData = this.isOneToMany(data, strEQPanel);

            value = validationData.lineId;
            // if show popup is true and there more than one equation for same x values
            // that is, if there are more than one y values for same values of x.
            if (showPopup && validationData.oneToMany && isEnabled) {
                this.trigger("OnMultipleYValuesForOneXValue");
            } else if (validationData.isColliding && isEnabled) {
                yPos = oLineData[value].slope * xPos + oLineData[value].displacement;

                oLine.xSliderPointPos = xPos;
                oLine.ySliderPointPos = yPos;

                canvasCoords = oLine.sliderPoint.gridGraphView.model.convertToCanvasCoordinates({
                    "x": xPos,
                    "y": yPos
                });

                oLine.sliderPoint.shapeObject.shape.x = canvasCoords.x;
                oLine.sliderPoint.shapeObject.shape.y = canvasCoords.y;

                if (canvasCoords.y > 0 && canvasCoords.y < this.gridOptions.canvasHeight) {
                    $plgLabel.show().css('top', (canvasCoords.y - 29) + 'px');
                } else {
                    $plgLabel.hide();
                }

                oLine.oCoordLabel.text = ('(' + xPos.safe_toFixed(1) + ', ' + yPos.safe_toFixed(1) + ')');
                oLine.oCoordLabel.visible = true;
                oLine.oCoordLabel.position = new PIXI.Point(canvasCoords.x + oLine.oCoordLabel.width / 3, canvasCoords.y - oLine.oCoordLabel.height / 2);
                if (showPopup && strEQPanel === this.idSelectedEqPanel && oLineData[value].graphLine !== this.selectedLine) {
                    oLineData[value].graphLine.selectLine();
                }
                oLine.sliderPoint.changeObjectVisibility(true);

            } else {
                $plgLabel.hide();
                oLine.oCoordLabel.visible = false;
                oLine.sliderPoint.changeObjectVisibility(false);
            }

            if (value !== null) {
                // change equation selection while slider position is changed
                this.trigger("changeEquationSelection", {
                    "affectedEqPanelId": strEQPanel,
                    "idSelectedLine": showPopup ? value : oLine.idSelectedLine
                });
            }
        },

        "scaleGraph": function(strValue) {

            var gridOptions = this.gridOptions,
                gridLimits = gridOptions.gridLimits,
                i,
                absValue;

            switch (strValue) {
                case 'XPlus':
                    {
                        if (this.xLimitCounter > 14) {
                            return;
                        }
                        if (this.xUpClicks === 0) {
                            if (gridOptions.xInterval == 5) {
                                gridOptions.xInterval = 2;
                            } else if (gridOptions.xInterval == 2) {
                                gridOptions.xInterval = 1;
                            } else {
                                gridOptions.xInterval /= 2;
                            }
                            gridLimits.xUpper = 9 * gridOptions.xInterval;
                            gridLimits.xLower = -gridOptions.xInterval;
                        }

                        this.xUpClicks += 1;
                        this.xLimitCounter++;
                        if (this.xUpClicks % 5 == 0 && gridOptions.xInterval > 1) {

                            if (gridOptions.xInterval == 5) {
                                gridOptions.xInterval = 2;
                            } else if (gridOptions.xInterval == 2) {
                                gridOptions.xInterval = 1;
                            } else {
                                gridOptions.xInterval /= 2;
                            }
                            this.xUpClicks = 1;
                            gridLimits.xUpper = 9 * gridOptions.xInterval;
                            gridLimits.xLower = -gridOptions.xInterval;
                        }

                        if (gridOptions.xInterval == 1) {
                            this.oneLimitCounter += 1;
                        }

                        if (this.xUpClicks !== 0) {
                            gridLimits.xUpper -= gridOptions.xInterval;
                            gridLimits.xLower = -(gridLimits.xUpper - gridLimits.xLower) / this.constants.DEFAULT_DIFF_X;
                        }
                        break;
                    }

                case 'XMinus':
                    {
                        if (this.xLimitCounter < -14) {
                            return;
                        }

                        if (this.xUpClicks === 0) {
                            if (gridOptions.xInterval == 1) {
                                gridOptions.xInterval = 2;
                            } else if (gridOptions.xInterval == 2) {
                                gridOptions.xInterval = 5;
                            } else {
                                gridOptions.xInterval *= 2;
                            }
                            gridLimits.xUpper = 5 * gridOptions.xInterval;
                            gridLimits.xLower = -gridOptions.xInterval;
                        }
                        this.xUpClicks -= 1;
                        this.xLimitCounter--;
                        if (this.xUpClicks % 5 == 0 && gridOptions.xInterval > 1) {

                            if (gridOptions.xInterval == 1) {
                                gridOptions.xInterval = 2;
                            } else if (gridOptions.xInterval == 2) {
                                gridOptions.xInterval = 5;
                            } else {
                                gridOptions.xInterval *= 2;
                            }
                            this.xUpClicks = -1;
                            gridLimits.xUpper = 5 * gridOptions.xInterval;
                            gridLimits.xLower = -gridOptions.xInterval;
                        }
                        if (gridOptions.xInterval == 1) {
                            this.oneLimitCounter -= 1;
                        }
                        if (gridOptions.xInterval == 1 && this.oneLimitCounter < 1) {
                            gridOptions.xInterval = 2;
                            this.xUpClicks = -1;
                        }

                        if (this.xUpClicks !== 0) {
                            gridLimits.xUpper += gridOptions.xInterval;
                        }
                        gridLimits.xLower = -(gridLimits.xUpper - gridLimits.xLower) / this.constants.DEFAULT_DIFF_X;
                        break;
                    }

                case 'resetX':
                    {
                        gridLimits.xUpper = this.constants.DEFAULT_GRID_X_UPPER_LIMIT;
                        gridLimits.xLower = -5;
                        this.xUpClicks = 1;
                        this.xLimitCounter = 0;
                        gridOptions.xInterval = this.constants.DEFAULT_X_INTERVAL;
                        break;
                    }

                case 'YPlus':
                    {
                        if (this.yLimitCounter > 15) {
                            return;
                        }
                        if (this.yUpClicks === 0) {
                            if (gridOptions.yInterval == 5) {
                                gridOptions.yInterval = 2;
                            } else if (gridOptions.yInterval == 2) {
                                gridOptions.yInterval = 1;
                            } else {
                                gridOptions.yInterval /= 2;
                            }
                            gridLimits.yUpper = 9 * gridOptions.yInterval;
                            gridLimits.yLower = -gridOptions.yInterval;
                        }
                        this.yUpClicks += 1;
                        this.yLimitCounter++;
                        if (this.yUpClicks % 5 == 0 && gridOptions.yInterval > 1) {

                            if (gridOptions.yInterval == 5) {
                                gridOptions.yInterval = 2;
                            } else if (gridOptions.yInterval == 2) {
                                gridOptions.yInterval = 1;
                            } else {
                                gridOptions.yInterval /= 2;
                            }
                            gridLimits.yUpper = 9 * gridOptions.yInterval;
                            gridLimits.yLower = -gridOptions.yInterval;
                            this.yUpClicks = 1;
                        }

                        if (gridOptions.yInterval == 1) {
                            this.oneLimitCounter += 1;
                        }

                        if (this.yUpClicks !== 0) {
                            gridLimits.yUpper -= gridOptions.yInterval;
                            gridLimits.yLower = -(gridLimits.yUpper - gridLimits.yLower) / this.constants.DEFAULT_DIFF_Y;
                        }
                        break;
                    }

                case 'YMinus':
                    {
                        if (this.yLimitCounter < -15) {
                            return;
                        }
                        if (this.yUpClicks === 0) {
                            if (gridOptions.yInterval == 1) {
                                gridOptions.yInterval = 2;
                            } else if (gridOptions.yInterval == 2) {
                                gridOptions.yInterval = 5;
                            } else {
                                gridOptions.yInterval *= 2;
                            }
                            gridLimits.yUpper = 5 * gridOptions.yInterval;
                            gridLimits.yLower = -gridOptions.yInterval;
                        }
                        this.yUpClicks -= 1;
                        this.yLimitCounter--;
                        if (this.yUpClicks % 5 == 0 && gridOptions.yInterval > 1) {

                            if (gridOptions.yInterval == 1) {
                                gridOptions.yInterval = 2;
                            } else if (gridOptions.yInterval == 2) {
                                gridOptions.yInterval = 5;
                            } else {
                                gridOptions.yInterval *= 2;
                            }
                            gridLimits.yUpper = 5 * gridOptions.yInterval;
                            gridLimits.yLower = -gridOptions.yInterval;
                            this.yUpClicks = -1;
                        }
                        if (gridOptions.yInterval == 1) {
                            this.oneLimitCounter -= 1;
                        }
                        if (gridOptions.yInterval == 1 && this.oneLimitCounter < 1) {
                            gridOptions.yInterval = 2;
                            this.yUpClicks = -1;
                        }
                        if (this.yUpClicks != 0) {
                            gridLimits.yUpper += gridOptions.yInterval;
                        }
                        gridLimits.yLower = -(gridLimits.yUpper - gridLimits.yLower) / this.constants.DEFAULT_DIFF_Y;
                        break;
                    }

                case 'resetY':
                    {
                        gridLimits.yUpper = this.constants.DEFAULT_GRID_Y_UPPER_LIMIT;
                        this.yUpClicks = 1;
                        gridLimits.yLower = -5;
                        this.yLimitCounter = 0;
                        gridOptions.yInterval = this.constants.DEFAULT_Y_INTERVAL;
                        break;
                    }
            }

            this.trigger("OnGraphScale");
            this.trigger("OnGridOptionsChange", true);
        }
    });
    // Return the model for the module
    return PLGMainModel;
});
