/**
 * Created by kev on 2016-04-21.
 */
///<reference path="../../../../typings/main/ambient/three/index.d.ts"/>
import THREE = require("three");
import IUniform = require("./IUniform");
class UniformV2 implements IUniform {
    value:THREE.Vector2 = new THREE.Vector2();
    type:string = "v2";
}
export = UniformV2;