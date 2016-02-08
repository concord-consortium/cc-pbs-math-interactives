define([
    "equation-popup-template",
    "lang-json",
    "constants",
    "spinner-view"

], function(template, langJson, constants, spinnerView) {
    var oView = Backbone.View.extend({

        "initialize": function(data) {
            this.bSpinnersCreated = false;
            this.constants = new constants();
            this.affectedExpData = null;
            this.bIsVisible = false;
            this.listenTo(this.model, "OnLineDatachange", this.OnLineDatachange);
            this.listenTo(this.model, "OnPopupVisibilityChange", this.OnPopupVisibilityChange);
            this.langJson = langJson;
            this.accJson = langJson.popupAccJSON;
            this.accManager = data.accManager;
            this.bIsPopupAlreadyOpen = false;
            this.render();
        },


        "OnPopupVisibilityChange": function(data) {
            if (data.bIsVisible === false) {
                this.bIsPopupAlreadyOpen = data.bIsVisible;
            }
        },

        "setAccOn": function() {
            var length = this.accJson.length,
                counter = 0,
                currentValue,
                arrParam = null,
                lineData = this.model.EqPanelData[this.affectedExpData.EqPanelId].lineData[this.affectedExpData.LineId];

            for (; counter < length; counter++) {
                currentValue = this.accJson[counter];
                this.accManager.setTabIndex(this.$(currentValue.id), currentValue.tabIndex);
                var arrParam = null;

                if (currentValue.id === "#plg-eqn-popup-holder") {
                    var strLineType = "Segment";
                    if (lineData.lineTypeId === this.constants.POS_INFINITY_RAY) {
                        strLineType = "positive ray";
                    } else if (lineData.lineTypeId === this.constants.NEG_INFINITY_RAY) {
                        strLineType = "negative ray";
                    }

                    arrParam = [strLineType, (Object.keys(this.model.EqPanelData[this.affectedExpData.EqPanelId].lineData).indexOf(this.affectedExpData.LineId) + 1)];
                } else if (currentValue.id === "#fa-check-square-label1") {
                    var strCheckType = "The function is in the point slope form. Use spacebar to select the slope intercept form.";
                    if (this.$("#fa-check-square-label1").hasClass('checked')) {
                        strCheckType = "The function is in the slope intercept form.";
                    }
                    arrParam = [strCheckType];
                } else if ((currentValue.id === "#plg-eqn-popup-11") || (currentValue.id === "#plg-eqn-popup-21")) {
                    var strSlopeValue = lineData.slope;
                    strSlopeValue = strSlopeValue.toFixed(2);
                    arrParam = [strSlopeValue];

                } else if (currentValue.id === "#plg-eqn-popup-12") {
                    var strDisplacementValue = lineData.displacement;
                    strDisplacementValue = strDisplacementValue.toFixed(1);
                    arrParam = [strDisplacementValue];
                } else if (currentValue.id === "#plg-eqn-popup-13" || currentValue.id === "#plg-eqn-popup-24") {
                    if ((lineData.lineTypeId === this.constants.POS_INFINITY_RAY) || (lineData.lineTypeId === this.constants.SEGMENT)) {
                        var strXOneValue = lineData.x1;
                        strXOneValue = strXOneValue.toFixed(1);
                        arrParam = [strXOneValue];
                    } else if (lineData.lineTypeId === this.constants.NEG_INFINITY_RAY) {
                        continue;
                    }
                } else if (currentValue.id === "#plg-eqn-popup-13-infinitytext" || currentValue.id === "#plg-eqn-popup-24-infinitytext") {
                    if ((lineData.lineTypeId === this.constants.POS_INFINITY_RAY) || (lineData.lineTypeId === this.constants.SEGMENT)) {
                        continue;
                    }
                } else if ((currentValue.id === "#plg-eqn-popup-toggle-btn-base-one") || (currentValue.id === "#plg-eqn-popup-toggle-btn-base-three")) {
                    var strLeftRange, strRightRange;
                    if ((this.$("#plg-eqn-popup-toggle-btn-less-than-equal-one").hasClass('plg-eqn-popup-toggle-checked'))) {
                        strLeftRange = "less than or equal to";
                        strRightRange = "less than";
                    } else {
                        strLeftRange = "less than";
                        strRightRange = "less than or equal to";
                    }
                    arrParam = [strLeftRange, strRightRange];
                } else if ((currentValue.id === "#plg-eqn-popup-toggle-btn-base-two") || (currentValue.id === "#plg-eqn-popup-toggle-btn-base-four")) {
                    var strLeftRange, strRightRange;
                    if ((this.$("#plg-eqn-popup-toggle-btn-less-than-equal-two").hasClass('plg-eqn-popup-toggle-checked'))) {
                        strLeftRange = "less than or equal to";
                        strRightRange = "less than";
                    } else {
                        strLeftRange = "less than";
                        strRightRange = "less than or equal to";
                    }
                    arrParam = [strLeftRange, strRightRange];
                } else if (currentValue.id === "#plg-eqn-popup-14" || currentValue.id === "#plg-eqn-popup-25") {
                    if ((lineData.lineTypeId === this.constants.NEG_INFINITY_RAY) || (lineData.lineTypeId === this.constants.SEGMENT)) {
                        var strXTwoValue = lineData.x2;
                        strXTwoValue = strXTwoValue.toFixed(1);
                        arrParam = [strXTwoValue];
                    } else if (lineData.lineTypeId === this.constants.POS_INFINITY_RAY) {
                        continue;
                    }
                } else if (currentValue.id === "#plg-eqn-popup-14-infinitytext" || currentValue.id === "#plg-eqn-popup-25-infinitytext") {
                    if ((lineData.lineTypeId === this.constants.NEG_INFINITY_RAY) || (lineData.lineTypeId === this.constants.SEGMENT)) {
                        continue;
                    }
                } else if (currentValue.id === "#fa-check-square-label2") {
                    var strCheckType = "The function is in the slope intercept form. Use spacebar to select the point slope form.";
                    if (this.$("#fa-check-square-label2").hasClass('checked')) {
                        strCheckType = "The function is in the point slope form.";
                    }
                    arrParam = [strCheckType];
                } else if (currentValue.id === "#plg-eqn-popup-22") {
                    var strXOneAValue = lineData.x2;
                    if ((lineData.lineTypeId === this.constants.POS_INFINITY_RAY) || (lineData.lineTypeId === this.constants.SEGMENT)) {
                        strXOneAValue = lineData.x1;
                    }
                    strXOneAValue = strXOneAValue.toFixed(1);
                    arrParam = [strXOneAValue];
                } else if (currentValue.id === "#plg-eqn-popup-23") {
                    var strYOneValue = lineData.y2;
                    if ((lineData.lineTypeId === this.constants.POS_INFINITY_RAY) || (lineData.lineTypeId === this.constants.SEGMENT)) {
                        strYOneValue = lineData.y1;
                    }
                    strYOneValue = strYOneValue.toFixed(1);
                    arrParam = [strYOneValue];
                }


                this.accManager.setAccText(this.$(currentValue.id), currentValue.accText, arrParam);
            }

            this.$(".acc-element").on("keydown", _.bind(this.accManager._keyPressHandler, this));
        },

        "setAccOff": function() {
            var length = this.accJson.length,
                counter = 0,
                currentValue;

            for (; counter < length; counter++) {
                currentValue = this.accJson[counter];
                this.accManager.setTabIndex(this.$(currentValue.id), -1);
                this.accManager.setAccText(this.$(currentValue.id), "", null);
            }
            this.$(".acc-element").on("keydown", _.bind(this.accManager._keyPressHandler, this));
        },

        "setAffectedExpData": function(data) {
            this.affectedExpData = data;
            this.bIsVisible = true;
        },

        "OnLineDatachange": function(data) {
            if (this.bIsVisible === true) {
                this.updateRender();
            }

            if (this.accManager != null && this.accManager.isAccessibilityOn) {

                if (this.bIsVisible === true) {
                    this.setAccOn();
                    if (!(this.bIsPopupAlreadyOpen)) {
                        this.$("#plg-eqn-popup-holder").focus();
                        this.bIsPopupAlreadyOpen = true;
                    }

                } else {
                    this.setAccOff();
                }
            }
        },

        "events": {
            "click .plg-eqn-popup-checkbox": "checkPopupCheckBox",
            "click .plg-eqn-slope-label": "checkPopupCheckBox",
            "click #plg-eqn-popup-toggle-btn-base-one , #plg-eqn-popup-toggle-btn-base-three": "CheckToggleLeftRange",
            "click #plg-eqn-popup-toggle-btn-base-two , #plg-eqn-popup-toggle-btn-base-four": "CheckToggleRightRange",
            "keyup #plg-eqn-popup-11": "popupChangeUpDownKeySlopeSI",
            "keyup #plg-eqn-popup-12": "popupChangeUpDownKeyDisplacementSI",
            "keyup #plg-eqn-popup-13": "popupChangeUpDownKeyX1SI",
            "keyup #plg-eqn-popup-14": "popupChangeUpDownKeyX2SI",
            "keyup #plg-eqn-popup-21": "popupChangeUpDownKeySlopePS",
            "keyup #plg-eqn-popup-22": "popupChangeUpDownKeyX1APS",
            "keyup #plg-eqn-popup-23": "popupChangeUpDownKeyY1PS",
            "keyup #plg-eqn-popup-24": "popupChangeUpDownKeyX1BPS",
            "keyup #plg-eqn-popup-25": "popupChangeUpDownKeyX2PS",
            "keyup #plg-eqn-popup-holder": "popupHolderKeyup"
        },

        "popupHolderKeyup": function(event) {
            if (this.accManager != null && this.accManager.isAccessibilityOn) {
                var code = (event.keyCode || event.which);
                if (code === 27) {
                    this.showPopup(false);
                }
            }
        },

        "popupChangeUpDownKeySlopeSI": function(e) {
            if (this.accManager != null && this.accManager.isAccessibilityOn) {
                var code = (e.keyCode || e.which);
                if (code === 38) {
                    this.si_spinner_slope._spinUpButttonPress();
                } else if (code === 40) {
                    this.si_spinner_slope._spinDownButttonPress();
                }
            }
        },

        "popupChangeUpDownKeyDisplacementSI": function(e) {
            if (this.accManager != null && this.accManager.isAccessibilityOn) {
                var code = (e.keyCode || e.which);
                if (code === 38) {
                    this.si_spinner_displacement._spinUpButttonPress();
                } else if (code === 40) {
                    this.si_spinner_displacement._spinDownButttonPress();
                }
            }
        },

        "popupChangeUpDownKeyX1SI": function(e) {
            if (this.accManager != null && this.accManager.isAccessibilityOn) {
                var code = (e.keyCode || e.which);
                if (code === 38) {
                    this.si_spinner_x1._spinUpButttonPress();
                } else if (code === 40) {
                    this.si_spinner_x1._spinDownButttonPress();
                }
            }
        },

        "popupChangeUpDownKeyX2SI": function(e) {
            if (this.accManager != null && this.accManager.isAccessibilityOn) {
                var code = (e.keyCode || e.which);
                if (code === 38) {
                    this.si_spinner_x2._spinUpButttonPress();
                } else if (code === 40) {
                    this.si_spinner_x2._spinDownButttonPress();
                }
            }
        },

        "popupChangeUpDownKeySlopePS": function(e) {
            if (this.accManager != null && this.accManager.isAccessibilityOn) {
                var code = (e.keyCode || e.which);
                if (code === 38) {
                    this.ps_spinner_slope._spinUpButttonPress();
                } else if (code === 40) {
                    this.ps_spinner_slope._spinDownButttonPress();
                }
            }
        },

        "popupChangeUpDownKeyX1APS": function(e) {
            if (this.accManager != null && this.accManager.isAccessibilityOn) {
                var code = (e.keyCode || e.which);
                if (code === 38) {
                    this.ps_spinner_x1_a._spinUpButttonPress();
                } else if (code === 40) {
                    this.ps_spinner_x1_a._spinDownButttonPress();
                }
            }
        },

        "popupChangeUpDownKeyY1PS": function(e) {
            if (this.accManager != null && this.accManager.isAccessibilityOn) {
                var code = (e.keyCode || e.which);
                if (code === 38) {
                    this.ps_spinner_y1._spinUpButttonPress();
                } else if (code === 40) {
                    this.ps_spinner_y1._spinDownButttonPress();
                }
            }
        },

        "popupChangeUpDownKeyX1BPS": function(e) {
            if (this.accManager != null && this.accManager.isAccessibilityOn) {
                var code = (e.keyCode || e.which);
                if (code === 38) {
                    this.ps_spinner_x1_b._spinUpButttonPress();
                } else if (code === 40) {
                    this.ps_spinner_x1_b._spinDownButttonPress();
                }
            }
        },

        "popupChangeUpDownKeyX2PS": function(e) {
            if (this.accManager != null && this.accManager.isAccessibilityOn) {
                var code = (e.keyCode || e.which);
                if (code === 38) {
                    this.ps_spinner_x2._spinUpButttonPress();
                } else if (code === 40) {
                    this.ps_spinner_x2._spinDownButttonPress();
                }
            }
        },

        "CheckToggleLeftRange": function() {
            var xRangeType = this.constants.LESS_THAN_OR_EQUAL;
            if (this.$("#plg-eqn-popup-toggle-btn-less-than-equal-one").hasClass('plg-eqn-popup-toggle-checked')) {
                xRangeType = this.constants.LESS_THAN;
            }
            this.model.ChangeToggleLeftRange({
                "affectedExpData": this.affectedExpData,
                "ChangedToggleLeftRangeType": xRangeType
            });
        },

        "CheckToggleRightRange": function() {
            var xRangeType = this.constants.LESS_THAN_OR_EQUAL;
            if (this.$("#plg-eqn-popup-toggle-btn-less-than-equal-two").hasClass('plg-eqn-popup-toggle-checked')) {
                xRangeType = this.constants.LESS_THAN;
            }
            this.model.CheckToggleRightRange({
                "affectedExpData": this.affectedExpData,
                "ChangedToggleRightRangeType": xRangeType
            });

        },

        "checkPopupCheckBox": function(event) {
            var interceptType = this.constants.POINT_SLOPE;
            if (this.$(event.currentTarget).hasClass('one')) {
                interceptType = this.constants.SLOPE_INTERCEPT;
            }

            this.model.ChangeInterceptType({
                "affectedExpData": this.affectedExpData,
                "ChangedInterceptType": interceptType
            });

        },

        "render": function() {
            var ht = Handlebars.templates['equation-popup-template']({

            }).trim();

            this.spinnerMinValue = -10;
            this.spinnerMaxValue = 10;

            this.$el.append(ht);
            this.$('#plg-eqn-slope-label-1').html(this.langJson.slope_label_1);
            this.$('#plg-eqn-slope-label-2').html(this.langJson.slope_label_2);
            this.$('.variableX').html(this.langJson.Variable_X);
            this.$('.forText').html(this.langJson.FOR);
            this.$('.plus').html(this.langJson.PLUS);
            this.$('.minus').html(this.langJson.MINUS);
            this.$(".plg-eqn-popup-13-infinitytext").html(this.langJson.NegInfinityText);
            this.$(".plg-eqn-popup-24-infinitytext").html(this.langJson.NegInfinityText);
            this.$(".plg-eqn-popup-14-infinitytext").html(this.langJson.InfinityText);
            this.$(".plg-eqn-popup-25-infinitytext").html(this.langJson.InfinityText);

            this.si_spinner_slope = this.createSpinner('plg-eqn-popup-11', 0.01, 1, "spinBox11", 2);
            this.si_spinner_displacement = this.createSpinner('plg-eqn-popup-12', 0.1, 2, "spinBox12", 1);
            this.si_spinner_x1 = this.createSpinner('plg-eqn-popup-13', 0.1, 3, "spinBox13", 1);
            this.si_spinner_x2 = this.createSpinner('plg-eqn-popup-14', 0.1, 4, "spinBox14", 1);

            //Create Point Slope Spinners
            this.ps_spinner_slope = this.createSpinner('plg-eqn-popup-21', 0.01, 1, "spinBox11", 2);
            this.ps_spinner_x1_a = this.createSpinner('plg-eqn-popup-22', 0.1, 2, "spinBox22", 1);
            this.ps_spinner_y1 = this.createSpinner('plg-eqn-popup-23', 0.1, 3, "spinBox23", 1);
            this.ps_spinner_x1_b = this.createSpinner('plg-eqn-popup-24', 0.1, 4, "spinBox24", 1);
            this.ps_spinner_x2 = this.createSpinner('plg-eqn-popup-25', 0.1, 5, "spinBox25", 1);


            this.listenTo(this.si_spinner_slope, "data-value-changed", this.changeSIspinnerSlope);
            this.listenTo(this.si_spinner_displacement, "data-value-changed", this.changeSIspinnerDisplacement);
            this.listenTo(this.si_spinner_x1, "data-value-changed", this.changeSIspinnerX1);
            this.listenTo(this.si_spinner_x2, "data-value-changed", this.changeSIspinnerX2);

            this.listenTo(this.ps_spinner_slope, "data-value-changed", this.changePSspinnerSlope);
            this.listenTo(this.ps_spinner_x1_a, "data-value-changed", this.changePSspinnerX1A);
            this.listenTo(this.ps_spinner_y1, "data-value-changed", this.changePSspinnerY1);
            this.listenTo(this.ps_spinner_x1_b, "data-value-changed", this.changePSspinnerX1B);
            this.listenTo(this.ps_spinner_x2, "data-value-changed", this.changePSspinnerX2);
            this._attachEvents();
            this.showPopup(false);
        },

        "updateRender": function() {
            var className = "plg-eqn-popup-label plg-eqn-popup-label-" + this.affectedExpData.EqPanelId;
            //Apply text from json
            this.$('.plg-eqn-popup-label').html(this.model.EqPanelData[this.affectedExpData.EqPanelId].title + " - " + this.langJson.eq_seg_text + (Object.keys(this.model.EqPanelData[this.affectedExpData.EqPanelId].lineData).indexOf(this.affectedExpData.LineId) + 1));
            this.$('.plg-eqn-popup-label').removeClass().addClass(className);
            this.setDefaultsToSpinners(this.affectedExpData);
            this.setInterceptType(this.affectedExpData);
            this.setRangeRelation(this.affectedExpData);
            if (this.bIsVisible && !this.bIsPopupAlreadyOpen) {
                this.showPopup(true);
                if (this.accManager === null || !this.accManager.isAccessibilityOn) {
                    this.bIsPopupAlreadyOpen = true;
                }
            }
        },

        "changeSIspinnerSlope": function() {


            this.model.EquationExpressionChange({
                "expType": "SIspinnerSlope",
                "curValue": this.si_spinner_slope.currentValue,
                "affectedExpData": this.affectedExpData
            });
        },

        "changeSIspinnerDisplacement": function() {
            this.model.EquationExpressionChange({
                "expType": "SIspinnerDisplacement",
                "curValue": this.si_spinner_displacement.currentValue,
                "affectedExpData": this.affectedExpData
            });
        },

        "changeSIspinnerX1": function() {
            this.model.EquationExpressionChange({
                "expType": "SIspinnerX1",
                "curValue": this.si_spinner_x1.currentValue,
                "affectedExpData": this.affectedExpData
            });
        },

        "changeSIspinnerX2": function() {
            this.model.EquationExpressionChange({
                "expType": "SIspinnerX2",
                "curValue": this.si_spinner_x2.currentValue,
                "affectedExpData": this.affectedExpData
            });
        },

        "changePSspinnerSlope": function() {
            this.model.EquationExpressionChange({
                "expType": "PSspinnerSlope",
                "curValue": this.ps_spinner_slope.currentValue,
                "affectedExpData": this.affectedExpData
            });
        },

        "changePSspinnerX1A": function() {
            this.model.EquationExpressionChange({
                "expType": "PSspinnerX1A",
                "curValue": this.ps_spinner_x1_a.currentValue,
                "affectedExpData": this.affectedExpData
            });
        },

        "changePSspinnerY1": function() {
            this.model.EquationExpressionChange({
                "expType": "PSspinnerY1",
                "curValue": this.ps_spinner_y1.currentValue,
                "affectedExpData": this.affectedExpData
            });
        },

        "changePSspinnerX1B": function() {
            this.model.EquationExpressionChange({
                "expType": "PSspinnerX1B",
                "curValue": this.ps_spinner_x1_b.currentValue,
                "affectedExpData": this.affectedExpData
            });
        },

        "changePSspinnerX2": function() {
            this.model.EquationExpressionChange({
                "expType": "PSspinnerX2",
                "curValue": this.ps_spinner_x2.currentValue,
                "affectedExpData": this.affectedExpData
            });
        },

        "_attachEvents": function() {
            var oThis = this;
            this.$('.plg-eqn-popup-close').on('click', function() {
                oThis.showPopup(false);
            });
        },

        "showPopup": function(bValue) {
            if (bValue) {
                this.$('.plg-eqn-popup-container').show();

            } else {
                this.$('.plg-eqn-popup-container').hide();
            }
            this.bIsVisible = bValue;
            this.model.PopupVisibilityChange({
                "bIsVisible": bValue,
                "popupName": "Eq Expression Popup",
                "affectedExpData": this.affectedExpData
            });
        },

        "createSpinner": function(parentClass, stepValue, defaultValue, spinID, inputPrecision) {
            var spinnerOptions = {
                "el": this.$('.' + parentClass),
                "maxValue": this.spinnerMinValue,
                "minValue": this.spinnerMaxValue,
                "step": stepValue,
                "defaultValue": defaultValue,
                "showSign": true,
                "isEditable": false,
                "spinId": spinID,
                "inputPrecision": inputPrecision
            };
            return spinnerView.generateCustomSpinner(spinnerOptions);
        },

        "setDefaultsToSpinners": function(data) {

            var slope = this.model.EqPanelData[data.EqPanelId].lineData[data.LineId].slope,
                displacement = this.model.EqPanelData[data.EqPanelId].lineData[data.LineId].displacement,
                x1 = this.model.EqPanelData[data.EqPanelId].lineData[data.LineId].x1,
                x2 = this.model.EqPanelData[data.EqPanelId].lineData[data.LineId].x2,
                x_value = x1,
                y_value = this.model.EqPanelData[data.EqPanelId].lineData[data.LineId].y1,
                bHideX1 = false
            bHideX2 = false;

            if (this.model.EqPanelData[data.EqPanelId].lineData[data.LineId].lineTypeId === this.constants.NEG_INFINITY_RAY) {
                x_value = x2;
                y_value = this.model.EqPanelData[data.EqPanelId].lineData[data.LineId].y2;
                bHideX1 = true;

            } else if (this.model.EqPanelData[data.EqPanelId].lineData[data.LineId].lineTypeId === this.constants.POS_INFINITY_RAY) {
                bHideX2 = true;
            }



            //Create Slope Intercept Spinners
            this.updateSpinner(this.si_spinner_slope, slope);
            this.updateSpinner(this.si_spinner_displacement, displacement);
            if (!bHideX1) {
                this.updateSpinner(this.si_spinner_x1, x1);
                this.updateSpinner(this.ps_spinner_x1_b, x1);
                this.$('.plg-eqn-popup-13').show();
                this.$('.plg-eqn-popup-24').show();
                this.$('.plg-eqn-popup-13-infinitytext').hide();
                this.$('.plg-eqn-popup-24-infinitytext').hide();
            } else {
                this.$('.plg-eqn-popup-13').hide();
                this.$('.plg-eqn-popup-24').hide();
                this.$('.plg-eqn-popup-13-infinitytext').show();
                this.$('.plg-eqn-popup-24-infinitytext').show();
            }

            if (!bHideX2) {
                this.updateSpinner(this.si_spinner_x2, x2);
                this.updateSpinner(this.ps_spinner_x2, x2);
                this.$('.plg-eqn-popup-14').show();
                this.$('.plg-eqn-popup-25').show();
                this.$('.plg-eqn-popup-14-infinitytext').hide();
                this.$('.plg-eqn-popup-25-infinitytext').hide();
            } else {
                this.$('.plg-eqn-popup-14').hide();
                this.$('.plg-eqn-popup-25').hide();
                this.$('.plg-eqn-popup-14-infinitytext').show();
                this.$('.plg-eqn-popup-25-infinitytext').show();
            }

            //Create Point Slope Spinners
            this.updateSpinner(this.ps_spinner_slope, slope);
            this.updateSpinner(this.ps_spinner_x1_a, x_value);
            this.updateSpinner(this.ps_spinner_y1, y_value);

        },

        "setInterceptType": function(data) {
            var curEqnState = this.model.EqPanelData[data.EqPanelId].lineData[data.LineId].idInterceptType;

            this.$('.plg-eqn-popup-checkbox').removeClass('checked');

            if (curEqnState === this.constants.SLOPE_INTERCEPT) {
                this.$('.plg-eqn-popup-checkbox.one').addClass('checked');
            } else {
                this.$('.plg-eqn-popup-checkbox.two').addClass('checked');
            }
        },

        "setRangeRelation": function(data) {
            var curXRangeLeftState = this.model.EqPanelData[data.EqPanelId].lineData[data.LineId].xRangeLeftRelation,
                curXRangeRightState = this.model.EqPanelData[data.EqPanelId].lineData[data.LineId].xRangeRightRelation;

            if (curXRangeLeftState === this.constants.LESS_THAN_OR_EQUAL) {
                this.$('#plg-eqn-popup-toggle-btn-less-than-equal-one').addClass('plg-eqn-popup-toggle-checked');
                this.$('#plg-eqn-popup-toggle-btn-less-one').removeClass('plg-eqn-popup-toggle-checked');
                this.$('#plg-eqn-popup-toggle-btn-less-than-equal-three').addClass('plg-eqn-popup-toggle-checked');
                this.$('#plg-eqn-popup-toggle-btn-less-three').removeClass('plg-eqn-popup-toggle-checked');
            } else {
                this.$('#plg-eqn-popup-toggle-btn-less-than-equal-one').removeClass('plg-eqn-popup-toggle-checked');
                this.$('#plg-eqn-popup-toggle-btn-less-one').addClass('plg-eqn-popup-toggle-checked');
                this.$('#plg-eqn-popup-toggle-btn-less-than-equal-three').removeClass('plg-eqn-popup-toggle-checked');
                this.$('#plg-eqn-popup-toggle-btn-less-three').addClass('plg-eqn-popup-toggle-checked');
            }

            if (curXRangeRightState === this.constants.LESS_THAN_OR_EQUAL) {
                this.$('#plg-eqn-popup-toggle-btn-less-than-equal-two').addClass('plg-eqn-popup-toggle-checked');
                this.$('#plg-eqn-popup-toggle-btn-less-two').removeClass('plg-eqn-popup-toggle-checked');
                this.$('#plg-eqn-popup-toggle-btn-less-than-equal-four').addClass('plg-eqn-popup-toggle-checked');
                this.$('#plg-eqn-popup-toggle-btn-less-four').removeClass('plg-eqn-popup-toggle-checked');
            } else {
                this.$('#plg-eqn-popup-toggle-btn-less-than-equal-two').removeClass('plg-eqn-popup-toggle-checked');
                this.$('#plg-eqn-popup-toggle-btn-less-two').addClass('plg-eqn-popup-toggle-checked');
                this.$('#plg-eqn-popup-toggle-btn-less-than-equal-four').removeClass('plg-eqn-popup-toggle-checked');
                this.$('#plg-eqn-popup-toggle-btn-less-four').addClass('plg-eqn-popup-toggle-checked');
            }
        },

        "updateSpinner": function(spinnerView, newValue) {

            spinnerView.updateSpinValue(newValue, false, true);
        }

    });
    // Our module now returns our view
    return oView;
});
