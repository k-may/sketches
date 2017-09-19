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
define(["require", "exports", "./plane", "../../common/base_sketch", "../../utils/load_utils"], function (require, exports, plane_1, base_sketch_1, load_utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Sketch = (function (_super) {
        __extends(Sketch, _super);
        function Sketch() {
            var _this = _super.call(this) || this;
            _this.windowWidth = 0;
            _this.windowHeight = 0;
            _this.counter = 0;
            load_utils_1.LoadUtils.LoadShaders(["../../scripts/ts/sketches/TrianglesTransitionSketch/frag1.glsl",
                "../../scripts/ts/sketches/TrianglesTransitionSketch/frag2.glsl",
                "../../scripts/ts/sketches/TrianglesTransitionSketch/vert1.glsl",
                "../../scripts/ts/sketches/TrianglesTransitionSketch/vert2.glsl"]).then(function (src) {
                _this.handleLoad(src);
            });
            return _this;
        }
        Sketch.prototype.draw = function (time) {
            if (this.renderer) {
                this.renderer.clear();
                this.renderMaterial.uniforms["time"].value = time;
                this.updateBottomLine();
                this.renderer.render(this.renderScene, this.camera, this.renderTexture, true);
                this.material.uniforms["time"].value = time;
                this.renderer.render(this.scene, this.camera);
            }
        };
        Sketch.prototype.updateBottomLine = function () {
            this.planes.forEach(function (plane) {
                plane.update();
            });
        };
        Sketch.prototype.resize = function (windowWidth, windowHeight) {
            this.windowWidth = windowWidth;
            this.windowHeight = windowHeight;
            if (this.renderer) {
                this.renderer.setSize(windowWidth, windowHeight);
            }
            if (this.renderTexture)
                this.renderTexture.setSize(windowWidth, windowHeight);
        };
        //------------------------------------------------------
        Sketch.prototype.handleLoad = function (src) {
            this.renderer = new THREE.WebGLRenderer({ alpha: true });
            this.renderer.setClearColor(0x000000, 0);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.el.appendChild(this.renderer.domElement);
            this.camera = new THREE.Camera();
            this.renderScene = new THREE.Scene();
            this.renderTexture = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBAFormat
            });
            this.renderMaterial = new THREE.RawShaderMaterial({
                uniforms: { time: { value: 0 } },
                vertexShader: src[3],
                fragmentShader: src[1]
            });
            var count = 10;
            var distance = window.innerWidth / window.innerHeight * (2 / count);
            this.planes = [];
            for (var i = 0; i < count; i++) {
                var l = { x: -1 + i * 2 / count, y: 1 };
                var r = { x: l.x + 2 / count, y: 1 };
                var plane = new plane_1.Plane(l, r, distance);
                this.planes.push(plane);
                var mesh = new THREE.Mesh(plane.renderPlane, this.renderMaterial);
                this.renderScene.add(mesh);
            }
            //set up rendered scene...
            this.scene = new THREE.Scene();
            this.material = new THREE.RawShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    texture: { value: this.renderTexture.texture },
                    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
                },
                vertexShader: src[2],
                fragmentShader: src[0]
            });
            this.material.transparent = true;
            this.material.alphaTest = 0;
            this.material.depthWrite = false;
            var planeBuffer = new THREE.PlaneBufferGeometry(2, 2);
            this.mesh = new THREE.Mesh(planeBuffer, this.material);
            this.scene.add(this.mesh);
        };
        return Sketch;
    }(base_sketch_1.BaseSketch));
    exports.Sketch = Sketch;
});
//# sourceMappingURL=TrianglesTransitionSketch.js.map