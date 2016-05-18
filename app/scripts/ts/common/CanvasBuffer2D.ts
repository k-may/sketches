/**
 * Created by kev on 2016-05-18.
 */
class CanvasBuffer2D {

    canvas:HTMLCanvasElement;
    ctx:CanvasRenderingContext2D;
    width:number;
    height:number;

    constructor() {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
    }

    resize(w:number, h:number):void {
        if (w !== this.width || h !== this.height) {
            this.canvas.width = this.width = w;
            this.canvas.height = this.height = h;
        }
    }

    clear():void{
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    //for debug!
    fill(color):void {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

}

export = CanvasBuffer2D;