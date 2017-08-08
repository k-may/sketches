/**
 * Created by kev on 15-07-17.
 */

define(['base_sketch',"TweenMax"],function (BaseSketch,TweenMax) {

    return BaseSketch.extend({

        canvas  :{},
        ctx     :{},
        loaded  :false,
        startImg:null,
        bgImg   :null,

        bgBuffer:{
            canvas:null,
            ctx   :null
        },

        maskBuffer:{
            canvas:null,
            ctx   :null
        },

        textureAnim1:{
            start:{
                x:0.3,y:0.3,w:0.3,h:0.16
            },
            dest :{
                x:-0.1,y:0.37,w:1.2,h:0.03
            }
        },
        textureAnim2:{
            start:{
                x:-0.1,y:0.37,w:1.2,h:0.03
            },
            dest :{
                x:-0.1,y:-0.3,w:1.2,h:1.5
            }
        },
        rectAnim    :{
            start:{
                x:0.3,y:0.3,w:0.23,h:0.16
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


            var count = 0;
            var _this = this;

            function loadHandler() {
                if (++count === 3) {
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

            this.startImgSolid = new Image();
            this.startImgSolid.onload = loadHandler;
            this.startImgSolid.src = "img/Background_Product_Section_solid.png";

            this.maskBuffer = {
                canvas:document.createElement("canvas")
            };
            this.maskBuffer.ctx = this.maskBuffer.canvas.getContext("2d");

            this.invalidated = true;
        },

        resize:function (w,h) {
            //this causes redraw!
            if (this.canvas.width !== w && this.canvas.height !== h) {
                this.canvas.width = w;
                this.canvas.height = h;
            }

            if (this.loaded) {
                this.maskBuffer.canvas.width = w;
                this.maskBuffer.canvas.height = h;
            }

            var startImgAspect = this.startImg.naturalHeight / this.startImg.naturalWidth;
            var startImgWidth = 0.4;
            var startImgHeight = (startImgWidth * startImgAspect * w) / h;
            var midHeight = 10;
            this.textureAnim1 = {
                start:{
                    x:0.3,y:0.3,w:startImgWidth,h:startImgHeight
                },
                dest :{
                    x:-0.1,
                    y:0.3 + (startImgHeight - ((midHeight / 2) / h)) / 2,
                    w:1.2,
                    h:(midHeight / h)
                }
            };

            this.textureAnim2 = {
                start:{
                    x:-0.1,
                    y:0.3 + (startImgHeight - ((midHeight / 2) / h)) / 2,
                    w:1.2,
                    h:(midHeight / h)
                },
                dest :{
                    x:-0.1,y:-0.3,w:1.2,h:1.5
                }
            };


            this.text.style.lineHeight = h * this.textureAnim1.start.h + "px";


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

            var rect;
            var angle = 0;
            if (this.scrollRatio <= 0.5)
                rect = this.getRect(this.textureAnim1,this.scrollRatio / 0.5);
            else {

                var ratio = (this.scrollRatio - 0.5) / 0.5;
                angle = Math.sin(ratio * 180 * Math.PI / 180) * (-5 * Math.PI / 180);

                rect = this.getRect(this.textureAnim2,ratio);
            }

            var m = this.getMatrix(rect,angle);

            this.drawMaskedBg(m,rect);
            this.drawImg(m,rect);

        },


        drawRect:function () {

            var rect = this.getRect(this.rectAnim);

            this.ctx.fillStyle = "#ffffff";
            this.ctx.beginPath();
            this.ctx.moveTo(rect.pt1.x,rect.pt1.y);
            this.ctx.lineTo(rect.pt2.x,rect.pt2.y);
            this.ctx.lineTo(rect.pt3.x,rect.pt3.y);
            this.ctx.lineTo(rect.pt4.x,rect.pt4.y);
            this.ctx.lineTo(rect.pt1.x,rect.pt1.y);
            this.ctx.closePath();
            this.ctx.fill();

        },

        drawMaskedBg:function (m,rect) {

            this.maskBuffer.ctx.save();
            this.maskBuffer.ctx.globalAlpha = Math.min(1,this.scrollRatio * 3);
            this.maskBuffer.ctx.clearRect(0,0,this.maskBuffer.canvas.width,this.maskBuffer.canvas.height);//(rect.bounds.x,rect.bounds.y,rect.bounds.w,rect.bounds.h);

            this.maskBuffer.ctx.save();

            this.maskBuffer.ctx.setTransform(m[0],m[1],m[2],m[3],m[4],m[5]);

            this.maskBuffer.ctx.drawImage(this.startImgSolid,0,0,rect.w,rect.h);
            this.maskBuffer.ctx.restore();

            this.maskBuffer.ctx.globalCompositeOperation = 'source-in';

            this.maskBuffer.ctx.drawImage(this.bgImg,0,0,this.canvas.width,this.canvas.height);
            this.maskBuffer.ctx.restore();

            this.ctx.drawImage(this.maskBuffer.canvas,0,0);


        },

        //todo add matrix to rect
        drawTransitionBg:function (m,rect) {
            this.ctx.save();
            this.ctx.setTransform(m[0],m[1],m[2],m[3],m[4],m[5]);
            this.ctx.globalAlpha = this.scrollRatio;
            this.ctx.drawImage(this.bgImg,0,0,rect.w,rect.h);
            this.ctx.restore();
        },

        drawImg:function (m,rect) {
            this.ctx.save();
            this.ctx.setTransform(m[0],m[1],m[2],m[3],m[4],m[5]);
            this.ctx.globalAlpha = (1 - this.scrollRatio);
            this.ctx.drawImage(this.startImg,0,0,rect.w,rect.h);
            this.ctx.restore();

        },

        getRect:function (anim,ratio) {

            var start = {
                x:anim.start.x * this.canvas.width,
                y:anim.start.y * this.canvas.height,
                w:anim.start.w * this.canvas.width,
                h:anim.start.h * this.canvas.height
            }

            var dest = {
                x:anim.dest.x * this.canvas.width,
                y:anim.dest.y * this.canvas.height,
                w:anim.dest.w * this.canvas.width,
                h:anim.dest.h * this.canvas.height
            };

            var rect = {
                x:start.x + (dest.x - start.x) * ratio,
                y:start.y + (dest.y - start.y) * ratio,
                w:start.w + (dest.w - start.w) * ratio,
                h:start.h + (dest.h - start.h) * ratio
            };

            var pt1 = {
                x:rect.x,
                y:rect.y//(rect.y + rect.h - start.h) + (rect.y - (rect.y + rect.h - start.h)) * ratio
            };

            var pt2 = {
                x:rect.x + rect.w,
                y:rect.y
            };

            var pt3 = {
                x:rect.x + rect.w,
                y:rect.y + rect.h//(rect.y + start.h) + ((rect.y + rect.h) - (rect.y + start.h)) * ratio
            };

            var pt4 = {
                x:rect.x,
                y:rect.y + rect.h
            };

            var bounds = {
                x:Math.min(pt1.x,pt2.x,pt3.x,pt4.x),
                y:Math.min(pt1.y,pt2.y,pt3.y,pt4.y)

            };
            bounds.w = Math.max(pt1.x,pt2.x,pt3.x,pt4.x) - bounds.x;
            bounds.h = Math.max(pt1.y,pt2.y,pt3.y,pt4.y) - bounds.y;

            return {
                pt1   :pt1,
                pt2   :pt2,
                pt3   :pt3,
                pt4   :pt4,
                w     :rect.w,
                h     :rect.h,
                start :start,
                dest  :dest,
                bounds:bounds
            };

        },


        getMatrix:function (rect,angle) {

            var matrix = [1,0,0,1,0,0];

            // do the translate to the array
            function translate(x,y) {
                matrix[4] += matrix[0] * x + matrix[2] * y;
                matrix[5] += matrix[1] * x + matrix[3] * y;
            }

            // do the scale to the array
            function scale(x,y) {
                matrix[0] *= x;
                matrix[1] *= x;
                matrix[2] *= y;
                matrix[3] *= y;
            }

            function skew(radiansX,radiansY) {
                var tanX = radiansX;//Math.tan(radiansX);
                var tanY = radiansY;//Math.tan(radiansY);
                var matrix0 = matrix[0];
                var matrix1 = matrix[1];
                matrix[0] += tanY * matrix[2];
                matrix[1] += tanY * matrix[3];
                matrix[2] += tanX * matrix0;
                matrix[3] += tanX * matrix1;

            }

            //  var angle = Math.atan2(rect.pt1.y - rect.pt2.y,rect.pt1.x - rect.pt2.x);
            var s = {
                x:rect.w / rect.start.w,
                y:rect.h / rect.start.h
            };

            translate(rect.pt1.x,rect.pt1.y);
            //  scale(s.x, s.y);
            skew(0,Math.tan(angle));

            return matrix;


        }


    })


})