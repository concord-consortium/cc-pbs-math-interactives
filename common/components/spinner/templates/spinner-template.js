(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['spinner-template'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div id=\"";
  if (stack1 = helpers.spinBoxId) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.spinBoxId); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "-content-holder\" class=\"spinbox\">\r\n    <div class=\"arrowbutton-container up fa fa-caret-up\"></div>\r\n    <div id=\"";
  if (stack1 = helpers.spinBoxId) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.spinBoxId); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "-text\" class=\"spin-textbox-container\">\r\n        <input type=\"text\" value=\"\" class=\"textbox-field\" />\r\n    </div>\r\n    <div class=\"arrowbutton-container down fa fa-caret-down\"></div>\r\n</div>\r\n";
  return buffer;
  });
})();