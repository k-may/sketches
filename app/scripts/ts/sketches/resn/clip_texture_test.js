/**
 * Created by kev on 16-02-29.
 */
define(['util/utils','base_sketch'],
    function (Utils,
        BaseSketch) {

        return BaseSketch.extend({

            buffer   :null,
            imgBuffer:null,

            img   :null,
            width :-1,
            height:-1,

            initialize:function () {

                this.buffer = Utils.CreateBuffer();
                this.el.appendChild(this.buffer.canvas);

                this.imgBuffer = Utils.CreateBuffer();

                var self = this;
                Utils.LoadImageBySrc('img/AYCF_MDMA.jpg').then(function (img) {
                    self.img = img;
                    self.onLoaded();
                }).catch(function (e) {
                    console.error(e.stack);
                })

            },

            onLoaded:function () {

                this.loaded = true;

                this.resize(this.width,this.height);
            },


            resize:function (w,h) {
                this.width = w;
                this.height = h;

                if (!this.loaded) {
                    return;

                }
                this.buffer.resize(w,h);
                this.imgBuffer.resize(w,h);

                this.renderImageBuffer();
            },


            renderImageBuffer:function () {
                this.imgBuffer.clear();

                var scale = Math.min(this.img.naturalWidth / this.imgBuffer.width,this.img.naturalHeight / this.imgBuffer.height);

                var clipRect = {
                    x:((this.img.naturalWidth - this.width * scale) >> 1) / scale,
                    y:((this.img.naturalHeight - this.height * scale) >> 1) / scale,
                    w:this.imgBuffer.width * scale,
                    h:this.imgBuffer.height * scale
                };

                this.imgBuffer.ctx.drawImage(this.img,clipRect.x,clipRect.y,clipRect.w,clipRect.h,
                    0,0,this.imgBuffer.width,this.imgBuffer.height
                );

            },

            setMousePos:function (pos) {
                this.mousePos = {x:pos.x - 100,y:pos.y - 100};
            },


            draw:function () {

                if (!this.loaded) {
                    return;
                }


                this.buffer.clear();

                this.drawClipOne();

                this.drawClipTwo();

            },

            drawClipOne:function () {

                this.buffer.ctx.save();

                this.buffer.ctx.beginPath();

                var pos = {
                    x     :(this.width >> 1) - 200,
                    y     :(this.height >> 1) - 200,
                    width :400,
                    height:400
                };

                //outer
                this.buffer.ctx.moveTo(pos.x,pos.y);
                this.buffer.ctx.lineTo(pos.x + 400,pos.y);
                this.buffer.ctx.lineTo(pos.x + 400,pos.y + 400);
                this.buffer.ctx.lineTo(pos.x,pos.y + 400);
                this.buffer.ctx.closePath();
                // this.buffer.ctx.fill();
                this.buffer.ctx.clip();

                //inner
                this.buffer.ctx.moveTo(pos.x + 100,pos.y + 100);
                this.buffer.ctx.lineTo(pos.x + 100,pos.y + 300);
                this.buffer.ctx.lineTo(pos.x + 300,pos.y + 300);
                this.buffer.ctx.lineTo(pos.x + 300,pos.y + 100);
                this.buffer.ctx.closePath();

                this.buffer.ctx.fill();

                this.buffer.ctx.translate(this.width >> 1,this.height >> 1);
                this.buffer.ctx.scale(0.9,0.9);
                this.buffer.ctx.translate(-this.width >> 1,-this.height >> 1);

                this.buffer.ctx.globalCompositeOperation = "source-in";
                this.buffer.ctx.drawImage(this.imgBuffer.canvas,0,0);

                this.buffer.ctx.restore();
            },

            drawClipTwo:function () {
                this.buffer.ctx.beginPath();

                this.buffer.ctx.save();
                var pos = {
                    x     :(this.width >> 1) - 400,
                    y     :(this.height >> 1) - 400,
                    width :800,
                    height:800
                };

                //outer
                this.buffer.ctx.moveTo(pos.x,pos.y);
                this.buffer.ctx.lineTo(pos.x + 800,pos.y);
                this.buffer.ctx.lineTo(pos.x + 800,pos.y + 800);
                this.buffer.ctx.lineTo(pos.x,pos.y + 800);
                this.buffer.ctx.closePath();
                // this.buffer.ctx.fill();
                this.buffer.ctx.clip();

                //inner
                this.buffer.ctx.moveTo(pos.x + 100,pos.y + 100);
                this.buffer.ctx.lineTo(pos.x + 100,pos.y + 700);
                this.buffer.ctx.lineTo(pos.x + 700,pos.y + 700);
                this.buffer.ctx.lineTo(pos.x + 700,pos.y + 100);
                this.buffer.ctx.closePath();

                this.buffer.ctx.fill();

                /*this.buffer.ctx.translate(this.width >> 1, this.height >> 1);
                this.buffer.ctx.scale(1, 1);
                this.buffer.ctx.translate(-this.width >> 1, -this.height >> 1);

                this.buffer.ctx.globalCompositeOperation = "source-in";
                this.buffer.ctx.drawImage(this.imgBuffer.canvas, 0, 0);*/


                this.buffer.ctx.restore();

            }


        });


    });