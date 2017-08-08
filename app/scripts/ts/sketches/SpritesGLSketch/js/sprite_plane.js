define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by kevin.mayo on 8/3/2017.
     */
    var SpritePlane = (function () {
        //----------------------------------------------------------
        function SpritePlane(spriteData) {
            this.name = spriteData.name;
            this.spriteData = spriteData;
            this.json = this.spriteData.json;
            this.texture = this.spriteData.texture;
            this.texture = new THREE.TextureLoader().load(this.name + ".png");
            this.texture.wrapS = THREE.ClampToEdgeWrapping;
            this.texture.wrapT = THREE.ClampToEdgeWrapping;
            //scaling
            var sourceSize = this.json.frames[0].sourceSize;
            var plane = new THREE.PlaneGeometry(sourceSize.w, sourceSize.h);
            this.mesh = new THREE.Mesh(plane, this.spriteData.material);
            this.spriteData.material.uniforms["color"].value = new THREE.Color(Math.random(), Math.random(), Math.random());
        }
        return SpritePlane;
    }());
    exports.SpritePlane = SpritePlane;
});
//# sourceMappingURL=sprite_plane.js.map