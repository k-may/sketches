/**
 * Created by kev on 15-07-24.
 */

define(['base_sketch','rsvp'],function (BaseSketch,RSVP) {


    return BaseSketch.extend({

        imgSrc     :['backgrounds1','backgrounds2','backgrounds3','backgrounds4'],
        mouseImgSrc:'img/mouseMask3.png',
        mouseImg   :null,
        img        :[],
        canvas     :{},
        ctx        :{},
        loaded     :false,
        invalidated:false,
        mousePos   :{x:0,y:0},
        brushPos   :{x:0,y:0},
        mouseBuffer:{},
        backBuffer :{},
        interval   :5000,
        lastTime   :-1,
        count      :0,
        sourceImg  :null,
        rotation   :0,


        initialize:function () {

            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext("2d");
            this.el.appendChild(this.canvas);

            this.mouseBuffer = this.createBuffer();
            this.backBuffer = this.createBuffer();

            var promises = [];
            for (var i = 0; i < this.imgSrc.length; i++) {
                promises.push(this.loadImage("img/backgrounds/" + this.imgSrc[i] + ".jpg"));
            }
            promises.push(this.loadImage(this.mouseImgSrc));

            var _this = this;
            RSVP.all(promises).then(function (img) {

                for (var i = 0; i < img.length; i++) {
                    var src = img[i].src;
                    var index = img[i].src.indexOf(_this.mouseImgSrc);
                    if (index !== -1) {
                        _this.mouseImg = img.splice(i,1)[0];
                        break;
                    }
                }

                _this.img = img;
                _this.loaded = true;
                _this.resize(_this.canvas.width,_this.canvas.height);
            });


            this.invalidated = true;


        },


        resize:function (w,h) {

            if (this.canvas.width !== w || this.canvas.height !== h) {
                this.canvas.width = w;
                this.canvas.height = h;
            }

            if (this.loaded) {
                this.ctx.drawImage(this.img[this.count++ % this.img.length],0,0,this.canvas.width,this.canvas.height);
            }

            this.backBuffer.resize(w,h);
            this.mouseBuffer.resize(w,h);

            this.invalidated = true;

        },


        draw:function () {
            if (!this.loaded) {
                return;
            }

            var elapsed = Date.now() - this.lastTime
            var ratio = Math.min(1,elapsed / 5000);

            if (elapsed > 5000) {
                this.lastTime = Date.now();
                this.sourceImg = this.img[this.count++ % this.img.length];
                this.invalidated = true;
            }

            /* if (!this.invalidated) {
                 return;
             }*/

           // this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

            this.invalidated = false;

            this.drawMouse(ratio);
        },

        drawMouse:function (ratio) {


            var diffX = Math.abs((this.mousePos.x - this.brushPos.x)) / window.innerWidth;
            var diffY = Math.abs((this.mousePos.y - this.brushPos.y)) / window.innerHeight;
            //   console.log(diff);
            this.brushPos = {
                x:this.brushPos.x + (this.mousePos.x - this.brushPos.x) * 0.09,
                y:this.brushPos.y + (this.mousePos.y - this.brushPos.y) * 0.09
            };

            this.rotation += 0.1*Math.max(diffX, diffY);

            var angle = this.rotation * Math.PI / 180;
            var cosVal = Math.cos(this.rotation);
            var sinVal = Math.sin(this.rotation);

            var ctx = this.mouseBuffer.ctx;
            var canvas = this.mouseBuffer.canvas;

            var radius = 200;
            var rect = {
                x:this.brushPos.x - 200,
                y:this.brushPos.y - 200,
                w:radius * 2,
                h:radius * 2
            };

            ratio = (-Math.pow(2,-10 * ratio) + 1);

            ctx.save();
            ctx.clearRect(0,0,canvas.width,canvas.height);

            ctx.save();
            ctx.globalAlpha = ratio;
            ctx.translate(rect.x,rect.y);

            ctx.setTransform(cosVal,sinVal,-sinVal,cosVal,rect.x + radius,rect.y + radius);
            ctx.drawImage(this.mouseImg,-radius / 2,-radius / 2,radius,radius);
            ctx.restore();

            ctx.globalCompositeOperation = 'source-atop';
            ctx.drawImage(this.sourceImg,0,0,this.canvas.width,this.canvas.height);
            ctx.restore();

            this.ctx.drawImage(canvas,0,0,this.canvas.width,this.canvas.height);

        },


        setMousePos:function (mousePos) {
            /*this.mousePos = {
                x:this.mousePos.x + (mousePos.x - this.mousePos.x) * 0.9,
                y:this.mousePos.y + (mousePos.y - this.mousePos.y) * 0.9
            };
*/
            this.mousePos = mousePos;
            this.invalidated = true;
        },

        loadImage:function (src) {

            return new RSVP.Promise(function (resolve,reject) {

                var img = new Image();
                img.onload = function () {
                    resolve(img);
                }
                img.src = src;
            });
        }


    })
})