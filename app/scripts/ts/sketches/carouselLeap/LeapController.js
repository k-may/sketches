var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "../../common/base_controller", "leapmotionts"], function (require, exports, base_controller_1, leapmotionts_1) {
    "use strict";
    var LeapController = /** @class */ (function (_super) {
        __extends(LeapController, _super);
        function LeapController() {
            var _this = _super.call(this) || this;
            _this.swipe = {
                start: -1
            };
            _this.createElements();
            _this.controller = new leapmotionts_1.Controller();
            _this.controller.addEventListener(leapmotionts_1.LeapEvent.LEAPMOTION_CONNECTED, function (event) {
                _this.console("connected");
                _this.controller.enableGesture(leapmotionts_1.Gesture.TYPE_SWIPE);
                _this.controller.enableGesture(leapmotionts_1.Gesture.TYPE_SCREEN_TAP);
            });
            _this.controller.addEventListener(leapmotionts_1.LeapEvent.LEAPMOTION_FRAME, function (event) {
                _this.onLeapFrame(event);
            });
            return _this;
        }
        LeapController.prototype.createElements = function () {
            this.consoles = [];
            this.consoleDiv = document.getElementsByClassName('console')[0];
            if (!this.consoleDiv) {
                this.consoleDiv = document.createElement("div");
                this.consoleDiv.setAttribute("class", "console");
                document.body.appendChild(this.consoleDiv);
            }
        };
        LeapController.prototype.onLeapFrame = function (event) {
            var frame = event.frame;
            var hand = null;
            if (frame.hands.length > 0) {
                hand = frame.hands[0];
            }
            if (hand) {
                var gestures = frame.gestures();
                var direction;
                for (var i = 0; i < gestures.length; i++) {
                    switch (gestures[i].type) {
                        case leapmotionts_1.Gesture.TYPE_SWIPE:
                            var swipe = gestures[i];
                            direction = swipe.direction;
                            var absX = Math.abs(direction.x);
                            var absY = Math.abs(direction.y);
                            if (absX > absY) {
                                var time = Date.now();
                                if (time - this.swipe.start > 500 && swipe.state === leapmotionts_1.Gesture.STATE_STOP) {
                                    var dir = absX / direction.x;
                                    this.console("new swipe : !" + swipe.state + " :: " + dir);
                                    this.swipe.start = time;
                                    //https://github.com/Microsoft/TypeScript/issues/2029
                                    //casting unness!
                                    var evt = document.createEvent("CustomEvent");
                                    evt.initCustomEvent("Swipe", true, true, { "direction": dir });
                                    window.dispatchEvent(evt);
                                }
                            }
                            break;
                        case leapmotionts_1.Gesture.TYPE_SCREEN_TAP:
                            var tap = gestures[i];
                            direction = tap.direction;
                            this.console("tap : " + direction.z.toFixed(2));
                            //toggle active
                            /*if(this.currentItem.active){
                                this.currentItem.setActive(false);
                            }else{
                                this.currentItem.setActive(true);
                            }*/
                            break;
                    }
                }
            }
        };
        LeapController.prototype.console = function (message) {
            this.consoles.push(message + "</br>");
            if (this.consoles.length > 20) {
                this.consoles.shift();
            }
            message = "";
            this.consoles.forEach(function (m) {
                message += m;
            });
            this.consoleDiv.innerHTML = message;
        };
        return LeapController;
    }(base_controller_1.BaseController));
    return LeapController;
});
//# sourceMappingURL=LeapController.js.map