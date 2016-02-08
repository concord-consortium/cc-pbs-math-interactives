define([
    "equation-axis-label-template",
    "lang-json"
], function(aboutTemplate, langJson) {
    var AboutView = Backbone.View.extend({

        "initialize": function(data) {

            this.accManager = data.accManager;
            this.bIsVisible = false;
            this.bIsPopupAlreadyOpen = false;
            this.langJson = langJson.axislabelpopupJSON;
            this.accJson = langJson.axislabelpopupAccJSON;
            this.listenTo(this.model, "OnPopupVisibilityChange", this.OnPopupVisibilityChange);
            this.xAxisLabelAccText = "";
            this.yAxisLabelAccText = "";
            this.render();
        },

        "render": function() {
            var ht = Handlebars.templates['equation-axis-label-template']({}).trim();
            this.$el.append(ht);

            this.$(".plg-axis-popup-label").html(this.langJson.title);
            this.$(".plg-axis-label").html(this.langJson.line_one);
            this.$(".plg-x-axis-text").html(this.langJson.line_two);
            this.$(".plg-y-axis-text").html(this.langJson.line_three);
            this.$('#plg-axis-ok-btn').html(this.langJson.btn_ok);

            this._attachEvents();
            this.showAxisLabelPopup(false);
        },

        "events": {
            "click #plg-axis-ok-btn": "showOk",
            "keyup #plg-equation-axis-label-panel": "popupHolderKeyup",
            "focusout #plg-x-axis-input-text": "changeXInputText",
            "focusout #plg-y-axis-input-text": "changeYInputText"
        },

        "popupHolderKeyup": function(event) {
            if (this.accManager != null && this.accManager.isAccessibilityOn) {
                var code = (event.keyCode || event.which);
                if (code === 27) {
                    this.showAxisLabelPopup(false);
                }
            }
        },

        "showOk": function() {

        },

        "changeXInputText": function() {
            var xAxisText = this.$("#plg-x-axis-input-text").val();
            if (this.accManager != null && this.accManager.isAccessibilityOn) {
                var strXAxisText = "Currently there is no x axis label. Use the keyboard to type an x axis label.",
                    arrParam = "";
                if (xAxisText !== "") {
                    strXAxisText = "Currently the x axis label is " + xAxisText + ". Use the keyboard to edit the x axis label.";
                }
                arrParam = [strXAxisText];
                this.accManager.setAccText(this.$("#plg-x-axis-input-text"), this.xAxisLabelAccText, arrParam);
            }

        },

        "changeYInputText": function() {
            var yAxisText = this.$("#plg-y-axis-input-text").val();
            if (this.accManager != null && this.accManager.isAccessibilityOn) {
                var strYAxisText = "Currently there is no y axis label. Use the keyboard to type an y axis label.",
                    arrParam = "";
                if (yAxisText !== "") {
                    strYAxisText = "Currently the y axis label is " + yAxisText + ". Use the keyboard to edit the y axis label.";
                }
                arrParam = [strYAxisText];
                this.accManager.setAccText(this.$("#plg-y-axis-input-text"), this.yAxisLabelAccText, arrParam);
            }
        },

        "_attachEvents": function() {
            var oThis = this;
            this.$('.plg-axis-popup-close').on('click', function() {
                oThis.showAxisLabelPopup(false);
            });

            this.$('.plg-axis-ok-btn').on('click', function() {
                oThis.model.xAxisLabel = oThis.$('.plg-x-axis-input-text').val();
                oThis.model.yAxisLabel = oThis.$('.plg-y-axis-input-text').val();
                oThis.model.AxesLabelChange();
                oThis.showAxisLabelPopup(false);
            });
        },

        "showAxisLabelPopup": function(bValue) {
            if (bValue) {
                this.$('.plg-equation-axis-label-panel').show();
                this.$('.plg-x-axis-input-text').val(this.model.xAxisLabel);
                this.$('.plg-y-axis-input-text').val(this.model.yAxisLabel);

            } else {
                this.$('.plg-equation-axis-label-panel').hide();
            }


            this.bIsVisible = bValue;
            this.model.PopupVisibilityChange({
                "bIsVisible": bValue,
                "popupName": "Axis Label Popup",
                "affectedExpData": null
            });

        },

        "OnPopupVisibilityChange": function(data) {
            this.bIsPopupAlreadyOpen = data.bIsVisible;

            if (this.accManager != null && this.accManager.isAccessibilityOn) {
                if (data.bIsVisible) {
                    this.setAccOn();
                    this.$("#plg-axis-popup-holder").focus();
                } else {
                    this.setAccOff();
                }
            }
        },



        "setAccOn": function() {
            var length = this.accJson.length,
                counter = 0,
                currentValue;

            for (; counter < length; counter++) {
                currentValue = this.accJson[counter];
                this.accManager.setTabIndex(this.$(currentValue.id), currentValue.tabIndex);
                var arrParam = null;

                if (currentValue.id === "#plg-x-axis-input-text") {
                    this.xAxisLabelAccText = currentValue.accText;
                    var strXAxisText = "Currently there is no x axis label. Use the keyboard to type an x axis label.";
                    if (this.model.xAxisLabel !== "") {
                        strXAxisText = "Currently the x axis label is " + this.model.xAxisLabel + ". Use the keyboard to edit the x axis label.";
                    }
                    arrParam = [strXAxisText];
                } else if (currentValue.id === "#plg-y-axis-input-text") {
                    this.yAxisLabelAccText = currentValue.accText;
                    var strYAxisText = "Currently there is no y axis label. Use the keyboard to type a y axis label.";
                    if (this.model.yAxisLabel !== "") {
                        strYAxisText = "Currently the y axis label is " + this.model.yAxisLabel + ". Use the keyboard to edit the y axis label.";
                    }
                    arrParam = [strYAxisText];
                }

                this.accManager.setAccText(this.$(currentValue.id), currentValue.accText, arrParam);
            }
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
        }

    });
    return AboutView;
});
