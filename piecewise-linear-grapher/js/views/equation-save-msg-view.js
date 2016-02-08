define([
    "equation-save-msg-template",
    "lang-json"
], function(aboutTemplate, langJson) {
    var AboutView = Backbone.View.extend({

        "initialize": function(data) {
            this.listenTo(this.model, "OnPopupVisibilityChange", this.OnPopupVisibilityChange);
            this.accManager = data.accManager;
            this.bIsVisible = false;
            this.bIsPopupAlreadyOpen = false;
            this.langJson = langJson.saveimagemsgpopupJSON;
            this.accJson = langJson.saveimagemsgpopupAccJSON;
            this.holderAccText = "";
            this.popupName = "Save Msg Popup";
            this.holderDiv = null;
            this.urlAccText = "";
            this.render();
        },

        "render": function() {
            var ht = Handlebars.templates['equation-save-msg-template']({}).trim();
            this.$el.append(ht);

            this.$("#plg-save-msg-popup-exp").html(this.langJson.title);
            this.$("#plg-img-saved-msg").html(this.langJson.msg);
            this.holderDiv = this.$("#plg-save-msg-popup-holder");

            this._attachEvents();
            this.showSaveMsgPopup(false);
        },

        "events": {
            "keyup #plg-equation-save-msg-panel": "popupHolderKeyup"
        },

        "popupHolderKeyup": function(event) {
            if (this.accManager != null && this.accManager.isAccessibilityOn) {
                var code = (event.keyCode || event.which);
                if (code === 27) {
                    this.showSaveMsgPopup(false);
                }
            }
        },

        "_attachEvents": function() {
            var oThis = this;
            this.$('.plg-save-msg-popup-close-exp').on('click', function() {
                oThis.showSaveMsgPopup(false);
            });
        },

        "showSaveMsgPopup": function(bValue) {
            if (bValue) {
                this.$('.plg-equation-save-msg-panel').show();
                this.$("#plg-img-saved-msg").hide();
                this.$("#plg-progress-msg").show();
                this.$("#plg-saved-url").hide();
            } else {
                this.$('.plg-equation-save-msg-panel').hide();
            }
            this.bIsVisible = bValue;
            this.model.PopupVisibilityChange({
                "bIsVisible": bValue,
                "popupName": this.popupName,
                "affectedExpData": null
            });

        },

        "updateURL": function(url) {
            var urlDiv = this.$("#plg-saved-url-a"),
                msgDiv = this.$("#plg-img-saved-msg");
            urlDiv.html(url);
            urlDiv.attr('href', url);
            msgDiv.show();
            this.$("#plg-progress-msg").hide();
            this.$("#plg-saved-url").show();

            if (this.accManager != null && this.accManager.isAccessibilityOn) {
                var arrParam = [msgDiv.text() + " Press Tab to visit to the image URL."];

                this.accManager.enableTab(urlDiv, true);
                this.accManager.setAccText(urlDiv, this.urlAccText, [url]);


                urlDiv.off("keyup").on("keyup", function(event) {

                    var key = event ? event.which : event.keyCode,
                        ENTER_KEY = 13,
                        SPACE_KEY = 32;
                    if (key === SPACE_KEY || key === ENTER_KEY) {
                        window.open(event.currentTarget.href);
                    }

                });

                this.accManager.setAccText(this.holderDiv, this.holderAccText, arrParam);
                $('#Dummy').attr('tabindex', '1000')
                    .focus()
                    .removeAttr('tabindex');
                this.holderDiv.focus();
            }
        },

        "OnPopupVisibilityChange": function(data) {
            if (data.popupName !== this.popupName) {
                return;
            }
            if (this.accManager != null && this.accManager.isAccessibilityOn) {

                if (data.bIsVisible) {
                    this.setAccOn();
                    this.holderDiv.focus();
                } else {
                    this.setAccOff();
                }
            }

            if (!data.bIsVisible) {
                this.bIsPopupAlreadyOpen = false;
            }
        },

        "setAccOn": function() {
            var length = this.accJson.length,
                counter = 0,
                currentValue,
                arrParam = null;


            for (; counter < length; counter++) {
                currentValue = this.accJson[counter];
                this.accManager.setTabIndex(this.$(currentValue.id), currentValue.tabIndex);
                arrParam = null;

                if (currentValue.id === "#plg-save-msg-popup-holder") {
                    this.holderAccText = currentValue.accText;
                    arrParam = ["Please wait while image is been saved or"]
                } else if (currentValue.id === "#plg-saved-url-a") {
                    this.urlAccText = currentValue.accText;
                }
                this.accManager.setAccText(this.$(currentValue.id), currentValue.accText, arrParam);
            }
            this.accManager.enableTab(this.$("#plg-saved-url-a"), false);
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
