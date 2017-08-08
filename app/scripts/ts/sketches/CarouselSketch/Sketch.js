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
define(["require", "exports", "../../common/BaseSketch", "../../utils/anim_utils"], function (require, exports, BaseSketch_1, anim_utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by Kevin on 2015-11-08.
     */
    var Div = (function () {
        function Div(div) {
            this.x = 0;
            this.y = 0;
            this.div = div;
        }
        return Div;
    }());
    exports.Div = Div;
    var Sketch = (function (_super) {
        __extends(Sketch, _super);
        function Sketch(div) {
            var _this = _super.call(this) || this;
            _this.ratio = 0;
            _this.invalidated = false;
            _this.targetRatio = 0;
            var fileref = document.createElement("link");
            fileref.rel = "stylesheet";
            fileref.type = "text/css";
            fileref.href = "styles/carousel2d.css";
            document.getElementsByTagName("head")[0].appendChild(fileref);
            _this.divs = [];
            var num = 100;
            var height = window.innerHeight / num;
            for (var i = 0; i < num; i++) {
                var div = document.createElement('div');
                div.setAttribute("class", "sketch");
                var offset = i * height;
                div.style.height = height + "px";
                _this.el.appendChild(div);
                _this.divs.push(new Div(div));
            }
            return _this;
        }
        Sketch.prototype.draw = function (time) {
            var _this = this;
            _super.prototype.draw.call(this, time);
            this.invalidated = false;
            var diff = (this.targetRatio - this.ratio);
            if (Math.abs(diff) > 0.001) {
                this.invalidated = true;
            }
            this.ratio += diff * 0.1;
            var previous = null;
            var div = this.divs[0];
            var xPos = (this.ratio * window.innerWidth);
            var yPos = 10 + Math.sin(this.ratio * Math.PI * 2) * 100 - this.ratio * 120;
            div.x = xPos;
            div.y = yPos;
            this.divs.forEach(function (div, index) {
                _this.drawDiv(div, _this.ratio, previous);
                previous = div;
            });
        };
        Sketch.prototype.drawDiv = function (div, ratio, previous) {
            if (previous) {
                div.x = div.x + (previous.x - div.x) * 0.4;
                div.y = previous.y + 0.01;
            }
            anim_utils_1.AnimUtils.SetMatrix(div.div, 0, (90 * ratio), 0, 1, div.x, div.y, 0);
        };
        Sketch.prototype.mouseMove = function (e) {
            this.setRatio(Math.min(0.5, Math.max(0, (e.clientX + 10) / (window.innerWidth - 10))));
        };
        Sketch.prototype.setRatio = function (ratio) {
            this.targetRatio = ratio;
            this.invalidated = true;
        };
        return Sketch;
    }(BaseSketch_1.BaseSketch));
    exports.Sketch = Sketch;
});
//# sourceMappingURL=Sketch.js.map