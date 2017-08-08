
import {BaseSketch} from "../../common/BaseSketch";
import {Col} from "./Col";
import {CanvasBuffer2D} from "../../common/CanvasBuffer2D";
/**
 * Created by kev on 2016-05-18.
 */

export class Triangles2D extends BaseSketch {

    windowWidth:number = 0;
    windowHeight:number = 0;
    size:number = 10;


    cols1 : Col[];
    cols2 : Col[];

    res:number = 50;

    buffer1 : CanvasBuffer2D;
    buffer2 : CanvasBuffer2D;

    constructor() {
        super();

        var num = 100;

        this.cols1 = [];
        for(var i = 0 ;i < num; i ++){
            this.cols1.push(new Col(this.size));
        }

        this.cols2 = [];
        for(var i = 0 ;i < num; i ++){
            this.cols2.push(new Col(this.size));
        }

        this.buffer1 = new CanvasBuffer2D();
        this.buffer2 = new CanvasBuffer2D();
        /*

         div.appendChild(this.buffer1.canvas);
         div.appendChild(this.buffer2.canvas);
         */

        this.addBuffer(this.buffer1);
        this.addBuffer(this.buffer2);
        this.buffer2.canvas.style.opacity = "0.7";
    }

    addBuffer(b:CanvasBuffer2D){
        this.el.appendChild(b.canvas);
        b.canvas.style.position = "absolute";
        b.canvas.style.top = "0px";
    }

    draw(time?:Number) {
        this.drawBuffer1();
        this.drawBuffer2();
    }

    drawBuffer1(){

        this.buffer1.ctx.globalAlpha = 0.006;
        this.buffer1.ctx.fillStyle = "#000000";
        this.buffer1.ctx.fillRect(0, 0, this.buffer1.width, this.buffer1.height);
        this.buffer1.ctx.globalAlpha = 1;
        this.buffer1.ctx.fillStyle = "#ffffff";

        for(var i = 0 ;i < this.cols1.length ; i ++) {

            this.buffer1.ctx.save();
            this.buffer1.ctx.translate(this.res * i, 0);
            this.buffer1.ctx.beginPath();
            //  this.buffer1.ctx.fillStyle = "#eee";

            if (this.cols1[i].complete) {
                this.cols1[i].init();
                //this.buffer1.clear();
            }

            this.cols1[i].update();
            this.cols1[i].draw(this.buffer1);

            this.buffer1.ctx.fill();

            this.buffer1.ctx.restore();
        }
    }

    drawBuffer2(){

        this.buffer2.ctx.globalAlpha = 0.006;
        this.buffer2.ctx.fillStyle = "#000000";
        this.buffer2.ctx.fillRect(0, 0, this.buffer2.width, this.buffer2.height);
        this.buffer2.ctx.globalAlpha = 1;

        //this.buffer2.clear();
        this.buffer2.ctx.fillStyle = "#ffffff";
        for(var i = 0 ;i < this.cols2.length ; i ++) {

            this.buffer2.ctx.save();
            this.buffer2.ctx.translate(this.res * i, 0);
            this.buffer2.ctx.beginPath();
            //  this.buffer2.ctx.fillStyle = "#eee";

            if (this.cols2[i].complete) {
                this.cols2[i].init();
                //this.buffer2.clear();
            }

            this.cols2[i].update();
            this.cols2[i].draw(this.buffer2);

            this.buffer2.ctx.fill();

            this.buffer2.ctx.restore();
        }
    }

    resize(windowWidth, windowHeight) {

        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;

        this.buffer1.resize(windowWidth, windowHeight);
        this.buffer2.resize(windowWidth, windowHeight);

        this.res = Math.ceil(windowWidth / this.cols1.length);

        for(var i = 0 ;i < this.cols1.length; i ++){
            this.cols1[i].size = this.res;
            this.cols1[i].init();
        }

        for(var i = 0 ;i < this.cols2.length; i ++){
            this.cols2[i].size = this.res;
            this.cols2[i].init();
        }
    }
}
