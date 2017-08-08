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
define(["require", "exports", "../../common/BaseSketch", "./shadow_mesh", "../../utils/load_utils"], function (require, exports, BaseSketch_1, shadow_mesh_1, load_utils_1) {
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
            load_utils_1.LoadUtils.LoadShaders(['../../scripts/ts/sketches/OrthoPanelsGLSketch/vert.glsl',
                '../../scripts/ts/sketches/OrthoPanelsGLSketch/frag.glsl',
                "../../scripts/ts/sketches/OrthoPanelsGLSketch/shadow_frag.glsl"]).then(function (src) {
                _this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
                _this.renderer.setClearColor(0x000000, 0);
                _this.renderer.setSize(window.innerWidth, window.innerHeight);
                _this.el.appendChild(_this.renderer.domElement);
                _this.camera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, -500, 1000);
                _this.camera.updateMatrix();
                _this.scene = new THREE.Scene();
                _this.light = new THREE.DirectionalLight(0xffffff, 1);
                _this.light.position.set(-2, 3, 4);
                _this.light.lookAt(_this.scene.position);
                _this.scene.add(_this.light);
                _this.backPlane = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
                var mesh = new THREE.Mesh(_this.backPlane, new THREE.MeshBasicMaterial({ color: 0xff0000 }));
                _this.scene.add(mesh);
                var material = new THREE.RawShaderMaterial({
                    fragmentShader: src[1],
                    vertexShader: src[0],
                    uniforms: {
                        color: { value: new THREE.Color(0xffff00) }
                    }
                });
                _this.plane1 = new THREE.PlaneGeometry(200, 400);
                _this.mesh1 = new THREE.Mesh(_this.plane1, material);
                _this.mesh1.position.set(-100, -100, 20);
                _this.scene.add(_this.mesh1);
                _this.plane2 = new THREE.PlaneGeometry(400, 200);
                var material = material.clone();
                material.uniforms.color.value = new THREE.Color(0X00ff00);
                _this.mesh2 = new THREE.Mesh(_this.plane2, material.clone());
                _this.mesh2.position.set(-40, 100, 30);
                _this.scene.add(_this.mesh2);
                var shadowMaterial = new THREE.RawShaderMaterial({
                    fragmentShader: src[2],
                    vertexShader: src[0],
                    transparent: true,
                    depthWrite: false
                });
                _this.planeShadow1 = new shadow_mesh_1.ShadowMesh(_this.mesh1, shadowMaterial);
                _this.scene.add(_this.planeShadow1);
                _this.planeShadow2 = new shadow_mesh_1.ShadowMesh(_this.mesh2, shadowMaterial);
                _this.scene.add(_this.planeShadow2);
                _this.planeShadow3 = new shadow_mesh_1.ShadowMesh(_this.mesh2, shadowMaterial);
                _this.scene.add(_this.planeShadow3);
            });
            return _this;
        }
        Sketch.prototype.draw = function (time) {
            if (this.renderer) {
                this.plane1.vertices[1].x += Math.sin(time * 0.001) * 1;
                this.plane1.verticesNeedUpdate = true;
                this.mesh2.position.setY(Math.sin(time * 0.001) * 20);
                this.mesh2.matrixWorldNeedsUpdate = true;
                this.renderer.clear();
                var normalVector = new THREE.Vector3(0, 0, 1);
                var planeConstant = 0.1; // this value must be slightly higher than the groundMesh's y position of 0.0
                var groundPlane = new THREE.Plane(normalVector, planeConstant);
                var position = new THREE.Vector4(this.light.position.x, this.light.position.y, this.light.position.z, 0.001);
                this.planeShadow1.update(groundPlane, position);
                this.planeShadow2.update(groundPlane, position);
                this.planeShadow3.update(new THREE.Plane(normalVector, 20.1), position);
                this.renderer.render(this.scene, this.camera);
            }
        };
        Sketch.prototype.resize = function (windowWidth, windowHeight) {
            this.windowWidth = windowWidth;
            this.windowHeight = windowHeight;
            if (this.renderer)
                this.renderer.setSize(window.innerWidth, window.innerHeight);
        };
        return Sketch;
    }(BaseSketch_1.BaseSketch));
    exports.Sketch = Sketch;
});
//# sourceMappingURL=sketch.js.map