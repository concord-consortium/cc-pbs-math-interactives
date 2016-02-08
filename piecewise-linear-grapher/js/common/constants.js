define([], function() {
    var Constants = function Constants() {

        this.ONE_EQ_PANEL = "one";
        this.TWO_EQ_PANEL = "two";
        this.THREE_EQ_PANEL = "three";
        this.FOUR_EQ_PANEL = "four";

        this.COLOR_ONE = 0xe86f2f;
        this.COLOR_TWO = 0x2da343;
        this.COLOR_THREE = 0xffc223;
        this.COLOR_FOUR = 0x6dc5d8;

        //Equation type
        this.SLOPE_INTERCEPT = 1;
        this.POINT_SLOPE = 2;

        //x value range relation
        this.LESS_THAN_OR_EQUAL = 1;
        this.LESS_THAN = 2;

        this.EQ_BASE_TAB_INDEX = 2000;
        this.EQ_BASE_TAB_BUFFER = 30;

        //model objects
        this.OBJ_ROCKET = 1;

        this.X_DEFAULT_RANGE = 5;
        this.Y_DEFAULT_RANGE = 5;
        this.INVALID_VALUE = -1;
        this.INFINITY_VALUE = -17.0;
        this.DEFAULT_SLOPE = 1.0;
        this.DEFAULT_DISPLACEMENT = 0.0;

        //Line types
        this.SEGMENT = 1;
        this.POS_INFINITY_RAY = 2;
        this.NEG_INFINITY_RAY = 3;
        this.DEFAULT_X1 = 0.0;
        this.DEFAULT_Y1 = 0.0;
        this.DEFAULT_X2 = 5.0;
        this.DEFAULT_Y2 = 5.0;

        //Default Grid Options
        this.DEFAULT_CANVAS_WIDTH = 390;
        this.DEFAULT_CANVAS_HEIGHT = 390;
        this.DEFAULT_GRID_X_LOWER_LIMIT = -5;
        this.DEFAULT_GRID_X_UPPER_LIMIT = 45;
        this.DEFAULT_GRID_Y_LOWER_LIMIT = -5;
        this.DEFAULT_GRID_Y_UPPER_LIMIT = 45;
        this.DEFAULT_X_INTERVAL = 5;
        this.DEFAULT_Y_INTERVAL = 5;
        this.DEFAULT_DIFF_X = (this.DEFAULT_GRID_X_UPPER_LIMIT - this.DEFAULT_GRID_X_LOWER_LIMIT) / this.DEFAULT_X_INTERVAL;
        this.DEFAULT_DIFF_Y = (this.DEFAULT_GRID_Y_UPPER_LIMIT - this.DEFAULT_GRID_Y_LOWER_LIMIT) / this.DEFAULT_Y_INTERVAL;

        this.DEFAULT_LINE_DATA = {
            "x1": this.DEFAULT_X1,
            "y1": this.DEFAULT_Y1,
            "x2": this.DEFAULT_X2,
            "y2": this.DEFAULT_Y2,
            "idInterceptType": this.SLOPE_INTERCEPT,
            "xRangeLeftRelation": this.LESS_THAN_OR_EQUAL,
            "xRangeRightRelation": this.LESS_THAN,
            "bIsSelected": false,
            "lineTypeId": this.SEGMENT,
            "slope": this.DEFAULT_SLOPE,
            "displacement": this.DEFAULT_DISPLACEMENT,
            "expressionSlopeIntercept": "",
            "expressionPointSlope": ""
        };



        this.isIE = function() {
            var returnValue = false,
                ua = window.navigator.userAgent,
                oldIE = ua.indexOf('MSIE '),
                newIE = ua.indexOf('Trident/');

            if (oldIE > -1 || newIE > -1) {
                returnValue = true;
            }

            return returnValue;
        };

        Number.prototype.safe_toFixed = function(x) {
            var that = this.toFixed(x);
            that = that.replace(/\.0$/, '');
            if (that == '-0') {
                that = 0;
            }
            return that;
        }
    };
    // Our module now returns our view
    return Constants;
});
