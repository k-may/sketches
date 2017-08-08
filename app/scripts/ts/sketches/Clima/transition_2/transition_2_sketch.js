/**
 * Created by kev on 15-07-31.
 */


define(['base_sketch','transition_2/snow_buffer'],function (BaseSketch,SnowBuffer) {

    return BaseSketch.extend({

        imgs       :null,
        athleteImg :null,
        bgImg      :null,
        loaded     :false,
        invalidated:false,
        className  :"transition2",

        athleteBuffer:{},
        bgBuffer     :{},
        snowBuffer   :{},
        canvas       :null,
        ctx          :null,

        canvasPos     :{
            x:0,
            y:0
        },
        targetMousePos:{},
        mousePos      :{},

        width :-1,
        height:-1,

        initialize:function () {

            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext("2d");

            this.el.appendChild(this.canvas);

            this.athleteBuffer = this.createBuffer();
            this.bgBuffer = this.createBuffer();

            this.snowBuffer = new SnowBuffer();

            var _this = this;
            this.loadImages(['img/transition_2.png','img/transition_2_bg.jpg']).then(function (img) {

                _this.imgs = img;
                _this.loaded = true;

                _this.setupCanvas();

            }).catch(function (e) {
                console.error(e);
            })


        },

        resize:function (w,h) {

            this.width = w;
            this.height = h;

            this.targetMousePos = {
                x:w >> 1,
                y:0
            };

            this.mousePos = {
                x:w >> 1,
                y:0
            };

            var offset = $(this.canvas).offset();

            this.canvasPos = {
                x:(this.width - this.canvas.width ) >> 1,
                y:200
            }
        },

        setupCanvas:function () {

            this.athleteImg = this.getImageBySrc('img/transition_2.png');
            this.bgImg = this.getImageBySrc('img/transition_2_bg.jpg');

            var w = this.athleteImg.naturalWidth;
            var h = this.athleteImg.naturalHeight;

            this.canvas.width = w;
            this.canvas.height = h;

            this.athleteBuffer.resize(w,h);

            var aspect = (h - 200) / this.bgImg.naturalHeight;

            //render scaled bg
            var bgWidth = aspect * this.bgImg.naturalWidth;
            this.bgBuffer.resize(bgWidth,h);
            this.bgBuffer.ctx.drawImage(this.bgImg,0,0,this.bgBuffer.width,this.bgBuffer.height);

            this.snowBuffer.resize(w,h);

            this.invalidate();

        },

        draw:function () {
            if (!this.loaded) {
                return;
            }

            if (this.invalidated) {
                this.drawAthleteScroll();
            }
            this.invalidated = false;

            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
            this.ctx.drawImage(this.athleteBuffer.canvas,0,0);

            this.snowBuffer.draw();
            this.ctx.drawImage(this.snowBuffer.canvas,0,0);

        },

        drawAthleteMouse:function () {

            this.mousePos = {
                x:this.mousePos.x + (this.targetMousePos.x - this.mousePos.x) * 0.01,
                y:this.mousePos.y + (this.targetMousePos.y - this.mousePos.y) * 0.01
            };

            var mouseX = (this.mousePos.x - this.width / 2) / (this.width / 2);
            var mouseY = (this.mousePos.y - this.height / 2) / (this.height / 2);

            var diffX = (this.bgBuffer.width - this.canvas.width)* 0.5;
            var offsetX = diffX+ (diffX * mouseX);

            var diffY = 200 * this.scrollRatio;
            var offsetY = diffY + (200 - diffY) * mouseY * -0.25;

            this.drawAthlete(offsetX, offsetY);

        },

        drawAthleteScroll:function () {

            var diffX = (this.bgBuffer.width - this.canvas.width) * 0.5;//*0.5 * mouseX;
            var diffY = 200 * this.scrollRatio;
            this.drawAthlete(diffX, -diffY);
        },

        drawAthlete:function (x,y) {


            var ctx = this.athleteBuffer.ctx;

            ctx.save();
            ctx.drawImage(this.athleteImg,0,0,this.canvas.width,this.canvas.height);
            ctx.globalCompositeOperation = "source-in";
            ctx.drawImage(this.bgBuffer.canvas,
                x,
                y,
                this.canvas.width,
                this.canvas.height,
                0,0,this.canvas.width,this.canvas.height);
            ctx.restore();

            //todo the image needs the alpha set, this is expensive!
            ctx.save();
            ctx.globalAlpha = 0.4;
            ctx.drawImage(this.athleteImg,0,0,this.canvas.width,this.canvas.height);
            ctx.restore();

        },


        setMousePos:function (mousePos) {
            this.targetMousePos = mousePos;
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