/**
 * Created by kev on 15-07-02.
 */

"use strict";

export class Color {

    r:number = 0;
    g:number;
    b:number;
    a:number;

    constructor(r?:number, g?:number, b?:number, a?:number) {
        this.r = r || 255;
        this.g = g || 255;
        this.b = b || 255;
        this.a = a || 255
    }

    toRGBString():string {
        return 'rgb(' + this.r + "," + this.g + "," + this.b + ")";
    }
    toRGBAString():string {
        return 'rgba(' + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    }

    clone():Color{
        return new Color(this.r, this.g, this.b, this.a);
    }

    static hexToRgb(hex):Color {
        var result:RegExpExecArray = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return new Color(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16));
    }

    static lerpColor(start, dest, ratio) {
        return new Color(
            parseInt(start.r + (dest.r - start.r) * ratio),
            parseInt(start.g + (dest.g - start.g) * ratio),
            parseInt(start.b + (dest.b - start.b) * ratio),
            parseInt(start.a + (dest.a - start.a) * ratio)
        )
    }
}
