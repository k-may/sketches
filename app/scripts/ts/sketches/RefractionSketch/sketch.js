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
define(["require", "exports", "../../common/base_sketch", "../../utils/load_utils", "ts/sketches/RefractionSketch/OBJLoader"], function (require, exports, base_sketch_1, load_utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Sketch = /** @class */ (function (_super) {
        __extends(Sketch, _super);
        //--------------------------------------------------
        function Sketch(div) {
            var _this = _super.call(this) || this;
            _this.windowWidth = 0;
            _this.windowHeight = 0;
            _this.loaded = false;
            _this.mouseX = 0;
            _this.mouseY = 0;
            _this.path = "scripts/ts/sketches/RefractionSketch/";
            _this.divElement = div;
            _this.initialize();
            return _this;
        }
        //--------------------------------------------------
        Sketch.prototype.mouseMove = function (event) {
            var windowHalfX = window.innerWidth / 2;
            var windowHalfY = window.innerHeight / 2;
            this.mouseX = (event.clientX - windowHalfX) / 2;
            this.mouseY = (event.clientY - windowHalfY) / 2;
        };
        Sketch.prototype.draw = function (time) {
            if (this.loaded) {
                this.camera.position.x += (this.mouseX - this.camera.position.x) * .05;
                this.camera.position.y += (-this.mouseY - this.camera.position.y) * .05;
                this.camera.lookAt(this.object.position);
                this.renderer.clear();
                this.renderer.render(this.planeScene, this.planeCamera, this.renderTexture);
                this.renderer.render(this.planeScene, this.planeCamera);
                this.renderer.clearDepth();
                //this.scene.background = this.renderTexture.texture;
                this.renderer.render(this.scene, this.camera);
            }
        };
        Sketch.prototype.resize = function (windowWidth, windowHeight) {
            this.windowWidth = windowWidth;
            this.windowHeight = windowHeight;
        };
        //--------------------------------------------------
        Sketch.prototype.initialize = function () {
            var _this = this;
            this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            this.renderer.setClearColor(0x000000, 0);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.autoClear = false;
            this.el.appendChild(this.renderer.domElement);
            this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
            this.scene = new THREE.Scene();
            var ambient = new THREE.AmbientLight(0x101030);
            this.scene.add(ambient);
            var directionalLight = new THREE.DirectionalLight(0xffeedd);
            directionalLight.intensity = 0.1;
            directionalLight.position.set(0, 0, 1);
            this.scene.add(directionalLight);
            var imgLoader = new THREE.ImageLoader();
            imgLoader.load(this.path + 'textures/UV_Grid_Sm.jpg', function (image) {
                var texture = new THREE.Texture(image);
                texture.needsUpdate = true;
                _this.loadPlane(texture).then(function () {
                    _this.loadObj();
                });
            });
        };
        Sketch.prototype.loadPlane = function (texture) {
            var _this = this;
            return new Promise(function (resolve) {
                load_utils_1.LoadUtils.LoadShaders([_this.path + 'planeFrag.glsl', _this.path + 'planeVert.glsl']).then(function (src) {
                    _this.planeScene = new THREE.Scene();
                    var halfW = window.innerWidth / 2;
                    var halfH = window.innerHeight / 2;
                    _this.planeCamera = new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, -100, 1000);
                    _this.planeCamera.updateMatrix();
                    _this.plane = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
                    _this.planeMaterial = new THREE.RawShaderMaterial({
                        uniforms: {
                            uTexture1: {
                                value: texture,
                                type: 't'
                            }
                        },
                        fragmentShader: src[0],
                        vertexShader: src[1]
                    });
                    _this.planeMesh = new THREE.Mesh(_this.plane, _this.planeMaterial);
                    _this.planeScene.add(_this.planeMesh);
                    _this.renderTexture = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
                        minFilter: THREE.LinearFilter,
                        magFilter: THREE.NearestFilter,
                        format: THREE.RGBAFormat
                    });
                    resolve();
                });
            });
        };
        Sketch.prototype.loadObj = function () {
            var _this = this;
            load_utils_1.LoadUtils.LoadShaders([this.path + 'cubeFrag.glsl', this.path + 'cubeVert.glsl']).then(function (src) {
                var cubeMaterial = new THREE.RawShaderMaterial({
                    uniforms: {
                        "uTexture2": {
                            value: _this.renderTexture.texture,
                            type: "t"
                        }
                    },
                    fragmentShader: src[0],
                    vertexShader: src[1],
                    side: THREE.DoubleSide
                });
                var loader = new OBJLoader();
                loader.load(_this.path + 'CubeUV.obj', function (object) {
                    object.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            //var mat = <THREE.MeshPhongMaterial>child.material;
                            child.material = cubeMaterial;
                            child.geometry.center();
                            child.geometry.computeVertexNormals();
                        }
                    });
                    _this.object = object;
                    object.position.z = -1500;
                    var helper = new THREE.VertexNormalsHelper(object, 2, 0x00ff00, 1);
                    _this.scene.add(object);
                    _this.scene.add(helper);
                    _this.loaded = true;
                });
            });
        };
        return Sketch;
    }(base_sketch_1.BaseSketch));
    exports.Sketch = Sketch;
});
//# sourceMappingURL=sketch.js.map