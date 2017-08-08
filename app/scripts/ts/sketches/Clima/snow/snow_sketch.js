/**
 * Created by kev on 15-07-30.
 */

define(['base_sketch',"noise"],function (BaseSketch,Noise) {


    var ANGLE_NOISE = Math.PI / 6;

    var Particle = function (img,angle,x,y,speed) {
        this.img = img;
        this.rads = angle * Math.PI / 180;
        this.x = x || 0;
        this.y = y || 0;
        this.speed = speed || 2 + Math.random() * 3;
        this.currentSpeed = speed;

        this.draw = function (ctx) {

            ctx.drawImage(this.img,this.x,this.y);
        }

    };

    return BaseSketch.extend({

        canvas:{},
        ctx   :{},

        mousePos   :{x:0,y:0},
        noiseBuffer:{},
        bgBuffer   :{},
        bgImg      :null,

        snowImg:[],

        loaded     :false,
        invalidated:false,

        particle    :null,
        numParticles:2000,
        particles   :[],
        noiseInc    :0,
        angle       :15,

        noiseRatioWidth :0,
        noiseRatioHeight:0,
        noiseData       :[[]],


        initialize:function () {

            this.particles = [];
            this.snowImg = [];

            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext("2d");
            this.el.appendChild(this.canvas);

            this.noiseBuffer = this.createBuffer();
            this.noiseBuffer.resize(100,100);
            //fill white
            this.noiseBuffer.ctx.fillStyle = "#fff";
            this.noiseBuffer.ctx.fillRect(0,0,this.noiseBuffer.canvas.width,this.noiseBuffer.canvas.height);

            this.bgBuffer = this.createBuffer();

            var _this = this;
            this.loadImages(["img/snow.png","img/snow10x10.png","img/LANDING_SECTION.png"]).then(function (imgs) {

                for (var i = 0; i < imgs.length; i++) {
                    if (imgs[i].src.indexOf("img/LANDING_SECTION.png") !== -1) {
                        _this.bgImage = imgs.splice(i,1)[0];
                    }
                }

                _this.snowImg = imgs;
                _this.loaded = true;
                _this.invalidated = true;
                _this.resize(_this.canvas.width,_this.canvas.height);

            }).catch(function (e) {
                console.error(e);
            })
        },

        resize:function (w,h) {
            //this causes redraw!
            if (this.canvas.width !== w && this.canvas.height !== h) {
                this.canvas.width = w;
                this.canvas.height = h;

            }

            if (this.loaded) {

                this.bgBuffer.resize(w,h);
                this.drawTransitionBg();

                this.renderNoise();

                for (var i = 0; i < this.numParticles; i++) {
                    var size = Math.floor(Math.random() * 10) % 2;
                    this.particles.push(new Particle(
                        this.snowImg[size],
                        this.angle,
                        Math.random() * this.canvas.width,
                        Math.random() * this.canvas.height,
                        Math.random() * 2 + 1 + (size * 10)
                    ))
                }
            }

        },


        draw:function () {

            if (!this.loaded) {
                return;
            }

            this.ctx.save();
            this.ctx.globalAlpha = 0.5;
            this.ctx.drawImage(this.bgBuffer.canvas,0,0);
            this.ctx.restore();

            /*this.mousePos = {
                x:this.canvas.width >> 1,
                y:this.canvas.height >> 1
            };*/

            for (var i = 0; i < this.numParticles; i++) {
                this.drawParticle(this.particles[i]);
            }


            //this.renderNoise();
            //this.drawNoise();

        },


        drawTransitionBg:function () {

            var ctx = this.bgBuffer.ctx;
            var canvas = this.bgBuffer.canvas;

            var scale = Math.max(canvas.width / this.bgImage.naturalWidth,
                canvas.height / this.bgImage.naturalHeight);
            var width = this.bgImage.naturalWidth * scale;
            var height = this.bgImage.naturalHeight * scale;
            var rect = {
                x:(canvas.width - width) * 0.5,
                y:canvas.height - height,
                w:width,
                h:height
            };
            ctx.globalAlpha = 0;
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.globalAlpha = 1;

            this.drawImage(ctx,this.bgImage,rect);

        },

        drawParticle:function (particle) {

            if (particle.y >= this.canvas.height) {
                particle.y = 0;
                particle.x = Math.random() * (this.canvas.width + 800) - 400;
            }

            var mouseOffsetRads = 0;
            var radius =50;
            var ratio = 1;

            if (this.mousePos.y - particle.y < radius && this.mousePos.y - particle.y > 0) {
                if (Math.abs(particle.x - this.mousePos.x) < radius) {

                    var distance = Math.sqrt(Math.pow(particle.x - this.mousePos.x,2) +
                        Math.pow(particle.y - this.mousePos.y,2));

                    if (distance < radius) {
                        var direction = (particle.x - this.mousePos.x) / Math.abs(particle.x - this.mousePos.x);
                        ratio = 1 - distance / radius;
                        ratio = ratio*ratio;
                        // mouseOffsetRads *= mouseOffsetRads;
                        mouseOffsetRads = (1 - ratio) * (Math.PI / 20) * direction;
                    }

                }
            }

            var nX = Math.floor(Math.max(0,Math.min(this.canvas.width,particle.x)) / this.noiseRatioWidth);
            var nY = Math.max(0,Math.floor(particle.y / this.noiseRatioHeight));
            var noiseVal = this.noiseData[nX][nY];

            var speed = (particle.speed*ratio);
            particle.currentSpeed = particle.speed + (speed - particle.speed)*0.9;

            var rads = particle.rads + ANGLE_NOISE * noiseVal + mouseOffsetRads;
            particle.x += Math.sin(rads) * particle.currentSpeed;//(particle.speed*ratio);// -((1- ratio)*particle.speed));
            particle.y += Math.cos(rads) * particle.currentSpeed;//(particle.speed*ratio);// -((1 - ratio)*particle.speed));

            try {
                particle.draw(this.ctx,noiseVal);
            } catch (e) {
                console.log(nX,nY);
            }
        },

        drawNoise:function () {
            this.ctx.drawImage(this.noiseBuffer.canvas,this.canvas.width - this.noiseBuffer.canvas.width - 20,
                this.canvas.height - this.noiseBuffer.canvas.height - 20);
        },

        renderNoise:function () {

            var nW = this.noiseBuffer.canvas.width;
            var nH = this.noiseBuffer.canvas.height;
            var ctx = this.noiseBuffer.ctx;

            var imgData = ctx.getImageData(0,0,nW,nH);//.data;
            var pixelData = imgData.data;
            this.noiseInc += 0.1;
            var index = 0;
            for (var i = 0; i < nW; i++) {
                this.noiseData[i] = [];
                for (var j = 0; j < nH; j++) {
                    index = (i + j * nW) * 4 + 3;

                    var value = noise.simplex2((i + this.noiseInc) / 200,(j + this.noiseInc) / 200);
                    this.noiseData[i][j] = value;

                    var pixelValue = Math.floor((1 + value) * 125);
                    pixelData[index] = pixelValue;
                }
            }
            ctx.putImageData(imgData,0,0);

            this.noiseRatioWidth = this.canvas.width / (this.noiseBuffer.canvas.width - 1);
            this.noiseRatioHeight = this.canvas.height / (this.noiseBuffer.canvas.height - 1);

        },

        setMousePos:function (mousePos) {
            this.mousePos = mousePos;
        }


    })
})