define(["require", "exports", "three"], function (require, exports, THREE) {
    "use strict";
    var UniformV2 = (function () {
        function UniformV2() {
            this.value = new THREE.Vector2();
            this.type = "v2";
        }
        return UniformV2;
    }());
    return UniformV2;
});
//# sourceMappingURL=UniformV2.js.map