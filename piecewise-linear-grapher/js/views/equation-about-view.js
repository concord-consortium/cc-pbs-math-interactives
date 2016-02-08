define([
    "equation-about-template",
    "lang-json"
], function(aboutTemplate, langJson) {
    var AboutView = Backbone.View.extend({

        "initialize": function(data) {
            this.listenTo(this.model, "OnPopupVisibilityChange", this.OnPopupVisibilityChange);
            this.accManager = data.accManager;
            this.bIsVisible = false;
            this.bIsPopupAlreadyOpen = false;
            this.langJson = langJson.aboutpopupJSON;
            this.accJson = langJson.aboutpopupAccJSON;
            this.versionAccText = "";
            this.licenseAccText = "";
            this.creditAccText = "";
            this.acknowledgementsAccText = "";
            this.render();
        },

        "render": function() {
            var ht = Handlebars.templates['equation-about-template']({}).trim();
            this.$el.append(ht);

            this.$('#plg-about-popup-label-exp').html(this.langJson.title);

            this.$('#plg-eqn-popup-version-tab').html(this.langJson.version.version_title);
            this.$('#plg-eqn-popup-version-line-one').html(this.langJson.version.line_one);
            this.$('#plg-eqn-popup-version-line-two').html(this.langJson.version.line_two);
            this.$('#plg-eqn-popup-version-line-three').html(this.langJson.version.line_three);
            this.$('#plg-eqn-popup-version-line-four').html(this.langJson.version.line_four);

            this.$('#plg-eqn-popup-license-tab').html(this.langJson.license.license_title);
            this.$('#plg-eqn-popup-license-line-one').html(this.langJson.license.line_one);
            this.$('#plg-eqn-popup-license-line-two').html(this.langJson.license.line_two);
            this.$('#plg-eqn-popup-license-line-three').html(this.langJson.license.line_three);
            this.$('#plg-eqn-popup-license-line-four').html(this.langJson.license.line_four);
            this.$('#plg-eqn-popup-license-line-five').html(this.langJson.license.line_five);
            this.$('#plg-eqn-popup-license-line-six').html(this.langJson.license.line_six);

            this.$('#plg-eqn-popup-credits-tab').html(this.langJson.credits.credits_title);
            this.$('#plg-eqn-popup-credits-line-one').html(this.langJson.credits.line_one);
            this.$('#plg-eqn-popup-credits-line-two').html(this.langJson.credits.line_two);
            this.$('#plg-eqn-popup-credits-line-three').html(this.langJson.credits.line_three);
            this.$('#plg-eqn-popup-credits-line-four').html(this.langJson.credits.line_four);
            this.$('#plg-eqn-popup-credits-line-five').html(this.langJson.credits.line_five);
            this.$('#plg-eqn-popup-credits-line-six').html(this.langJson.credits.line_six);
            this.$('#plg-eqn-popup-credits-line-seven').html(this.langJson.credits.line_seven);
            this.$('#plg-eqn-popup-credits-line-eight').html(this.langJson.credits.line_eight);

            this.$('#plg-eqn-popup-acknowledgements-tab').html(this.langJson.acknowledgements.acknowledgements_title);
            this.$('#plg-eqn-popup-acknowledgements-line-one').html(this.langJson.acknowledgements.para_one);
            this.$('#plg-eqn-popup-acknowledgements-line-two').html(this.langJson.acknowledgements.para_two);
            this.$('#plg-eqn-popup-acknowledgements-line-three').html(this.langJson.acknowledgements.para_three);

            this.$('#plg-eqn-popup-version-tab').addClass('selectedTab');

            this._attachEvents();
            this.showAboutPage(false);
        },

        "events": {
            "keyup #plg-equation-about-panel": "popupHolderKeyup",
            "click .tab": "popupTabClick"
        },

        "popupHolderKeyup": function(event) {
            if (this.accManager != null && this.accManager.isAccessibilityOn) {
                var code = (event.keyCode || event.which);
                if (code === 27) {
                    this.showAboutPage(false);
                }
            }
        },

        "_attachEvents": function() {
            var oThis = this;
            this.$('.plg-about-popup-close').on('click', function() {
                oThis.showAboutPage(false);
            });
        },

        "showAboutPage": function(bValue) {
            if (bValue) {
                this.$('.plg-equation-about-panel').show();
                this.$('#plg-eqn-popup-version-tab-radio').attr("checked", "checked");

                this.showClickedTab('plg-eqn-popup-version-tab');
            } else {
                this.$('.plg-equation-about-panel').hide();
            }
            this.bIsVisible = bValue;
            this.model.PopupVisibilityChange({
                "bIsVisible": bValue,
                "popupName": "About Popup",
                "affectedExpData": null
            });

        },

        "popupTabClick": function(event) {
            this.showClickedTab(event.currentTarget.id);
        },

        "showClickedTab": function(id) {
            this.$('.tab').removeClass('selectedTab');
            this.$('.plg-eqn-popup-content-holder .content').hide();
            this.$('.' + id).addClass('selectedTab');
            this.$('.' + id.split('-tab')[0] + '.content').show().scrollTop(0);


            if (this.accManager != null && this.accManager.isAccessibilityOn) {
                this.setAboutPageAccText(id);
                this.disableTabAllContent();
                this.accManager.enableTab(this.$('#' + id.split('-tab')[0] + '-content'), true);
            }
        },

        "disableTabAllContent": function() {
            var verText = this.$("#plg-eqn-popup-version-content"),
                licText = this.$("#plg-eqn-popup-license-content"),
                credText = this.$("#plg-eqn-popup-credits-content"),
                ackText = this.$("#plg-eqn-popup-acknowledgements-content");

            this.accManager.enableTab(verText, false);
            this.accManager.enableTab(licText, false);
            this.accManager.enableTab(credText, false);
            this.accManager.enableTab(ackText, false);
        },

        "setAboutPageAccText": function(id) {
            var accText = "Press spacebar followed by tab to reveal the content",
                verText = this.$("#plg-eqn-popup-version-tab"),
                licText = this.$("#plg-eqn-popup-license-tab"),
                credText = this.$("#plg-eqn-popup-credits-tab"),
                ackText = this.$("#plg-eqn-popup-acknowledgements-tab"),
                arrParam = [accText];

            this.accManager.setAccText(verText, this.versionAccText, arrParam);
            this.accManager.setAccText(licText, this.licenseAccText, arrParam);
            this.accManager.setAccText(credText, this.creditAccText, arrParam);
            this.accManager.setAccText(ackText, this.acknowledgementsAccText, arrParam);

            if (id === "plg-eqn-popup-version-tab") {
                this.accManager.setAccText(this.$("#" + id), this.versionAccText, [""]);
            } else if (id === "plg-eqn-popup-license-tab") {
                this.accManager.setAccText(this.$("#" + id), this.licenseAccText, [""]);
            } else if (id === "plg-eqn-popup-credits-tab") {
                this.accManager.setAccText(this.$("#" + id), this.creditAccText, [""]);
            } else if (id === "plg-eqn-popup-acknowledgements-tab") {
                this.accManager.setAccText(this.$("#" + id), this.acknowledgementsAccText, [""]);
            }
        },


        "OnPopupVisibilityChange": function(data) {
            if (this.accManager != null && this.accManager.isAccessibilityOn) {

                if (data.bIsVisible) {
                    this.setAccOn();
                    this.$("#plg-about-popup-holder").focus();
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

                if (currentValue.id === "#plg-eqn-popup-version-tab") {
                    this.versionAccText = currentValue.accText;
                } else if (currentValue.id === "#plg-eqn-popup-license-tab") {
                    this.licenseAccText = currentValue.accText;
                } else if (currentValue.id === "#plg-eqn-popup-credits-tab") {
                    this.creditAccText = currentValue.accText;
                } else if (currentValue.id === "#plg-eqn-popup-acknowledgements-tab") {
                    this.acknowledgementsAccText = currentValue.accText;
                }


                this.accManager.setTabIndex(this.$(currentValue.id), currentValue.tabIndex);
                this.accManager.setAccText(this.$(currentValue.id), currentValue.accText, arrParam);
            }
            this.$('#plg-eqn-popup-version-tab').addClass('selectedTab');
            this.setAboutPageAccText("plg-eqn-popup-version-tab");
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
