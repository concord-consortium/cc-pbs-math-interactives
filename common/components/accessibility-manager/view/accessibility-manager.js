define(["acc-manager-model"], function(AccModel) {

    var AccessibilityManager = Backbone.View.extend({
        "isAccessibilityOn": null,
        "initialize": function(arguments) {
            this.isAccessibilityOn = arguments.isAccessibilityOn;
            if (this._isMobile()) {
                this.isAccessibilityOn = false;
            }
            this.model = new AccModel();
            this.model.set('isAccessibilityOn', this.isAccessibilityOn);
        },

        "_isMobile": function() {
            var userAgent = navigator.userAgent.toLowerCase(),
                isAndroid = userAgent.indexOf("android") > -1,
                isChrome = userAgent.indexOf("chrome") > -1,
                isSafari = !isChrome && userAgent.indexOf("safari") > -1,
                isIOS = userAgent.indexOf("mobile") > -1 && isSafari;
            return isIOS || isAndroid;
        },

        /**
         * Triggers the click event of parent.
         * @method _keyPressHandler
         * @param event {Object}
         * @return {void}
         **/
        "_keyPressHandler": function(event) {
            if (!this.isAccessibilityOn) {
                return;
            }
            var $accEl = $(event.target),
                key = event ? event.which : event.keyCode,
                ENTER_KEY = 13,
                SPACE_KEY = 32;



            if ($accEl.attr('type') !== "text" && $accEl.prop("tagName") !== "TEXTAREA" && (key === SPACE_KEY || key === ENTER_KEY)) {
                event.preventDefault();
                event.stopPropagation();
                $accEl.trigger("mousedown").trigger("mouseup").trigger("click");
            }
        },

        /**
         * set tab index to jquery object passed
         * @method setTabIndex
         * @param $element {Object} [jquery object]
         * @param tabIndex {Number} tab index to be set
         * @return {void}
         */
        "setTabIndex": function($element, tabIndex) {
            if (!this.isAccessibilityOn) {
                return;
            }
            $element.attr({
                "tabindex": tabIndex,
                "temp-tabindex": tabIndex
            }).addClass('acc-element');
        },

        /**
         * get tab index of element passed
         * @method getTabIndex
         * @param $element {Object} [jquery object]
         * @return {Number} tabindex of the element
         */
        "getTabIndex": function($element) {
            return $element.attr('tabindex');
        },

        /**
         * enable disable tab based on boolean passed
         * @method enableTab
         * @param $element {Object} [jquery object]
         * @param shouldEnable {Boolean} Boolean to enable or disable element
         * @return {void}
         */
        "enableTab": function($element, shouldEnable) {
            if (!this.isAccessibilityOn) {
                return;
            }
            if (shouldEnable) {
                $element.attr('tabindex', $element.attr('temp-tabindex'));
            } else {
                $element.attr('tabindex', -1);
            }
        },

        /**
         * enable tab for all elements
         * @method enableAllTabs
         * @return {void}
         */
        "enableAllTabs": function(event) {
            if (!this.isAccessibilityOn) {
                return;
            }

            var elementsArray = this.$('.acc-element'),
                counter = 0,
                length = elementsArray.length;

            for (; counter < length; counter++) {
                this.enableTab(elementsArray.eq(counter), true);
            }
        },

        /**
         * disable tab for all elements
         * @method disableAllTabs
         * @return {void}
         */
        "disableAllTabs": function() {
            if (!this.isAccessibilityOn) {
                return;
            }

            var elementsArray = this.$('.acc-element'),
                counter = 0,
                length = elementsArray.length;

            for (; counter < length; counter++) {
                this.enableTab(elementsArray.eq(counter), false);
            }
        },

        /**
         * Replaces the '%@$%' in given message with strings in the given array.
         * @method _replaceSpecialStr
         * @private
         * @param message {String} Message which is to be modified.
         * @param arrParam {Object} Array of strings to be replace in message.
         * @return {String} Returns The modified message removing'%@$%'.
         **/
        "_replaceSpecialStr": function(message, arrParam) {
            var counter = 0;

            for (; counter < arrParam.length; counter++) {
                message = message.replace("%@$%", arrParam[counter]);
            }
            return message;
        },

        /**
         * Set accessibility text for element passed in.
         * @method setAccText
         * @param $element {Object} [jquery object]
         * @param accText {String} accessibility text to set for $element
         * @param arrParam {Object} replaceable text in accText
         * @return {void}
         */
        "setAccText": function($element, accText, arrParam) {
            if (!this.isAccessibilityOn) {
                return;
            }

            var labelledBy,
                $labelledBy;

            if ($element.length === 0 || $element.attr('type') === "text") {
                return;
            }

            labelledBy = $element.attr('aria-labelledby');
            if (arrParam) {
                accText = this._replaceSpecialStr(accText, arrParam);
            }
            if (labelledBy) {
                $labelledBy = this.$('#' + labelledBy);
                $labelledBy.html(accText);
            } else {
                $element.attr('aria-label', accText);
            }
        },

        /**
         * Adds an input element before and after the player container for accessibility
         * @method initializeAccessibilityComponents
         * @param container {Object} Player container
         **/
        "initializeAccessibilityComponents": function(container) {
            if (!this.isAccessibilityOn) {
                return;
            }
            this._setModelValues(container, false);

            var $firstFocusableElement = this._attachFirstElement(container),
                $lastFocusableElement = this._attachLastElement(container),
                $startWrapper = this._attachStartWrapper($firstFocusableElement),
                $startInputElement = this._attachStartInputElement($startWrapper),
                $endWrapper = this._attachEndWrapper($lastFocusableElement),
                $endInputElement = this._attachEndInputElement($endWrapper),
                interactiveElements = null,
                interactiveElementsLength = null,
                elementCounter = 0;

            this._attachAccessibilityEvents(container, $startInputElement, $endInputElement, $lastFocusableElement, $firstFocusableElement);
            // clear tabindex values of all element inside player
            interactiveElements = container.find("[tabindex]");
            interactiveElementsLength = interactiveElements.length;
            for (; elementCounter < interactiveElementsLength; elementCounter++) {
                interactiveElements.eq(elementCounter).attr("tabindex", -1);
            }
        },

        /**
         * Sets default values in the model
         * @method _setModelValues
         * @param $playerContainer {Object} Player container
         **/
        "_setModelValues": function($playerContainer, insideInteractivity) {
            var elementsArray = $playerContainer.find("[tabindex]:visible:not(:disabled)"),
                tabIndexArray = [],
                validTabIndexArray = [],
                elementsArrayLength = elementsArray.length,
                elementCounter = 0,
                tabIndexVal = null,
                maxValueTabIndex = null,
                minValueTabIndex = null,
                firstElementTabIndex = null,
                lastElementTabIndex = null,
                firstElement = null,
                lastElement = null;

            for (; elementCounter < elementsArrayLength; elementCounter++) {
                tabIndexVal = Number(elementsArray.eq(elementCounter).attr("tabindex"));
                tabIndexArray[elementCounter] = tabIndexVal;
                if (tabIndexVal > -1) {
                    validTabIndexArray.push(tabIndexVal);
                }
            }

            if (validTabIndexArray.length === 0) {
                firstElement = $playerContainer.next().find("input");
                lastElement = $playerContainer.prev().find("input");
            } else {
                minValueTabIndex = Math.min.apply(Math, validTabIndexArray);
                firstElementTabIndex = $.inArray(minValueTabIndex, tabIndexArray);
                firstElement = elementsArray.eq(firstElementTabIndex);

                maxValueTabIndex = Math.max.apply(Math, tabIndexArray);
                lastElementTabIndex = $.inArray(maxValueTabIndex, tabIndexArray);
                lastElement = elementsArray.eq(lastElementTabIndex);
            }

            //Unset previously stored value to prevent comparison of DOM elements
            this.model.set({
                "firstElement": null,
                "lastElement": null
            });

            this.model.set({
                "firstElement": firstElement,
                "lastElement": lastElement,
                "insideInteractivity": insideInteractivity
            });
        },

        /**
         * Attaches an element after the player container which acts as the last element
         * @method _attachLastElement
         * @param $playerContainer {Object} Player container
         **/
        "_attachLastElement": function($playerContainer) {
            var $lastElement = $("<div>", {
                    "class": "last-focusable-element"
                }).insertAfter($playerContainer)
                .css({
                    "height": 0,
                    "overflow": "hidden"
                });

            this.model.set("lastFocusableElement", $lastElement);
            return $lastElement;
        },

        /**
         * Attaches an element before the player container which acts as the first element
         * @method _attachFirstElement
         * @param $playerContainer {Object} Player container
         **/
        "_attachFirstElement": function($playerContainer) {
            var $firstElement = $("<div>", {
                    "class": "first-focusable-element"
                }).insertBefore($playerContainer)
                .css({
                    "height": 0,
                    "overflow": "hidden"
                });

            this.model.set("firstFocusableElement", $firstElement);
            return $firstElement;
        },

        /**
         * Attaches a wrapper before player container to hide input element
         * @method _attachStartWrapper
         * @param $playerContainer {Object} Player container
         **/
        "_attachStartWrapper": function($playerContainer) {
            //Add a wrapper div to hide starting input element
            var $startWrapper = $("<div>", {
                    "class": "checkbox-wrapper start-checkbox-wrapper"
                }).insertBefore($playerContainer)
                .css({
                    "height": 0,
                    "overflow": "hidden"
                });

            return $startWrapper;
        },

        /**
         * Attaches an input element before player container for accessibility
         * @method _attachStartInputElement
         * @param startWrapper {Object} Wrapper element used to hide the input element
         **/
        "_attachStartInputElement": function(startWrapper) {
            //Adding a start input element for DE accessibility
            var $startInputElement = $("<input type='checkbox' />")
                .attr({
                    "class": "start-checkbox",
                    "aria-hidden": true
                })
                .appendTo(startWrapper)
                .css({
                    "float": "left"
                });

            return $startInputElement;
        },

        /**
         * Attaches a wrapper after player container to hide input element
         * @method _attachEndWrapper
         * @param $playerContainer {Object} Player container
         **/
        "_attachEndWrapper": function($playerContainer) {
            //Add a wrapper div to hide ending input element
            var $endWrapper = $("<div>", {
                    "class": "checkbox-wrapper end-checkbox-wrapper"
                }).insertAfter($playerContainer)
                .css({
                    "height": 0,
                    "overflow": "hidden"
                });

            return $endWrapper;
        },

        /**
         * Attaches an input element after player container for accessibility
         * @method _attachEndInputElement
         * @param endWrapper {Object} Wrapper element used to hide the input element
         **/
        "_attachEndInputElement": function(endWrapper) {
            //Adding an end input element for DE accessibility
            var $endInputElement = $("<input type='checkbox' />")
                .attr({
                    "class": "end-checkbox",
                    "aria-hidden": true
                })
                .appendTo(endWrapper)
                .css({
                    "float": "left",
                    "position": "relative"
                });

            return $endInputElement;
        },

        "_setFocusableElementTabIndex": function() {
            var lastFocusableElement = this.model.get("lastFocusableElement"),
                firstFocusableElement = this.model.get("firstFocusableElement"),
                insideInteractivity = this.model.get("insideInteractivity"),
                firstTabIndex = insideInteractivity ? this.model.get("firstTabIndex") : -1,
                lastTabIndex = insideInteractivity ? (this.model.get("tabIndexRange") + this.model.get("startTabindex")) : -1;

            firstFocusableElement.attr("tabindex", firstTabIndex);
            lastFocusableElement.attr("tabindex", lastTabIndex);
        },

        /**
         * Attaches events on input elements and player container
         * @method _attachAccessibilityEvents
         * @param $playerContainer {Object} Player container
         * @param $startInputElement {Object} Input element before player container
         * @param $endInputElement {Object} Input element after player container
         * @param $lastFocusableElement {Object} Element which acts as the last element
         **/
        "_attachAccessibilityEvents": function($playerContainer, $startInputElement, $endInputElement, $lastFocusableElement, $firstFocusableElement) {
            this._attachEventsOnStartElement($playerContainer, $startInputElement);
            this._attachEventsOnPlayerElements($lastFocusableElement, $firstFocusableElement);
        },

        /**
         * Attaches focus in event on start input element
         * @method _attachEventsOnStartElement
         * @param $playerContainer {Object} Player container
         * @param $startWrapper {Object} Wrapper element used to hide the input element before player container
         * @param $startInputElement {Object} Input element before player container
         **/
        "_attachEventsOnStartElement": function($playerContainer, $startInputElement) {
            //Attach focusin event on starting input element to handle accessibility through DE's elements
            $startInputElement.on("focusin.setResetTabIndex", _.bind(function(event) {

                var elements = null,
                    index = null,
                    tabbables = null,
                    tabIndexVal = null,
                    elementsLength = null,
                    elementCounter = 0,
                    $currentElement = null;

                if (!this.model.get("insideInteractivity")) {
                    elements = $playerContainer.find("[tabindex]");

                    elementsLength = elements.length;

                    for (; elementCounter < elementsLength; elementCounter++) {
                        $currentElement = elements.eq(elementCounter);
                        tabIndexVal = $currentElement.attr("temp-tabindex");
                        if (!$currentElement.hasClass('disabled')) {
                            $currentElement.attr("tabindex", tabIndexVal);
                        }
                    }
                    this._setModelValues($playerContainer, true);
                    this.model.set("insideInteractivity", true);
                    this._setFocusableElementTabIndex();

                    _.delay(_.bind(function() {
                        this.model.get("firstElement").focus();
                    }, this), 100);
                } else {
                    this._setModelValues($playerContainer, false);
                    elements = $playerContainer.find("[tabindex]");
                    elementsLength = elements.length;

                    for (; elementCounter < elementsLength; elementCounter++) {
                        elements.eq(elementCounter).attr("tabindex", -1);
                    }
                    tabbables = $(":tabbable:visible:not(:disabled)");
                    index = $.inArray(this, tabbables);

                    this._setFocusableElementTabIndex();
                    _.delay(function() {
                        //Checks if a tab-able element is present before it and shifts focus to it if true,
                        // else shifts focus to last tab-able element on page
                        if (tabbables[index - 1]) {
                            tabbables[index - 1].focus();
                        } else {
                            tabbables[tabbables.length - 1].focus();
                        }
                    }, 100);
                }
            }, this));
        },

        /**
         * Attaches keydown events on all player elements
         * @method _attachEventsOnPlayerElements
         * @param $playerContainer {Object} Player container
         * @param $lastFocusableElement {Object} Element to be used as the last element
         **/
        "_attachEventsOnPlayerElements": function($lastFocusableElement, $firstFocusableElement) {
            $lastFocusableElement.on("focusin.setResetTabIndex", _.bind(function(event) {
                if (this.model.get("insideInteractivity")) {
                    $lastFocusableElement.next().find("input").focus();
                }
            }, this));

            $firstFocusableElement.on("focusin.setResetTabIndex", _.bind(function(event) {
                if (this.model.get("insideInteractivity")) {
                    $firstFocusableElement.prev().find("input").focus();
                }
            }, this));
        },

        /**
         * Attaches focus in event on end input element
         * @method _attachEventsOnEndElement
         * @param $playerContainer {Object} Player container
         * @param $endWrapper {Object} Wrapper element used to hide the input element after player container
         * @param $endInputElement {Object} Input element after player container
         **/
        "_attachEventsOnEndElement": function($playerContainer, $endInputElement) {
            $endInputElement.on("focusin.setResetTabIndex", _.bind(function(event) {

                var elements = null,
                    tabbables = null,
                    index = null,
                    elementsLength = null,
                    elementCounter = 0,
                    $currentElement = null;

                if (this.model.get("insideInteractivity")) {
                    this._setModelValues($playerContainer, false);

                    elements = $playerContainer.find("[tabindex]");
                    elementsLength = elements.length;

                    for (; elementCounter < elementsLength; elementCounter++) {
                        elements.eq(elementCounter).attr("tabindex", -1);
                    }

                    tabbables = $(":tabbable:visible:not(:disabled)");
                    index = $.inArray(this, tabbables);

                    this._setFocusableElementTabIndex();

                    _.delay(function() {
                        //Checks if a tab-able element is present after it and shifts focus to it if true,
                        // else shifts focus to first tab-able element on page
                        if (tabbables[index + 1]) {
                            tabbables[index + 1].focus();
                        } else {
                            tabbables[0].focus();
                        }
                    }, 100);
                } else {
                    elements = $playerContainer.find("[tabindex]");

                    elementsLength = elements.length;
                    for (; elementCounter < elementsLength; elementCounter++) {
                        $currentElement = elements.eq(elementCounter);
                        if (!$currentElement.hasClass('disabled')) {
                            $currentElement.attr("tabindex", $currentElement.attr("temp-tabindex"));
                        }
                    }
                    this._setModelValues($playerContainer, true);
                    this.model.set("insideInteractivity", true);
                    this._setFocusableElementTabIndex();
                    _.delay(_.bind(function() {
                        this.model.get("lastElement").focus();
                    }, this), 100);
                }
            }, this));
        }
    });
    return AccessibilityManager;
});
