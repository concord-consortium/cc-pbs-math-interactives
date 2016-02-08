define([
    "base-view-template"
], function(baseTemplate) {
    var BaseView = Backbone.View.extend({

        "initialize": function() {
            this.langJson = "";
        },

        "render": function() {
            var ht = Handlebars.templates['base-view-template']({
                "activity-json": this.langJson
            }).trim();

            this.$el.append(ht);
            this.renderActivityArea();
        },

        "renderActivityArea": function() {
            alert("renderActivityArea() is not implemented in the derived class.");
        }

    });
    // Our module now returns our view
    return BaseView;
});
