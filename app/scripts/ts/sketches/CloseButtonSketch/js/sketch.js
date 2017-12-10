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
define(["require", "exports", "../../../common/base_sketch", "../../../common/canvas_buffer2d", "../../../utils/anim_utils"], function (require, exports, base_sketch_1, canvas_buffer2d_1, anim_utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by kev on 16-02-08.
     */
    var Line = /** @class */ (function () {
        function Line() {
            this.d1 = { x: 0, y: 0 };
            this.s1 = { x: 0, y: 0 };
            this.p1 = { x: 0, y: 0 };
            this.d2 = { x: 0, y: 0 };
            this.s2 = { x: 0, y: 0 };
            this.p2 = { x: 0, y: 0 };
            this.value = 0;
            this.visible = true;
            this.p1 = { x: 0, y: 0 };
            this.p1 = { x: 0, y: 0 };
        }
        Line.prototype.setup = function (s1, d1, s2, d2) {
            this.s1 = s1;
            this.s2 = s2;
            this.d1 = d1;
            this.d2 = d2;
        };
        Line.prototype.update = function () {
            this.p1 = this.lerp(this.s1, this.d1, this.value);
            this.p2 = this.lerp(this.s2, this.d2, this.value);
        };
        Line.prototype.lerp = function (s, d, ratio) {
            return {
                x: s.x + (d.x - s.x) * ratio,
                y: s.y + (d.y - s.y) * ratio
            };
        };
        return Line;
    }());
    var Sketch = /** @class */ (function (_super) {
        __extends(Sketch, _super);
        function Sketch(div) {
            var _this = _super.call(this) || this;
            _this.windowWidth = 0;
            _this.windowHeight = 0;
            _this.animDirection = 0;
            _this.l1 = new Line();
            _this.l2 = new Line();
            _this.l3 = new Line();
            _this.l4 = new Line();
            _this.buffer = new canvas_buffer2d_1.CanvasBuffer2D();
            _this.el.appendChild(_this.buffer.canvas);
            _this.l1.setup({ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 1 });
            _this.l3.visible = false;
            _this.l2.setup({ x: 1, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 1 });
            _this.l2.visible = false;
            _this.l4.setup({ x: 0, y: 1 }, { x: 0, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 0 });
            _this.l4.visible = false;
            return _this;
        }
        Sketch.prototype.onClick = function () {
            if (this.animDirection == 0)
                this.animIn();
            else
                this.animOut();
            this.animDirection = 1 - this.animDirection;
        };
        Sketch.prototype.animIn = function () {
            var _this = this;
            new TWEEN.Tween(this.l1)
                .to({ value: 1 }, 500)
                .start();
            new TWEEN.Tween(this.l2)
                .delay(250)
                .onStart(function () { return _this.l2.visible = true; })
                .to({ value: 1 }, 500)
                .easing(TWEEN.Easing.Exponential.Out)
                .start();
            this.l3.setup({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 });
            this.l3.value = 0;
            new TWEEN.Tween(this.l3)
                .delay(750)
                .to({ value: 1 }, 500)
                .onStart(function () { return _this.l3.visible = true; })
                .easing(TWEEN.Easing.Exponential.Out)
                .onComplete(function () {
                _this.l3.setup({ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 1 }, { x: 0, y: 1 });
                _this.l3.value = 0;
                new TWEEN.Tween(_this.l3)
                    .to({ value: 1 }, 500)
                    .easing(TWEEN.Easing.Exponential.Out)
                    .onComplete(function () { return _this.l3.visible = false; })
                    .start();
            })
                .start();
            new TWEEN.Tween(this.l4)
                .to({ value: 1 }, 300)
                .delay(1250)
                .onStart(function () { _this.l4.visible = true; })
                .easing(TWEEN.Easing.Exponential.Out)
                .start();
        };
        Sketch.prototype.animOut = function () {
            var _this = this;
            new TWEEN.Tween(this.l4)
                .to({ value: 0 }, 200)
                .easing(TWEEN.Easing.Exponential.Out)
                .onComplete(function () { return _this.l4.visible = false; })
                .start();
            this.l3.visible = true;
            new TWEEN.Tween(this.l3)
                .to({ value: 0 }, 200)
                .delay(150)
                .onComplete(function () {
                _this.l3.setup({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 0 });
                _this.l3.value = 0;
                new TWEEN.Tween(_this.l3)
                    .to({ value: 1 }, 200)
                    .easing(TWEEN.Easing.Exponential.Out)
                    .onComplete(function () { return _this.l3.visible = false; })
                    .start();
            })
                .start();
            new TWEEN.Tween(this.l2)
                .to({ value: 0 }, 500)
                .easing(TWEEN.Easing.Exponential.Out)
                .delay(500)
                .start();
            new TWEEN.Tween(this.l1)
                .to({ value: 0 }, 1000)
                .delay(600)
                .easing(TWEEN.Easing.Exponential.Out)
                .start();
        };
        Sketch.prototype.draw = function (time) {
            this.buffer.clear();
            this.l1.update();
            this.l2.update();
            this.l3.update();
            this.l4.update();
            this.buffer.ctx.lineCap = "round";
            this.buffer.ctx.beginPath();
            this.buffer.ctx.strokeStyle = "0x000000";
            this.buffer.ctx.lineWidth = 10;
            if (this.l1.visible)
                this.drawLn(this.l1);
            if (this.l2.visible)
                this.drawLn(this.l2);
            if (this.l3.visible)
                this.drawLn(this.l3);
            if (this.l4.visible)
                this.drawLn(this.l4);
            this.buffer.ctx.stroke();
        };
        Sketch.prototype.drawLn = function (line) {
            var padding = 10;
            var width = this.buffer.width - padding * 2;
            var height = this.buffer.height - padding * 2;
            this.buffer.ctx.moveTo(line.p1.x * width + padding, line.p1.y * height + padding);
            this.buffer.ctx.lineTo(line.p2.x * width + padding, line.p2.y * height + padding);
        };
        Sketch.prototype.resize = function (windowWidth, windowHeight) {
            this.windowWidth = windowWidth;
            this.windowHeight = windowHeight;
            this.buffer.resize(windowWidth * 0.5, windowHeight * 0.5);
            anim_utils_1.AnimUtils.SetTransformMatrix(this.buffer.canvas, anim_utils_1.AnimUtils.GetTranslationMatrix(windowWidth * 0.25, windowHeight * 0.25));
        };
        return Sketch;
    }(base_sketch_1.BaseSketch));
    exports.Sketch = Sketch;
});
//# sourceMappingURL=sketch.js.map