/**
 * Created by kev on 15-07-30.
 */

define(['base_sketch'],function (BaseSketch) {

    return BaseSketch.extend({

        mainBuffer:{},
        staticBuffer : {},

        currentBuffer : null,
        forgetBuffer1:{},
        forgetBuffer2:{},

        startRect  :{},
        imgs       :null,
        loaded     :false,
        invalidated:false,

        initialize:function () {

            this.mainBuffer = this.createBuffer();
            this.canvas = this.mainBuffer.canvas;
            this.ctx = this.mainBuffer.ctx;
            this.el.appendChild(this.canvas);

            this.staticBuffer = this.createBuffer();
            this.forgetBuffer1 = this.createBuffer();
            this.forgetBuffer2 = this.createBuffer();

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
            this.mainBuffer.resize(w, h);

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

                this.forgetBuffer1.resize(destWidth,350);
                this.forgetBuffer2.resize(destWidth,350);
                this.staticBuffer.resize(destWidth, 350);

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

            this.mainBuffer.clear();
            this.ctx.globalAlpha = 1- this.scrollRatio;

            this.drawStatic();
            this.drawPersistent();

        },

        drawStatic : function(){

            this.staticBuffer.clear();
            this.staticBuffer.ctx.globalAlpha = 1- this.easeOutExpo(this.scrollRatio);;//1- this.scrollRatio;
            this.drawImage1(this.staticBuffer.ctx);
            this.drawImage2(this.staticBuffer.ctx);
            // this.drawImage3(this.ctx);
            // this.drawImage4(this.staticBuffer.ctx);
            this.drawImage5(this.staticBuffer.ctx);
            this.drawImage6(this.staticBuffer.ctx);

            this.ctx.drawImage(this.staticBuffer.canvas,(this.canvas.width - this.staticBuffer.width) >> 1,
                (this.canvas.height - this.staticBuffer.height) >> 1);

        },

        drawPersistent : function(){

            //swap buffers
            var previousBuffer = this.currentBuffer;

            if(this.currentBuffer === this.forgetBuffer1){
                this.currentBuffer = this.forgetBuffer2;
            }else{
                this.currentBuffer = this.forgetBuffer1;
            }
            this.currentBuffer.clear();

            if(previousBuffer) {
                this.currentBuffer.ctx.save();
                this.currentBuffer.ctx.globalAlpha = this.easeOutExpo(this.scrollRatio);
                this.currentBuffer.ctx.drawImage(previousBuffer.canvas,0,0);
                this.currentBuffer.ctx.restore();
            }

            //DRAW BORDER BOUNDARY
            this.currentBuffer.ctx.strokeStyle = "#ff0000";
            this.currentBuffer.ctx.rect(0,0,this.currentBuffer.width,this.currentBuffer.height);
            this.currentBuffer.ctx.stroke();

            this.currentBuffer.ctx.save();
            this.currentBuffer.ctx.globalCompositeOperation = 'destination-over';

            //this.drawImage1(this.currentBuffer.ctx);
            //this.drawImage2(this.currentBuffer.ctx);
            this.drawImage3(this.currentBuffer.ctx);
            this.drawImage4(this.currentBuffer.ctx);
            // this.drawImage5(this.currentBuffer.ctx);
            //  this.drawImage6(this.currentBuffer.ctx);

            this.currentBuffer.ctx.restore();
            // var alpha = Math.pow(this.scrollRatio, 2);
            //this.ctx.globalAlpha = 1- this.smoothStep(this.scrollRatio);//1 - alpha ;
            this.ctx.drawImage(this.currentBuffer.canvas,(this.canvas.width - this.currentBuffer.width) >> 1,
                (this.canvas.height - this.currentBuffer.height) >> 1);
        },

        drawImage1:function (ctx) {

            var img = this.imgs[0];
            var destRect = {
                x       :this.startRect.x + 10,
                y       :this.startRect.y + 200,
                w       :this.startRect.w,
                h       :this.startRect.h,
                rotation:1,
                alpha   :0.1
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
                alpha   :0.1
            };
            var rect = this.interpolate(this.startRect,destRect,this.scrollRatio);

            this.drawImage(ctx,img,rect);
        },
        drawImage3:function (ctx) {

            var img = this.imgs[2];
            var destRect = {
                x       :this.startRect.x ,
                y       :this.startRect.y + 140,
                w       :this.startRect.w,
                h       :this.startRect.h,
                rotation:0,
                alpha   :0
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
                alpha   :0.5
            };
            var rect = this.interpolate(this.startRect,destRect,this.scrollRatio);

            this.drawImage(ctx,img,rect);
        },

        drawImage5:function (ctx) {

            var img = this.imgs[4];
            var destRect = {
                x       :this.startRect.x + 10,
                y       :this.startRect.y + 20,
                w       :this.startRect.w,
                h       :this.startRect.h,
                rotation:-1,
                alpha   :0.7
            };
            var rect = this.interpolate(this.startRect,destRect,this.scrollRatio);

            this.drawImage(ctx,img,rect);
        },

        drawImage6:function (ctx) {

            var img = this.imgs[4];
            var destRect = {
                x       :this.startRect.x,
                y       :this.startRect.y + 20,
                w       :this.startRect.w,
                h       :this.startRect.h,
                rotation:0,
                alpha   :0.3
            };
            var rect = this.interpolate(this.startRect,destRect,this.scrollRatio);

            this.drawImage(ctx,img,rect);
        },

        drawImage:function (ctx,img,rect) {

            ctx.save();
            ctx.globalAlpha = 1 - this.scrollRatio;//rect.alpha;
            ctx.translate((rect.w >> 1),(rect.h >> 1));
            ctx.rotate(rect.rotation * Math.PI / 180);
            ctx.translate(rect.x,rect.y);
            ctx.drawImage(img,-(rect.w >> 1),-(rect.h >> 1),this.startRect.w,this.startRect.h);
            ctx.restore();
        },

        smoothStep: function (ratio) {
            return ratio * ratio * (3 - 2 * ratio);
        },

        easeOutExpo: function (ratio) {
            return (-Math.pow(2, -10 * ratio) + 1);
        },

    })

})