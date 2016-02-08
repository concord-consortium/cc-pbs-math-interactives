(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['base-view-template'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div id=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0['activity-json'])),stack1 == null || stack1 === false ? stack1 : stack1.title_short)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-main-container\" class=\"pbs-base-main-container\" role=\"application\">\r\n        <div id=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0['activity-json'])),stack1 == null || stack1 === false ? stack1 : stack1.title_short)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-header-container\" class=\"pbs-base-main-header\">\r\n       		<div id=\"pbs-base-links-header-container\" class=\"pbs-base-links-header-container\">\r\n           Related Links:	<a id=\"pbs-base-links-guide\" href=\"#\" onclick=\"window.open('"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0['activity-json'])),stack1 == null || stack1 === false ? stack1 : stack1.user_guide_href)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "')\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0['activity-json'])),stack1 == null || stack1 === false ? stack1 : stack1.user_guide)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\r\n                  				<a id=\"pbs-base-links-faq\" href=\"#\" onclick=\"window.open('"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0['activity-json'])),stack1 == null || stack1 === false ? stack1 : stack1.faq_href)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "')\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0['activity-json'])),stack1 == null || stack1 === false ? stack1 : stack1.faq)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\r\n       				            <a id=\"pbs-base-links-warmup\" href=\"#\" onclick=\"window.open('"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0['activity-json'])),stack1 == null || stack1 === false ? stack1 : stack1.warmup_href)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "')\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0['activity-json'])),stack1 == null || stack1 === false ? stack1 : stack1.warmup)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\r\n       				            <a id=\"pbs-base-links-sampleactivity\" href=\"#\" onclick=\"window.open('"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0['activity-json'])),stack1 == null || stack1 === false ? stack1 : stack1.sampleactivity_href)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "')\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0['activity-json'])),stack1 == null || stack1 === false ? stack1 : stack1.sampleactivity)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a> \r\n            <p id=\"cc-logo-header-container\" class=\"cc-logo-header-container\">     </p>\r\n        	</div>\r\n          <div id=\"Dummy\"></div>\r\n        	<div id=\"pbs-base-title-header-container\" class=\"pbs-base-title-header-container\">\r\n        		<div id=\"pbs-base-title-content\" class=\"pbs-base-title-content\">\r\n            "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0['activity-json'])),stack1 == null || stack1 === false ? stack1 : stack1.title_content)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n        	\r\n          	\r\n            <div id=\"pbs-base-title-cam-icon-content\" title=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0['activity-json'])),stack1 == null || stack1 === false ? stack1 : stack1.tooltip)),stack1 == null || stack1 === false ? stack1 : stack1.titleCam)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"pbs-base-title-cam-icon-content\" > \r\n               <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 18\" width=\"20px\" height=\"18px\">\r\n                <style type=\"text/css\"><![CDATA[\r\n                .style0 {\r\n                  font-size: 18px;\r\n                  font-family: \"FontAwesome\";\r\n                  fill: rgb(255,255,255);\r\n                }\r\n                ]]></style>\r\n                <text class=\"style0\" transform=\"translate(-20 16)\"><tspan fill=\"rgb(255, 255, 255)\" x=\"20\"></tspan></text></svg>\r\n            </div>\r\n            <div id=\"pbs-base-title-i-icon-content\" title=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0['activity-json'])),stack1 == null || stack1 === false ? stack1 : stack1.tooltip)),stack1 == null || stack1 === false ? stack1 : stack1.titleI)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"pbs-base-title-i-icon-content\"> \r\n              <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 7 16\" width=\"7px\" height=\"16px\">\r\n                <style type=\"text/css\"><![CDATA[\r\n                .style0 {\r\n                  font-size: 18px;\r\n                  font-family: \"FontAwesome\";\r\n                  fill: rgb(255,255,255);\r\n                }\r\n                ]]></style>\r\n              <text class=\"style0\" transform=\"translate(-20 15)\"><tspan fill=\"rgb(255, 255, 255)\" x=\"20\"></tspan></text></svg>\r\n            </div>\r\n\r\n          </div>\r\n        </div>\r\n       \r\n        <div id=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0['activity-json'])),stack1 == null || stack1 === false ? stack1 : stack1.title_short)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-activity-area-container\" class=\"pbs-base-main-activity-area\">\r\n           \r\n        </div>\r\n       \r\n        <div id=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0['activity-json'])),stack1 == null || stack1 === false ? stack1 : stack1.title_short)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "-footer-container\" class=\"pbs-base-main-footer\"> \r\n       \r\n        	<div id=\"pbs-base-links-footer-container\" class=\"pbs-base-links-footer-container\">\r\n        		  <a id=\"pbs-base-links-more\" href=\"#\" onclick=\"window.open('"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0['activity-json'])),stack1 == null || stack1 === false ? stack1 : stack1.footer_more_href)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "')\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0['activity-json'])),stack1 == null || stack1 === false ? stack1 : stack1.footer_more)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\r\n              <span id=\"pbs-base-copyright-text\" class=\"pbs-base-copyright-text\">Copyright &#169 2016 The Concord Consortium.</span>\r\n        	</div>\r\n       \r\n        </div>\r\n</div>";
  return buffer;
  });
})();