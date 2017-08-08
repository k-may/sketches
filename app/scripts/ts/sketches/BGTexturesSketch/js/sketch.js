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
define(["require", "exports", "three", "./plane", "../../../common/BaseSketch", "../../../utils/load_utils"], function (require, exports, THREE, plane_1, BaseSketch_1, load_utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by kev on 16-02-08.
     */
    var Sketch = (function (_super) {
        __extends(Sketch, _super);
        function Sketch(div) {
            var _this = _super.call(this) || this;
            _this.windowWidth = 0;
            _this.windowHeight = 0;
            load_utils_1.LoadUtils.LoadShaders(['scripts/ts/sketches/BgTexturesSketch/frag.glsl',
                'scripts/ts/sketches/BgTexturesSketch/vert.glsl'])
                .then(function (src) {
                _this.renderer = new THREE.WebGLRenderer({ alpha: true });
                _this.renderer.setClearColor(0x000000, 0);
                _this.el.appendChild(_this.renderer.domElement);
                _this.camera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, -500, 1000);
                _this.camera.updateMatrix();
                _this.scene = new THREE.Scene();
                _this.material = new THREE.RawShaderMaterial({
                    fragmentShader: src[0],
                    vertexShader: src[1],
                    uniforms: {
                        time: { value: 0 },
                        resolution: {
                            value: new THREE.Vector2(window.innerWidth, window.innerHeight)
                        }
                    },
                    depthTest: false,
                    transparent: true
                });
                _this.material.alphaTest = 0.5;
                _this.planes = [];
                var planeCount = 250;
                for (var i = 0; i < planeCount; i++) {
                    var plane = new plane_1.Plane(_this.material);
                    _this.scene.add(plane.mesh);
                    _this.planes.push(plane);
                }
                _this.loaded = true;
                _this.resize(window.innerWidth, window.innerHeight);
            });
            return _this;
        }
        Sketch.prototype.draw = function (time) {
            if (this.loaded) {
                this.planes.forEach(function (plane) { return plane.update(time); });
                this.material.uniforms["time"].value = time;
                this.renderer.clear();
                this.renderer.render(this.scene, this.camera);
            }
        };
        Sketch.prototype.resize = function (windowWidth, windowHeight) {
            if (!this.loaded)
                return;
            this.windowWidth = windowWidth;
            this.windowHeight = windowHeight;
            this.renderer.setSize(windowWidth, windowHeight);
            this.material.uniforms["resolution"].value = new THREE.Vector2(windowWidth, windowHeight);
        };
        return Sketch;
    }(BaseSketch_1.BaseSketch));
    exports.Sketch = Sketch;
});
//# sourceMappingURL=sketch.js.map