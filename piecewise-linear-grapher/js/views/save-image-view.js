define([
    "equation-save-image-template",
    "lang-json"
], function(aboutTemplate, langJson) {
    var AboutView = Backbone.View.extend({

        "initialize": function(data) {
            this.listenTo(this.model, "OnPopupVisibilityChange", this.OnPopupVisibilityChange);
            this.accManager = data.accManager;
            this.bIsVisible = false;
            this.bIsPopupAlreadyOpen = false;
            this.langJson = langJson.saveimagepopupJSON;
            this.accJson = langJson.saveimagepopupAccJSON;
            this.popupName = "Save Popup";
            this.render();
        },

        "render": function() {
            var ht = Handlebars.templates['equation-save-image-template']({}).trim();
            this.$el.append(ht);

            this.$('#plg-save-popup-label-exp').html(this.langJson.title);
            this.$('#plg-save-line-one').html(this.langJson.line_one);
            this.$('#plg-save-group-text').html(this.langJson.line_two);
            this.$('#plg-save-username-text').html(this.langJson.line_three);
            this.$('#plg-save-title').html(this.langJson.line_four);
            this.$('#plg-save-comment').html(this.langJson.line_five);
            this.$('#plg-save-cancel-btn').html(this.langJson.btn_cancel);
            this.$('#plg-save-ok-btn').html(this.langJson.btn_ok);

            this._attachEvents();
            this.showSavePage(false);
        },

        "events": {
            "keyup #plg-equation-save-panel": "popupHolderKeyup"
        },

        "popupHolderKeyup": function(event) {
            if (this.accManager != null && this.accManager.isAccessibilityOn) {
                var code = (event.keyCode || event.which);
                if (code === 27) {
                    this.showSavePage(false);
                }
            }
        },

        "_attachEvents": function() {
            var oThis = this;
            this.$('.plg-save-popup-close').on('click', function() {
                oThis.showSavePage(false);
            });
            this.$('#plg-save-ok-btn').on('click', function() {
                oThis.OnOkClicked();
            });
        },

        "showSavePage": function(bValue) {
            if (bValue) {
                this.$('.plg-equation-save-panel').show();
                this.$("#plg-save-group-input-text").val("Piecewise Linear Grapher");
                this.$("#plg-save-username-input-text").val("");
                this.$("#plg-save-title-input-text").val("");
                this.$("#plg-save-comment-input-text").val("");
            } else {
                this.$('.plg-equation-save-panel').hide();
            }
            this.bIsVisible = bValue;
            this.model.PopupVisibilityChange({
                "bIsVisible": bValue,
                "popupName": this.popupName,
                "affectedExpData": null
            });

        },

        "OnOkClicked": function() {
            this.$('.plg-equation-save-panel').hide();
            this.bIsVisible = false;
            this.model.PopupVisibilityChange({
                "bIsVisible": false,
                "popupName": this.popupName,
                "affectedExpData": {
                    "bSaveOkClicked": true
                }
            });
        },

        "OnPopupVisibilityChange": function(data) {
            if (data.popupName !== this.popupName) {
                return;
            }
            if (this.accManager != null && this.accManager.isAccessibilityOn) {

                if (data.bIsVisible) {
                    this.setAccOn();
                    this.$("#plg-save-popup-holder").focus();
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
                var arrParam = null;
                this.accManager.setTabIndex(this.$(currentValue.id), currentValue.tabIndex);

                if (currentValue.id === "") {

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
