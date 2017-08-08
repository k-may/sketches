/**
 * Created by kev on 15-08-14.
 */


define(['underscore',
        'base_sketch',
        'snow_2/noiseBuffer'],

    function (_,
        BaseSketch,
        NoiseBuffer) {

        Number.prototype.mod = function (n) {
            return ((this % n) + n) % n;
        };

        var HALF_PI = Math.PI / 2;
        var QUART_PI = Math.PI / 4;
        var DBL_PI = Math.PI * 2;

        var ParticleBuffer = function (buffer,img) {

            buffer.length = 50;
            buffer.numAngles = 30;
            buffer.resize(100,buffer.numAngles * 100);

            var inc = DBL_PI / buffer.numAngles;

            buffer.ctx.globalAlpha = 0.7;
            for (var i = 0; i < buffer.numAngles; i++) {
                buffer.ctx.save();
                buffer.ctx.translate(0,i * 100);

                buffer.ctx.translate(buffer.width >> 1,buffer.width >> 1);
                buffer.ctx.rotate(i * inc);
                buffer.ctx.drawImage(img,-buffer.width >> 1,-img.naturalHeight >> 1,buffer.length,img.naturalHeight);
                buffer.ctx.restore();
            }
            return buffer;
        };

        var Particle = function (noiseBuffer,particleBuffer) {
            this.noiseBuffer = noiseBuffer;
            this.particleBuffer = particleBuffer;
        };
        _.extend(Particle.prototype,{
            length:Math.random() * 10 + 10,
            pos   :{x:0,y:0},
            angle :QUART_PI,
            count :0,

            resize:function (w,h) {
                this.pos = {
                    x:Math.random() * w,
                    y:Math.random() * h
                };
            },

            update:function (bounds) {

                var noiseAmt = this.noiseBuffer.getNoiseByRatio(this.pos.x / (bounds.right - bounds.left),this.pos.y / (bounds.bottom - bounds.top)) * 0.4;
                this.angle = noiseAmt * HALF_PI;//- QUART_PI/10;

                var speed = ((noiseAmt + 1) / 2) * 400;
                var x = this.pos.x - Math.sin(this.angle) * speed;
                var y = this.pos.y + Math.cos(this.angle) * speed;

                if (x > bounds.right || x < bounds.left || y > bounds.bottom) {
                    x = Math.random() * (bounds.right - bounds.left) + bounds.left;
                    y = Math.random() * -speed - speed;
                }

                this.pos = {
                    x:x,
                    y:y
                };

            },

            draw:function (ctx) {
                var angle = (this.angle + HALF_PI).mod(DBL_PI);
                var ratio = (angle / DBL_PI);
                var angleIndex = Math.floor(ratio * this.particleBuffer.numAngles);
                ctx.drawImage(this.particleBuffer.canvas,0,angleIndex * 100,100,100,
                    this.pos.x,this.pos.y,100,100);
            }

        });

        return BaseSketch.extend({

            particleBuffer:null,
            noiseBuffer   :null,
            mainBuffer    :null,
            numParticles  :1000,
            frameRate     :30,
            lastUpdate    :-1,

            initialize:function () {

                this.particles = [];
                this.snowImg = [];

                this.mainBuffer = this.createBuffer();
                this.ctx = this.mainBuffer.ctx;

                this.el.appendChild(this.mainBuffer.canvas);

                var _this = this;
                this.loadImages(["img/snow.png","img/snow10x10.png","img/LANDING_SECTION.png"]).then(function (imgs) {

                    for (var i = 0; i < imgs.length; i++) {
                        if (imgs[i].src.indexOf("img/LANDING_SECTION.png") !== -1) {
                            _this.bgImage = imgs.splice(i,1)[0];
                        }
                    }

                    _this.noiseBuffer = new NoiseBuffer({w:100,h:100});
                    //_this.particle = new Particle(imgs[1],_this.noiseBuffer,_this.createBuffer());
                    _this.snowImg = imgs;
                    _this.createParticles();
                    _this.loaded = true;
                    _this.invalidated = true;
                    _this.resize(_this.mainBuffer.width,_this.mainBuffer.height);

                }).catch(function (e) {
                    console.error(e);
                })
            }
            ,

            createParticles:function () {

                this.particleBuffer = new ParticleBuffer(this.createBuffer(),this.snowImg[1]);

                for (var i = 0; i < this.numParticles; i++) {
                    var particle = new Particle(this.noiseBuffer,this.particleBuffer);
                    particle.resize(this.mainBuffer.width,this.mainBuffer.height);
                    this.particles.push(particle);
                }
            },

            resize:function (w,h) {
                //this causes redraw!
                this.mainBuffer.resize(w,h);

                if (this.loaded) {

                }

            }
            ,
            draw  :function (time) {


                if (!this.loaded) {
                    return;
                }

                if (time - this.lastUpdate > 50) {
                    this.lastUpdate = time;
                    this.noiseBuffer.renderNoise();

                    this.ctx.fillStyle = "#000";
                    this.ctx.fillRect(0,0,this.mainBuffer.width,this.mainBuffer.height);
                    // this.ctx.drawImage(this.particleBuffer.canvas,0,0);

                    for (var i = 0; i < this.numParticles; i++) {
                        var particle = this.particles[i];//new Particle(imgs[1],this.noiseBuffer,this.createBuffer());
                        particle.draw(this.ctx);
                        particle.update({left:-400, top : 0, right:this.mainBuffer.width + 400,bottom:this.mainBuffer.height});
                    }
                }

            }


        })

    });
