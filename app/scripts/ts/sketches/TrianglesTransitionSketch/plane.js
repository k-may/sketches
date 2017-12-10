define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by kevin.mayo on 7/28/2017.
     */
    var Plane = /** @class */ (function () {
        function Plane(l, r, d) {
            this.bottomLine = { l: { x: -0.5, y: 0.5 }, r: { x: 0.5, y: 0.5 } };
            this.destBottomLine = { l: { x: -0.5, y: 0.5 }, r: { x: 0.5, y: 0.5 } };
            this.done = false;
            this.counter = 0;
            this.speed = 1 + Math.random();
            this.distance = d;
            this.bottomLine.l.x = this.destBottomLine.l.x = l.x;
            this.bottomLine.l.y = this.destBottomLine.l.y = l.y;
            this.bottomLine.r.x = this.destBottomLine.r.x = r.x;
            this.bottomLine.r.y = this.destBottomLine.r.y = r.y;
            this.renderPlane = new THREE.PlaneGeometry(1, 1);
            this.renderPlane.vertices.forEach(function (v, i) {
                v.y = i % 2 == 0 ? l.y : r.y;
                v.x = i % 2 == 0 ? l.x : r.x;
            });
            this.resetBottomLine();
        }
        Plane.prototype.update = function () {
            if (this.done)
                return;
            this.counter += this.speed;
            var ratio = this.counter / 100.0;
            if (ratio > 1) {
                ratio = 0;
                this.counter = 0;
                this.resetBottomLine();
            }
            ratio = TWEEN.Easing.Cubic.InOut(ratio);
            //lerp point
            var pt = this.lerpPoint(this.bottomLine.l, this.destBottomLine.l, ratio);
            this.renderPlane.vertices[2].x = pt.x;
            this.renderPlane.vertices[2].y = pt.y;
            pt = this.lerpPoint(this.bottomLine.r, this.destBottomLine.r, ratio);
            this.renderPlane.vertices[3].x = pt.x;
            this.renderPlane.vertices[3].y = pt.y;
            this.renderPlane.verticesNeedUpdate = true;
        };
        Plane.prototype.resetBottomLine = function () {
            this.renderPlane.vertices[2].x = this.bottomLine.l.x = this.destBottomLine.l.x;
            this.renderPlane.vertices[2].y = this.bottomLine.l.y = this.destBottomLine.l.y;
            this.renderPlane.vertices[3].x = this.bottomLine.r.x = this.destBottomLine.r.x;
            this.renderPlane.vertices[3].y = this.bottomLine.r.y = this.destBottomLine.r.y;
            var target;
            if (Math.abs(this.destBottomLine.l.y - this.destBottomLine.r.y) < this.distance * 2) {
                var next = Math.random() > 0.5 ? "l" : "r";
                if (next == "l") {
                    target = this.destBottomLine.l;
                }
                else {
                    target = this.destBottomLine.r;
                }
            }
            else {
                target = this.destBottomLine.l.y < this.destBottomLine.r.y ? this.destBottomLine.r : this.destBottomLine.l;
            }
            target.y -= this.distance;
            this.done = this.bottomLine.l.y <= -2 && this.bottomLine.r.y <= -2;
        };
        Plane.prototype.lerpPoint = function (pt, destPt, ratio) {
            return {
                x: pt.x + (destPt.x - pt.x) * ratio,
                y: pt.y + (destPt.y - pt.y) * ratio
            };
        };
        return Plane;
    }());
    exports.Plane = Plane;
});
//# sourceMappingURL=plane.js.map