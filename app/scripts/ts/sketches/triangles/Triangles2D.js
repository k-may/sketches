var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./Col", "../../common/BaseSketch", "../../common/CanvasBuffer2D"], function (require, exports, Col, BaseSketch, CanvasBuffer2D) {
    "use strict";
    /**
     * Created by kev on 2016-05-18.
     */
    var Triangles2D = (function (_super) {
        __extends(Triangles2D, _super);
        function Triangles2D(div) {
            _super.call(this);
            this.windowWidth = 0;
            this.windowHeight = 0;
            this.size = 20;
            this.res = 50;
            var num = 100;
            this.cols1 = [];
            for (var i = 0; i < num; i++) {
                this.cols1.push(new Col(this.size));
            }
            this.cols2 = [];
            for (var i = 0; i < num; i++) {
                this.cols2.push(new Col(this.size));
            }
            this.buffer1 = new CanvasBuffer2D();
            this.buffer2 = new CanvasBuffer2D();
            /*
    
             div.appendChild(this.buffer1.canvas);
             div.appendChild(this.buffer2.canvas);
             */
            this.addBuffer(div, this.buffer1);
            this.addBuffer(div, this.buffer2);
            this.buffer2.canvas.style.opacity = "0.7";
        }
        Triangles2D.prototype.addBuffer = function (div, b) {
            div.appendChild(b.canvas);
            b.canvas.style.position = "absolute";
            b.canvas.style.top = 0;
        };
        Triangles2D.prototype.draw = function (time) {
            //this.buffer.clear();
            this.drawBuffer1();
            this.drawBuffer2();
        };
        Triangles2D.prototype.drawBuffer1 = function () {
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
                }
                this.cols1[i].update();
                this.cols1[i].draw(this.buffer1);
                this.buffer1.ctx.fill();
                this.buffer1.ctx.restore();
            }
        };
        Triangles2D.prototype.drawBuffer2 = function () {
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
                }
                this.cols2[i].update();
                this.cols2[i].draw(this.buffer2);
                this.buffer2.ctx.fill();
                this.buffer2.ctx.restore();
            }
        };
        Triangles2D.prototype.resize = function (windowWidth, windowHeight) {
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
        return Triangles2D;
    }(BaseSketch));
    return Triangles2D;
});
//# sourceMappingURL=Triangles2D.js.map