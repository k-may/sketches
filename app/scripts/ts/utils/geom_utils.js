/**
 * Created by kev on 15-07-06.
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Point = /** @class */ (function () {
        function Point() {
        }
        return Point;
    }());
    exports.Point = Point;
    var GeomUtils = /** @class */ (function () {
        function GeomUtils() {
        }
        GeomUtils.LerpPoint = function (start, dest, percentage) {
            return this.LerpObject(start, dest, percentage);
        };
        GeomUtils.LerpObject = function (start, dest, percentage) {
            var obj = _.clone(start);
            for (var prop in start) {
                if (dest.hasOwnProperty(prop) && typeof start[prop] === "number" && typeof dest[prop] === "number") {
                    obj[prop] = start[prop] + (dest[prop] - start[prop]) * percentage;
                }
            }
            return obj;
        };
        GeomUtils.Distance = function (start, dest) {
            return Math.sqrt(Math.pow(start.x - dest.x, 2) + Math.pow(start.y - dest.y, 2));
        };
        return GeomUtils;
    }());
    exports.GeomUtils = GeomUtils;
});
//# sourceMappingURL=geom_utils.js.map