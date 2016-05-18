/**
 * Created by kev on 2016-04-21.
 */
import IUniform = require("./IUniform");
class UniformF implements IUniform {
    value:number = 1.0;
    type:string = 'f';
}
export = UniformF;