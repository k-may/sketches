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
define(["require", "exports", "../../../common/base_sketch"], function (require, exports, base_sketch_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Sketch = /** @class */ (function (_super) {
        __extends(Sketch, _super);
        function Sketch(div) {
            var _this = _super.call(this, div) || this;
            _this.windowWidth = 0;
            _this.windowHeight = 0;
            return _this;
        }
        Sketch.prototype.draw = function (time) {
        };
        Sketch.prototype.resize = function (windowWidth, windowHeight) {
            this.windowWidth = windowWidth;
            this.windowHeight = windowHeight;
        };
        return Sketch;
    }(base_sketch_1.BaseSketch));
    exports.Sketch = Sketch;
});
//# sourceMappingURL=sketch.js.map