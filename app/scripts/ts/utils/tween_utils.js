define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by kev on 15-07-01.
     */
    var TweenUtils = /** @class */ (function () {
        function TweenUtils() {
        }
        TweenUtils.easeInExpo = function (t, b, c, d) {
            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        };
        return TweenUtils;
    }());
    exports.TweenUtils = TweenUtils;
});
//# sourceMappingURL=tween_utils.js.map