define([

    'base_sketch'

], function (

    BaseSketch

) { "use strict";

    var Cloud = function ( index, indexRatio, img, x, y, w, h, speed, alpha ) {

        this.index  = index;
        this.indexR = indexRatio || 1;
        this.img    = img;
        this.x      = x || 0;
        this.y      = y || 0;
        this.oY     = y || 0;
        this.w      = w || 100;
        this.h      = h || 50;
        this.speed  = speed || 0.5 + Math.random() * 0.5;
        this.alpha  = alpha || 0.5 + Math.random() * 0.5;

        this.draw = function (ctx, scrollRatio) {

            this.x -= this.speed;
            this.y = this.oY + ( ( this.indexR * 200 ) * scrollRatio );

            // ctx.globalAlpha = this.alpha;
            ctx.drawImage( this.img, this.x, this.y, this.w, this.h );
            // ctx.globalAlpha = 1;
        };

    };

    return BaseSketch.extend({

        canvas       : {},
        ctx          : {},

        cloudImgs    : null,

        loaded       : false,
        invalidated  : false,

        numClouds    : 20,
        clouds       : null,

        initialize : function () {

            this.clouds = [];
            this.cloudImgs = [];

            this.imgPaths = [
                'img/clouds/cloud-1.png',
                'img/clouds/cloud-1r.png',
                'img/clouds/cloud-2.png',
                'img/clouds/cloud-2r.png',
                'img/clouds/cloud-3.png',
                'img/clouds/cloud-3r.png',
                'img/clouds/cloud-4.png',
                'img/clouds/cloud-4r.png'
            ];

            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext("2d");

            var _this = this;

            this.loadImages(this.imgPaths).then(function (imgs) {

                _this.cloudImgs = imgs;

                _this.loaded = true;
                _this.invalidated = true;

            }).catch(
                function (e) {
                    console.error(e);
                }
            );
        },

        resize : function ( w, h ) {

            //this causes redraw!
            if ( this.canvas.width !== w && this.canvas.height !== h ) {
                this.canvas.width = w;
                this.canvas.height = h;
            }

            if ( this.loaded ) {

                for ( var i = 0; i < this.numClouds; i++ ) {

                    var cloudType = Math.floor( Math.random() * this.cloudImgs.length );
                    var cloudImage = this.cloudImgs[cloudType];
                    var cloudImageScale = 0.5;
                    var cloudImageRatio = cloudImage.naturalWidth / cloudImage.naturalHeight;
                    var cloudImageWidth = cloudImage.naturalWidth * cloudImageScale;
                    var cloudImageHeight = cloudImageWidth / cloudImageRatio;

                    var indexRatio = ( i + 1 ) / this.numClouds;

                    this.clouds.push(
                        new Cloud(
         /* index */        i,
    /* indexRatio */        indexRatio,
           /* img */        cloudImage,
             /* x */        Math.random() * ( this.canvas.width * 1.5 ),
             /* y */        ( this.canvas.height * 0.5 ) - ( indexRatio * ( this.canvas.height * 0.5 ) ),
             // /* w */        ( cloudImageWidth * 0.7 ) + Math.random( cloudImageWidth * 0.3 ),
             // /* h */        ( cloudImageHeight * 0.7 ) + Math.random( cloudImageHeight * 0.3 ),
             /* w */        cloudImageWidth * indexRatio,
             /* h */        cloudImageHeight * indexRatio,
         /* speed */        0.1 + Math.random() * 0.1,
         /* alpha */        0.5 + Math.random() * 0.5
                        )
                    );
                }
            }

        },

        draw : function (scrollRatio) {

            if (!this.loaded) {
                return;
            }

            this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );

            this.scrollRatio = scrollRatio;

            for (var i = 0; i < this.numClouds; i++) {
                this.drawCloud(this.clouds[i]);
            }
        },

        drawCloud : function (cloud) {

            if ( cloud.x <= ( cloud.w * -1 ) ) {
                cloud.x = this.canvas.width;
            }

            // var nX = Math.floor(cloud.x);
            // var nY = Math.max(0,Math.floor(cloud.y));

            // try {
                // cloud.draw(this.ctx, this.scrollRatio - 0.5);
                cloud.draw(this.ctx, this.scrollRatio);
            // } catch (e) {
            //     console.log(nX,nY);
            // }
        }

    });

});