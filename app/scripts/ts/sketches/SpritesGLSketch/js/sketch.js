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
define(["require", "exports", "../../../common/base_sketch", "./sprite_data", "./sprite_plane", "../../../utils/load_utils"], function (require, exports, base_sketch_1, sprite_data_1, sprite_plane_1, load_utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by kev on 16-02-08.
     */
    var Sketch = (function (_super) {
        __extends(Sketch, _super);
        //------------------------------------------------------
        function Sketch(div) {
            var _this = _super.call(this) || this;
            _this.windowWidth = 0;
            _this.windowHeight = 0;
            _this.frameCounter = 0;
            load_utils_1.LoadUtils.LoadShaders(['scripts/ts/sketches/SpritesGLSketch/frag.glsl',
                'scripts/ts/sketches/SpritesGLSketch/vert.glsl'])
                .then(function (src) {
                _this.setup(src);
            });
            return _this;
        }
        //------------------------------------------------------
        Sketch.prototype.setup = function (src) {
            this.renderer = new THREE.WebGLRenderer({ alpha: true });
            this.renderer.setClearColor(0x000000, 0);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.el.appendChild(this.renderer.domElement);
            this.camera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, -500, 1000);
            this.camera.updateMatrix();
            this.scene = new THREE.Scene();
            this.setupSprites(src);
            this.resize(window.innerWidth, window.innerHeight);
        };
        Sketch.prototype.setupSprites = function (src) {
            var _this = this;
            this.spritePlanes = [];
            var promises = [];
            //*note : its much much faster to share materials!
            var textures = ["scripts/ts/sketches/SpritesGLSketch/doodle1",
                "scripts/ts/sketches/SpritesGLSketch/doodle2",
                "scripts/ts/sketches/SpritesGLSketch/doodle3",
                "scripts/ts/sketches/SpritesGLSketch/doodle4"];
            textures.forEach(function (texture) {
                var data = new sprite_data_1.SpriteData(texture, src[0], src[1]);
                promises.push(data.load());
            });
            Promise.all(promises).then(function (spriteData) {
                _this.spriteData = spriteData;
                for (var i = 0; i < 1000; i++) {
                    var data = spriteData[i % spriteData.length];
                    var plane = new sprite_plane_1.SpritePlane(data);
                    var mesh = plane.mesh;
                    mesh.position.x = Math.random() * window.innerWidth - window.innerWidth / 2;
                    mesh.position.y = Math.random() * window.innerHeight - window.innerHeight / 2;
                    _this.scene.add(plane.mesh);
                    _this.spritePlanes.push(plane);
                }
            });
        };
        Sketch.prototype.draw = function (time) {
            if (this.renderer) {
                this.renderer.clear();
                if (this.spriteData)
                    this.spriteData.forEach(function (sD) { return sD.update(time); });
                this.renderer.render(this.scene, this.camera);
            }
        };
        Sketch.prototype.resize = function (windowWidth, windowHeight) {
            this.windowWidth = windowWidth;
            this.windowHeight = windowHeight;
        };
        return Sketch;
    }(base_sketch_1.BaseSketch));
    exports.Sketch = Sketch;
});
//# sourceMappingURL=sketch.js.map