import {Point} from "../data/Point";
/**
 * Created by kev on 15-07-06.
 */

export class GeomUtils {

    static LerpPoint(start:Point, dest:Point, percentage:number):Point {
       return <Point> this.LerpObject(start, dest, percentage);
    }

    static LerpObject(start:any, dest:any, percentage:number):any{

        var obj = _.clone(start);
        for(var prop in start){
            if(dest.hasOwnProperty(prop) && typeof start[prop] === "number" && typeof dest[prop] === "number"){
                obj[prop] = start[prop] + (dest[prop] - start[prop])*percentage;
            }
        }
        return obj;
    }

    static Distance(start:Point, dest:Point): number{
        return Math.sqrt(Math.pow(start.x - dest.x, 2) + Math.pow(start.y - dest.y, 2));
    }
}
