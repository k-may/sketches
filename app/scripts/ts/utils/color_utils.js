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
        Color.RandomColor = function () {
            return new Color(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
        };
        Color.RandomPastelColor = function () {
            return new Color(Math.floor(Math.random() * 55) + 150, Math.floor(Math.random() * 55) + 150, Math.floor(Math.random() * 55) + 150);
        };
        Color.RandomGoogleColor = function () {
            return this.hexToRgb(this.GoogleColors[Math.floor(Math.random() * this.GoogleColors.length)]);
        };
        Color.RandomGoogleColorHex = function () {
            return this.GoogleColors[Math.floor(Math.random() * this.GoogleColors.length)];
        };
        Color.lerpColor = function (start, dest, ratio) {
            return new Color(parseInt(start.r + (dest.r - start.r) * ratio), parseInt(start.g + (dest.g - start.g) * ratio), parseInt(start.b + (dest.b - start.b) * ratio), parseInt(start.a + (dest.a - start.a) * ratio));
        };
        //see : https://github.com/google/web-starter-kit/blob/b0079b5265124df04f560e5ac0e89be87441599c/app/styles/components/_palette.scss
        Color.GoogleColors = [
            "#e00032",
            "#c51162",
            "#ce93d8",
            // "#aa00ff",
            "#304ffe",
            "#4d69ff",
            "#0091ea",
            "#aeea00",
            "#3e2723"
            /*"#6200ea",
             "#e8eaf6",
             "#e0f7fa",
             "#e0f2f1",
             "#d0f8ce",
             "#f1f8e9",
             "#f9fbe7",
             "#fffde7",
             "#fff8e1",
             "#fff3e0",
             "#fbe9e7",
             "#efebe9",
             "#eceff1"*/
        ];
        return Color;
    }());
    exports.Color = Color;
});
//# sourceMappingURL=color_utils.js.map