/**
 * Created by kev on 15-07-31.
 */

define(['base_sketch'],function (BaseSketch) {

    return BaseSketch.extend({
        imgs:null,

        canvas:null,
        ctx   :null,

        rainBuffer:{},
        rainPos : {
            x: 0,
            y :0
        },
        bgBuffer  :{},
        bgImg     :null,
        rainImg   :null,

        frameRate : 100,
        lastUpdate : -1,

        loaded     :false,
        invalidated:false,

        initialize:function () {

            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext("2d");
            this.el.appendChild(this.canvas);

            this.bgBuffer = this.createBuffer();
            this.rainBuffer = this.createBuffer();

            var _this = this;
            this.loadImages(['img/rain_test.png','img/LANDING_SECTION.png']).then(function (imgs) {

                _this.imgs = imgs;

                _this.bgImg = _this.getImageBySrc("img/LANDING_SECTION.png");
                _this.rainImg = _this.getImageBySrc('img/rain_test.png');

                _this.loaded = true;


            }).catch(function (e) {
                console.error(e);
            });

        },

        resize:function (w,h) {

            if (this.canvas.width !== w || this.canvas.height !== h) {
                this.canvas.width = w;
                this.canvas.height = h;
            }

            this.bgBuffer.resize(w,h);
            this.rainBuffer.resize(w,h);

            if (this.loaded) {
                this.drawTransitionBg();

            }
        },

        draw:function (time) {

            if (!this.loaded) {
                return;
            }

            if (this.invalidated) {
                this.invalidated = false;
            }

            if(time - this.lastUpdate > this.frameRate){
                this.lastUpdate = time;
                this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
                this.ctx.drawImage(this.bgBuffer.canvas,0,0);
                this.drawRain();
                this.ctx.drawImage(this.rainBuffer.canvas, 0, 0);
            }

        },

        drawTransitionBg:function () {

            var ctx = this.bgBuffer.ctx;
            var canvas = this.bgBuffer.canvas;

            var scale = Math.max(canvas.width / this.bgImg.naturalWidth,
                canvas.height / this.bgImg.naturalHeight);
            var width = this.bgImg.naturalWidth * scale;
            var height = this.bgImg.naturalHeight * scale;
            var rect = {
                x:(canvas.width - width) * 0.5,
                y:canvas.height - height,
                w:width,
                h:height
            };


            ctx.globalAlpha = 0;
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.globalAlpha = 1;

            this.drawImage(ctx,this.bgImg,rect);

        },

        drawRain:function () {

            this.rainPos = {
                x : Math.random()*100,
                y : Math.random()*100
            };
            var ctx = this.rainBuffer.ctx;
            var canvas = this.rainBuffer.canvas;

            ctx.clearRect(0,0,canvas.width, canvas.height);
            // ctx.globalAlpha = 0;
            ctx.drawImage(this.rainImg,this.rainPos.x, this.rainPos.y);
        },


        getImageBySrc:function (src) {
            for (var i = 0; i < this.imgs.length; i++) {
                if (this.imgs[i].src.indexOf(src) !== -1) {
                    return this.imgs[i];
                }
            }
        }

    })


})