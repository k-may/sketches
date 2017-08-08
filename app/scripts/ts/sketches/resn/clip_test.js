/**
 * Created by kev on 16-02-17.
 */
/**
 * Created by kev on 16-02-17.
 */
define(['util/utils',
        'base_sketch'],

    function (Utils,
        BaseSketch) {

        var MAX_DEPTH = 1000;

        return BaseSketch.extend({

            buffer:null,

            initialize:function () {
                this.heightRatio = 1;

                this.buffer = Utils.CreateBuffer();
                this.el.appendChild(this.buffer.canvas);
            },

            resize:function (w,h) {
                this.buffer.resize(w,h);

                this.mousePos = {
                    x:w >> 1,
                    y:h >> 1
                };

            },

            setMousePos:function (pos) {
                this.delta = Math.max(200,this.delta + Math.abs(pos.x - this.mousePos.x));
                this.mousePos = {x:pos.x - 100,y:pos.y - 100};
            },

            draw:function () {

                this.buffer.clear();
                this.buffer.ctx.beginPath();

                this.buffer.ctx.moveTo(100,100);
                this.buffer.ctx.lineTo(400,100);
                this.buffer.ctx.lineTo(400,400);
                this.buffer.ctx.lineTo(100,400);
                this.buffer.ctx.closePath();
                // this.buffer.ctx.fill();
                this.buffer.ctx.clip();

                this.buffer.ctx.moveTo(this.mousePos.x,this.mousePos.y);
                this.buffer.ctx.lineTo(this.mousePos.x,this.mousePos.y + 200);
                this.buffer.ctx.lineTo(this.mousePos.x + 200,this.mousePos.y + 200);
                this.buffer.ctx.lineTo(this.mousePos.x + 200,this.mousePos.y);
                this.buffer.ctx.closePath();

                this.buffer.ctx.fill();


            },


        })
    });