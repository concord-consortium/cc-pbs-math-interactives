(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['equation-save-msg-template'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"plg-equation-save-msg-panel\" class=\"plg-equation-save-msg-panel\">\r\n  <div id=\"plg-save-msg-popup-holder\" class=\"plg-save-msg-popup-holder\">\r\n        <div id=\"plg-save-msg-popup-exp\" class=\"plg-save-msg-popup\"></div>\r\n        <div id=\"plg-save-msg-popup-close-exp\" class=\"plg-save-msg-popup-close-exp fa fa-times-circle fa-lg \"></div>\r\n      <div id=\"plg-eqn-popup-body-exp\" class=\"plg-eqn-popup-body\">\r\n      	 <div id=\"plg-img-saved-msg\" class=\"plg-img-saved-msg\"></div>\r\n         <div id=\"plg-progress-msg\" class=\"plg-progress-msg\"> Please wait ...</div>\r\n         <div id=\"plg-saved-url\" class=\"plg-saved-url\"><a id=\"plg-saved-url-a\" href=\"\" target=\"_blank\">URL: http://abc.com </a></div>\r\n  	  </div>\r\n  </div>\r\n</div>";
  });
})();