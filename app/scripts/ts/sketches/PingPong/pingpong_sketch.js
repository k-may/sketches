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
define(["require", "exports", "../../common/base_sketch", "../../utils/load_utils"], function (require, exports, base_sketch_1, load_utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Vector4 = THREE.Vector4;
    /**
     * Created by kevin.mayo on 8/15/2017.
     */
    var PingPongData = (function () {
        function PingPongData(fragmentShader, vertexShader) {
            this.time = Math.random();
            this.offset = Math.random();
            this.src = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBAFormat
            });
            this.src.depthBuffer = false;
            this.dest = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBAFormat
            });
            this.dest.depthBuffer = false;
            this.color = new THREE.Vector3(Math.random(), Math.random(), Math.random());
            /*  var val = this.color.dot(new THREE.Vector3(0.3, 0.4, 0.5));
              this.color = new THREE.Vector3(val, val, val);
          */
            this.material = new THREE.RawShaderMaterial({
                fragmentShader: fragmentShader,
                vertexShader: vertexShader,
                uniforms: {
                    rTexture: {
                        type: "t",
                        value: this.src.texture
                    },
                    uOffset: {
                        value: Math.random() * 10000,
                    }
                },
                transparent: true,
                depthTest: false
            });
            this.material.blending = THREE.CustomBlending;
            this.material.blendSrc = THREE.SrcAlphaFactor;
            this.material.blendDst = THREE.OneMinusDstColorFactor;
            this.material.blendEquation = THREE.MaxEquation;
            var plane = new THREE.PlaneGeometry(2, 2);
            this.mesh = new THREE.Mesh(plane, this.material);
            this.scene = new THREE.Scene();
            this.scene.add(this.mesh);
        }
        PingPongData.prototype.render = function (renderer, camera, scene) {
            this.swap();
            // renderer.setClearColor(0xffffff, 0);
            renderer.clearTarget(this.dest, true, true, true);
            renderer.render(scene, camera, this.dest, false);
            renderer.render(this.scene, camera, this.dest, false);
        };
        PingPongData.prototype.resize = function (w, h) {
            this.src.setSize(w, h);
            this.dest.setSize(w, h);
        };
        PingPongData.prototype.swap = function () {
            var temp = this.dest;
            this.dest = this.src;
            this.src = temp;
            this.material.uniforms["rTexture"].value = this.src.texture;
        };
        return PingPongData;
    }());
    //======================================================
    var Sketch = (function (_super) {
        __extends(Sketch, _super);
        //------------------------------------------------------
        function Sketch() {
            var _this = _super.call(this) || this;
            _this.loaded = false;
            _this.initialize();
            return _this;
        }
        //------------------------------------------------------
        Sketch.prototype.draw = function (time) {
            _super.prototype.draw.call(this, time);
            if (this.loaded) {
                this.renderer.clear();
                for (var i = 0; i < this.pingPongs.length; i++) {
                    var pingPong = this.pingPongs[i];
                    this.circleMaterial.uniforms["time"].value = pingPong.time += 30;
                    this.circleMaterial.uniforms["uColor"].value = pingPong.color;
                    this.circleMaterial.uniforms["uOffset"].value = pingPong.offset;
                    // this.renderer.clearDepth();
                    pingPong.render(this.renderer, this.camera, this.circleScene);
                    this.renderer.clearDepth();
                    this.renderMaterial.uniforms["uTexture"].value = pingPong.dest.texture;
                    this.renderer.render(pingPong.scene, this.camera);
                }
            }
        };
        Sketch.prototype.resize = function (w, h) {
            if (this.loaded) {
                for (var i = 0; i < this.pingPongs.length; i++) {
                    this.pingPongs[i].resize(w, h);
                }
                this.renderer.setSize(w, h);
            }
            return _super.prototype.resize.call(this, w, h);
        };
        //------------------------------------------------------
        Sketch.prototype.initialize = function () {
            var _this = this;
            load_utils_1.LoadUtils.LoadShaders(['scripts/ts/sketches/PingPong/ppFrag.glsl',
                'scripts/ts/sketches/PingPong/vert.glsl',
                'scripts/ts/sketches/PingPong/circleFrag.glsl',
                'scripts/ts/sketches/PingPong/frag.glsl',]).then(function (src) {
                _this.pingPongs = [];
                for (var i = 0; i < 500; i++) {
                    var pingPong = new PingPongData(src[0], src[1]);
                    _this.pingPongs.push(pingPong);
                }
                _this.renderer = new THREE.WebGLRenderer({ alpha: true });
                _this.renderer.setPixelRatio(window.devicePixelRatio);
                _this.renderer.setSize(window.innerWidth, window.innerHeight);
                _this.renderer.setClearColor(0xffffff, 0);
                _this.renderer.autoClear = false;
                var gl = _this.renderer.getContext();
                // gl.disable(gl.BLEND);
                _this.el.appendChild(_this.renderer.domElement);
                _this.camera = new THREE.Camera();
                _this.setupCircleScene(src);
                _this.setupRenderScene(src);
                _this.loaded = true;
                _this.resize(window.innerWidth, window.innerHeight);
            });
        };
        Sketch.prototype.setupRenderScene = function (src) {
            this.renderMaterial = new THREE.RawShaderMaterial({
                fragmentShader: src[3],
                vertexShader: src[1],
                uniforms: {
                    uTexture: {
                        type: 't',
                        value: null
                    }
                }
            });
            this.renderMaterial.depthWrite = false;
            this.renderMaterial.transparent = true;
            this.renderMaterial.blending = THREE.MultiplyBlending;
            this.renderMaterial.blending = THREE.NoBlending;
            /*  this.renderMaterial.blendSrc = THREE.SrcAlphaFactor;
              this.renderMaterial.blendDst = THREE.OneMinusDstColorFactor;
              this.renderMaterial.blendEquation = THREE.MinEquation;*/
            var pBG = new THREE.PlaneGeometry(2, 2);
            this.mesh = new THREE.Mesh(pBG, this.renderMaterial);
            this.scene = new THREE.Scene();
            this.scene.add(this.mesh);
        };
        Sketch.prototype.setupCircleScene = function (src) {
            this.circleScene = new THREE.Scene();
            this.circleMaterial = new THREE.RawShaderMaterial({
                fragmentShader: src[2],
                vertexShader: src[1],
                uniforms: {
                    time: {
                        value: 0
                    },
                    uColor: {
                        value: new Vector4()
                    },
                    uOffset: {
                        value: 1
                    }
                },
                transparent: true
            });
            var plane = new THREE.PlaneGeometry(2, 2);
            this.circleMesh = new THREE.Mesh(plane, this.circleMaterial);
            this.circleScene.add(this.circleMesh);
        };
        return Sketch;
    }(base_sketch_1.BaseSketch));
    exports.Sketch = Sketch;
});
//# sourceMappingURL=pingpong_sketch.js.map