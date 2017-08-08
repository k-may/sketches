/**
 * Created by kev on 15-07-21.
 */

define(['base_sketch',"TweenMax"],function (BaseSketch,TweenMax) {

    return BaseSketch.extend({

        canvas  :{},
        ctx     :{},
        loaded  :false,
        startImg:null,
        bgImg   :null,

        maskBuffer:{},
        rectAnim1 :{
            start:{
                x:0.3,y:0.3,w:0.3,h:0.16
            },
            dest :{
                x:0.0,y:0.33,w:1.0,h:0.1
            }
        },

        rectAnim2:{
            start:{
                x:0.0,y:0.33,w:1.0,h:0.1
            },
            dest :{
                x:0.0,y:0.0,w:1.0,h:1.0
            }
        },

        text   :null,

        initialize:function () {

            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext("2d");
            this.el.appendChild(this.canvas);

            this.text = document.createElement("div");
            this.text.innerHTML = "COLD";
            this.text.setAttribute("class","details_transition_text");
            this.el.appendChild(this.text);


            this.maskBuffer.canvas = document.createElement("canvas");
            this.maskBuffer.ctx = this.maskBuffer.canvas.getContext("2d");


            var count = 0;
            var _this = this;

            function loadHandler() {
                if (++count === 2) {
                    _this.loaded = true;
                    _this.resize(_this.canvas.width,_this.canvas.height);
                }
            }

            this.startImg = new Image();
            this.startImg.onload = loadHandler;
            this.startImg.src = "img/Background_Product_Section.png";

            this.bgImg = new Image();
            this.bgImg.onload = loadHandler;
            this.bgImg.src = "img/Background_Product_Section_BG.jpg";

            this.invalidated = true;
        },

        resize:function (w,h) {
            //this causes redraw!
            if (this.canvas.width !== w && this.canvas.height !== h) {
                this.canvas.width = w;
                this.canvas.height = h;
            }

            if (this.maskBuffer.width !== w && this.maskBuffer.height !== h) {
                this.maskBuffer.canvas.width = w;
                this.maskBuffer.canvas.height = h;
            }

            var startImgAspect = this.startImg.naturalHeight / this.startImg.naturalWidth;
            var startImgWidth = 0.4;
            var startImgHeight = (startImgWidth * startImgAspect * w) / h;
            var midHeight = 10;
            this.rectAnim1 = {
                start:{
                    x:0.3,y:0.3,w:startImgWidth,h:startImgHeight
                },
                dest :{
                    x:0.0,
                    y:0.3 + (startImgHeight - ((midHeight / 2) / h)) / 2,
                    w:1.0,
                    h:(midHeight / h)
                }
            };

            this.rectAnim2 = {
                start:{
                    x:0.0,
                    y:0.3 + (startImgHeight - ((midHeight / 2) / h)) / 2,
                    w:1.0,
                    h:midHeight / h
                },
                dest :{
                    x:0.0,
                    y:0.0,
                    w:1.0,
                    h:1.0
                }
            }

            this.text.style.lineHeight = h * this.rectAnim1.start.h + "px";

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
            this.ctx.fillStyle = "#ffffff";
            this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

            if (this.scrollRatio < 0.1) {
                this.drawImage();
            } else {
                this.drawMaskRect();
            }
        },

        drawImage:function () {

            var rectStart = this.rectAnim1.start;
            rectStart = this.getRectAbsolute(rectStart);

            var rect = this.getRect();
            var ratioExpo = (-Math.pow(2,-10 * this.scrollRatio) + 1)
            var heightDiff = ratioExpo * this.startImg.naturalHeight;
            var widthDiff = ratioExpo * this.startImg.naturalWidth;

            this.ctx.drawImage(this.startImg,widthDiff / 2,heightDiff / 2,
                this.startImg.naturalWidth - widthDiff,
                this.startImg.naturalHeight - heightDiff,rect.x,rect.y,rect.w,rect.h);

        },

        drawMaskRect:function () {

            var ratio = (Math.max(0.5,this.scrollRatio) - 0.5 ) * 2;
            var ratioSin = Math.sin(ratio * 180 * (Math.PI / 180));
            var rect = this.getRect();

            var pt1 = {
                x:rect.x,
                y:rect.y + ratioSin * 10
            };

            var pt2 = {
                x:rect.x + rect.w,
                y:rect.y - ratioSin * 10
            };

            var pt3 = {
                x:rect.x + rect.w,
                y:rect.y + rect.h - ratioSin * 10
            };

            var pt4 = {
                x:rect.x,
                y:rect.y + rect.h + ratioSin * 10
            }

            //console.log(ratio.toFixed(2), ratioSin.toFixed(2));

            this.maskBuffer.ctx.save();
            this.maskBuffer.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
            this.maskBuffer.ctx.fillStyle = "#ff0000";
            //   this.maskBuffer.ctx.globalAlpha = this.scrollRatio;
            //  this.maskBuffer.ctx.fillRect(rect.x,rect.y,rect.w,rect.h);
            this.maskBuffer.ctx.beginPath();
            this.maskBuffer.ctx.moveTo(pt1.x,pt1.y);
            this.maskBuffer.ctx.lineTo(pt2.x,pt2.y);
            this.maskBuffer.ctx.lineTo(pt3.x,pt3.y);
            this.maskBuffer.ctx.lineTo(pt4.x,pt4.y);

            this.maskBuffer.ctx.fill();
            this.maskBuffer.ctx.globalCompositeOperation = 'source-in';
            this.maskBuffer.ctx.drawImage(this.bgImg,0,0,this.canvas.width,this.canvas.height);
            this.maskBuffer.ctx.restore();

            this.ctx.drawImage(this.maskBuffer.canvas,0,0,this.canvas.width,this.canvas.height);

        },

        easeOutExpo:function (x,t,b,c,d) {
            return (t == d) ? b + c : c * (-Math.pow(2,-10 * t / d) + 1) + b;
        },

        getRect:function () {

            var ratio = this.scrollRatio;
            var rectAnim;
            if (ratio > 0.5) {
                ratio = (ratio - 0.5) * 2;
                rectAnim = this.rectAnim2;
            } else {
                ratio *= 2;
                rectAnim = this.rectAnim1;
            }

            var interpolated = this.getInterpolatedRect(rectAnim,ratio);

            return this.getRectAbsolute(interpolated);

        },

        getInterpolatedRect:function (rectAnim,ratio) {

            var start = rectAnim.start;
            var dest = rectAnim.dest;

            return {
                x:start.x + (dest.x - start.x) * ratio,
                y:start.y + (dest.y - start.y) * ratio,
                w:start.w + (dest.w - start.w) * ratio,
                h:start.h + (dest.h - start.h) * ratio
            };
        },

        GetRectAbsolute:function (rect) {

            return {
                x:rect.x * this.canvas.width,
                y:rect.y * this.canvas.height,
                w:rect.w * this.canvas.width,
                h:rect.h * this.canvas.height
            };
        }
    })


})