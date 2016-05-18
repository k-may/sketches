/**
 * Created by kev on 2016-04-21.
 */

///<reference path="../../../../typings/main/ambient/three/index.d.ts"/>
import THREE = require("three");
import IUniform = require("./IUniform");
class UniformT implements IUniform {
    value:THREE.Texture;
    type:string = 't';

    constructor(value?:THREE.Texture){
        this.value = value;
    }
}
export = UniformT;