/**
 * Created by kev on 2016-05-18.
 */
///<reference path="../../../../typings/globals/three/index.d.ts"/>
define(["require", "exports", "three", "./three/UniformF", "./three/UniformV2", "../utils/LoadUtils", "underscore"], function (require, exports, THREE, UniformF, UniformV2, LoadUtils, _) {
    "use strict";
    var ShaderData = (function () {
        function ShaderData(fragmentID, vertexID, uniforms) {
            this.fragmentShader = "";
            this.vertexShader = "";
            this.ready = false;
            this.width = 0;
            this.height = 0;
            this.time = 0;
            this.fragmentID = fragmentID;
            this.vertexID = vertexID;
            uniforms = uniforms || {};
            this.uniforms = _.extend(uniforms, {
                time: new UniformF(),
                resolution: new UniformV2(),
                mouse: new UniformV2()
            });
        }
        ShaderData.prototype.start = function () {
            var self = this;
            var vertexPath = "glsl/" + self.vertexID + ".glsl";
            var fragmentPath = "glsl/" + self.fragmentID + ".glsl";
            return LoadUtils.LoadShaders([vertexPath, fragmentPath]).then(function (shaders) {
                self.vertexShader = shaders[0];
                self.fragmentShader = shaders[1];
                self.createMaterial();
            }).catch(function (e) {
                console.log(e.stack);
            });
        };
        ShaderData.prototype.createMaterial = function () {
            this.camera = new THREE.Camera();
            this.camera.position.z = 1;
            this.scene = new THREE.Scene();
            this.material = new THREE.RawShaderMaterial({
                uniforms: this.uniforms,
                vertexShader: this.vertexShader,
                fragmentShader: this.fragmentShader
            });
            this.material.needsUpdate = true;
            if (!this.mesh) {
                var geometry = new THREE.PlaneGeometry(2, 2);
                //geometry.//dynamic = true;
                this.mesh = new THREE.Mesh(geometry);
            }
            this.mesh.material = this.material;
            this.scene.add(this.mesh);
            this.ready = true;
        };
        ShaderData.prototype.update = function (time, w, h, mx, my) {
            // console.log(this.time);
            this.uniforms.time.value = this.time += 0.05;
            this.uniforms.resolution.value.x = w;
            this.uniforms.resolution.value.y = h;
            if (mx && my) {
                this.uniforms.mouse.value.x = mx / w;
                this.uniforms.mouse.value.y = my / h;
            }
        };
        ShaderData.prototype.render = function (renderer) {
            renderer.render(this.scene, this.camera);
        };
        return ShaderData;
    }());
    return ShaderData;
});
//# sourceMappingURL=ShaderData.js.map