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
define(["require", "exports", "../../common/base_sketch", "../../common/canvas_buffer2d"], function (require, exports, base_sketch_1, canvas_buffer2d_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by kev on 15-10-26.
     */
    var Sketch = /** @class */ (function (_super) {
        __extends(Sketch, _super);
        function Sketch() {
            var _this = _super.call(this) || this;
            _this.buffer = new canvas_buffer2d_1.CanvasBuffer2D();
            _this.buffer.resize(window.innerWidth, window.innerHeight);
            _this.headPos = new THREE.Vector2(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
            _this.body = [];
            _this.body.push(_this.headPos);
            _this.vertices = [];
            var vertCount = 0;
            _this.speed = new THREE.Vector2();
            var clone = _this.headPos.clone();
            for (var i = 0; i < 50; i++) {
                _this.body.push(_this.headPos.clone());
                _this.vertices.push(new THREE.Vector3());
                _this.vertices.push(new THREE.Vector3());
            }
            _this.acceleration = new THREE.Vector2();
            _this.triangles = [];
            return _this;
        }
        Sketch.prototype.checkCollisions = function () {
            var desired = new THREE.Vector2();
            if (this.headPos.x <= 25) {
                desired.x = 20;
            }
            else if (this.headPos.x >= this.buffer.width - 25) {
                desired.x = -20;
            }
            if (this.headPos.y <= 0) {
                desired.y = 20;
            }
            else if (this.headPos.y >= this.buffer.height - 25) {
                desired.y = -20;
            }
            return desired;
        };
        Sketch.prototype.draw = function (time) {
            this.update(time);
            this.drawVerts();
            return _super.prototype.draw.call(this, time);
        };
        Sketch.prototype.update = function (time) {
            this.updateHead(time);
            this.updateBody();
            this.updateVerts();
        };
        Sketch.prototype.updateHead = function (time) {
            var desiredVelocity = this.checkCollisions().normalize();
            var noise = new THREE.Vector2(Math.sin(time * 0.0001), Math.cos(time * 0.0001)).multiplyScalar(0.001);
            this.acceleration = noise.add(desiredVelocity).multiplyScalar(5);
            //limit force
            this.limit(this.acceleration, 0.1);
            this.speed.add(this.acceleration);
            //limit speed
            this.limit(this.speed, 14);
            this.headPos.add(this.speed);
        };
        Sketch.prototype.updateBody = function () {
            var previous = this.headPos;
            for (var i = 1; i < this.body.length; i++) {
                var node = this.body[i];
                var next = node.clone().lerp(previous, 0.1);
                var distance = next.clone().sub(node).length();
                if (distance > 20) {
                    this.body[i] = next.add(next.clone().normalize().multiplyScalar(20));
                }
                else
                    this.body[i] = next;
                previous = this.body[i];
            }
        };
        Sketch.prototype.updateVerts = function () {
            var width = 40;
            var perp;
            var a1, v;
            var vertCount = 0;
            for (var i = 0; i < this.body.length - 1; i++) {
                var node = this.body[i];
                var next = this.body[i + 1];
                perp = new THREE.Vector2(node.y - next.y, -(node.x - next.x));
                perp.normalize();
                //update verts
                a1 = new THREE.Vector2(node.x + perp.x * width, node.y + perp.y * width);
                v = this.vertices[vertCount++];
                v.x = (a1.x / this.buffer.width) * 2 - 1;
                v.y = (1 - a1.y / this.buffer.height) * 2 - 1;
                a1 = new THREE.Vector2(node.x + perp.x * -width, node.y + perp.y * -width);
                v = this.vertices[vertCount++];
                v.x = (a1.x / this.buffer.width) * 2 - 1;
                v.y = (1 - a1.y / this.buffer.height) * 2 - 1;
            }
        };
        Sketch.prototype.drawVerts = function () {
            this.buffer.clear();
            this.buffer.ctx.strokeStyle = "#ff0000";
            this.buffer.ctx.beginPath();
            var width = 40;
            var a1, a2, b1, b2, triangle;
            var vertCount = 0;
            while (vertCount < this.vertices.length) {
                a1 = b1 || this.vertices[vertCount++];
                a2 = b2 || this.vertices[vertCount++];
                b1 = this.vertices[vertCount++];
                b2 = this.vertices[vertCount++];
                triangle = [a1, a2, b2];
                this.drawTriangle(this.buffer.ctx, triangle);
                triangle = [a1, b2, b1];
                this.drawTriangle(this.buffer.ctx, triangle);
            }
            this.buffer.ctx.stroke();
        };
        Sketch.prototype.drawTriangle = function (ctx, triangle) {
            var first = true;
            var v;
            for (var j = 0; j < 3; j++) {
                v = triangle[j];
                if (first) {
                    first = false;
                    ctx.moveTo((v.x + 1) * 0.5 * this.buffer.width, (-v.y + 1) * 0.5 * this.buffer.height);
                }
                else {
                    ctx.lineTo((v.x + 1) * 0.5 * this.buffer.width, (-v.y + 1) * 0.5 * this.buffer.height);
                }
            }
            v = triangle[0];
            ctx.lineTo((v.x + 1) * 0.5 * this.buffer.width, (-v.y + 1) * 0.5 * this.buffer.height);
        };
        Sketch.prototype.limit = function (vector, max) {
            if (vector.length() > max) {
                vector.normalize().multiplyScalar(max);
            }
        };
        return Sketch;
    }(base_sketch_1.BaseSketch));
    exports.Sketch = Sketch;
});
//# sourceMappingURL=sketch.js.map