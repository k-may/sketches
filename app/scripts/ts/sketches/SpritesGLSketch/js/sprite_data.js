define(["require", "exports", "../../../utils/load_utils"], function (require, exports, load_utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by kevin.mayo on 8/4/2017.
     */
    var SpriteData = (function () {
        //----------------------------------------------------------
        function SpriteData(name, frag, vert) {
            this.frameCounter = 0;
            this.name = name;
            this.frag = frag;
            this.vert = vert;
        }
        //----------------------------------------------------------
        SpriteData.prototype.load = function () {
            var _this = this;
            return new Promise(function (resolve) {
                _this.texture = new THREE.TextureLoader().load(_this.name + ".png");
                _this.promise = load_utils_1.LoadUtils.LoadAJAX(_this.name + ".json").then(function (json) {
                    _this.json = json;
                    var sourceSize = _this.json.frames[0].sourceSize;
                    var imageSize = _this.json.meta.size;
                    var spriteSize = new THREE.Vector2(sourceSize.w / imageSize.w, sourceSize.h / imageSize.h);
                    _this.material = new THREE.RawShaderMaterial({
                        fragmentShader: _this.frag,
                        vertexShader: _this.vert,
                        uniforms: {
                            time: { value: 0 },
                            uvOffset: { value: new THREE.Vector2() },
                            spriteSize: { value: spriteSize },
                            texture: { value: _this.texture },
                            resolution: {
                                value: new THREE.Vector2(sourceSize.w, sourceSize.h)
                            },
                            color: {
                                value: new THREE.Color(0x000000)
                            }
                        },
                        depthTest: false,
                        transparent: true
                    });
                    resolve(_this);
                });
            });
        };
        SpriteData.prototype.update = function (time) {
            var frame = Math.floor(this.frameCounter++);
            var currentFrame = this.json.frames[frame % this.json.frames.length];
            this.material.uniforms["uvOffset"].value = new THREE.Vector2(currentFrame.frame.x / this.json.meta.size.w, 1.0 - currentFrame.frame.y / this.json.meta.size.h);
            this.material.uniforms["time"].value = time;
        };
        return SpriteData;
    }());
    exports.SpriteData = SpriteData;
});
//# sourceMappingURL=sprite_data.js.map