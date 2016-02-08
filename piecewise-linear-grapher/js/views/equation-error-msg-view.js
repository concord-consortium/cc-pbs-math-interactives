define([
    "equation-error-msg-template",
    "lang-json"
], function(aboutTemplate, langJson) {
    var AboutView = Backbone.View.extend({

        "initialize": function(data) {
            this.listenTo(this.model, "OnPopupVisibilityChange", this.OnPopupVisibilityChange);
            this.listenTo(this.model, "OnMultipleYValuesForOneXValue", this.showError);
            this.accManager = data.accManager;
            this.bIsVisible = false;
            this.bIsPopupAlreadyOpen = false;
            this.langJson = langJson.erromsgpopupJSON;
            this.accJson = langJson.errormsgpopupAccJSON;
            this.render();
        },

        "render": function() {
            var ht = Handlebars.templates['equation-error-msg-template']({}).trim();
            this.$el.append(ht);

            this.$('.plg-error-msg-popup').html(this.langJson.title);
            this.$('.plg-error-msg').html(this.langJson.para_one);
            this.$('.plg-error-ok-btn').html(this.langJson.btn_ok);

            this._attachEvents();
            this.showErrorMsgPopup(false);
        },

        "events": {
            "keyup #plg-equation-error-msg-panel": "popupHolderKeyup"
        },

        "popupHolderKeyup": function(event) {
            if (this.accManager != null && this.accManager.isAccessibilityOn) {
                var code = (event.keyCode || event.which);
                if (code === 27) {
                    this.showErrorMsgPopup(false);
                }
            }
        },


        "_attachEvents": function() {
            var oThis = this;
            this.$('.plg-error-msg-popup-close-exp,.plg-error-ok-btn').on('click', function() {
                oThis.showErrorMsgPopup(false);
            });
        },

        "showErrorMsgPopup": function(bValue) {
            if (bValue) {
                this.$('.plg-equation-error-msg-panel').show();
            } else {
                this.$('.plg-equation-error-msg-panel').hide();
            }
            this.bIsVisible = bValue;
            this.model.PopupVisibilityChange({
                "bIsVisible": bValue,
                "popupName": "Error Msg Popup",
                "affectedExpData": null
            });

        },

        "showError": function() {
            this.showErrorMsgPopup(true);
        },

        "OnPopupVisibilityChange": function(data) {
            if (this.accManager != null && this.accManager.isAccessibilityOn) {

                if (data.bIsVisible) {
                    this.setAccOn();
                    this.$("#plg-error-popup-holder").focus();
                } else {
                    this.setAccOff();
                    this.bIsPopupAlreadyOpen = false;
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
                this.accManager.setAccText(this.$(currentValue.id), currentValue.accText, null);
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
