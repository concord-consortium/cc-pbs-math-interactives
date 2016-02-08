(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['equation-error-msg-template'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"plg-equation-error-msg-panel\" class=\"plg-equation-error-msg-panel\">\r\n  <div id=\"plg-error-popup-holder\" class=\"plg-error-popup-holder\">\r\n        <div id=\"plg-error-msg-popup-exp\" class=\"plg-error-msg-popup\"></div>\r\n        <div id=\"plg-error-msg-popup-close-exp\" class=\"plg-error-msg-popup-close-exp fa fa-times-circle fa-lg \"></div>\r\n      <div id=\"plg-eqn-popup-body-exp\" class=\"plg-eqn-popup-body\">\r\n\r\n      		<div id=\"plg-error-img\" class=\"plg-error-img fa fa-times-circle fa-2x\"></div>\r\n      		<div id=\"plg-error-msg\" class=\"plg-error-msg\"></div>\r\n      		<div id=\"plg-error-ok-btn\" class=\"plg-ok-btn plg-error-ok-btn\"></div>\r\n      		\r\n  	  </div>\r\n  </div>\r\n</div>";
  });
})();