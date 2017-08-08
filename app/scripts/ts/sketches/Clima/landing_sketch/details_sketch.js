/**
 * Created by kev on 15-08-07.
 */

define(['underscore',
    'base_sketch',
    'TweenMax'],
    function (_,
        BaseSketch,
        TweenMax) {

    return BaseSketch.extend({

        canvas  :{},
        ctx     :{},
        loaded  :false,
        startImg:null,
        bgImg   :null,

        staticMaskBuffer :{},
        dynamicMaskBuffer:{},
        compositeBuffer  :{},
        flowBuffer       :{},

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

        text             :null,
        topMaskPadding   :20,
        bottomMaskPadding:10,

        targetRatio :0,
        currentRatio:0,


        isActive : false,

        initialize:function () {

            this.animObj = {value : 0};

            this.canvas = this.el;
            this.ctx = this.canvas.getContext("2d");

            this.staticMaskBuffer = this.createBuffer();
            this.dynamicMaskBuffer = this.createBuffer();
            this.compositeBuffer = this.createBuffer();
            this.flowBuffer = this.createBuffer();

            this.loadDetailsImages();

        },

        setScrollRatio:function (value) {
            console.log("kill tween details!");
            //TweenMax.killTweensOf(this.animObj);
            this.scrollRatio = value;
            this.invalidate();
        },

        resize:function (w,h) {
            if (this.canvas.width !== w && this.canvas.height !== h) {
                this.canvas.width = w;
                this.canvas.height = h;
            }

            if (!this.loaded) {
                return;
            }

            this.topMaskPadding = 40;
            this.bottomMaskPadding = 25;

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
                y:0.3 + (startImgHeight - 0.05) / 2,
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
            this.renderFlowBuffer();

            this.invalidate();

        }
        ,

        toggle        :function () {
            if (!this.isActive) {
                this.isActive = true;
                TweenMax.to(this.animObj,1.2,{
                    value:1,onUpdate:_.bind(function () {
                        //this.scrollRatio = this.animObj.value;
                        //this.invalidate();
                        this.invalidated = true
                    },this),
                    ease :'Expo.easeInOut'
                });

            } else {
                TweenMax.to(this.animObj,1.2,{
                    value:0,onUpdate:_.bind(function () {
                        //this.scrollRatio = this.animObj.value;
                        this.invalidate();
                    },this),
                    onComplete :_.bind(function(){
                        this.isActive = false;
                    }, this),
                    ease :'Expo.easeInOut'
                });
            }
        },

        draw:function () {

            if (!this.loaded) {
                return;
            }

            /*if (!this.invalidated) {
                return;
            }
            this.invalidated = false;
*/
            this.currentRatio += (this.scrollRatio - this.currentRatio) * 0.09;
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

             if (this.isActive) {
            this.drawTransition();
              } else {
                  this.drawFlowing();
              }
        },

        drawFlowing:function () {
            //ease ratio


            var width = this.flowBuffer.canvas.width;
            var height  = this.flowBuffer.canvas.height;

            var intent = this.scrollRatio - this.currentRatio;
            var angle = 10 * intent;
            var rads = angle * Math.PI/180;
            var rectAbs = this.getRectAbsolute(this.rect1,this.canvas);
            rectAbs.y += intent * 1000 * intent;

            //skew
            this.ctx.save();
            this.ctx.setTransform(1,rads,0,1 ,rectAbs.x+width,rectAbs.y+(height >> 1));
            this.ctx.drawImage(this.flowBuffer.canvas,-width,-height >> 1);

            this.ctx.restore();
        },


        drawTransition:function () {

            var ratio = this.animObj.value;

            if (ratio <= 0.5) {
                ratio = ratio / 0.5;
                var rect = this.interpolate(this.rect1,this.rect2,ratio);
                var rectAbs = this.getRectAbsolute(rect,this.canvas);

                this.drawTransitionTexture(ratio,rect,rectAbs);
            } else {
                this.drawTransitionBg((ratio - 0.5) / 0.5);
            }
        },

        drawTransitionTexture:function (ratio,rect,rectAbs) {
            this.drawDynamicMask(rect,rectAbs);

            this.compositeBuffer.clear();
            var ctx = this.compositeBuffer.ctx;
            var dest = _.clone(rectAbs);
            dest.x -= ratio * 100;
            dest.w += ratio * 200;
            this.drawCompositeTexture(ctx,ratio,rectAbs,dest);
            this.ctx.drawImage(this.compositeBuffer.canvas,0,0,this.canvas.width,this.canvas.height);
        },

        drawDynamicMask:function (rect,rectAbs) {

            this.dynamicMaskBuffer.clear();
            var ctx = this.dynamicMaskBuffer.ctx;

            var rectStartAbs = this.getRectAbsolute(this.rect1,this.dynamicMaskBuffer.canvas);

            ctx.save();
            ctx.drawImage(this.staticMaskBuffer.canvas,
                0,0,rectStartAbs.w,rectStartAbs.h,
                rectAbs.x,rectStartAbs.y,rectAbs.w,rectStartAbs.h);

            ctx.globalCompositeOperation = 'source-in';

            //stretch the static mask to the right size
            var sourceWidth = this.startImg.naturalWidth * rect.w;
            var sourceLeft = (this.startImg.naturalWidth - sourceWidth ) / 2;

            ctx.drawImage(this.startImg,sourceLeft,0,sourceWidth,this.startImg.naturalHeight,
                rectAbs.x,rectStartAbs.y,rectAbs.w,rectStartAbs.h);

            //clipping mask
            ctx.restore();
        },


        drawCompositeTexture:function (ctx,ratio,rectSrc,rectDest) {

            rectDest = rectDest || rectSrc;

            var centerHeight = Math.max(10,(rectSrc.h - this.bottomMaskPadding - this.topMaskPadding));// * (1 - ratio);
            var rectStartAbs = this.getRectAbsolute(this.rect1,this.dynamicMaskBuffer.canvas);
            var sourceTop = rectSrc.y + Math.min(10,(rectSrc.y - rectStartAbs.y));

            //top
            ctx.drawImage(this.dynamicMaskBuffer.canvas,
                rectSrc.x,rectStartAbs.y,rectSrc.w,this.topMaskPadding,
                rectDest.x,rectDest.y,rectDest.w,this.topMaskPadding);

            //center
            ctx.drawImage(this.dynamicMaskBuffer.canvas,
                rectSrc.x,sourceTop + this.topMaskPadding,rectSrc.w,centerHeight,
                rectDest.x,rectDest.y + this.topMaskPadding,rectDest.w,centerHeight);

            //bottom
            ctx.drawImage(this.dynamicMaskBuffer.canvas,
                rectSrc.x,rectStartAbs.y + rectStartAbs.h - this.bottomMaskPadding,rectSrc.w,this.bottomMaskPadding,
                rectDest.x,rectDest.y + centerHeight + this.topMaskPadding,rectDest.w,this.bottomMaskPadding);
        },


        drawTransitionBg:function (ratio) {
            var rect = this.interpolate(this.rect2,this.rect3,ratio);
            var rectAbs = this.getRectAbsolute(rect,this.canvas);
            var dest = _.clone(rectAbs);
            dest.x -= 100;
            dest.w += 200;
            this.drawCompositeBg(ratio,rect,rectAbs, dest);

            this.ctx.save();
            var angle = Math.sin(ratio * 180 * Math.PI / 180) * (-3 * Math.PI / 180);
            this.ctx.setTransform(1,Math.tan(angle),0,1,0,0);

            this.ctx.drawImage(this.compositeBuffer.canvas,0,0,this.canvas.width,this.canvas.height);

            this.ctx.restore();
        },


        renderFlowBuffer:function () {
            this.flowBuffer.clear();
            this.flowBuffer.resize(this.rect1.w * window.innerWidth,this.rect1.h * window.innerHeight);
            var ctx = this.flowBuffer.ctx;
            var rectAbs = this.getRectAbsolute(this.rect1,this.canvas);
            this.drawDynamicMask(this.rect1,rectAbs);
            this.drawCompositeTexture(ctx,0,rectAbs,{x:0,y:0,w:rectAbs.w,h:rectAbs.h});
        },


        renderStaticMask:function () {

            this.staticMaskBuffer.clear();
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
            ctx.drawImage(this.startImg,this.startImg.naturalWidth - 200,90,200,this.startImg.naturalHeight * 0.7,
                rectStartAbs.x + rectStartAbs.w - 40,rectStartAbs.y,40,rectStartAbs.h);

            ctx.fillStyle = "#ff0000";
            ctx.fillRect(rectStartAbs.x + 27,rectStartAbs.y,rectStartAbs.w - 54,rectStartAbs.h);

            ctx.globalCompositeOperation = 'source-in';

            //make solid mask

            ctx.fillStyle = "#ff0000";
            ctx.fillRect(rectStartAbs.x,rectStartAbs.y,rectStartAbs.w,rectStartAbs.h);

            ctx.restore();
        },


        drawCompositeBg:function (ratio,rect,rectAbs ,rectDest) {
            this.compositeBuffer.clear();

            rectDest = rectDest || rectSrc;

            var ctx = this.compositeBuffer.ctx;

            var height = Math.max(10,(rectAbs.h - this.bottomMaskPadding - this.topMaskPadding));// * (1 - ratio);
            var rectStartAbs = this.getRectAbsolute(this.rect1,this.dynamicMaskBuffer.canvas);

            //top
            ctx.drawImage(this.dynamicMaskBuffer.canvas,
                rectAbs.x,rectStartAbs.y,rectAbs.w,this.topMaskPadding,
                rectDest.x,rectDest.y,rectDest.w,this.topMaskPadding);


            //center
            ctx.drawImage(this.bgImg,
                rectAbs.x,rectAbs.y + this.topMaskPadding,this.bgImg.naturalWidth,height,
                rectDest.x,rectDest.y + this.topMaskPadding,rectDest.w,height + 2);


            //bottom
            ctx.drawImage(this.dynamicMaskBuffer.canvas,
                rectAbs.x,rectStartAbs.y + rectStartAbs.h - this.bottomMaskPadding,rectAbs.w,this.bottomMaskPadding,
                rectDest.x,rectDest.y + height + this.topMaskPadding,rectDest.w,this.bottomMaskPadding);
        },

        loadDetailsImages:function () {

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
        },


    })

})