/**
 * Created by kev on 15-11-30.
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MathUtils = (function () {
        function MathUtils() {
        }
        MathUtils.Map = function (value, low2, high2) {
            if (value < low2) {
                return 0;
            }
            else if (value >= low2 && value <= high2) {
                return Math.max(0, Math.min(1, (value - low2) / (high2 - low2)));
            }
            else {
                return 1;
            }
        };
        MathUtils.Mod = function (n, m) {
            var remain = n % m;
            return Math.floor(remain >= 0 ? remain : remain + m);
        };
        return MathUtils;
    }());
    exports.MathUtils = MathUtils;
});
//# sourceMappingURL=math_utils.js.map