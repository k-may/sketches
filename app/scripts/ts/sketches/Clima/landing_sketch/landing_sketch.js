/**
 * Created by kev on 15-07-24.
 */

define(['landing_sketch/base_landing_sketch',
        'rsvp',
        "jquery",
        'landing_sketch/details_sketch'],
    function (BaseLandingSketch,
        RSVP,
        $,
        DetailsSketch) {

        return BaseLandingSketch.extend({

            canvas           :null,
            ctx              :null,
            bgBuffer         :{},
            titleMaskBuffer  :{},
            titleBuffer      :{},
            titleContRect    :{
                x:-1,
                y:-1,
                w:0.5,
                h:-1
            },
            titleTopBuffer      :{},
            titleMidImg      :{},
            titleBotBuffer      :{},
            backgroundImg    :{},
            titleMidRect     :{},
            titleBotRectStart:{},
            titleBotRectDest :{},
            width            :-1,
            height           :-1,
            detailsSketch    :null,

            initialize:function () {

                this.detailsSketch = new DetailsSketch({
                    el:document.createElement("canvas")
                });
                //add behind!
                this.el.appendChild(this.detailsSketch.el);


                BaseLandingSketch.prototype.initialize.call(this);
                //prepend folder
                for (var i = 0; i < this.imgSrc.length; i++) {
                    this.imgSrc[i] = "img/" + this.imgSrc[i];
                }
                var _this = this;
                this.loadImages(this.imgSrc).then(function (img) {
                    _this.img = img;
                    _this.loaded = true;
                    _this.setupCanvas();
                    _this.resize(_this.width,_this.height);
                }).catch(function (e) {
                    console.error(e);
                });
            },


            setupCanvas:function () {
                this.removeElements();

                this.titleTopBuffer = this.getImageBySrc('LANDING_SECTION_climaheat.png');
                this.titleMidImg = this.getImageBySrc('LANDING_SECTION_forget_distressed.png');
                this.titleBotBuffer = this.getImageBySrc('LANDING_SECTION_cold.png');
                this.backgroundImg = this.getImageBySrc('LANDING_SECTION.png');

                this.bgBuffer = this.createBuffer("bg");
                this.el.appendChild(this.bgBuffer.canvas);

                this.titleMaskBuffer = this.createBuffer("titleMask");
                this.titleBuffer = this.createBuffer("titleMid");
                this.el.appendChild(this.titleBuffer.canvas);
            },


            resize:function (w,h) {

                this.width = w;
                this.height = h;

                if (this.loaded) {
                    this.setupTitle();
                    this.renderBackground();
                    this.renderMaskBuffer();
                }

                this.detailsSketch.resize(w,h);

                this.invalidate();
            },

            renderMaskBuffer:function () {
                var ctx = this.titleMaskBuffer.ctx;
                ctx.clearRect(0,0,this.titleMaskBuffer.width,this.titleMaskBuffer.height);
                ctx.save();
                ctx.drawImage(this.bgBuffer.canvas,
                    (this.bgBuffer.width - this.titleMaskBuffer.width) / 2,
                    200,
                    this.titleMaskBuffer.width,
                    this.titleMaskBuffer.height,
                    0,
                    0,
                    this.titleMaskBuffer.width,
                    this.titleMaskBuffer.height
                );
                ctx.globalCompositeOperation = 'source-in';
                ctx.fillStyle = "#ff0000";
                ctx.fillRect(0,0,this.titleMaskBuffer.width,this.titleMaskBuffer.height);
                ctx.restore();
            },

            renderBackground:function (ctx,canvas) {

                this.bgBuffer.resize(this.width,this.height);

                var ctx = this.bgBuffer.ctx;
                var canvas = this.bgBuffer.canvas

                var scale = Math.max(canvas.width / this.backgroundImg.width,
                    canvas.height / this.backgroundImg.naturalHeight);
                var width = this.backgroundImg.naturalWidth * scale;
                var height = this.backgroundImg.naturalHeight * scale;
                var rect = {
                    x:(canvas.width - width) * 0.5,
                    y:canvas.height - height,
                    w:width,
                    h:height
                };

                ctx.globalAlpha = 0;
                ctx.fillRect(0,0,canvas.width,canvas.height);
                ctx.globalAlpha = 1;

                this.drawImage(ctx,this.backgroundImg,rect);
            },


            setupTitle:function () {

                //canvas gets positioned absolute, this needs to match up with the
                //dom elements perfectly!
                this.titleContRect = {
                    x:0.25,
                    y:0,
                    w:0.5,
                    h:802 / 1591 * 0.5
                };

                var yPos = 0;
                var renderWidth = this.width * this.titleContRect.w;

                this.titleMaskBuffer.resize(renderWidth,this.height - 200);
                this.titleBuffer.resize(renderWidth,this.height - 200);

                var aspect = this.titleTopBuffer.naturalWidth / renderWidth;

                yPos += this.titleTopBuffer.naturalHeight / aspect;//this.titleTopRectStart.h;

                aspect = this.titleMidImg.naturalWidth / renderWidth;
                this.titleMidRect = {
                    x:(this.width - renderWidth) * 0.5,
                    y:yPos,
                    w:renderWidth,
                    h:this.titleMidImg.naturalHeight / aspect
                };

                yPos += this.titleMidImg.naturalHeight / aspect;//this.titleMidRect.h;

                aspect = this.titleBotBuffer.naturalWidth / renderWidth;
                this.titleBotRectStart = {
                    x:(this.width - renderWidth) * 0.5,
                    y:yPos,
                    w:renderWidth,
                    h:this.titleBotBuffer.naturalHeight / aspect
                };

                this.titleBotRectDest = {
                    x:(this.width - renderWidth) * 0.5,
                    y:this.height,
                    w:renderWidth,
                    h:this.titleBotBuffer.naturalHeight / aspect
                };
            },


            toggle        :function () {
                this.detailsSketch.toggle();
               // BaseLandingSketch.prototype.toggle.call(this);
            },

            setScrollRatio:function (value) {
                BaseLandingSketch.prototype.setScrollRatio.call(this, value);
                this.detailsSketch.setScrollRatio(value);
            },

            draw:function () {

                this.detailsSketch.draw();

                if (!this.loaded) {
                    return;
                }

                if (!this.invalidated) {
                    return;
                }

                this.invalidated = false;

                var titleRatio = (this.scrollHeight / this.height) * this.scrollRatio;
                this.drawBottomTitle(titleRatio);

            },

            drawBottomTitle:function (ratio) {

                var ctx = this.titleBuffer.ctx;
                ctx.clearRect(0,0,this.titleBuffer.width,this.titleBuffer.height);

                //draw masked out "cold"
                ctx.save();
                ctx.drawImage(this.titleMaskBuffer.canvas,0,0);
                ctx.globalCompositeOperation = "source-in";
                rect = this.interpolate(this.titleBotRectStart,this.titleBotRectDest,ratio);
                ctx.drawImage(this.titleBotBuffer,0,rect.y,rect.w,rect.h);
                ctx.restore();

                //draw "forgot
                var rect = this.titleMidRect;
                this.drawImage(ctx,this.titleMidImg,{
                    x:rect.x - this.titleBuffer.width * 0.5,
                    y:rect.y,
                    w:rect.w,
                    h:rect.h
                });
            }


        });


    });