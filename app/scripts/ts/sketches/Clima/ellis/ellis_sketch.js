/**
 * Created by kev on 15-07-16.
 */


define(['backbone', 'base_sketch'],function (Backbone, BaseSketch) {

    return BaseSketch.extend({

        canvas     :{},
        ctx        :{},
        loaded     :false,
        bgImage    :null,
        bgBuffer   :null,
        ellisImage :null,
        ellisBuffer:null,
        maskBuffer :null,

        ellisPos:{
            x:0,
            y:0
        },

        ellisAnim:{
            start:{
                x:0,
                y:0
            },
            dest :{
                x:1,
                y:1
            }
        },

        bgAnim:{},

        initialize:function () {

            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext("2d");

            this.el.appendChild(this.canvas);

            var count = 0;
            var _this = this;

            function loadHandler() {
                if (++count === 2) {
                    _this.loaded = true;
                    _this.resize(_this.canvas.width,_this.canvas.height);
                }
            }

            this.bgImage = new Image();
            this.bgImage.onload = loadHandler;
            this.bgImage.src = "img/Ellis_City_Mask.png";

            this.ellisImage = new Image();
            this.ellisImage.onload = loadHandler;
            this.ellisImage.src = "img/Ellis.png";

            this.bgBuffer = {canvas:document.createElement("canvas")};
            this.ellisBuffer = {canvas:document.createElement("canvas")};

            this.maskBuffer = {
                canvas:document.createElement("canvas")
            };
            this.maskBuffer.ctx = this.maskBuffer.canvas.getContext("2d");

            this.createAnimations();

            this.invalidated = true;
        },

        createAnimations:function () {
            this.bgAnim = {
                start :{
                    x:0,
                    y:0
                },
                dest  :{
                    x:1,
                    y:1
                },
                target:this.maskBuffer
            };

            this.ellisAnim = {
                start :{
                    x:0.1,
                    y:0
                },
                dest  :{
                    x:1,
                    y:1
                },
                target:this.ellisBuffer
            };

        },

        resize:function (w,h) {
            //this causes redraw!
            if (this.canvas.width !== w && this.canvas.height !== h) {
                this.canvas.width = w;
                this.canvas.height = h;
            }

            if (this.loaded) {
                var scale = (this.canvas.height * 0.8) / this.ellisImage.naturalHeight;
                this.ellisBuffer.canvas = this.resampleImage(this.ellisImage,scale);
                this.bgBuffer.canvas = this.resampleImage(this.bgImage,scale);

                this.maskBuffer.canvas.width = this.bgBuffer.canvas.width;
                this.maskBuffer.canvas.height = this.bgBuffer.canvas.height;
            }

            this.invalidated = true;
        }
        ,

        draw:function () {


            if (!this.loaded) {
                return;
            }

            if (!this.invalidated) {
                return;
            }
            this.invalidated = false;

            //clear
            this.ctx.fillStyle = "#ff0000";
            this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

            this.drawMask();
            this.drawEllis();
        },

        drawMask:function () {

            var maskWidth = this.bgBuffer.canvas.width;
            var maskHeight = this.bgBuffer.canvas.height;

            this.maskBuffer.ctx.save();
            this.maskBuffer.ctx.clearRect(0,0,maskWidth,maskHeight);
            this.maskBuffer.ctx.drawImage(this.ellisBuffer.canvas, 0,0);
            this.maskBuffer.ctx.globalCompositeOperation = 'source-in';
            this.maskBuffer.ctx.drawImage(this.bgBuffer.canvas,Math.abs(this.scrollRatio*100),0);
            this.maskBuffer.ctx.restore();

            var pos = this.updatePosition(this.bgAnim,this.scrollRatio);

            this.ctx.drawImage(this.maskBuffer.canvas,pos.x,pos.y);
        },

        drawEllis:function () {

            var pos = this.updatePosition(this.ellisAnim,this.scrollRatio);
            this.ctx.drawImage(this.ellisBuffer.canvas,
                pos.x,
                pos.y);

        }
        ,

        setScrollRatio:function (value) {
            this.scrollRatio = value;
            this.invalidated = true;
        }
        ,

        resampleImage:function (img,scale) {

            var buffer1Canvas = document.createElement("canvas");
            var buffer1Ctx = buffer1Canvas.getContext("2d");

            var buffer2Canvas = document.createElement("canvas");
            var buffer2Ctx = buffer2Canvas.getContext("2d");

            var ctxs = [{canvas:buffer1Canvas,ctx:buffer1Ctx},{canvas:buffer2Canvas,ctx:buffer2Ctx}];

            var finalHeight = img.naturalHeight * scale;
            var finalWidth = img.naturalWidth * scale;

            var steps = Math.ceil(Math.log(img.naturalHeight / (finalHeight)) / Math.log(2));

            var current,last;
            var width = img.naturalWidth;
            var height = img.naturalHeight;

            last = ctxs[1];
            current = ctxs[0];

            last.canvas.width = current.canvas.width = img.naturalWidth;
            last.canvas.height = current.canvas.height = img.naturalHeight;
            current.ctx.drawImage(img,0,0,width,height);

            for (var i = 0; i < steps - 1; i++) {

                last.ctx.clearRect(0,0,width,height);
                last.ctx.drawImage(current.canvas,0,0,width,height);

                current.ctx.clearRect(0,0,width,height);
                current.ctx.drawImage(last.canvas,0,0,width * 0.5,height * 0.5);
            }

            last.canvas.width = finalWidth;
            last.canvas.height = finalHeight;
            last.ctx.clearRect(0,0,width,height);
            last.ctx.drawImage(current.canvas,0,0,width * 0.5,height * 0.5,0,0,finalWidth,finalHeight);

            return last.canvas;
        },

        updatePosition:function (animObj,ratio) {
            var start = {
                x:animObj.start.x * this.canvas.width,
                y:animObj.start.y * this.canvas.height
            };

            var dest = {
                x:animObj.dest.x * (this.canvas.width - animObj.target.canvas.width),
                y:animObj.dest.y * (this.canvas.height - animObj.target.canvas.height),
            };

            return {
                x:Math.abs(start.x + (dest.x - start.x) * ratio),
                y:Math.abs(start.y + (dest.y - start.y) * ratio)
            };
        }


    });

})