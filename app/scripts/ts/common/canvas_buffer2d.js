define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by kev on 2016-05-18.
     */
    var CanvasBuffer2D = /** @class */ (function () {
        function CanvasBuffer2D() {
            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext("2d");
        }
        CanvasBuffer2D.prototype.resize = function (w, h) {
            if (w !== this.width || h !== this.height) {
                this.canvas.width = this.width = w;
                this.canvas.height = this.height = h;
            }
        };
        CanvasBuffer2D.prototype.clear = function () {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        };
        //for debug!
        CanvasBuffer2D.prototype.fill = function (color) {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(0, 0, this.width, this.height);
        };
        return CanvasBuffer2D;
    }());
    exports.CanvasBuffer2D = CanvasBuffer2D;
});
//# sourceMappingURL=canvas_buffer2d.js.map