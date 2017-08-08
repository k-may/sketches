define([

    'base_sketch',
    'transition_1/clouds_buffer'

], function (

    BaseSketch,
    CloudsBuffer

) { "use strict";

    return BaseSketch.extend({

        className     : "transition1",
        canvas        : {},
        ctx           : {},

        imgPaths      : null,
        imgs          : null,

        loaded        : false,
        invalidated   : false,

        athleteBuffer : null,
        artworkBuffer : null,
        cloudsBuffer  : null,

        athleteImg    : null,
        bgImg         : null,

        initialize : function () {

            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext("2d");

            this.el.appendChild(this.canvas);

            this.athleteBuffer = this.createBuffer();
            this.artworkBuffer = this.createBuffer();
            this.cloudsBuffer = new CloudsBuffer();

            this.imgPaths = [
                'img/transition_1.png',
                'img/transition_1_mask.png',
                'img/transition_1_combined.png'
            ];

            var _this = this;

            this.loadImages(this.imgPaths).then(function (img) {

                _this.imgs = img;

                _this.loaded = true;
                _this.setupCanvas();
            });
        },

        invalidate : function () {
            this.invalidated = true;
        },

        resize : function (w,h) {

        },

        setupCanvas : function () {

            this.athleteImg = this.getImageBySrc(this.imgPaths[0]);
            this.maskImg = this.getImageBySrc(this.imgPaths[1]);
            this.bgImg = this.getImageBySrc(this.imgPaths[2]);

            this.canvas.width = this.athleteImg.naturalWidth;
            this.canvas.height = this.athleteImg.naturalHeight;

            this.athleteBuffer.resize(this.canvas.width, this.canvas.height);
            this.artworkBuffer.resize(this.canvas.width, this.canvas.height);
            this.cloudsBuffer.resize(this.canvas.width, this.canvas.height);

            this.invalidate();
        },

        draw: function () {

            if ( !this.loaded ) { return; }

            if ( this.invalidated ) {

            }


            // Background + Clouds
            // -------------------
            var artworkCtx = this.artworkBuffer.ctx;

            artworkCtx.clearRect( 0, 0, this.canvas.width, this.canvas.height );

            // Add background image
            var heightRatio = ( this.bgImg.naturalHeight / this.canvas.height );
            var realWidth = this.bgImg.naturalWidth / heightRatio;
            artworkCtx.drawImage( this.bgImg, 0, 200 * this.scrollRatio, realWidth, this.canvas.height );

            this.cloudsBuffer.draw(this.scrollRatio);
            artworkCtx.drawImage( this.cloudsBuffer.canvas, 0, 0 );


            // Mask
            // -------------------
            var athleteCtx = this.athleteBuffer.ctx;

            athleteCtx.fillRect( 0, 0, this.canvas.width, this.canvas.height );

            athleteCtx.save();
            athleteCtx.globalCompositeOperation = "source-in";
            athleteCtx.drawImage( this.maskImg, 0, 0, this.canvas.width, this.canvas.height );
            athleteCtx.drawImage( this.artworkBuffer.canvas, 0, 0, this.canvas.width, this.canvas.height );
            athleteCtx.restore();

            this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );

            this.ctx.drawImage( this.athleteImg, 0, 0, this.canvas.width, this.canvas.height );
            this.ctx.drawImage( this.athleteBuffer.canvas, 0, 0, this.canvas.width, this.canvas.height );

            this.invalidated = false;
        },


        getImageBySrc : function (src) {

            for (var i = 0; i < this.imgs.length; i++) {

                if (this.imgs[i].src.indexOf(src) !== -1) {
                    return this.imgs[i];
                }
            }
        }

    });

});