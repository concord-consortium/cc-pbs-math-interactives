(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['equation-axis-label-template'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"plg-equation-axis-label-panel\" class=\"plg-equation-axis-label-panel\">\r\n  <div id=\"plg-axis-popup-holder\" class=\"plg-axis-popup-holder\">\r\n        <div id=\"plg-axis-popup-label-exp\" class=\"plg-axis-popup-label\"></div>\r\n        <div id=\"plg-axis-popup-close-exp\" class=\"plg-axis-popup-close fa fa-times-circle fa-lg \"></div>\r\n      <div id=\"plg-eqn-popup-body-exp\" class=\"plg-eqn-popup-body\">\r\n      \r\n      		<div id=\"plg-axis-label\" class=\"plg-axis-label plg-axis-text-color\"></div>\r\n      		<div id=\"plg-axis-label-hr\" class=\"plg-axis-label-hr\"></div>\r\n		  	\r\n		  	<div id=\"plg-x-axis-container\" class=\"plg-x-axis-container plg-axis-text-color\">\r\n				<div id=\"plg-x-axis-text\" class=\"plg-x-axis-text\"></div>\r\n				 <input type=\"text\" id=\"plg-x-axis-input-text\" class=\"plg-x-axis-input-text\">  \r\n			</div>\r\n			\r\n			<div id=\"plg-y-axis-container\" class=\"plg-y-axis-container plg-axis-text-color\">\r\n				<div id=\"plg-y-axis-text\" class=\"plg-y-axis-text\"></div>\r\n				<input type=\"text\" id=\"plg-y-axis-input-text\" class=\"plg-y-axis-input-text\" > \r\n			</div>\r\n			\r\n			<div id=\"plg-axis-ok-btn\" class=\"plg-ok-btn plg-axis-ok-btn\"></div>\r\n\r\n  	  </div>\r\n  </div>\r\n</div>";
  });
})();