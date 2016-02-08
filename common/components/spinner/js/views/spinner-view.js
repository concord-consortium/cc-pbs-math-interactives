define([
    "spinner-template",
    "spinner-model",
    "limit-textbox"

], function(spinnerTemplate, spinnerModel, limitBox) {
    'use strict';


    var oSpinnerView = Backbone.View.extend({

        "minValue": null,
        "maxValue": null,
        "stepValue": null,
        "spinValue": null,
        "spinSign": false,
        "upBtn": null,
        "downBtn": null,
        "disableSpin": false,
        "previousValue": '',
        "currentValue": '',
        "isEditable": false,
        "alignType": false,
        "inputPrecision": null,
        "inputRegEx": null,
        /**
         * Spinner text box view
         *
         * @property spinnerTextbox
         * @type Object
         * @default null
         */
        "spinnerTextbox": null,

        "isFocusedPress": false,

        /**
         * stored user supplied button width.
         *
         * @property buttonWidth
         * @type Number
         * @default null
         */
        "buttonWidth": null,

        /**
         * stored user supplied button height.
         *
         * @property buttonHeight
         * @type Number
         * @default null
         */
        "buttonHeight": null,

        /**
         * stored user supplied input Box width.
         *
         * @property inputBoxWidth
         * @type Number
         * @default null
         */
        "inputBoxWidth": null,

        /**
         * stored user supplied input Box height.
         *
         * @property inputBoxHeight
         * @type Number
         * @default null
         */
        "inputBoxHeight": null,

        /**
         * Get data from model & set in view, Calls render
         *
         * @namespace MathInteractives.Common.Components.Views
         * @class CustomSpinner
         * @constructor
         */
        "initialize": function() {
            var currentModel = this.model,
                data,
                templateHtml,
                BUTTON_WIDTH = 43,
                BUTTON_HEIGHT = 31,
                INPUT_BOX_HEIGHT = 39,
                INPUT_BOX_WIDTH = 39;
            // Get Values from models
            this.spinBoxId = currentModel.get('spinId');
            this.minValue = currentModel.get('minValue');
            this.maxValue = currentModel.get('maxValue');
            this.stepValue = currentModel.get('step');
            this.buttonWidth = BUTTON_WIDTH;
            this.buttonHeight = BUTTON_HEIGHT;
            this.inputBoxWidth = INPUT_BOX_WIDTH;
            this.inputBoxHeight = INPUT_BOX_HEIGHT;
            this.spinValue = currentModel.get('defaultValue');
            this.spinSign = currentModel.get('showSign');
            this.isEditable = currentModel.get('isEditable');
            this.allValues = currentModel.get('allValues');
            data = {
                "spinBoxId": this.spinBoxId
            };

            templateHtml = Handlebars.templates['spinner-template']({
                "spinBoxId": this.spinBoxId
            });

            this._render(templateHtml);
            this._attachEvents();
            this.$('.textbox-field').on("focusout", _.bind(this._takeValueFromTextfield, this));
            this.updateSpinValue(this.spinValue);

            if (this.isEditable) {
                this.$('.textbox-field').removeAttr('disabled');
            } else {
                this.$('.textbox-field').attr('disabled', 'disabled');
            }
        },
        /**
         * Renders the Custom Spinner
         *
         * @method render
         * @private
         * @param template {String} template of customSpin
         */
        "_render": function(template) {
            this.$el.append(template.trim());
            this.$('.spin-textbox-container,.spin-down-arrow,.spin-up-arrow').addClass('center-aligned');
            this.$('.textbox-field').width(this.inputBoxWidth);

            var limitTextboxView = new limitBox({
                "el": this.$('.textbox-field'),
                "option": {
                    "minInput": this.minValue,
                    "maxInput": this.maxValue,
                    "allowMinus": true,
                    "onlyPositiveDecimal": true
                }
            });
            limitTextboxView.on('empty-textbox-field-value', _.bind(this.emptyTextBoxFieldValue, this));
            this.model.set("limitTextboxView", limitTextboxView);
        },
        "emptyTextBoxFieldValue": function() {
            this.$('.textbox-field').val(this.currentValue.safe_toFixed(this.model.get("inputPrecision")));
        },
        /**
         * Setting alignments & other css properties of elements
         *
         * @method _attachEvents
         * @private
         **/
        "_attachEvents": function() {
            var $spinBoxUpButtonJObj = this.$('.arrowbutton-container.up'),
                $spinBoxDownButtonJObj = this.$('.arrowbutton-container.down');
            this.upBtn = $spinBoxUpButtonJObj;
            this.downBtn = $spinBoxDownButtonJObj;

            this.$('.textbox-field').off("keypress.textBoxField").on("keypress.textBoxField", _.bind(this._onKeyPress, this));
            if ($spinBoxDownButtonJObj.hasClass('disabled')) {
                $spinBoxDownButtonJObj.off('click.spinBoxDownButton')
                    .off('mouseenter.spinBoxDownButton')
                    .off('mouseleave.spinBoxDownButton');
            } else {
                $spinBoxDownButtonJObj.off('click.spinBoxDownButton')
                    .on('click.spinBoxDownButton', _.bind(this._spinDownButttonClick, this));
                if ('ontouchstart' in window === false) {
                    $spinBoxDownButtonJObj.off('mouseenter.spinBoxDownButton')
                        .on('mouseenter.spinBoxDownButton', _.bind(this._hoverState, this))
                        .off('mouseleave.spinBoxDownButton')
                        .on('mouseleave.spinBoxDownButton', _.bind(this._removeHoverState, this));
                }
            }
            if ($spinBoxUpButtonJObj.hasClass('disabled')) {
                $spinBoxUpButtonJObj.off('click.spinBoxUpButton')
                    .off('mouseenter.spinBoxUpButton')
                    .off('mouseleave.spinBoxUpButton');
            } else {
                $spinBoxUpButtonJObj.off('click.spinBoxUpButton')
                    .on('click.spinBoxUpButton', _.bind(this._spinUpButttonClick, this));
                if ('ontouchstart' in window === false) {
                    $spinBoxUpButtonJObj.off('mouseenter.spinBoxUpButton')
                        .on('mouseenter.spinBoxUpButton', _.bind(this._hoverState, this))
                        .off('mouseleave.spinBoxUpButton')
                        .on('mouseleave.spinBoxUpButton', _.bind(this._removeHoverState, this));
                }
            }
        },

        "_valueChanged": function() {
            this.trigger('data-value-changed');
        },

        "_onKeyPress": function(event) {
            if (event.keyCode === oSpinnerView.CODE.ENTER_KEY) {
                var maxInput = this.maxValue,
                    minInput = this.minValue,
                    $target = this.$('.textbox-field'),
                    targetValue = $target.val();
                if (targetValue < minInput) {
                    $target.val(minInput);
                } else if (targetValue > maxInput) {
                    $target.val(maxInput);
                }
                this._takeValueFromTextfield();
            }
        },

        "_hoverState": function(event) {
            var $target = $(event.currentTarget);
            if ($target.find('.arrowbutton.disabled').length !== 0) {
                return;
            }
            $target.addClass('hover');
        },

        "_removeHoverState": function(event) {
            $(event.currentTarget).removeClass('hover');
        },

        "_downState": function(event) {
            var $target = $(event.currentTarget);
            if ($target.find('.arrowbutton.disabled').length !== 0) {
                return;
            }
            $target.addClass('btn-down');
        },

        "_removeDownState": function(event) {
            $(event.currentTarget).removeClass('btn-down');
        },


        "updateSpinValue": function(spinValue, isSavestate, loadPopup) {
            var defaultValue = this.model.get('defaultText');
            this.previousValue = this.currentValue;
            if (isSavestate && (this.allValues || this.allValues === null)) {
                if (this.allValues === null) {
                    spinValue = null;
                } else {
                    spinValue = this.allValues[spinValue - 2]; //spin value decrement by 2
                }
            }
            if (this.previousValue === spinValue) {
                this.$('.textbox-field').val(spinValue.safe_toFixed(this.model.get("inputPrecision")));
                return;
            }

            if (!this.disableSpin) {
                if (spinValue === null || spinValue === defaultValue) {
                    this.$('.textbox-field').val(defaultValue.safe_toFixed(this.model.get("inputPrecision")));
                    this.currentValue = null;
                } else {
                    this.$('.textbox-field').val(spinValue.safe_toFixed(this.model.get("inputPrecision")));
                    this.currentValue = spinValue;
                }
                this.model.get("limitTextboxView").inputLastVal = this.currentValue;
                if (this.minValue === spinValue) {
                    if ($(this.upBtn).hasClass('disabled')) {
                        this._enableBtn(this.upBtn);
                    }
                    this._disableBtn(this.downBtn);
                    this._attachEvents();
                } else if (this.maxValue === spinValue) {
                    this._disableBtn(this.upBtn);
                    if ($(this.downBtn).hasClass('disabled')) {
                        this._enableBtn(this.downBtn);
                    }
                    this._attachEvents();
                } else {
                    if ($(this.upBtn).hasClass('disabled')) {
                        this._enableBtn(this.upBtn);
                    }
                    if ($(this.downBtn).hasClass('disabled') && this.currentValue !== null) {
                        this._enableBtn(this.downBtn);
                    }
                    this._attachEvents();
                }
                if (this.currentValue === null) {
                    this._disableBtn(this.downBtn);
                    this._disableBtn(this.upBtn);
                }
            }
            if (!loadPopup) {
                this._valueChanged();
            }
        },
        "_takeValueFromTextfield": function() {
            var valueInTextField = this.$('.textbox-field').val(),
                iCurrentValue = Number(valueInTextField);
            if (iCurrentValue > this.maxValue) {
                this.$('.textbox-field').val(this.maxValue.safe_toFixed(this.model.get("inputPrecision")));
                iCurrentValue = Number(this.$('.textbox-field').val());
            } else if (isNaN(iCurrentValue) || valueInTextField === '') {
                iCurrentValue = this.currentValue;
            }
            this.updateSpinValue(iCurrentValue);
        },

        "_spinUpButttonClick": function(event) {
            if ($(event.currentTarget).hasClass('disabled') || event !== void 0 && (event.which !== void 0 && event.which !== 1)) {
                return;
            }
            var iStep = this.stepValue,
                iStepString = this.stepValue.toString(),
                noOfDigitsAfterDecimalPoint = iStepString.length - iStepString.indexOf('.') - 1,
                index,
                iCurrentValue = Number(this.currentValue);

            if (this.allValues) {
                index = this.allValues.indexOf(iCurrentValue);
                iCurrentValue = index === -1 ? this.roundToNearestValue(iCurrentValue)[0] : this.allValues[--index];
            } else {
                iCurrentValue += iStep;
            }
            this.updateSpinValue(Number(iCurrentValue.toFixed(noOfDigitsAfterDecimalPoint)));
        },
        "_spinDownButttonClick": function(event) {
            if ($(event.currentTarget).hasClass('disabled') || typeof event !== 'undefined' && (typeof event.which !== 'undefined' && event.which !== 1)) {
                return;
            }
            var iCurrentValue = Number(this.currentValue),
                iStepString = this.stepValue.toString(),
                noOfDigitsAfterDecimalPoint = iStepString.length - iStepString.indexOf('.') - 1,
                index;
            if (this.allValues) {
                index = this.allValues.indexOf(iCurrentValue);
                iCurrentValue = index === -1 ? this.roundToNearestValue(iCurrentValue)[1] : this.allValues[++index];
            } else {
                iCurrentValue -= this.stepValue;
            }
            this.updateSpinValue(Number(iCurrentValue.toFixed(noOfDigitsAfterDecimalPoint)));
        },

        "_spinUpButttonPress": function() {
            var iStep = this.stepValue,
                index,
                iCurrentValue = Number(this.currentValue);

            if (this.allValues) {
                index = this.allValues.indexOf(iCurrentValue);
                iCurrentValue = index === -1 ? this.roundToNearestValue(iCurrentValue)[0] : this.allValues[--index];
            } else {
                iCurrentValue += iStep;
            }
            this.updateSpinValue(iCurrentValue);
        },
        "_spinDownButttonPress": function() {
            var iCurrentValue = Number(this.currentValue),
                index;
            if (this.allValues) {
                index = this.allValues.indexOf(iCurrentValue);
                iCurrentValue = index === -1 ? this.roundToNearestValue(iCurrentValue)[1] : this.allValues[++index];
            } else {
                iCurrentValue -= this.stepValue;
            }
            this.updateSpinValue(iCurrentValue);
        },
        "roundToNearestValue": function(interval) {
            var LOWER_INDEX = -1,
                intervalArray = this.allValues,
                higherIndex = intervalArray.length,
                mid;
            while (higherIndex - LOWER_INDEX > 1) {
                mid = Math.round((LOWER_INDEX + higherIndex) / 2);
                if (intervalArray[mid] >= interval) {
                    LOWER_INDEX = mid;
                } else {
                    higherIndex = mid;
                }
            }
            if (intervalArray[LOWER_INDEX] === interval) {
                return intervalArray[LOWER_INDEX];
            }
            return [intervalArray[LOWER_INDEX], intervalArray[higherIndex]];
        },
        "updateSpinnerDefaults": function(options) {
            var index,
                currentValue;

            if (this.allValues) {
                index = this.allValues.indexOf(this.currentValue);
            }
            if (index === -1 || index === void 0) {
                index = 1;
            }
            this.allValues = options.intervalArray;
            this.maxValue = options.maxValue;
            this.minValue = options.minValue;
            this.defaultValue = options.defaultValue;
            this.model.get("limitTextboxView").maxInput = options.maxValue;
            this.model.get("limitTextboxView").minInput = options.minValue;
            this.model.set({
                "maxValue": this.maxValue,
                "minValue": this.minValue,
                "defaultValue": this.defaultValue
            });
            if (this.allValues) {
                currentValue = this.allValues[index];
                if (this.currentValue === null) {
                    this._enableBtn(this.downBtn);
                    this._enableBtn(this.upBtn);
                }
            } else {
                currentValue = null;
                this._disableBtn(this.downBtn);
                this._disableBtn(this.upBtn);
            }
            this._attachEvents();
            this.currentValue = currentValue;
            this.$('.textbox-field').val(currentValue.safe_toFixed(this.model.get("inputPrecision")));
        },
        "_enableBtn": function(btn) {
            btn.removeClass('disabled');
            btn.find('.arrowbutton').removeClass('disabled');
        },

        "_disableBtn": function(btn) {
            btn.addClass('disabled');
            btn.find('.arrowbutton').addClass('disabled').closest('.arrowbutton-container').removeClass('hover');
        },

        /**
         * Backbone property for binding events to DOM elements.
         * @property events
         * @private
         */
        "events": {
            'focusout .spinbox .spinner-input-box': '_spinBoxInputFocusOut',
            'focusin .spinbox .spinner-input-box': '_spinBoxInputFocusIn',
            'keyup .spinbox .spinner-input-box': '_spinBoxInputKeyPress'
        },

        "setFocusOnSpinner": function() {
            this.$('.textbox-field').focus();
        },

        "getModel": function() {
            return this.model;
        }
    }, {
        "generateCustomSpinner": function(options) {
            if (options) {
                var customSpinnerModel = new spinnerModel(options),
                    customSpinnerView = new oSpinnerView({
                        "model": customSpinnerModel,
                        "el": options.el
                    });
                return customSpinnerView;
            }
        },

        "CODE": {
            "LEFT_ARROW_KEY": 37,
            "RIGHT_ARROW_KEY": 39,
            "UP_ARROW_KEY": 38,
            "DOWN_ARROW_KEY": 40,
            "BACKSPACE_KEY": 8,
            "ENTER_KEY": 13,
            "DELETE_KEY": 46,
            "ZERO_KEY": 48,
            "NINE_KEY": 57
        }

    });
    return oSpinnerView;
});
