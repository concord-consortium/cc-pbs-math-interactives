define(function() {

    return {
        "title": "Piecewise Linear Grapher",
        "title_short": "plg",
        "user_guide": "User's Guide",
        "user_guide_href": "links/PLG_UsersGuide.htm",
        "faq": "FAQ",
        "faq_href": "links/PLG_FAQ.htm",
        "warmup": "Warm-Up",
        "warmup_href": "links/PLG_Warmup.htm",
        "sampleactivity": "Sample Activity",
        "sampleactivity_href": "links/PLG_Activity.pdf",
        "title_content": "Piecewise Linear Grapher ",
        "footer_more": "More Seeing Math Interactives",
        "footer_more_href": "http://seeingmath.concord.org/sms_interactives.html",
        "popup_label": "Linear Piecewise - Segment 1",
        "slope_label_1": "Slope-Intercept",
        "slope_label_2": "Point-Slope",
        "Variable_X": "X",
        "FOR": "for",
        "PLUS": "+",
        "MINUS": "-",
        "InfinityText": "&#8734;",
        "NegInfinityText": "-&#8734;",
        "eq_seg_text": "Segment ",
        "aboutpopupJSON": {
            "title": "About Piecewise Linear Grapher",
            "close_button": "Close",
            "version": {
                "version_title": "Version",
                "line_one": "Seeing Math by the Concord Consortium:",
                "line_two": "Piecewise Linear Grapher",
                "line_three": "Portions Copyright &#169; 2016 The Concord Consortium. All Rights Reserved.",
                "line_four": "Version 2.0 Feb 1, 2016"
            },
            "license": {
                "license_title": "License",
                "line_one": "This software is licensed to you under the MIT license:",
                "line_two": "https://opensource.org/licenses/MIT</a>"
            },
            "credits": {
                "credits_title": "Credits",
                "line_one": "Lead Programmer:",
                "line_two": "Eric Brown",
                "line_three": "Contributing Programmer:",
                "line_four": "Ingrid Moncada, Zeus Learning",
                "line_five": "Lead Instructional Designers:",
                "line_six": "George Collison, Fadia Harik",
                "line_seven": "Interactive Team",
                "line_eight": "Stephen Bannasch, Ronit Carter, Scott Cytacki, David Jarsky, Joanna Lu, David Pinzer, Judah Schwartz"
            },
            "acknowledgements": {
                "acknowledgements_title": "Acknowledgements",
                "para_one": "The Piecewise Linear Grapher is developed by the Concord Consortium and informed by previous work on Calculus Unlimited by Michal Yerushalmy and Judah Schwartz. The Piecewise Linear Grapher explicitly links changes a user makes in a graph of a linear function with corresponding changes in its symbolic expression. Changes in the graph produce corresponding changes in its symbolic notation. Conversely, changes in the symbolic form result in changes in the graph.",
                "para_two": "Beyond simple linear functions such as lines or bent lines, users may explore step functions -- those that are discontinuous in range and/or domain, as well as linear relationships that are not functions. For example, with cases in which a graph defines a non-function because a single input yields more than one output, the PLG alerts the user and then allows continued exploration.",
                "para_three": "Innovative technology developed by the Concord Consortium permits networked users of our software to save with one click an image of any screen made with CC interactive software. They can then share their work with other networked users in real time or asynchronously."
            }
        },

        "saveimagemsgpopupJSON": {
            "title": "Save image",
            "msg": "The image has been saved successfully. To view the image, copy the URL below and paste it into a browser window.</br></br> To point other people to the saved image, copy the URL below and paste it into an e-mail or a posting to a discussion thread."
        },

        "tooltip": {
            "titleI": "About button",
            "titleCam": "Snapshot",
            "titlePencil": "Open axis labels popup",
            "titleDelete": "Delete selected ray or line segment",
            "titleVerticalZoomIn": "Zoom in Y axis",
            "titleVerticalDefault": "Default zoom for Y axis",
            "titleVerticalZoomOut": "Zoom out Y axis",
            "titleHorizontalZoomIn": "Zoom in X axis",
            "titleHorizontalDefault": "Default zoom for X axis",
            "titleHorizontalZoomOut": "Zoom out X axis",
            "titleLineSegment": "Create a line segment on the graph",
            "titlePositiveRay": "Create a ray approaching positive infinity",
            "titleNegativeRay": "Create a ray approaching negative infinity"
        },

        "saveimagepopupJSON": {
            "title": "Save Image Panel",
            "line_one": "Please fill out the information you want to save with this image.",
            "line_two": "Group:",
            "line_three": "User Name:",
            "line_four": "Title of the image:",
            "line_five": "Comment:",
            "btn_cancel": "Cancel",
            "btn_ok": "OK"
        },

        "axislabelpopupJSON": {
            "title": "Axis Labels",
            "line_one": "Change Axis Labels",
            "line_two": "x-axis:",
            "line_three": "y-axis:",
            "btn_ok": "OK"
        },

        "erromsgpopupJSON": {
            "title": "Not a function",
            "para_one": "There is more than one y-value for at least one x-value. This is not the graph of a function. You may have to change the domain for one or more segments.",
            "btn_ok": "OK"
        },

        "saveimagemsgpopupAccJSON": [{
            "id": "#plg-save-msg-popup-holder",
            "tabIndex": 12000,
            "accText": "Save image popup. %@$% Press tab to proceed."
        }, {
            "id": "#plg-saved-url-a",
            "tabIndex": 12020,
            "accText": "URL is %@$% Press space to open URL."
        }, {
            "id": "#plg-save-msg-popup-close-exp",
            "tabIndex": 12030,
            "accText": "Use spacebar to close the save image popup."
        }],

        "aboutpopupAccJSON": [{
            "id": "#plg-about-popup-holder",
            "tabIndex": 9000,
            "accText": "Use tab to navigate through tabs. Use spacebar to select a tab."
        }, {
            "id": "#plg-eqn-popup-version-tab",
            "tabIndex": 9010,
            "accText": "Version Tab. %@$%"
        }, {
            "id": "#plg-eqn-popup-version-content",
            "tabIndex": 9020,
            "accText": "Seeing Math by the Concord Consortium Piecewise Linear Grapher Portions Copyright 2016 The Concord Consortium. All Rights Reserved Version 2.0 Feb 1, 2016"
        }, {
            "id": "#plg-eqn-popup-license-tab",
            "tabIndex": 9030,
            "accText": "License Tab. %@$%"
        }, {
            "id": "#plg-eqn-popup-license-content",
            "tabIndex": 9040,
            "accText": " This software is licensed to you under the MIT license https://opensource.org/licenses/MIT"
        }, {
            "id": "#plg-eqn-popup-credits-tab",
            "tabIndex": 9050,
            "accText": "Credits Tab. %@$%"
        }, {
            "id": "#plg-eqn-popup-credits-content",
            "tabIndex": 9060,
            "accText": " Lead Programmer Eric Brown Contributing Programmer Ingrid Moncada, Zeus Learning Lead Instructional Designers George Collison, Fadia Harik Interactive Team Stephen Bannasch, Ronit Carter, Scott Cytacki, David Jarsky, Joanna Lu, David Pinzer, Judah Schwartz"
        }, {
            "id": "#plg-eqn-popup-acknowledgements-tab",
            "tabIndex": 9070,
            "accText": "Acknowledgements Tab. %@$%"
        }, {
            "id": "#plg-eqn-popup-acknowledgements-content",
            "tabIndex": 9080,
            "accText": "The Piecewise Linear Grapher is developed by the Concord Consortium and informed by previous work on Calculus Unlimited by Michal Yerushalmy and Judah Schwartz. The Piecewise Linear Grapher explicitly links changes a user makes in a graph of a linear function with corresponding changes in its symbolic expression. Changes in the graph produce corresponding changes in its symbolic notation. Conversely, changes in the symbolic form result in changes in the graph. Beyond simple linear functions such as lines or bent lines, users may explore step functions those that are discontinuous in range and or domain, as well as linear relationships that are not functions. For example, with cases in which a graph defines a non function because a single input yields more than one output, the PLG alerts the user and then allows continued exploration. Innovative technology developed by the Concord Consortium permits networked users of our software to save with one click an image of any screen made with CC interactive software. They can then share their work with other networked users in real time or asynchronously."
        }, {
            "id": "#plg-about-popup-close-exp",
            "tabIndex": 9090,
            "accText": "Use spacebar to close the about popup."
        }],
        "saveimagepopupAccJSON": [{
            "id": "#plg-save-popup-holder",
            "tabIndex": 10000,
            "accText": "Please fill out the information you want to save with this image. Use tab to navigate to the text fields and the OK button."
        }, {
            "id": "#plg-save-group-text",
            "tabIndex": 10005,
            "accText": "Group. Press tab to enter the group name."
        }, {
            "id": "#plg-save-group-input-text",
            "tabIndex": 10010,
            "accText": "Group. Use the keyboard to edit this field."
        }, {
            "id": "#plg-save-username-text",
            "tabIndex": 10015,
            "accText": "User Name. Press tab to enter the user name."
        }, {
            "id": "#plg-save-username-input-text",
            "tabIndex": 10020,
            "accText": "User Name. Use the keyboard to edit this field."
        }, {
            "id": "#plg-save-title",
            "tabIndex": 10025,
            "accText": "Title of the image. Press tab to enter the title."
        }, {
            "id": "#plg-save-title-input-text",
            "tabIndex": 10030,
            "accText": "Title of the image. Use the keyboard to edit this field."
        }, {
            "id": "#plg-save-comment",
            "tabIndex": 10035,
            "accText": "Comment. Press tab to enter the comment."
        }, {
            "id": "#plg-save-comment-input-text",
            "tabIndex": 10040,
            "accText": "Comment. Use the keyboard to edit this field."
        }, {
            "id": "#plg-save-ok-btn",
            "tabIndex": 10050,
            "accText": "OK button. Use spacebar to save the image."
        }, {
            "id": "#plg-save-popup-close-exp",
            "tabIndex": 10060,
            "accText": "Close button. Use spacebar to close the popup."
        }],
        "axislabelpopupAccJSON": [{
            "id": "#plg-axis-popup-holder",
            "tabIndex": 11010,
            "accText": "You can edit the axis labels on the graph using this popup. Use tab to navigate to the x and y axis labels text fields and the OK button"
        }, {
            "id": "#plg-x-axis-text",
            "tabIndex": 11015,
            "accText": "x axis. Press tab to enter the label."
        }, {
            "id": "#plg-x-axis-input-text",
            "tabIndex": 11020,
            "accText": "%@$%"
        }, {
            "id": "#plg-y-axis-text",
            "tabIndex": 11025,
            "accText": "y axis. Press tab to enter the label"
        }, {
            "id": "#plg-y-axis-input-text",
            "tabIndex": 11030,
            "accText": "%@$%"
        }, {
            "id": "#plg-axis-ok-btn",
            "tabIndex": 11040,
            "accText": "OK button. Use spacebar to save the x and y axes labels text fields."
        }, {
            "id": "#plg-axis-popup-close-exp",
            "tabIndex": 11050,
            "accText": "Use spacebar to close the function axis popup."
        }],
        "errormsgpopupAccJSON": [{
            "id": "#plg-error-popup-holder",
            "tabIndex": 12010,
            "accText": "Error occurred. There is more than one y value for at least one x value. This is not the graph of a function. You may have to change the domain for one or more segments."
        }, {
            "id": "#plg-error-ok-btn",
            "tabIndex": 12020,
            "accText": "Use spacebar to press ok button to close the function error popup."
        }, {
            "id": "#plg-error-msg-popup-close-exp",
            "tabIndex": 12030,
            "accText": "Use spacebar to close the function error popup."
        }],

        "popupAccJSON": [{
            "id": "#plg-eqn-popup-holder",
            "tabIndex": 7000,
            "accText": "Edit the function for %@$% %@$% using this function edit popup. Use tab to navigate through the popup."
        }, {
            "id": "#fa-check-square-label1",
            "tabIndex": 7010,
            "accText": "%@$%"
        }, {
            "id": "#plg-eqn-popup-11",
            "tabIndex": 7020,
            "accText": "The slope is %@$% Use the up and down arrow keys to change the slope by a step of 0.01"
        }, {
            "id": "#plg-eqn-popup-12",
            "tabIndex": 7030,
            "accText": "The y intercept is  %@$% Use the up and down arrow keys to change the y intercept by a step of 0.1"
        }, {
            "id": "#plg-eqn-popup-13",
            "tabIndex": 7040,
            "accText": "The lower limit of x is %@$% Use the up and down arrow keys to change the lower limit by a step of 0.1"
        }, {
            "id": "#plg-eqn-popup-13-infinitytext",
            "tabIndex": 7045,
            "accText": "The lower limit of x is negative infinity."
        }, {
            "id": "#plg-eqn-popup-toggle-btn-base-one",
            "tabIndex": 7050,
            "accText": "Lower limit is %@$% x. Use spacebar to change to %@$%"
        }, {
            "id": "#plg-eqn-popup-toggle-btn-base-two",
            "tabIndex": 7060,
            "accText": "x is %@$% upper limit. Use spacebar to change to %@$%"
        }, {
            "id": "#plg-eqn-popup-14",
            "tabIndex": 7070,
            "accText": "The upper limit of x is %@$% Use the up and down arrow keys to change the upper limit by a step of 0.1"
        }, {
            "id": "#plg-eqn-popup-14-infinitytext",
            "tabIndex": 7075,
            "accText": "The upper limit of x is infinity."
        }, {
            "id": "#fa-check-square-label2",
            "tabIndex": 7080,
            "accText": "%@$%"
        }, {
            "id": "#plg-eqn-popup-21",
            "tabIndex": 7090,
            "accText": "The slope is %@$% Use the up and down arrow keys to change the slope by a step of 0.01"
        }, {
            "id": "#plg-eqn-popup-22",
            "tabIndex": 8000,
            "accText": "The x coordinate is  %@$% Use the up and down arrow keys to change the x coordinate by a step of 0.1"
        }, {
            "id": "#plg-eqn-popup-23",
            "tabIndex": 8010,
            "accText": "The y coordinate is  %@$% Use the up and down arrow keys to change the y coordinate by a step of 0.1"
        }, {
            "id": "#plg-eqn-popup-24",
            "tabIndex": 8020,
            "accText": "The lower limit of x is  %@$% Use the up and down arrow keys to change the lower limit by a step of 0.1"
        }, {
            "id": "#plg-eqn-popup-24-infinitytext",
            "tabIndex": 8025,
            "accText": "The lower limit of x is negative infinity."
        }, {
            "id": "#plg-eqn-popup-toggle-btn-base-three",
            "tabIndex": 8030,
            "accText": "Lower limit is  %@$% x. Use spacebar to change to  %@$%"

        }, {
            "id": "#plg-eqn-popup-toggle-btn-base-four",
            "tabIndex": 8040,
            "accText": "x is %@$% upper limit. Use spacebar to change to %@$%"

        }, {
            "id": "#plg-eqn-popup-25",
            "tabIndex": 8050,
            "accText": "The upper limit of x is %@$% Use the up and down arrow keys to change the upper limit by a step of 0.1"
        }, {
            "id": "#plg-eqn-popup-25-infinitytext",
            "tabIndex": 8055,
            "accText": "The upper limit of x is infinity."
        }, {
            "id": "#plg-eqn-popup-close-exp",
            "tabIndex": 8060,
            "accText": "Use spacebar to close the function edit popup."

        }],
        "accJSON": [{
            "id": "#plg-main-container",
            "tabIndex": 10,
            "accText": "Interactive Piecewise Linear Grapher. Press tab to proceed."
        }, {
            "id": "#plg-activity-area-container",
            "tabIndex": 20,
            "accText": "This activity helps you create, explore, and learn about piecewise linear functions. Use the line buttons to add different types of lines on the graph. Use the function panels to change the functions of the lines on the graph. Use the zoom buttons to scale the X or Y axes. Use tab to navigate through the activity."
        }, {
            "id": "#plg-graph-label-container",
            "tabIndex": 30,
            "accText": "The Model Objects to the left of the graph indicate the y position. %@$% %@$% %@$% %@$%"
        }, {
            "id": "#plg-grapher-control",
            "tabIndex": 40,
            "accText": "Currently, the visible range for x axis is %@$% to %@$% for the x axis, and %@$% to %@$% for the y axis. The lines for functions from the function panels are present on the graph. Navigate to the function panels to check the functions."
        }, {
            "id": "#plg-graph-button-pencil",
            "tabIndex": 50,
            "accText": "Axis Labels button. Use spacebar to edit the axis labels on the graph."
        }, {
            "id": "#plg-graph-button-close",
            "tabIndex": 60,
            "accText": "Delete selected ray or line segment button. Currently, %@$% from function panel %@$% is selected. Use Spacebar to delete it."
        }, {
            "id": "#plg-btn-spinner",
            "tabIndex": 1100,
            "accText": "Model Object Icon Selector. You can select a Model Object Icon from five icons rocket, basketball, monkey, dollar, and dolphin. Currently the Model Object Icon is a %@$% Use the up and down arrow keys to select a different icon."
        }, {
            "id": "#plg-slider",
            "tabIndex": 1110,
            "accText": "The slider represents the x position. On moving the slider to the left or right, a trace moves along the ray or segment, indicating the x position. Use tab to go to the slider handle."
        }, {
            "id": ".ui-slider-handle",
            "tabIndex": 1115,
            "accText": "%@$%"
        }, {
            "id": "#plg-vertical-increase-button",
            "tabIndex": 1120,
            "accText": "Use spacebar to zoom in on the y axis."
        }, {
            "id": "#plg-vertical-default-button",
            "tabIndex": 1130,
            "accText": "Use spacebar to set the y axis to default zoom level."
        }, {
            "id": "#plg-vertical-decrease-button",
            "tabIndex": 1140,
            "accText": "Use spacebar to zoom out on the y axis."
        }, {
            "id": "#plg-horizontal-increase-button",
            "tabIndex": 1150,
            "accText": "Use spacebar to zoom in on the x axis."
        }, {
            "id": "#plg-horizontal-default-button",
            "tabIndex": 1160,
            "accText": "Use spacebar to set the x axis to default zoom level."
        }, {
            "id": "#plg-horizontal-decrease-button",
            "tabIndex": 1170,
            "accText": "Use spacebar to zoom out on the x axis."
        }, {
            "id": "#plg-line-segment",
            "tabIndex": 1180,
            "accText": "%@$%"
        }, {
            "id": "#plg-positive-infinity",
            "tabIndex": 1190,
            "accText": "%@$%"
        }, {
            "id": "#plg-negative-infinity",
            "tabIndex": 1200,
            "accText": "%@$%"
        }, {
            "id": "#plg-equation-panel-one",
            "tabIndex": 2000,
            "accText": "The function panel %@$% has %@$% %@$%"
        }, {
            "id": "#plg-fa-check-square-one",
            "tabIndex": 2010,
            "accText": "Currently the checkbox for the function panel %@$% is %@$%, and the %@$% %@$% %@$%. Use spacebar to %@$% the %@$%."
        }, {
            "id": "#plg-txteditable-one",
            "tabIndex": 2020,
            "accText": "%@$%. Use the keyboard to edit the function panel title."
        }, {
            "id": "#plg-equation-panel-two",
            "tabIndex": 3000,
            "accText": "The function panel %@$% has %@$% %@$%"
        }, {
            "id": "#plg-fa-check-square-two",
            "tabIndex": 3010,
            "accText": "Currently the checkbox for the function panel %@$% is %@$%, and the %@$% %@$% %@$%. Use spacebar to %@$% the %@$% ."
        }, {
            "id": "#plg-txteditable-two",
            "tabIndex": 3020,
            "accText": "%@$%. Use the keyboard to edit the function panel title."
        }, {
            "id": "#plg-equation-panel-three",
            "tabIndex": 4000,
            "accText": "The function panel %@$% has %@$% %@$%"
        }, {
            "id": "#plg-fa-check-square-three",
            "tabIndex": 4010,
            "accText": "Currently the checkbox for the function panel %@$% is %@$%, and the %@$% %@$% %@$%. Use spacebar to %@$% the %@$% ."
        }, {
            "id": "#plg-txteditable-three",
            "tabIndex": 4020,
            "accText": "%@$%. Use the keyboard to edit the function panel title."
        }, {
            "id": "#plg-equation-panel-four",
            "tabIndex": 5000,
            "accText": "The function panel %@$% has %@$% %@$%"
        }, {
            "id": "#plg-fa-check-square-four",
            "tabIndex": 5010,
            "accText": "Currently the checkbox for the function panel %@$% is %@$%, and the %@$% %@$% %@$%. Use spacebar to %@$% the %@$%."
        }, {
            "id": "#plg-txteditable-four",
            "tabIndex": 5020,
            "accText": "%@$%. Use the keyboard to edit the function panel title."
        }, {
            "id": "#pbs-base-title-i-icon-content",
            "tabIndex": 6010,
            "accText": "Use spacebar to access the About section."
        }, {
            "id": "#pbs-base-title-cam-icon-content",
            "tabIndex": 6020,
            "accText": "Use spacebar to take a screenshot."
        }, {
            "id": "#pbs-base-links-guide",
            "tabIndex": 6030,
            "accText": "Use spacebar or enter to access the User’s Guide."
        }, {
            "id": "#pbs-base-links-faq",
            "tabIndex": 6040,
            "accText": "Use spacebar to access the frequently asked questions."
        }, {
            "id": "#pbs-base-links-warmup",
            "tabIndex": 6050,
            "accText": "Use spacebar to access the Warm Up."
        }, {
            "id": "#pbs-base-links-sampleactivity",
            "tabIndex": 6060,
            "accText": "Use spacebar to access the Sample Activity."
        }, {
            "id": "#pbs-base-links-more",
            "tabIndex": 6070,
            "accText": "Use spacebar to access the more seeing math interactive."
        }]
    };
});
