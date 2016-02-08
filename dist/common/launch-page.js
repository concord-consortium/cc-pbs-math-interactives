function LaunchPage(e,o,r){var s=0,n=0,i=610,w=750,a=2e3,g=2e3,h=window.screen
switch(r="en",g_oBrowserType){case g_oBrowserTypes.Chrome:case g_oBrowserTypes.IE:h.height>g&&(i=h.height/100*79.43),h.width>a&&(w=h.width/100*54.9)
break
case g_oBrowserTypes.Safari:i=652,w=752,h.height>g&&(i=h.height/100*84.9),h.width>a&&(w=h.width/100*55.1)}window.open(e,"","location=0,screenX="+s+",screenY="+n+",left="+s+",top="+n+",width="+w+",height="+i)}function CheckBrowser(){var e=navigator.userAgent.toLowerCase(),o=g_oBrowserTypes.Unknown
o=e.indexOf("msie")>-1&&e.indexOf("mac")<0?g_oBrowserTypes.IE:e.indexOf("firefox")>-1?g_oBrowserTypes.FF:e.indexOf("chrome")>-1?g_oBrowserTypes.Chrome:e.indexOf("safari")>-1?g_oBrowserTypes.Safari:g_oBrowserTypes.Unknown,g_oBrowserType=o}var bDebugLocalization=!1,ToggleDebugMode=function(){bDebugLocalization=bDebugLocalization?!1:!0},g_oBrowserTypes={IE:1,FF:2,Chrome:3,Safari:4,Unknown:5},g_oBrowserType=g_oBrowserTypes.Unknown
CheckBrowser()
