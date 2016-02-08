var bDebugLocalization = false;

var ToggleDebugMode = function() {
    bDebugLocalization = (bDebugLocalization) ? false : true;
}

var g_oBrowserTypes = {
    IE: 1,
    FF: 2,
    Chrome: 3,
    Safari: 4,
    Unknown: 5
}

var g_oBrowserType = g_oBrowserTypes.Unknown;

CheckBrowser();

function LaunchPage(strPath, strTitle, strLang) {

    var x = 0,
        y = 0,
        lHeight = 610,
        lWidth = 750,
        maxWidth = 2000,
        maxHeight = 2000,
        screenCoord = window.screen;

    strLang = "en";

    switch (g_oBrowserType) {

        case g_oBrowserTypes.Chrome:
        case g_oBrowserTypes.IE:

            //Size the Popup on the basis of resolution
            //Scale-up/down the popup, interactive container and all the inner DIVs maintaining the aspect 
            //ratio i. e. - change height and width of all the holder DIVs.
            //if the scale (height and width) goes below minimum suitable value of screen resolution, than it 
            //would set it to minimum supported height or width. Here we considered 2000 as minimum sutable value 
            //threshold which can be changed. Supported minimum size for interactive is 750x600
            //Any changes here will need changes in the main.js as well.
            //Note that resizing the browser popup wont affect the interactive size as re-sizing is not supported in
            //this version of the interactive.
            if (screenCoord.height > maxHeight) {
                lHeight = (screenCoord.height / 100) * 79.43;
            }
            if (screenCoord.width > maxWidth) {
                lWidth = (screenCoord.width / 100) * 54.90;
            }
            break;

        case g_oBrowserTypes.Safari:
            lHeight = 652;
            lWidth = 752;

            //Size the Popup on the basis of resolution.
            //Scale-up/down the popup, interactive container and all the inner DIVs maintaining the aspect 
            //ratio i. e. - change height and width of all the holder DIVs.
            //if the scale (height and width) goes below minimum suitable value of screen resolution, than it 
            //would set it to minimum supported height or width. Here we considered 2000 as minimum sutable value 
            //threshold which can be changed. Supported minimum size for interactive is 750x600
            //Any changes here will need changes in the main.js as well.
            //Note that resizing the browser popup wont affect the interactive size as re-sizing is not supported in
            //this version of the interactive.
            if (screenCoord.height > maxHeight) {
                lHeight = (screenCoord.height / 100) * 84.9;
            }
            if (screenCoord.width > maxWidth) {
                lWidth = (screenCoord.width / 100) * 55.1;
            }
            break;

        default:
            break;
    }

    var oWindow = window.open(strPath, "", "location=0,screenX=" + x + ",screenY=" + y + ",left=" + x + ",top=" + y + ",width=" + lWidth + ",height=" + lHeight);
}


function CheckBrowser() {
    var strBrowser = navigator.userAgent.toLowerCase();
    var iBrowserType = g_oBrowserTypes.Unknown;

    if (strBrowser.indexOf("msie") > -1 && strBrowser.indexOf("mac") < 0) {
        iBrowserType = g_oBrowserTypes.IE;
    } else if (strBrowser.indexOf("firefox") > -1) {
        iBrowserType = g_oBrowserTypes.FF;
    } else if (strBrowser.indexOf("chrome") > -1) {
        iBrowserType = g_oBrowserTypes.Chrome;
    } else if (strBrowser.indexOf("safari") > -1) {
        iBrowserType = g_oBrowserTypes.Safari;
    } else {
        iBrowserType = g_oBrowserTypes.Unknown;
    }

    g_oBrowserType = iBrowserType;
}
