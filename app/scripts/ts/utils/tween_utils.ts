/**
 * Created by kev on 15-07-01.
 */
export class TweenUtils {

    static easeInExpo(t:number, b:number, c:number, d:number):number {
        return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    }

}
