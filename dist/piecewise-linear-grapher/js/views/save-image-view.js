define(["equation-save-image-template","lang-json"],function(e,i){var t=Backbone.View.extend({initialize:function(e){this.listenTo(this.model,"OnPopupVisibilityChange",this.OnPopupVisibilityChange),this.accManager=e.accManager,this.bIsVisible=!1,this.bIsPopupAlreadyOpen=!1,this.langJson=i.saveimagepopupJSON,this.accJson=i.saveimagepopupAccJSON,this.popupName="Save Popup",this.render()},render:function(){var e=Handlebars.templates["equation-save-image-template"]({}).trim()
this.$el.append(e),this.$("#plg-save-popup-label-exp").html(this.langJson.title),this.$("#plg-save-line-one").html(this.langJson.line_one),this.$("#plg-save-group-text").html(this.langJson.line_two),this.$("#plg-save-username-text").html(this.langJson.line_three),this.$("#plg-save-title").html(this.langJson.line_four),this.$("#plg-save-comment").html(this.langJson.line_five),this.$("#plg-save-cancel-btn").html(this.langJson.btn_cancel),this.$("#plg-save-ok-btn").html(this.langJson.btn_ok),this._attachEvents(),this.showSavePage(!1)},events:{"keyup #plg-equation-save-panel":"popupHolderKeyup"},popupHolderKeyup:function(e){if(null!=this.accManager&&this.accManager.isAccessibilityOn){var i=e.keyCode||e.which
27===i&&this.showSavePage(!1)}},_attachEvents:function(){var e=this
this.$(".plg-save-popup-close").on("click",function(){e.showSavePage(!1)}),this.$("#plg-save-ok-btn").on("click",function(){e.OnOkClicked()})},showSavePage:function(e){e?(this.$(".plg-equation-save-panel").show(),this.$("#plg-save-group-input-text").val("Piecewise Linear Grapher"),this.$("#plg-save-username-input-text").val(""),this.$("#plg-save-title-input-text").val(""),this.$("#plg-save-comment-input-text").val("")):this.$(".plg-equation-save-panel").hide(),this.bIsVisible=e,this.model.PopupVisibilityChange({bIsVisible:e,popupName:this.popupName,affectedExpData:null})},OnOkClicked:function(){this.$(".plg-equation-save-panel").hide(),this.bIsVisible=!1,this.model.PopupVisibilityChange({bIsVisible:!1,popupName:this.popupName,affectedExpData:{bSaveOkClicked:!0}})},OnPopupVisibilityChange:function(e){e.popupName===this.popupName&&null!=this.accManager&&this.accManager.isAccessibilityOn&&(e.bIsVisible?(this.setAccOn(),this.$("#plg-save-popup-holder").focus()):(this.setAccOff(),this.bIsPopupAlreadyOpen=!1))},setAccOn:function(){for(var e,i=this.accJson.length,t=0;i>t;t++){e=this.accJson[t]
var s=null
this.accManager.setTabIndex(this.$(e.id),e.tabIndex),""===e.id,this.accManager.setAccText(this.$(e.id),e.accText,s)}},setAccOff:function(){for(var e,i=this.accJson.length,t=0;i>t;t++)e=this.accJson[t],this.accManager.setTabIndex(this.$(e.id),-1),this.accManager.setAccText(this.$(e.id),"",null)
this.$(".acc-element").on("keydown",_.bind(this.accManager._keyPressHandler,this))}})
return t})
