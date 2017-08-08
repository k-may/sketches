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
define(["require", "exports", "../../common/BaseSketch", "./Col", "../../common/CanvasBuffer2D"], function (require, exports, BaseSketch_1, Col_1, CanvasBuffer2D_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by kev on 2016-05-18.
     */
    var Sketch = (function (_super) {
        __extends(Sketch, _super);
        function Sketch() {
            var _this = _super.call(this) || this;
            _this.windowWidth = 0;
            _this.windowHeight = 0;
            _this.size = 10;
            _this.res = 50;
            var num = 100;
            _this.cols1 = [];
            for (var i = 0; i < num; i++) {
                _this.cols1.push(new Col_1.Col(_this.size));
            }
            _this.cols2 = [];
            for (var i = 0; i < num; i++) {
                _this.cols2.push(new Col_1.Col(_this.size));
            }
            _this.buffer1 = new CanvasBuffer2D_1.CanvasBuffer2D();
            _this.buffer2 = new CanvasBuffer2D_1.CanvasBuffer2D();
            /*
    
             div.appendChild(this.buffer1.canvas);
             div.appendChild(this.buffer2.canvas);
             */
            _this.addBuffer(_this.buffer1);
            _this.addBuffer(_this.buffer2);
            _this.buffer2.canvas.style.opacity = "0.7";
            return _this;
        }
        Sketch.prototype.addBuffer = function (b) {
            this.el.appendChild(b.canvas);
            b.canvas.style.position = "absolute";
            b.canvas.style.top = "0px";
        };
        Sketch.prototype.draw = function (time) {
            this.drawBuffer1();
            this.drawBuffer2();
        };
        Sketch.prototype.drawBuffer1 = function () {
            this.buffer1.ctx.globalAlpha = 0.006;
            this.buffer1.ctx.fillStyle = "#000000";
            this.buffer1.ctx.fillRect(0, 0, this.buffer1.width, this.buffer1.height);
            this.buffer1.ctx.globalAlpha = 1;
            this.buffer1.ctx.fillStyle = "#ffffff";
            for (var i = 0; i < this.cols1.length; i++) {
                this.buffer1.ctx.save();
                this.buffer1.ctx.translate(this.res * i, 0);
                this.buffer1.ctx.beginPath();
                //  this.buffer1.ctx.fillStyle = "#eee";
                if (this.cols1[i].complete) {
                    this.cols1[i].init();
                    //this.buffer1.clear();
                }
                this.cols1[i].update();
                this.cols1[i].draw(this.buffer1);
                this.buffer1.ctx.fill();
                this.buffer1.ctx.restore();
            }
        };
        Sketch.prototype.drawBuffer2 = function () {
            this.buffer2.ctx.globalAlpha = 0.006;
            this.buffer2.ctx.fillStyle = "#000000";
            this.buffer2.ctx.fillRect(0, 0, this.buffer2.width, this.buffer2.height);
            this.buffer2.ctx.globalAlpha = 1;
            //this.buffer2.clear();
            this.buffer2.ctx.fillStyle = "#ffffff";
            for (var i = 0; i < this.cols2.length; i++) {
                this.buffer2.ctx.save();
                this.buffer2.ctx.translate(this.res * i, 0);
                this.buffer2.ctx.beginPath();
                //  this.buffer2.ctx.fillStyle = "#eee";
                if (this.cols2[i].complete) {
                    this.cols2[i].init();
                    //this.buffer2.clear();
                }
                this.cols2[i].update();
                this.cols2[i].draw(this.buffer2);
                this.buffer2.ctx.fill();
                this.buffer2.ctx.restore();
            }
        };
        Sketch.prototype.resize = function (windowWidth, windowHeight) {
            this.windowWidth = windowWidth;
            this.windowHeight = windowHeight;
            this.buffer1.resize(windowWidth, windowHeight);
            this.buffer2.resize(windowWidth, windowHeight);
            this.res = Math.ceil(windowWidth / this.cols1.length);
            for (var i = 0; i < this.cols1.length; i++) {
                this.cols1[i].size = this.res;
                this.cols1[i].init();
            }
            for (var i = 0; i < this.cols2.length; i++) {
                this.cols2[i].size = this.res;
                this.cols2[i].init();
            }
        };
        return Sketch;
    }(BaseSketch_1.BaseSketch));
    exports.Sketch = Sketch;
});
//# sourceMappingURL=sketch.js.map