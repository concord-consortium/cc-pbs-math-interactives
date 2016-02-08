define([], function() {
    "use strict";

    return Backbone.Model.extend({

        "defaults": function() {
            return {
                "isAccessibilityOn": true,
                "startTabindex": null,
                "firstElement": null,
                "lastElement": null,
                "lastFocusableElement": null,
                "firstFocusableElement": null,
                "insideInteractivity": null,
                "tabIndexRange": 15000,
                "firstTabIndex": 1
            };
        }
    });
});
