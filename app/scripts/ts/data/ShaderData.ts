/**
 * Created by kev on 2016-05-18.
 */
///<reference path="../../../../typings/globals/three/index.d.ts"/>


import THREE = require("three");
import IUniform = require("./three/IUniform");
import UniformF = require("./three/UniformF");
import UniformV2 = require("./three/UniformV2");
import Shader = THREE.Shader;
import UniformT = require("./three/UniformT");
import LoadUtils = require("../utils/LoadUtils");

import _ = require('underscore');

class ShaderData {

    fragmentID:string;
    vertexID:string;

    uniforms:any;

    scene:THREE.Scene;
    camera:THREE.Camera;
    mesh:THREE.Mesh;
    material:THREE.ShaderMaterial;

    fragmentShader:string = "";
    vertexShader:string = "";

    ready:boolean = false;

    width:number = 0;
    height:number = 0;
    time:number = 0;

    constructor(fragmentID:string, vertexID?:string, uniforms?:any) {

        this.fragmentID = fragmentID;
        this.vertexID = vertexID;

        uniforms = uniforms || {};

        this.uniforms = _.extend(uniforms ,{
            time: new UniformF(),
            resolution: new UniformV2(),
            mouse: new UniformV2()
        });
    }

    start():Promise<void>{

        var self = this;
        var vertexPath = "glsl/" + self.vertexID + ".glsl";
        var fragmentPath = "glsl/" + self.fragmentID + ".glsl";

        return LoadUtils.LoadShaders([vertexPath, fragmentPath]).then(function(shaders){
            self.vertexShader = shaders[0];
            self.fragmentShader = shaders[1];
            self.createMaterial();
        }).catch(function(e){
            console.log(e.stack);
        });

    }

    createMaterial():void {

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
            var geometry:THREE.PlaneGeometry = new THREE.PlaneGeometry(2, 2);
            //geometry.//dynamic = true;
            this.mesh = new THREE.Mesh(geometry);
        }

        this.mesh.material = this.material;
        this.scene.add(this.mesh);

        this.ready = true;
    }


    update(time:number, w:number, h:number, mx?:number, my?:number):void {
        // console.log(this.time);
        this.uniforms.time.value = this.time += 0.05;
        this.uniforms.resolution.value.x = w;
        this.uniforms.resolution.value.y = h;

        if (mx && my) {
            this.uniforms.mouse.value.x = mx / w;
            this.uniforms.mouse.value.y = my / h;
        }

    }

    render(renderer:THREE.Renderer):void {
        renderer.render(this.scene, this.camera);
    }

}


export = ShaderData;