define(["base-view-template"],function(e){var t=Backbone.View.extend({initialize:function(){this.langJson=""},render:function(){var e=Handlebars.templates["base-view-template"]({"activity-json":this.langJson}).trim()
this.$el.append(e),this.renderActivityArea()},renderActivityArea:function(){alert("renderActivityArea() is not implemented in the derived class.")}})
return t})
