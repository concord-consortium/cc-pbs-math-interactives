requirejs.config({
    "paths": {
        "lang-json": "../lang/en/text/loc-acc-json",
        "base-interactive-view": "../../common/components/base-interactive-view/js/views/base-interactive-view",
        "base-view-template": "../../common/components/base-interactive-view/templates/base-view-template",
        "limit-textbox": "../../common/components/limit-box/js/limit-textbox",
        "spinner-model": "../../common/components/spinner/js/models/spinner-model",
        "spinner-view": "../../common/components/spinner/js/views/spinner-view",
        "spinner-template": "../../common/components/spinner/templates/spinner-template",
        "plg-template": "../templates/plg-template",
        "graph-view": "views/graph-view",
        "graph-template": "../templates/graph-template",
        "equation-panel-view": "views/equation-panel-view",
        "equation-panel-template": "../templates/equation-panel-template",
        "equation-popup-view": "views/equation-popup-view",
        "equation-popup-template": "../templates/equation-popup-template",

        "equation-about-view": "views/equation-about-view",
        "equation-about-template": "../templates/equation-about-template",
        "save-image-view": "views/save-image-view",
        "equation-save-image-template": "../templates/equation-save-image-template",
        "equation-axis-label-view": "views/equation-axis-label-view",
        "equation-axis-label-template": "../templates/equation-axis-label-template",
        "equation-error-msg-view": "views/equation-error-msg-view",
        "equation-error-msg-template": "../templates/equation-error-msg-template",
        "equation-save-msg-view": "views/equation-save-msg-view",
        "equation-save-msg-template": "../templates/equation-save-msg-template",


        "acc-manager-view": "../../common/components/accessibility-manager/view/accessibility-manager",
        //Name "acc-manager-model" should be same in all activities.
        "acc-manager-model": "../../common/components/accessibility-manager/model/accessibility-manager",
        "constants": "common/constants",
        "main-model": "models/plg-main-model"
    }
});

requirejs([
    "js/views/plg-main-view.js"
], function(MainView) {

    var screenCoord = window.screen,
        lHeight = 600,
        lWidth = 750;

    //Size the Interactive container on the basis of resolution
    //Scale-up/down the popup, interactive container and all the inner DIVs maintaining the aspect 
    //ratio that is change height and width of all the holder DIVs.
    //if the scale (height and width) goes below minimum suitable value than it should take minimum supported
    //height or width. Here we considered 2000 as minimum sutable value threshold which can be changed.
    //Supported minimum size for interactive is 750x600
    //Any changes anything here will need change in the main.js as well to reflect in container DIV.
    //Note that resizing the browser popup wont affect the interactive size as re-sizing is not supported in
    //this version of the interactive.
    if (screenCoord.height > 2000) {
        lHeight = (screenCoord.height / 100) * 79.43;
    }
    if (screenCoord.width > 2000) {
        lWidth = (screenCoord.width / 100) * 54.90;
    }
    $("#plg-main-container-outer").height(lHeight).width(lWidth);

    var oMainView = new MainView({
        'el': $('#plg-main-container-outer')
    });
    oMainView.render();
});
