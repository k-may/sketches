/**
 * Created by kev on 15-07-02.
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Color = (function () {
        function Color(r, g, b, a) {
            this.r = 0;
            this.r = r || 255;
            this.g = g || 255;
            this.b = b || 255;
            this.a = a || 255;
        }
        Color.prototype.toRGBString = function () {
            return 'rgb(' + this.r + "," + this.g + "," + this.b + ")";
        };
        Color.prototype.toRGBAString = function () {
            return 'rgba(' + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
        };
        Color.prototype.clone = function () {
            return new Color(this.r, this.g, this.b, this.a);
        };
        Color.hexToRgb = function (hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return new Color(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16));
        };
        Color.lerpColor = function (start, dest, ratio) {
            return new Color(parseInt(start.r + (dest.r - start.r) * ratio), parseInt(start.g + (dest.g - start.g) * ratio), parseInt(start.b + (dest.b - start.b) * ratio), parseInt(start.a + (dest.a - start.a) * ratio));
        };
        return Color;
    }());
    exports.Color = Color;
});
//# sourceMappingURL=color.js.map