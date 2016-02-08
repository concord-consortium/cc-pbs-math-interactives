(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['equation-panel-template'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "\r\n<div id=\"equation-panel-box\" class=\"equation-panel-box\">\r\n	<div id=\"eq-panel-checkbox-editabletext\" class=\"eq-panel-box\">\r\n		<div id=\"eq-panel-fa-check-square\" class=\"eq-panel-fa-check-square\" >\r\n			<div id=\"plg-fa-check-square-";
  if (stack1 = helpers.EqPanelId) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.EqPanelId); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"fa fa-check-square fa-lg\"></div>\r\n			<input type=\"text\" id=\"plg-txteditable-";
  if (stack1 = helpers.EqPanelId) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.EqPanelId); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"plg-txteditable ";
  if (stack1 = helpers.EqPanelId) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.EqPanelId); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\r\n		</div>\r\n	</div>\r\n	<div id=\"eq-panel-symbolic-area\" class=\"eq-panel-symbolic-area\">\r\n		<div id=\"eq-panel-fixed-area\" class=\"eq-panel-fixed-area\">\r\n		  <span id=\"eq-panel-y\" class=\"eq-panel-y\"> y= </span>\r\n		  <span id=\"eq-panel-brack\" class=\"eq-panel-brack\">{</span>\r\n		</div>\r\n		<div id=\"eq-panel-expression-area\" class=\"eq-panel-expression-area\">\r\n		</div>\r\n	</div>\r\n</div>";
  return buffer;
  });
})();