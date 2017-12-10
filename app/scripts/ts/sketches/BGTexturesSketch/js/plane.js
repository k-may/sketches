define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Plane = /** @class */ (function () {
        function Plane(material) {
            var _this = this;
            this.done = false;
            this.offsetTime = Math.random() * 1000;
            this.scale = Math.random();
            var size = 50;
            var w = window.innerWidth;
            var h = window.innerHeight;
            this.geometry = new THREE.PlaneGeometry(size, size);
            var rX = Math.floor(window.innerWidth / size);
            var rY = Math.floor(window.innerHeight / size);
            // if (Math.random() > 0.5)
            this.geometry.rotateZ(Math.floor(Math.random() / .25) * 90 * Math.PI / 180.0);
            this.position = new THREE.Vector2(Math.floor(Math.random() * rX - rX / 2) * size, Math.floor(Math.random() * rY - rY / 2) * size);
            this.geometry.translate(this.position.x, this.position.y, 0);
            this.geometry.verticesNeedUpdate = true;
            this.verts = [];
            this.geometry.vertices.forEach(function (vert) { return _this.verts.push(vert.clone()); });
            var choice = Math.floor(Math.random() / 0.25);
            if (choice == 0 || choice == 1)
                this.method2();
            else
                this.method4();
            this.startVerts = [];
            this.geometry.vertices.forEach(function (vert) { return _this.startVerts.push(vert.clone()); });
            this.mesh = new THREE.Mesh(this.geometry, material);
        }
        Plane.prototype.update = function (time) {
            var _this = this;
            var value = (Math.sin(time * 0.001 + this.offsetTime) + 1.0) / 2.0; // + 0.5;
            this.geometry.vertices.forEach(function (v, i) {
                v.x = _this.startVerts[i].x + (_this.verts[i].x - _this.startVerts[i].x) * value;
                v.y = _this.startVerts[i].y + (_this.verts[i].y - _this.startVerts[i].y) * value;
            });
            this.geometry.translate(-this.position.x, 0, 0);
            this.geometry.scale(0.999, 1, 1);
            this.geometry.translate(this.position.x, 0, 0);
            this.geometry.verticesNeedUpdate = true;
        };
        Plane.prototype.method1 = function () {
            var _this = this;
            this.geometry.vertices.forEach(function (v, i) {
                if (Math.floor(i / 2) == 0) {
                    v.x = _this.geometry.vertices[i + 2].x;
                    v.y = _this.geometry.vertices[i + 2].y;
                }
            });
        };
        Plane.prototype.method2 = function () {
            var _this = this;
            this.geometry.vertices.forEach(function (v, i) {
                if (Math.floor(i / 2) == 1) {
                    v.x = _this.geometry.vertices[i - 2].x;
                    v.y = _this.geometry.vertices[i - 2].y;
                }
            });
        };
        Plane.prototype.method3 = function () {
            var _this = this;
            this.geometry.vertices.forEach(function (v, i) {
                if (Math.floor(i % 2) == 0) {
                    v.x = _this.geometry.vertices[i + 1].x;
                    v.y = _this.geometry.vertices[i + 1].y;
                }
            });
        };
        Plane.prototype.method4 = function () {
            var _this = this;
            this.geometry.vertices.forEach(function (v, i) {
                if (Math.floor(i % 2) == 1) {
                    v.x = _this.geometry.vertices[i - 1].x;
                    v.y = _this.geometry.vertices[i - 1].y;
                }
            });
        };
        Plane.prototype.reset = function () {
        };
        return Plane;
    }());
    exports.Plane = Plane;
});
//# sourceMappingURL=plane.js.map