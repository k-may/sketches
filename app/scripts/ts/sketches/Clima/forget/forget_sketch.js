/**
 * Created by kev on 15-07-30.
 */

define(['base_sketch'],function (BaseSketch) {

    return BaseSketch.extend({

        canvas:{},
        ctx   :{},

        forgetBuffer     :{},

        startRect  :{},
        imgs       :null,
        loaded     :false,
        invalidated:false,

        initialize:function () {

            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext("2d");
            this.el.appendChild(this.canvas);

            this.forgetBuffer = this.createBuffer();

            var _this = this;
            this.loadImages(['img/forget_1.png','img/forget_2.png','img/forget_3.png','img/forget_4.png','img/forget_5.png','img/forget_6.png']
            ).then(
                function (imgs) {
                    _this.imgs = imgs;
                    _this.loaded = true;
                    _this.resize(_this.canvas.width,_this.canvas.height);
                })

        },

        resize:function (w,h) {
            //this causes redraw!
            if (this.canvas.width !== w && this.canvas.height !== h) {
                this.canvas.width = w;
                this.canvas.height = h;
            }


            if (this.loaded) {
                //should all be the same size!
                var img = this.imgs[0];
                var destWidth = this.canvas.width / 2;
                var aspect = destWidth / img.naturalWidth;
                var destHeight = img.naturalHeight * aspect;

                this.startRect = {
                    x       :0,
                    y       :0,
                    w       :destWidth,//img.width,
                    h       :destHeight,//img.height,
                    rotation:0,
                    alpha   :1,
                };

                this.forgetBuffer.resize(destWidth,350);

            }
        },

        draw:function () {
            if (!this.loaded) {
                return;
            }

            if (!this.invalidated) {
                return;
            }
            this.invalidated = false;

            // this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

            // this.forgetBuffer.ctx.clearRect(0,0, this.forgetBuffer.width, this.forgetBuffer.height);
            this.forgetBuffer.ctx.fillStyle = "#fff";
            this.forgetBuffer.ctx.fillRect(0,0,this.forgetBuffer.canvas.width, this.forgetBuffer.canvas.height);

            this.forgetBuffer.ctx.strokeStyle = "#ff0000";
            this.forgetBuffer.ctx.rect(0,0,this.forgetBuffer.canvas.width, this.forgetBuffer.canvas.height);
            this.forgetBuffer.ctx.stroke();

            this.drawImage1(this.forgetBuffer.ctx);
            this.drawImage2(this.forgetBuffer.ctx);
            this.drawImage3(this.forgetBuffer.ctx);
            this.drawImage4(this.forgetBuffer.ctx);
            this.drawImage5(this.forgetBuffer.ctx);
            this.drawImage6(this.forgetBuffer.ctx);

            this.ctx.drawImage(this.forgetBuffer.canvas, (this.canvas.width - this.forgetBuffer.width) >> 1,
                (this.canvas.height - this.forgetBuffer.height)>>1);
        },

        drawImage1:function (ctx) {

            var img = this.imgs[0];
            var destRect = {
                x       :this.startRect.x + 10,
                y       :this.startRect.y + 20,
                w       :this.startRect.w,
                h       :this.startRect.h,
                rotation:1,
                alpha   :0.6
            };
            var rect = this.interpolate(this.startRect,destRect,this.scrollRatio);

            this.drawImage(ctx,img,rect);
        },
        drawImage2:function (ctx) {

            var img = this.imgs[1];
            var destRect = {
                x       :this.startRect.x - 10,
                y       :this.startRect.y + 130,
                w       :this.startRect.w,
                h       :this.startRect.h,
                rotation:-2,
                alpha   :0.7
            };
            var rect = this.interpolate(this.startRect,destRect,this.scrollRatio);

            this.drawImage(ctx,img,rect);
        },
        drawImage3:function (ctx) {

            var img = this.imgs[2];
            var destRect = {
                x       :this.startRect.x + 20,
                y       :this.startRect.y + 40,
                w       :this.startRect.w,
                h       :this.startRect.h,
                rotation:2,
                alpha   :0.2
            };
            var rect = this.interpolate(this.startRect,destRect,this.scrollRatio);

            this.drawImage(ctx,img,rect);
        },
        drawImage4:function (ctx) {

            var img = this.imgs[3];
            var destRect = {
                x       :this.startRect.x + 0,
                y       :this.startRect.y + 100,
                w       :this.startRect.w,
                h       :this.startRect.h,
                rotation:-1,
                alpha   :0.8
            };
            var rect = this.interpolate(this.startRect,destRect,this.scrollRatio);

            this.drawImage(ctx,img,rect);
        },

        drawImage5:function (ctx) {

            var img = this.imgs[4];
            var destRect = {
                x       :this.startRect.x + 0,
                y       :this.startRect.y + 140,
                w       :this.startRect.w,
                h       :this.startRect.h,
                rotation:-1,
                alpha   :0.4
            };
            var rect = this.interpolate(this.startRect,destRect,this.scrollRatio);

            this.drawImage(ctx,img,rect);
        },

        drawImage6:function (ctx) {

            var img = this.imgs[4];
            var destRect = {
                x       :this.startRect.x + 0,
                y       :this.startRect.y + 10,
                w       :this.startRect.w,
                h       :this.startRect.h,
                rotation:0,
                alpha   :0.9
            };
            var rect = this.interpolate(this.startRect,destRect,this.scrollRatio);

            this.drawImage(ctx,img,rect);
        },

        drawImage:function (ctx,img,rect) {

            ctx.save();
            ctx.globalAlpha = rect.alpha;
            ctx.translate((rect.w >> 1),(rect.h >> 1));
            ctx.rotate(rect.rotation * Math.PI / 180);
            ctx.translate(rect.x,rect.y);
            ctx.drawImage(img,-(rect.w >> 1),-(rect.h >> 1),this.startRect.w,this.startRect.h);
            ctx.restore();
        }

    })

})