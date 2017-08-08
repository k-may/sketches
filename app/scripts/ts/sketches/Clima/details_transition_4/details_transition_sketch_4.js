/**
 * Created by kev on 15-07-22.
 */

define(['base_sketch'],function (BaseSketch) {

    return BaseSketch.extend({

        canvas  :{},
        ctx     :{},
        loaded  :false,
        startImg:null,
        bgImg   :null,

        staticMaskBuffer :{},
        dynamicMaskBuffer:{},
        compositeBuffer  :{},


        rect1:{
            x:0.3,
            y:0.3,
            w:0.4,
            h:0.1
        },

        rect2:{
            x:-0.1,
            y:0.32,
            w:1.1,
            h:0.05
        },

        rect3:{
            x:0,
            y:0,
            w:1,
            h:1
        },

        text   :null,
        topMaskPadding   :20,
        bottomMaskPadding:10,

        initialize:function () {

            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext("2d");
            this.el.appendChild(this.canvas);

            this.text = document.createElement("div");
            this.text.innerHTML = "COLD";
            this.text.setAttribute("class","details_transition_text");
            this.el.appendChild(this.text);

            this.staticMaskBuffer = this.createBuffer();
            this.dynamicMaskBuffer = this.createBuffer();
            this.compositeBuffer = this.createBuffer();

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
            this.startImg.src = "img/red_bar.png";

            this.bgImg = new Image();
            this.bgImg.onload = loadHandler;
            this.bgImg.src = "img/Background_Product_Section_BG.jpg";

            this.invalidated = true;
        }
        ,

        resize:function (w,h) {
            if (this.canvas.width !== w && this.canvas.height !== h) {
                this.canvas.width = w;
                this.canvas.height = h;
            }

            this.topMaskPadding = 30;
            this.bottomMaskPadding = 17;

            var startImgAspect = this.startImg.naturalHeight / (this.startImg.naturalWidth * 0.4);
            var startImgWidth = 0.4;
            var startImgHeight = (startImgWidth * startImgAspect * w) / h;

            this.rect1 = {
                x:0.3,
                y:0.3,
                w:startImgWidth,
                h:startImgHeight
            };

            this.rect2 = {
                x:0,
                y:0.3 + (startImgHeight - 0.05)/2,
                w:1,
                h:0.05
            };

            this.rect3 = {
                x:0,
                y:0 - (this.topMaskPadding / this.canvas.height),
                w:1,
                h:1 + (this.topMaskPadding / this.canvas.height) + (this.bottomMaskPadding / this.canvas.height)
            };


            //resize dynamic buffers
            this.dynamicMaskBuffer.resize(w,h);
            this.compositeBuffer.resize(w,h);

            //rerender static mask
            this.renderStaticMask();

            this.text.style.lineHeight = h * this.rect1.h + "px";

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

            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

            if (this.scrollRatio <= 0.5) {
                this.drawTransitionTexture(this.scrollRatio / 0.5);
            } else {
                this.drawTransitionBg((this.scrollRatio - 0.5) / 0.5);
            }
        }
        ,

        drawTransitionTexture:function (ratio) {
            var rect = this.interpolate(this.rect1,this.rect2,ratio);
            var rectAbs = this.getRectAbsolute(rect,this.canvas);
            this.drawDynamicMask(rect,rectAbs);
            this.drawCompositeTexture(ratio,rect,rectAbs);
            this.ctx.drawImage(this.compositeBuffer.canvas,0,0,this.canvas.width,this.canvas.height);
        },

        drawTransitionBg:function (ratio) {
            var rect = this.interpolate(this.rect2,this.rect3,ratio);
            var rectAbs = this.getRectAbsolute(rect,this.canvas);
            this.drawCompositeBg(ratio,rect,rectAbs);

            this.ctx.save();
            var angle = Math.sin(ratio*180 * Math.PI/180) * (-3 * Math.PI/180);
            this.ctx.setTransform(1, Math.tan(angle),0 ,1, 0, 0);

            this.ctx.drawImage(this.compositeBuffer.canvas,0,0,this.canvas.width,this.canvas.height);

            this.ctx.restore();
        },

        renderStaticMask:function () {

            this.staticMaskBuffer.resize(this.rect1.w * window.innerWidth,this.rect1.h * window.innerHeight);
            var ctx = this.staticMaskBuffer.ctx;

            var rectStartAbs = {
                x:0,
                y:0,
                w:this.rect1.w * window.innerWidth,
                h:this.rect1.h * window.innerHeight
            };

            ctx.save();
            //draw left end
            ctx.drawImage(this.startImg,0,90,200,this.startImg.naturalHeight * 0.7,
                rectStartAbs.x,rectStartAbs.y,30,rectStartAbs.h);

            //draw right end
            ctx.drawImage(this.startImg,0,90,this.startImg.naturalWidth - 200,this.startImg.naturalHeight * 0.7,
                rectStartAbs.x + rectStartAbs.w - 40,rectStartAbs.y,40,rectStartAbs.h);

            ctx.fillStyle = "#ff0000";
            ctx.fillRect(rectStartAbs.x + 27,rectStartAbs.y,rectStartAbs.w - 54,rectStartAbs.h);

            ctx.globalCompositeOperation = 'source-in';

            //make solid mask

            ctx.fillStyle = "#ff0000";
            ctx.fillRect(rectStartAbs.x,rectStartAbs.y,rectStartAbs.w,rectStartAbs.h);

            ctx.restore();
        },

        drawDynamicMask:function (rect,rectAbs) {
            this.dynamicMaskBuffer.clear();

            var ctx = this.dynamicMaskBuffer.ctx;
            var canvas = this.dynamicMaskBuffer.canvas;

            var rectStartAbs = this.getRectAbsolute(this.rect1,this.dynamicMaskBuffer.canvas);

            ctx.save();
            ctx.drawImage(this.staticMaskBuffer.canvas,
                0,0,rectStartAbs.w,rectStartAbs.h,
                rectAbs.x,rectStartAbs.y,rectAbs.w,rectStartAbs.h);

            ctx.globalCompositeOperation = 'source-in';

            var sourceWidth = this.startImg.naturalWidth * rect.w;
            var sourceLeft = (this.startImg.naturalWidth - sourceWidth ) / 2;

            ctx.drawImage(this.startImg,sourceLeft,0,sourceWidth,this.startImg.naturalHeight,
                rectAbs.x,rectStartAbs.y,rectAbs.w,rectStartAbs.h);

            //clipping mask
            ctx.restore();
        },

        drawCompositeTexture:function (ratio,rect,rectAbs) {
            this.compositeBuffer.clear();

            var ctx = this.compositeBuffer.ctx;

            var height = Math.max(10, (rectAbs.h - this.bottomMaskPadding - this.topMaskPadding));// * (1 - ratio);
            var rectStartAbs = this.getRectAbsolute(this.rect1,this.dynamicMaskBuffer.canvas);

            //top
            ctx.drawImage(this.dynamicMaskBuffer.canvas,
                rectAbs.x,rectStartAbs.y,rectAbs.w,this.topMaskPadding,
                rectAbs.x,rectAbs.y,rectAbs.w,this.topMaskPadding);

            var sourceTop = rectAbs.y +  Math.min(10,(rectAbs.y - rectStartAbs.y));

            //center
            ctx.drawImage(this.dynamicMaskBuffer.canvas,
                rectAbs.x,sourceTop + this.topMaskPadding,rectAbs.w,height,
                rectAbs.x,rectAbs.y + this.topMaskPadding,rectAbs.w,height);

            //bottom
            ctx.drawImage(this.dynamicMaskBuffer.canvas,
                rectAbs.x,rectStartAbs.y + rectStartAbs.h - this.bottomMaskPadding,rectAbs.w,this.bottomMaskPadding,
                rectAbs.x,rectAbs.y + height + this.topMaskPadding,rectAbs.w,this.bottomMaskPadding);
        },

        drawCompositeBg:function (ratio,rect,rectAbs) {
            this.compositeBuffer.clear();

            var ctx = this.compositeBuffer.ctx;

            var height = Math.max(10, (rectAbs.h - this.bottomMaskPadding - this.topMaskPadding));// * (1 - ratio);
            var rectStartAbs = this.getRectAbsolute(this.rect1,this.dynamicMaskBuffer.canvas);

            //top
            ctx.drawImage(this.dynamicMaskBuffer.canvas,
                rectAbs.x,rectStartAbs.y,rectAbs.w,this.topMaskPadding,
                rectAbs.x,rectAbs.y,rectAbs.w,this.topMaskPadding);


            //center
            ctx.drawImage(this.bgImg,
                rectAbs.x,rectAbs.y + this.topMaskPadding,this.bgImg.naturalWidth,height,
                rectAbs.x,rectAbs.y + this.topMaskPadding,rectAbs.w,height + 2);


            //bottom
            ctx.drawImage(this.dynamicMaskBuffer.canvas,
                rectAbs.x,rectStartAbs.y + rectStartAbs.h - this.bottomMaskPadding,rectAbs.w,this.bottomMaskPadding,
                rectAbs.x,rectAbs.y + height + this.topMaskPadding,rectAbs.w,this.bottomMaskPadding);
        },



        getStaticMaskRectAbsolute:function () {
            return {
                x:0,
                y:0,
                w:this.rect1.w * window.innerWidth,
                h:this.rect1.h * window.innerHeight
            };
        }

    })

})