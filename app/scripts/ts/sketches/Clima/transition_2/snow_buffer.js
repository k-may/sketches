/**
 * Created by kev on 15-07-31.
 */
/**
 * Created by kev on 15-07-30.
 */

define(['base_sketch',"noise"],function (BaseSketch, Noise) {


    var ANGLE_NOISE = Math.PI / 6;

    var Particle = function (img,angle,x,y,speed) {
        this.img = img;
        this.rads = angle * Math.PI / 180;
        this.x = x || 0;
        this.y = y || 0;
        this.speed = speed || 2 + Math.random() * 3;

        this.draw = function (ctx,noiseVal) {
            var rads = this.rads + ANGLE_NOISE * noiseVal;
            this.x += Math.sin(rads) * this.speed;
            this.y += Math.cos(rads) * this.speed;
            ctx.drawImage(this.img,this.x,this.y);
        }

    };

    return BaseSketch.extend({

        canvas:{},
        ctx   :{},

        noiseBuffer:{},
        bgBuffer   :{},
        bgImg      :null,

        snowImg:[],

        loaded     :false,
        invalidated:false,

        particle    :null,
        numParticles:400,
        particles   :[],
        noiseInc    :0,
        angle       :45,

        noiseRatioWidth :0,
        noiseRatioHeight:0,
        noiseData       :[[]],


        initialize:function () {

            this.particles = [];
            this.snowImg = [];

            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext("2d");

            this.noiseBuffer = this.createBuffer();
            this.noiseBuffer.resize(100,100);
            //fill white
            this.noiseBuffer.ctx.fillStyle = "#fff";
            this.noiseBuffer.ctx.fillRect(0,0,this.noiseBuffer.canvas.width,this.noiseBuffer.canvas.height);

            this.bgBuffer = this.createBuffer();

            var _this = this;
            this.loadImages(["img/snow.png", "img/snow10x10.png","img/snow20x20.png"]).then(function (imgs) {
                _this.snowImg = imgs;
                _this.loaded = true;
                _this.invalidated = true;
             //   _this.resize(_this.canvas.width,_this.canvas.height);

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

                this.renderNoise();

                for (var i = 0; i < this.numParticles; i++) {
                    var size = Math.floor(Math.random() * 10) % this.snowImg.length;
                    this.particles.push(new Particle(
                        this.snowImg[size],
                        this.angle,
                        Math.random() * this.canvas.width,
                        Math.random() * this.canvas.height,
                        Math.random() + (size * this.snowImg.length) * 2
                    ))
                }
            }

        },


        draw:function () {

            if (!this.loaded) {
                return;
            }

            this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);

            for (var i = 0; i < this.numParticles; i++) {
                this.drawParticle(this.particles[i]);
            }
        },

        drawParticle:function (particle) {


            if (particle.x < 0) {
                particle.x = this.canvas.width;
            } else if (particle.x >= this.canvas.width) {
                particle.x = 0;
            }

            if (particle.y >= this.canvas.height) {
                particle.y = 0;
                particle.x = Math.random() * this.canvas.width;
            }

            var nX = Math.floor(particle.x / this.noiseRatioWidth);
            var nY = Math.max(0,Math.floor(particle.y / this.noiseRatioHeight));
            var noiseVal = this.noiseData[nX][nY];

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

            var imgData = ctx.getImageData(0,0,nW,nH);
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

        }


    })
})