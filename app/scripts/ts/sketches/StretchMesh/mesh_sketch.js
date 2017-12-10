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
define(["require", "exports", "./sketch"], function (require, exports, sketch_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MeshTexture = /** @class */ (function (_super) {
        __extends(MeshTexture, _super);
        function MeshTexture(canvas, sketch) {
            var _this = _super.call(this) || this;
            /* var self = this;
             LoadUtils.loadShaders(['vertex', 'fragment']).then(function (arr) {
             self.setLoaded(arr[0], arr[1]);
             });*/
            _this.setLoaded("", "");
            return _this;
        }
        MeshTexture.prototype.setLoaded = function (vertex, fragment) {
            /*this.uniforms = {
             texture: {
             type: 't',
             value: THREE.ImageUtils.loadTexture('img/mesh_texture.png')
             }
             };*/
            this.renderer = new THREE.WebGLRenderer({ alpha: true });
            this.renderer.setClearColor("#ffffff");
            this.canvas = this.renderer.domElement;
            this.el.appendChild(this.canvas);
            this.camera = new THREE.Camera();
            this.camera.position.z = 1;
            this.scene = new THREE.Scene();
            //todo figure this out
            this.geometry = new THREE.Geometry();
            //add verts
            for (var i = 0; i < this.vertices.length; i++) {
                this.geometry.vertices.push(this.vertices[i]);
            }
            //create faces/uvs
            var index = 0;
            var uvWidth = 1 / ((this.vertices.length / 2) - 1);
            for (var i = 0; i < this.vertices.length - 2; i += 2) {
                this.geometry.faces.push(new THREE.Face3(i + 0, i + 2, i + 1));
                this.geometry.faces.push(new THREE.Face3(i + 2, i + 3, i + 1));
                var left = uvWidth * i / 2;
                this.geometry.faceVertexUvs[0].push([new THREE.Vector2(left, 0), new THREE.Vector2(left + uvWidth, 0), new THREE.Vector2(left, 1)]);
                this.geometry.faceVertexUvs[0].push([new THREE.Vector2(left + uvWidth, 0), new THREE.Vector2(left + uvWidth, 1), new THREE.Vector2(left, 1)]);
            }
            this.geometry.computeFaceNormals();
            var map = new THREE.TextureLoader().load("scripts/ts/sketches/StretchMesh/img/red_bar.png");
            map.minFilter = THREE.LinearFilter;
            this.material = new THREE.MeshBasicMaterial({
                map: map
            });
            this.material.transparent = true;
            this.material.depthWrite = false;
            this.material.alphaTest = 0.5;
            this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial({
                map: map
            }));
            this.scene.add(this.mesh);
        };
        MeshTexture.prototype.resize = function (w, h) {
            _super.prototype.resize.call(this, w, h);
            this.renderer.setSize(w, h);
        };
        MeshTexture.prototype.draw = function (time) {
            _super.prototype.draw.call(this, time);
            this.update(time);
            this.geometry.verticesNeedUpdate = true;
            this.renderer.render(this.scene, this.camera);
        };
        return MeshTexture;
    }(sketch_1.Sketch));
    exports.MeshTexture = MeshTexture;
});
//# sourceMappingURL=mesh_sketch.js.map