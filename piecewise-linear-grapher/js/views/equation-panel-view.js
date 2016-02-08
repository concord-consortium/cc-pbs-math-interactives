define([
    "equation-panel-template",
    "lang-json",
    "constants",
    "equation-popup-view"

], function(template, langJson, constants, EqPopup) {
    var oView = Backbone.View.extend({

        "initialize": function() {
            this.constants = new constants();
            this.IsPopupVisible = false;
            this.accJson = langJson.accJSON;
            this.listenTo(this.model.mainModel, "OnLineDatachange", this.OnLineDatachange);
            this.listenTo(this.model.mainModel, "changeEquationSelection", this.changeEquationSelection);
            this.listenTo(this.model.mainModel, "OnPopupVisibilityChange", this.OnPopupVisibilityChange);
            this.checkBoxAccText = "";
            this.editBoxAccText = "";
            this.mainAccText = "";
            this.graphLabelAccText = "";
            this.bRemoveExpressionLine = false;
        },
        "OnLineDatachange": function(data) {
            if (this.model.arrayId === data.affectedEqPanelId) {
                this.renderExpressionArea();
            }
        },

        /**
         * change equation selection in equation panel while moving slider point or selecting deselecting a line segment.
         * @param  {[object]} data [data required to change equation selection]
         */
        "changeEquationSelection": function(data) {
            if (!this.$el.hasClass("plg-equation-panel-" + data.affectedEqPanelId)) {
                return;
            }
            this.$(".plg-expression-base, .plg-expression-selected").removeClass("plg-expression-selected");
            this.$("#" + data.affectedEqPanelId + "-" + data.idSelectedLine).addClass("plg-expression-selected");
        },

        "updateEqPanelEditAcc": function(accText) {
            this.editBoxAccText = accText;
        },

        "OnPopupVisibilityChange": function(data) {

            this.IsPopupVisible = data.bIsVisible;

            if (data.affectedExpData !== null && this.model.arrayId === data.affectedExpData.EqPanelId) {
                if (this.model.accManager !== null && this.model.accManager.isAccessibilityOn && data.popupName === "Eq Expression Popup") {
                    if (data.affectedExpData.LineId !== this.constants.INVALID_VALUE && !data.bIsVisible) {
                        this.$("#" + this.model.arrayId + "-" + data.affectedExpData.LineId).focus();
                    }
                }
            }
        },

        "render": function() {
            var ht = Handlebars.templates['equation-panel-template']({
                "number": this.model.number,
                "EqPanelId": this.model.arrayId
            }).trim();

            this.$el.html(ht);
            this.$expArea = this.$("#eq-panel-expression-area");

            this.$('.plg-txteditable').attr('maxLength', 50);

            this.renderExpressionArea();


        },

        "events": {
            "click .fa-check-square": "checkCheckBoxVisibility",
            "click .fa-times-circle": "removeExpressionLine",
            "click .plg-expression-base": "openSymbolicExpPopup",
            "focusout .plg-txteditable": "onFocusOutChangeTextData",
            "click .plg-txteditable": "OnClicktxtEditable",
            "click .equation-panel-box": "OnEqPanelClick"
        },

        "renderExpressionArea": function() {
            var data = this.model.mainModel.EqPanelData[this.model.arrayId],
                value,
                strEquation = "",
                strSelected = "";

            for (value in data.lineData) {
                strSelected = " plg-expression-selected";
                strEquation += this.getExpressionHTML(data.lineData[value], value, strSelected);
            }

            this.$expArea.html(strEquation);
            this.$("#eq-panel-checkbox-editabletext").addClass(this.model.cssClassName);
            this.$('.plg-txteditable.' + this.model.arrayId).css('background-color', this.$("#eq-panel-checkbox-editabletext").css('background-color'));
            this.$("#plg-txteditable-" + this.model.arrayId).val(this.model.mainModel.EqPanelData[this.model.arrayId].title)
                .attr('value', this.model.mainModel.EqPanelData[this.model.arrayId].title);

            if (this.model.mainModel.EqPanelData[this.model.arrayId].bIsEnable === true) {
                this.$("#plg-fa-check-square-" + this.model.arrayId).addClass('fa-checked-square');
            } else {
                this.$("#plg-fa-check-square-" + this.model.arrayId).removeClass('fa-checked-square');
            }
            if (this.model.accManager !== null && this.model.accManager.isAccessibilityOn) {
                this.setAccOn();
                if (this.bRemoveExpressionLine) {
                    this.bRemoveExpressionLine = false;
                    var objKeyArray = Object.keys(this.model.mainModel.EqPanelData[this.model.arrayId].lineData);
                    if (objKeyArray.length > 0) {
                        this.$("#" + this.model.arrayId + "-" + objKeyArray[objKeyArray.length - 1]).focus();
                    } else {
                        this.$el.focus();
                    }

                }
            }
        },

        "setAccOn": function() {
            if (this.model.accManager !== null && this.model.accManager.isAccessibilityOn) {
                var tabIndex = this.constants.EQ_BASE_TAB_INDEX + (1000 * (this.model.number - 1)) + this.constants.EQ_BASE_TAB_BUFFER,
                    value = null,
                    strAcc = "",
                    slope = "",
                    displacement = "",
                    x1 = "",
                    x2 = "",
                    y = "",
                    strleftRel = "less than",
                    strrightRel = "less than";
                for (value in this.model.mainModel.EqPanelData[this.model.arrayId].lineData) {

                    slope = this.model.mainModel.EqPanelData[this.model.arrayId].lineData[value].slope.safe_toFixed(2);
                    displacement = this.model.mainModel.EqPanelData[this.model.arrayId].lineData[value].displacement.safe_toFixed(1);
                    strleftRel = "less than";
                    strrightRel = "less than";
                    x1 = this.model.mainModel.EqPanelData[this.model.arrayId].lineData[value].x1.safe_toFixed(1);
                    x2 = this.model.mainModel.EqPanelData[this.model.arrayId].lineData[value].x2.safe_toFixed(1);
                    y = this.model.mainModel.EqPanelData[this.model.arrayId].lineData[value].y1.safe_toFixed(1);

                    if (this.model.mainModel.EqPanelData[this.model.arrayId].lineData[value].lineTypeId === this.constants.POS_INFINITY_RAY) {
                        x2 = "infinity";

                    } else if (this.model.mainModel.EqPanelData[this.model.arrayId].lineData[value].lineTypeId === this.constants.NEG_INFINITY_RAY) {
                        x1 = "minus infinity";
                        y = this.model.mainModel.EqPanelData[this.model.arrayId].lineData[value].y2.safe_toFixed(1);

                    }

                    if (this.model.mainModel.EqPanelData[this.model.arrayId].lineData[value].xRangeLeftRelation === this.constants.LESS_THAN_OR_EQUAL) {
                        strleftRel = "less than or equal to";
                    }

                    if (this.model.mainModel.EqPanelData[this.model.arrayId].lineData[value].xRangeRightRelation === this.constants.LESS_THAN_OR_EQUAL) {
                        strrightRel = "less than or equal to";
                    }

                    if (this.model.mainModel.EqPanelData[this.model.arrayId].lineData[value].idInterceptType !== this.constants.SLOPE_INTERCEPT) {
                        strAcc = "Function " + slope + " ( x minus " + x1 + " ) plus " + y + " for " + x1 + " " + strleftRel + " x " + strrightRel + " " + x2 + " Use spacebar to edit the function.";
                    } else {

                        strAcc = "Function " + slope + " x plus " + displacement + " for " + x1 + " " + strleftRel + " x " + strrightRel + " " + x2 + " Use spacebar to edit the function.";
                    }

                    this.model.accManager.setTabIndex(this.$("#" + this.model.arrayId + "-" + value), tabIndex);

                    this.model.accManager.setAccText(this.$("#" + this.model.arrayId + "-" + value), strAcc, null);

                    tabIndex += 10;

                    this.model.accManager.setTabIndex(this.$("#remove-" + this.model.arrayId + "-" + value), tabIndex);

                    this.model.accManager.setAccText(this.$("#remove-" + this.model.arrayId + "-" + value), "Remove Expression.", null);

                    if (this.IsPopupVisible) {
                        this.model.accManager.enableTab(this.$("#" + this.model.arrayId + "-" + value), false);
                        this.model.accManager.enableTab(this.$("#remove-" + this.model.arrayId + "-" + value), false);
                    }

                    tabIndex += 10;
                }
                this.setAccOnMain();
                this.setAccOnCheck();
                this.setAccOnEdit();

                this.$(".acc-element").on("keydown", _.bind(this.model.accManager._keyPressHandler, this));

            }
        },

        "updateEqPanelAcc": function(accText) {
            this.mainAccText = accText;
        },

        "updateEqPanelCheckAcc": function(accText) {
            this.checkBoxAccText = accText;
        },

        "updateEqPanelEditAcc": function(accText) {
            this.editBoxAccText = accText;
        },

        "setAccOnCheck": function() {
            var strPanelNo = this.model.arrayId,
                lineCount = Object.keys(this.model.mainModel.EqPanelData[this.model.arrayId].lineData).length,
                strFunc = "function panel",
                strRel = "is",
                strVisible = "hidden",
                strHide = "unhide",
                arrParam = null,
                strChecked = "unchecked";

            if (lineCount == 0) {
                strFunc = "function panel";
                strRel = "is";
            } else if (lineCount == 1) {
                strFunc = "function panel";
                strRel = "is";
            }

            if (this.$("#plg-fa-check-square-" + this.model.arrayId).hasClass('fa-checked-square')) {
                strChecked = "checked";
                strVisible = "visible";
                strHide = "hide";
            }
            arrParam = [this.model.arrayId, strChecked, strFunc, strRel, strVisible, strHide, strFunc];
            this.model.accManager.setAccText(this.$("#plg-fa-check-square-" + this.model.arrayId), this.checkBoxAccText, arrParam);
        },

        "setAccOnEdit": function() {
            var strMsg = "Currently the function panel one has no title";
            if (this.model.mainModel.EqPanelData[this.model.arrayId].title !== "") {
                strMsg = this.model.mainModel.EqPanelData[this.model.arrayId].title;
            }
            arrParam = [strMsg];
            this.model.accManager.setAccText(this.$("#plg-txteditable-" + this.model.arrayId), this.editBoxAccText, arrParam);
        },

        "setAccOnMain": function() {
            var lineCount = Object.keys(this.model.mainModel.EqPanelData[this.model.arrayId].lineData).length,
                strFunc = "functions",
                strRel = "are",
                strVisible = "hidden",
                strHide = "unhide",
                arrParam = null,
                strChecked = "unchecked";

            if (lineCount == 0) {
                lineCount = "no";
            } else if (lineCount == 1) {
                strFunc = "function";
            }

            arrParam = [this.model.arrayId, lineCount, strFunc];
            this.model.accManager.setAccText(this.$el, this.mainAccText, arrParam);
        },

        "getExpressionHTML": function(lineData, idLine, strSelected) {

            if (lineData.graphLine.equationPanelData.idSelectedLine !== idLine) {
                strSelected = "";
            }
            var strRet = "<div id='" + this.model.arrayId + "-" + idLine + "' class='plg-expression-base" + strSelected + "' title='" + this.equationPanelSymbolicExpression(lineData) + "'>";
            strRet += this.equationPanelSymbolicExpression(lineData);
            strRet += "<span id='remove-" + this.model.arrayId + "-" + idLine + "' class='plg-expresion-remove-sign fa fa-times-circle fa-lg'></span></div>"
            return strRet;
        },

        "OnClicktxtEditable": function(event) {
            event.stopPropagation();
        },

        "removeExpressionLine": function(event) {
            event.stopPropagation();
            var $targetElement = $(event.target),
                arrElementId = $targetElement.attr("id").split("-"),
                lineId = arrElementId[2],
                eqPanelId = arrElementId[1];


            if (this.model.accManager !== null && this.model.accManager.isAccessibilityOn) {
                this.bRemoveExpressionLine = true;
            }

            this.model.mainModel.DeleteLine({
                "EqPanelId": eqPanelId,
                "LineId": lineId
            });
            this.model.mainModel.SetEqPanelSelected({
                "EqPanelId": this.model.arrayId
            });

        },

        "openSymbolicExpPopup": function(event) {
            event.stopPropagation();
            var $targetElement = $(event.target),
                model = this.model,
                plgMainModel = model.mainModel,
                arrElementId = $targetElement.attr("id").split("-"),
                lineId = arrElementId[1],
                eqPanelId = arrElementId[0];

            if (arrElementId.length === 2) {
                // For hiding points of all equations of previously selected equation panel
                if (plgMainModel.idSelectedEqPanel !== plgMainModel.constants.INVALID_VALUE &&
                    plgMainModel.idSelectedEqPanel !== eqPanelId) {
                    plgMainModel.trigger("onDeselectingEquationPanel", {
                        "eqPanelId": plgMainModel.idSelectedEqPanel
                    });
                }
                plgMainModel.idSelectedEqPanel = eqPanelId;

                // For hiding points of all equations of currently selected equation panel
                plgMainModel.trigger("onSelectingEquationPanel", {
                    "eqPanelId": plgMainModel.idSelectedEqPanel
                });
                if (lineId !== plgMainModel.idSelectedLine) {
                    plgMainModel.EqPanelData[eqPanelId].lineData[lineId].graphLine.selectLine();
                }
                model.oEqPopup.setAffectedExpData({
                    "EqPanelId": eqPanelId,
                    "LineId": lineId
                });
                plgMainModel.ChangeLineSelection({
                    "EqPanelId": eqPanelId,
                    "LineId": lineId
                });
            }
            plgMainModel.SetEqPanelSelected({
                "EqPanelId": this.model.arrayId
            });
        },

        "checkCheckBoxVisibility": function(event) {
            $(event.target).toggleClass('fa-checked-square');
            this.model.mainModel.ToggleEnableStatus({
                "EqPanelId": this.model.arrayId
            });

            event.stopPropagation();
            this.model.mainModel.trigger("lineVisibilityChanged", {
                "affectedEqPanelId": this.model.arrayId
            });
            this.model.mainModel.SetEqPanelSelected({
                "EqPanelId": this.model.arrayId
            });
        },

        "equationPanelSymbolicExpression": function(lineData) {
            var lineEqn;
            if (lineData.idInterceptType === this.constants.SLOPE_INTERCEPT) {
                lineEqn = lineData.expressionSlopeIntercept;
            } else {
                lineEqn = lineData.expressionPointSlope;
            }
            return lineEqn;
        },

        "OnEqPanelClick": function() {
            this.model.mainModel.SetEqPanelSelected({
                "EqPanelId": this.model.arrayId
            });
        },

        "onFocusOutChangeTextData": function(event) {
            event.stopPropagation();
            var changeText = this.$(".plg-txteditable").val();
            this.$(".plg-txteditable").attr('value', changeText);
            this.model.mainModel.ChangeTextData({
                "EqPanelId": this.model.arrayId,
                "ChangeText": changeText
            })
            this.setAccOnEdit();
        }

    });
    // Our module now returns our view
    return oView;
});
