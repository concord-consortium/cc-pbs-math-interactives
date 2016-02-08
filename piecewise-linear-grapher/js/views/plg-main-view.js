define([
    "base-interactive-view",
    "main-model",
    "lang-json",
    "graph-view",
    "equation-panel-view",
    "equation-popup-view",
    "acc-manager-view",
    "equation-about-view",
    "save-image-view",
    "equation-axis-label-view",
    "equation-error-msg-view",
    "equation-save-msg-view",
    "constants",
    "plg-template"

], function(baseInteractiveView, mainModel, langJson, Grapher, EqPanel, EqPopup, accManager, AboutView, SaveImageView, AxisLabelView, ErrorMsgView, SaveMsgView, constants) {
    var PLGView = baseInteractiveView.extend({
        "initialize": function() {
            this.model = new mainModel();
            this.constants = new constants();
            this.langJson = langJson;
            this.$activity_el = null;

            //cached objects
            this.oGrapher = null;
            this.oEqPanel1 = null;
            this.oEqPanel2 = null;
            this.oEqPanel3 = null;
            this.oEqPanel4 = null;
            this.accManager = null;
            this.isAccessibilityOn = true;
            this.accJson = langJson.accJSON;

            this.accManager = null;
            this.oAboutPopup = null;
            this.oSaveImageView = null;
            this.oAxisLabelView = null;
            this.oErrorMsgView = null;
            this.oSaveMsgView = null;
            this.graphLabelAccText = "";
            this.deleteBtnAccText = "";
            this.lineSegAcctext = "";
            this.linePosRayAcctext = "";
            this.lineNegRayAcctext = "";

            if (this.isAccessibilityOn) {
                this.accManager = new accManager({
                    "el": this.$el,
                    "isAccessibilityOn": this.isAccessibilityOn
                });
            }
            this.listenTo(this.model, "lineVisibilityChanged", this.onLineVisibilityChange);
            this.listenTo(this.model, "OnPopupVisibilityChange", this.OnPopupVisibilityChange);
            this.listenTo(this.model, "OnGraphScale", this.setSliderProps);
            this.listenTo(this.model, "changeEquationSelection", this.changeEquationSelection);
            this.listenTo(this.model, "OnLineDatachange", this.OnLineDatachange);
            this.listenTo(this.model, "OnDeselectLine", this.OnDeselectLine);
            this.listenTo(this.model, "updateAccText", this.updateAccText);
            this.listenTo(this.model, "onSelectLine", this.onSelectLine);


            //For Debugging-Please remove------------------------------------------------------------------------------------
            this.$el.on('focusin', function(event) {
                console.log("%cFOCUS is on: %c" + event.target.id + "%c --- TABINDEX: %c" + $(event.target).attr('tabindex') + "%c --- ACCTEXT: %c" + $(event.target).attr('aria-label'), 'color: black', 'color: red; font-weight: bold', 'color: black', 'color: green; font-weight: bold', 'color: black', 'color: blue; font-weight: bold');
            });
            //----------------------------------------------------------------------------------------------------------------
        },


        "onSelectLine": function() {
            this.$("#plg-obj-oval-background-one").removeClass("plg-selected-modelObject");
            this.$("#plg-obj-oval-background-two").removeClass("plg-selected-modelObject");
            this.$("#plg-obj-oval-background-three").removeClass("plg-selected-modelObject");
            this.$("#plg-obj-oval-background-four").removeClass("plg-selected-modelObject");

            this.$("#plg-obj-oval-background-" + this.model.idSelectedEqPanel).addClass("plg-selected-modelObject");

        },

        "OnDeselectLine": function() {
            if (this.accManager != null && this.accManager.isAccessibilityOn) {

                this.accManager.setAccText(this.$("#plg-graph-button-close"), "Delete selected ray or line button. Currently, no line is selected.", null);
            }
        },

        "updateAccText": function() {
            if (this.accManager != null && this.accManager.isAccessibilityOn) {
                this.accManager.setAccText(this.$("#plg-graph-label-container"), this.graphLabelAccText, this.graphLabelPosition());
            }
        },

        "OnLineDatachange": function() {
            if (this.accManager != null && this.accManager.isAccessibilityOn) {
                var arrParam = this.getDeleteBtnAccText();
                if (arrParam !== null) {
                    this.accManager.setAccText(this.$("#plg-graph-button-close"), this.deleteBtnAccText, arrParam);
                } else {
                    this.accManager.setAccText(this.$("#plg-graph-button-close"), "Delete selected ray or line button. Currently, no line is selected.", null);
                }
                this.accManager.setAccText(this.$("#plg-line-segment"), this.lineSegAcctext, this.getlineAccparam(this.constants.SEGMENT));
                this.accManager.setAccText(this.$("#plg-positive-infinity"), this.linePosRayAcctext, this.getlineAccparam(this.constants.POS_INFINITY_RAY));
                this.accManager.setAccText(this.$("#plg-negative-infinity"), this.lineNegRayAcctext, this.getlineAccparam(this.constants.NEG_INFINITY_RAY));
                this.accManager.setAccText(this.$("#plg-graph-label-container"), this.graphLabelAccText, this.graphLabelPosition());

            }
        },

        "changeEquationSelection": function(data) {
            if (this.accManager != null && this.accManager.isAccessibilityOn) {
                this.accManager.setAccText(this.$("#plg-graph-label-container"), this.graphLabelAccText, this.graphLabelPosition());
                this.accManager.setAccText(this.$("#plg-graph-button-close"), this.deleteBtnAccText, this.getDeleteBtnAccText());

            }
        },

        "getDeleteBtnAccText": function() {
            var strLineNumber = "No line",
                strPanelNumber = "one";

            if (this.model.idSelectedEqPanel !== this.constants.INVALID_VALUE && this.model.EqPanelData[this.model.idSelectedEqPanel].idSelectedLine != this.constants.INVALID_VALUE) {
                strLineNumber = "line " + (Object.keys(this.model.EqPanelData[this.model.idSelectedEqPanel].lineData).indexOf(this.model.EqPanelData[this.model.idSelectedEqPanel].idSelectedLine) + 1);
                strPanelNumber = this.model.idSelectedEqPanel;
                return [strLineNumber, strPanelNumber];
            } else {
                return null;
            }
        },

        "events": {
            "click #plg-vertical-increase-button": "verticalIncreaseGraph",
            "click #plg-vertical-decrease-button": "verticalDecreaseGraph",
            "click #plg-vertical-default-button": "verticalDefaultGraph",
            "click #plg-horizontal-increase-button": "horizontalIncreaseGraph",
            "click #plg-horizontal-decrease-button": "horizontalDecreaseGraph",
            "click #plg-horizontal-default-button": "horizontalDefaultGraph",
            "click #plg-line-segment": "createLineSegment",
            "click #plg-positive-infinity": "createPositiveInfinityRay",
            "click #plg-negative-infinity": "createNegativeInfinityRay",
            "click #plg-spinner-btn-up-arrow": "spinImageUp",
            "click #plg-spinner-btn-down-arrow": "spinImageDown",
            "slidechange #plg-slider": "sliderThumbPositionChange",
            "slide #plg-slider": "sliderThumbPositionChange",
            "click .pbs-base-title-i-icon-content": "showAboutPage",
            "click .pbs-base-title-cam-icon-content": "showSaveImagePopup",
            "click #plg-graph-button-pencil": "showAxisLabelPopup",
            "click #plg-graph-button-close": "removeExpressionLine",
            "keyup #plg-btn-spinner": "modelSpinnerUpDownKey"
        },

        "modelSpinnerUpDownKey": function(e) {

            if (this.accManager != null && this.accManager.isAccessibilityOn) {
                var code = (e.keyCode || e.which);
                if (code === 38) {
                    this.spinImageUp();

                } else if (code === 40) {
                    this.spinImageDown();
                }
            }
        },

        "onLineVisibilityChange": function(data) {
            if (this.accManager !== null && this.accManager.isAccessibilityOn) {
                this.accManager.setAccText(this.$("#plg-graph-label-container"), this.graphLabelAccText, this.graphLabelPosition(data.affectedEqPanelId));
            }
        },

        "lineSegmentUpdatedLabel": function() {
            if (this.accManager != null && this.accManager.isAccessibilityOn) {

                var length = this.accJson.length,
                    counter = 0,
                    currentValue,
                    arrParam = ["No Function panel selected. Please select a function panel first."],
                    strMsg;

                for (; counter < length; counter++) {
                    currentValue = this.accJson[counter];
                    if (currentValue.id === "#plg-line-segment") {
                        if (this.model.idSelectedEqPanel !== -1) {
                            strMsg = "Use spacebar to create a line segment on the graph for the function panel " + this.model.EqPanelData[this.model.idSelectedEqPanel].idEquationPanel + ".",
                                arrParam = [strMsg];
                        }
                        this.accManager.setAccText(this.$(currentValue.id), currentValue.accText, arrParam);
                        break;
                    }
                }
            }
        },

        "positiveRayUpdatedLabel": function() {
            if (this.accManager != null && this.accManager.isAccessibilityOn) {

                var length = this.accJson.length,
                    counter = 0,
                    currentValue,
                    arrParam = ["No Function panel selected. Please select a function panel first."],
                    strMsg;

                for (; counter < length; counter++) {
                    currentValue = this.accJson[counter];
                    if (currentValue.id === "#plg-positive-infinity") {
                        if (currentValue.id === "#plg-line-segment") {
                            strMsg = "Use spacebar to create a ray approaching positive infinity on the graph for the function panel " + this.model.EqPanelData[this.model.idSelectedEqPanel].idEquationPanel + ".",
                                arrParam = [strMsg];
                        }
                        this.accManager.setAccText(this.$(currentValue.id), currentValue.accText, arrParam);
                        break;
                    }
                }
            }
        },

        "negativeRayUpdatedLabel": function() {
            if (this.accManager != null && this.accManager.isAccessibilityOn) {

                var length = this.accJson.length,
                    counter = 0,
                    currentValue, arrParam, strMsg;

                for (; counter < length; counter++) {
                    currentValue = this.accJson[counter];
                    if (currentValue.id === "#plg-negative-infinity") {
                        strMsg = "Use spacebar to create a ray approaching negative infinity on the graph for the function panel " + this.model.EqPanelData[this.model.idSelectedEqPanel].idEquationPanel + ".",
                            arrParam = [strMsg];
                        this.accManager.setAccText(this.$(currentValue.id), currentValue.accText, arrParam);
                        break;
                    }
                }
            }
        },

        "removeExpressionLine": function(event) {
            var model = this.model,
                selectedLine = model.selectedLine,
                idSelectedEqPanel = model.idSelectedEqPanel,
                eqPanelData = this.model.EqPanelData;

            if (!selectedLine || $(event.target).hasClass("plg-eqn-popup-close") || idSelectedEqPanel === -1) {
                return;
            }

            this.model.DeleteLine({
                "EqPanelId": idSelectedEqPanel,
                "LineId": selectedLine.lineId
            });
            this.model.SetEqPanelSelected({
                "EqPanelId": idSelectedEqPanel
            });
        },

        "showErrorMsgPopup": function() {
            this.oErrorMsgView.showErrorMsgPopup(true);
        },

        "showAxisLabelPopup": function() {
            this.oAxisLabelView.showAxisLabelPopup(true);
        },

        "showSaveMsgPopup": function() {
            this.oSaveMsgView.showSaveMsgPopup(true);
        },

        "showSaveImagePopup": function() {
            this.oSaveImageView.showSavePage(true);
        },

        "showAboutPage": function() {
            this.oAboutPopup.showAboutPage(true);
        },

        "sliderThumbPositionChange": function(event) {
            if (event.type !== "slide" && event.type !== "slidechange") {
                return;
            }
            var sliderValue;

            // if slider is dragged then on mouse up when slide change event is triggered we get original event
            sliderValue = event.type === 'slide' || event.originalEvent ? Number(this.$('#plg-slider').slider('value').toFixed(1)) : this.model.sliderValue;

            if (event.type === 'slide' || event.originalEvent) {
                this.model.AddSliderPointOnLine({
                    "xPos": sliderValue
                }, true);
            }

            if (this.accManager != null && this.accManager.isAccessibilityOn) {

                var length = this.accJson.length,
                    counter = 0,
                    currentValue, arrParam;

                for (; counter < length; counter++) {
                    currentValue = this.accJson[counter];
                    if (currentValue.id === ".ui-slider-handle") {
                        var curSliderHandleValue = sliderValue,
                            curSliderHandleStatement = "The slider handle is now at " + curSliderHandleValue + "";
                        arrParam = [curSliderHandleStatement];
                        this.accManager.setAccText(this.$(currentValue.id), currentValue.accText, arrParam);
                        break;
                    }

                }
                this.accManager.setAccText(this.$("#plg-graph-label-container"), this.graphLabelAccText, this.graphLabelPosition());
            }
        },


        "spinImageUp": function() {
            this.model.ShowNextImage();
            this.$("#plg-img-obj").css("background-position", (this.model.idSelectedModelObj * -40) + "px 0px");
            this.$(".plg-obj-image").css("background-position", (this.model.idSelectedModelObj * -56) + "px 0px");
            this.changeSpinnerAcc();

        },

        "spinImageDown": function() {
            this.model.ShowPreviousImage();
            this.$("#plg-img-obj").css("background-position", (this.model.idSelectedModelObj * -40) + "px 0px");
            this.$(".plg-obj-image").css("background-position", (this.model.idSelectedModelObj * -1 * this.$(".plg-obj-image").width()) + "px 0px");
            this.changeSpinnerAcc();
        },

        "changeSpinnerAcc": function() {
            if (this.accManager != null && this.accManager.isAccessibilityOn) {

                var length = this.accJson.length,
                    counter = 0,
                    currentValue, arrParam;

                for (; counter < length; counter++) {
                    currentValue = this.accJson[counter];
                    if (currentValue.id === "#plg-btn-spinner") {
                        var spinObj = this.spinCurrentModelObject(),
                            spinStatement = spinObj;
                        arrParam = [spinStatement];
                        this.accManager.setAccText(this.$(currentValue.id), currentValue.accText, arrParam);
                        break;
                    }
                }
            }
        },

        "verticalIncreaseGraph": function() {
            this.model.scaleGraph('YPlus');
        },

        "verticalDecreaseGraph": function() {
            this.model.scaleGraph('YMinus');
        },

        "verticalDefaultGraph": function() {
            this.model.scaleGraph('resetY');
        },

        "horizontalIncreaseGraph": function() {
            this.model.scaleGraph('XPlus');
        },

        "horizontalDecreaseGraph": function() {
            this.model.scaleGraph('XMinus');
        },

        "horizontalDefaultGraph": function() {
            this.model.scaleGraph('resetX');
        },

        "createLineSegment": function() {
            this.model.AddLineSegment();
        },

        "createPositiveInfinityRay": function() {
            this.model.AddPositiveInfinityRay();
        },

        "createNegativeInfinityRay": function() {
            this.model.AddNegativeInfinityRay();
        },

        "OnModelObjectChange": function() {

       },

        "graphLabelPosition": function(affectedEqPanelId) {
            var strModelObjectone = "",
                strModelObjecttwo = "",
                strModelObjectthree = "",
                strModelObjectfour = "",
                strModelObject = "",
                arrParam = null;

            if (this.$("#plg-obj-oval-background-one").is(":visible")) {
                strModelObjectone = "The y position of function panel one is " + this.model.EqPanelData["one"].ySliderPointPos.safe_toFixed(1) + ".";
            }
            if (this.$("#plg-obj-oval-background-two").is(":visible")) {
                strModelObjecttwo = "The y position of function panel two is " + this.model.EqPanelData["two"].ySliderPointPos.safe_toFixed(1) + ".";
            }
            if (this.$("#plg-obj-oval-background-three").is(":visible")) {
                strModelObjectthree = "The y position of function panel three is " + this.model.EqPanelData["three"].ySliderPointPos.safe_toFixed(1) + ".";
            }
            if (this.$("#plg-obj-oval-background-four").is(":visible")) {
                strModelObjectfour = "The y position of function panel four is " + this.model.EqPanelData["four"].ySliderPointPos.safe_toFixed(1) + ".";
            }

            arrParam = [strModelObjectone, strModelObjecttwo, strModelObjectthree, strModelObjectfour];

            if (affectedEqPanelId) {
                if (!(this.$("#plg-obj-oval-background-" + affectedEqPanelId).is(":visible"))) {
                    strModelObject = "The y position of function panel " + affectedEqPanelId + " is " + this.model.EqPanelData[affectedEqPanelId].ySliderPointPos.safe_toFixed(1) + ".";
                }
                if (affectedEqPanelId === "one") {
                    arrParam[0] = strModelObject;
                } else if (affectedEqPanelId === "two") {
                    arrParam[1] = strModelObject;
                } else if (affectedEqPanelId === "three") {
                    arrParam[2] = strModelObject;
                } else if (affectedEqPanelId === "four") {
                    arrParam[3] = strModelObject;
                }
            }

            return arrParam;
        },

        "spinCurrentModelObject": function() {
            var curModelObjectId = this.model.idSelectedModelObj,
                curModelObject = "",
                arrParam = null;
            if (curModelObjectId === 0) {
                curModelObject = "rocket ";
            } else if (curModelObjectId === 1) {
                curModelObject = "basketball ";
            } else if (curModelObjectId === 2) {
                curModelObject = "monkey";
            } else if (curModelObjectId === 3) {
                curModelObject = "dollar ";
            } else if (curModelObjectId === 4) {
                curModelObject = "dolphin ";
            }
            arrParam = [curModelObject];
            return arrParam;
        },

        "equationPanelUpdate": function() {
            var strData = this.model.EqPanelData[this.model.idSelectedEqPanel];
            strPanelNo = strData.idEquationPanel,
                strLineNo = strData.idSelectedLine,
                strFunc = "functions",
                arrParam = null;
            strLineNo = strLineNo.slice(-1);
            if (strLineNo == 1) {
                strFunc = "function"
            }
            arrParam = [strPanelNo, strLineNo, strFunc];
            return arrParam;
        },

        "setAccOn": function() {
            var length = this.accJson.length,
                counter = 0,
                currentValue;

            for (; counter < length; counter++) {
                currentValue = this.accJson[counter];
                this.accManager.setTabIndex(this.$(currentValue.id), currentValue.tabIndex);
                var arrParam = null;

                if (currentValue.id === "#plg-graph-label-container") {
                    this.graphLabelAccText = currentValue.accText;
                    arrParam = this.graphLabelPosition();
                } else if (currentValue.id === "#plg-grapher-control") {
                    this.oGrapher.updateGraphAcc(currentValue.accText);
                    continue;
                } else if (currentValue.id === "#plg-btn-spinner") {
                    var spinObj = this.spinCurrentModelObject(),
                        spinStatment = spinObj;
                    arrParam = [spinStatment];

                } else if (currentValue.id === ".ui-slider-handle") {
                    var curSliderHandleValue = this.model.EqPanelData[this.model.idSelectedEqPanel].xSliderPointPos,
                        curSliderHandleStatement = "Currently the slider handle is at " + curSliderHandleValue + ". Use the left and right arrow keys to move the slider handle";
                    arrParam = [curSliderHandleStatement];
                } else if (currentValue.id === "#plg-line-segment") {
                    this.lineSegAcctext = currentValue.accText;
                    arrParam = this.getlineAccparam(this.constants.SEGMENT);
                } else if (currentValue.id === "#plg-positive-infinity") {
                    this.linePosRayAcctext = currentValue.accText;
                    arrParam = this.getlineAccparam(this.constants.POS_INFINITY_RAY);
                } else if (currentValue.id === "#plg-negative-infinity") {
                    this.lineNegRayAcctext = currentValue.accText;
                    arrParam = this.getlineAccparam(this.constants.NEG_INFINITY_RAY);
                } else if (currentValue.id === "#plg-equation-panel-one") {
                    this.oEqPanel1.updateEqPanelAcc(currentValue.accText);
                    continue;
                } else if (currentValue.id === "#plg-fa-check-square-one") {
                    this.oEqPanel1.updateEqPanelCheckAcc(currentValue.accText);
                    continue;
                } else if (currentValue.id === "#plg-txteditable-one") {
                    this.oEqPanel1.updateEqPanelEditAcc(currentValue.accText);
                    continue;
                } else if (currentValue.id === "#plg-equation-panel-two") {
                    this.oEqPanel2.updateEqPanelAcc(currentValue.accText);
                    continue;
                } else if (currentValue.id === "#plg-fa-check-square-two") {
                    this.oEqPanel2.updateEqPanelCheckAcc(currentValue.accText);
                    continue;
                } else if (currentValue.id === "#plg-txteditable-two") {
                    this.oEqPanel2.updateEqPanelEditAcc(currentValue.accText);
                    continue;
                } else if (currentValue.id === "#plg-equation-panel-three") {
                    this.oEqPanel3.updateEqPanelAcc(currentValue.accText);
                    continue;
                } else if (currentValue.id === "#plg-fa-check-square-three") {
                    this.oEqPanel3.updateEqPanelCheckAcc(currentValue.accText);
                    continue;
                } else if (currentValue.id === "#plg-txteditable-three") {
                    this.oEqPanel3.updateEqPanelEditAcc(currentValue.accText);
                    continue;
                } else if (currentValue.id === "#plg-equation-panel-four") {
                    this.oEqPanel4.updateEqPanelAcc(currentValue.accText);
                    continue;
                } else if (currentValue.id === "#plg-fa-check-square-four") {
                    this.oEqPanel4.updateEqPanelCheckAcc(currentValue.accText);
                    continue;
                } else if (currentValue.id === "#plg-txteditable-four") {
                    this.oEqPanel4.updateEqPanelEditAcc(currentValue.accText);
                    continue;
                } else if (currentValue.id === "#plg-graph-button-close") {
                    this.deleteBtnAccText = currentValue.accText;
                    arrParam = this.getDeleteBtnAccText();
                }

                this.accManager.setAccText(this.$(currentValue.id), currentValue.accText, arrParam);
            }
            this.$(".acc-element").on("keydown", _.bind(this.accManager._keyPressHandler, this));

            this.oGrapher.setAccOn();
            this.oEqPanel1.setAccOn();
            this.oEqPanel2.setAccOn();
            this.oEqPanel3.setAccOn();
            this.oEqPanel4.setAccOn();

        },

        "getlineAccparam": function(lineType) {
            var arrParam = null;
            if (lineType === this.constants.SEGMENT) {
                if (this.model.idSelectedEqPanel != -1) {
                    arrParam = ["Add Segment button. Use spacebar to create a line segment on the graph for the function panel " + this.model.idSelectedEqPanel];
                } else {
                    arrParam = ["Add Segment button. Since no function panel selected, you can not add a segment."];
                }
            } else if (lineType === this.constants.POS_INFINITY_RAY) {
                if (this.model.idSelectedEqPanel != -1) {
                    arrParam = ["Add positive ray button. Use spacebar to create a ray approaching positive infinity on the graph for the function panel " + this.model.idSelectedEqPanel];
                } else {
                    arrParam = ["Add positive ray button. Since no function panel selected, you can not add a ray."];
                }
            } else if (lineType === this.constants.NEG_INFINITY_RAY) {
                if (this.model.idSelectedEqPanel != -1) {
                    arrParam = ["Add negative ray button. Use spacebar to create a ray approaching negative infinity on the graph for the function panel " + this.model.idSelectedEqPanel];
                } else {
                    arrParam = ["Add negative ray button. Since no function panel selected, you can not add a ray."];
                }
            }
            return arrParam;
        },

        "OnPopupVisibilityChange": function(data) {
            if (this.accManager != null && this.accManager.isAccessibilityOn) {

                if (data.bIsVisible) {
                    this.accManager.disableAllTabs();
                } else {
                    this.accManager.enableAllTabs();
                    if (data.popupName === "About Popup") {
                        this.$("#pbs-base-title-i-icon-content").focus();
                    } else if (data.popupName === "Axis Label Popup") {
                        this.$("#plg-graph-button-pencil").focus();

                    } else if (data.popupName === "Error Msg Popup") {
                        this.$(".ui-slider-handle").focus();
                    } else if (data.popupName === "Save Popup" || data.popupName === "Save Msg Popup") {

                        if (data.affectedExpData && data.affectedExpData.bSaveOkClicked) {} else {
                            this.$("#pbs-base-title-cam-icon-content").focus();
                        }

                    }
                }
            }

            if (data.popupName === "Save Popup") {

                if (data.affectedExpData && data.affectedExpData.bSaveOkClicked) {
                    Shutterbug.snapshot({
                        selector: '#plg-main-container',
                        done: this.ScreenshotDone, // optional
                        fail: this.ScreenshotFail, // optional
                        always: this.ScreenshotAlways // optional
                    });

                    this.oSaveMsgView.showSaveMsgPopup(true);
                    g_oSaveMsgView = this.oSaveMsgView;

                }
            }
        },

        "ScreenshotDone": function(src) {

            if (src && g_oSaveMsgView) {
                g_oSaveMsgView.updateURL(src);
            }
        },

        "ScreenshotFail": function() {
            alert("Image save failed. Please check your internet connection and retry.");
        },

        "ScreenshotAlways": function() {
            //alert("always");
        },

        "setSliderProps": function() {
            this.$("#plg-slider").slider({
                value: this.model.sliderValue,
                min: this.model.gridOptions.gridLimits.xLower,
                max: this.model.gridOptions.gridLimits.xUpper,
                step: 0.1
            });
        },



        "renderActivityArea": function() {
            if (this.$activity_el === null) {
                this.$activity_el = this.$("#" + this.langJson.title_short + "-activity-area-container");
            }
            var ht = Handlebars.templates['plg-template']({
                "activity-json": this.langJson
            }).trim();

            this.$activity_el.append(ht);

            this.$('.plg-obj-oval-background').hide();

            this.$("#plg-slider").slider({
                value: 1,
                min: this.model.gridOptions.gridLimits.xLower,
                max: this.model.gridOptions.gridLimits.xUpper,
                step: 0.1
            });

            if (this.oGrapher === null && this.oEqPanel1 === null) {

                this.oEqPopup = new EqPopup({
                    "el": this.$("#plg-activity-area-container"),
                    "model": this.model,
                    "accManager": this.accManager
                });
                this.oAboutPopup = new AboutView({
                    "el": this.$("#plg-activity-area-container"),
                    "model": this.model,
                    "accManager": this.accManager
                });

                this.oSaveImageView = new SaveImageView({
                    "el": this.$("#plg-activity-area-container"),
                    "model": this.model,
                    "accManager": this.accManager
                });
                this.oAxisLabelView = new AxisLabelView({
                    "el": this.$("#plg-activity-area-container"),
                    "model": this.model,
                    "accManager": this.accManager
                });
                this.oErrorMsgView = new ErrorMsgView({
                    "el": this.$("#plg-activity-area-container"),
                    "model": this.model,
                    "accManager": this.accManager
                });
                this.oSaveMsgView = new SaveMsgView({
                    "el": this.$("#plg-activity-area-container"),
                    "model": this.model,
                    "accManager": this.accManager
                });

                var graphDiv = this.$("#plg-grapher-control");
                this.model.updateGraphCoord(graphDiv.height(), graphDiv.width());

                this.oGrapher = new Grapher({
                    "el": graphDiv,
                    "model": this.model,
                    "accManager": this.accManager
                });

                this.oEqPanel1 = new EqPanel({
                    "el": this.$("#plg-equation-panel-one"),
                    "model": {
                        "number": "1",
                        "arrayId": "one",
                        "mainModel": this.model,
                        "cssClassName": "plg-equation-panel-one",
                        "oEqPopup": this.oEqPopup,
                        "accManager": this.accManager
                    }
                });
                this.oEqPanel2 = new EqPanel({
                    "el": this.$("#plg-equation-panel-two"),
                    "model": {
                        "number": "2",
                        "arrayId": "two",
                        "mainModel": this.model,
                        "cssClassName": "plg-equation-panel-two",
                        "oEqPopup": this.oEqPopup,
                        "accManager": this.accManager
                    }
                });
                this.oEqPanel3 = new EqPanel({
                    "el": this.$("#plg-equation-panel-three"),
                    "model": {
                        "number": "3",
                        "arrayId": "three",
                        "mainModel": this.model,
                        "cssClassName": "plg-equation-panel-three",
                        "oEqPopup": this.oEqPopup,
                        "accManager": this.accManager
                    }
                });
                this.oEqPanel4 = new EqPanel({
                    "el": this.$("#plg-equation-panel-four"),
                    "model": {
                        "number": "4",
                        "arrayId": "four",
                        "mainModel": this.model,
                        "cssClassName": "plg-equation-panel-four",
                        "oEqPopup": this.oEqPopup,
                        "accManager": this.accManager
                    }
                });

            }

            this.oGrapher.render();
            this.oEqPanel1.render();
            this.oEqPanel2.render();
            this.oEqPanel3.render();
            this.oEqPanel4.render();

            if (this.accManager != null && this.accManager.isAccessibilityOn) {
                this.setAccOn();
                this.$("#plg-main-container").focus();
            }
        }
    });
    // Our module now returns our view
    return PLGView;
});
