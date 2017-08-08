/**
 * Created by kev on 15-07-21.
 */

define(['base_sketch','rsvp'],function (BaseSketch,RSVP) {

    return BaseSketch.extend({

        imgSrc         :['backgrounds1','backgrounds2','backgrounds3','backgrounds4'],
        img            :[],
        canvas         :{},
        ctx            :{},
        loaded         :false,
        invalidated    :false,
        containerHeight:10000,
        carouselList   :[],

        initialize:function () {

            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext("2d");
            this.el.appendChild(this.canvas);

            var promises = [];
            for (var i = 0; i < this.imgSrc.length; i++) {
                promises.push(this.loadImage("img/backgrounds/" + this.imgSrc[i] + ".jpg"));
            }

            var _this = this;
            RSVP.all(promises).then(function (img) {
                _this.img = img;
                _this.loaded = true;
                _this.resize(_this.canvas.width,_this.canvas.height);
            });

            this.invalidated = true;
        },

        resize:function (w,h) {

            if (this.canvas.width !== w && this.canvas.height !== h) {
                this.canvas.width = w;
                this.canvas.height = h;
            }

            this.invalidated = true;

            if (this.img.length) {

                var overlap = 200;
                var scale = w / this.img[0].naturalWidth;
                var y = 0;
                var count = 0;
                this.carouselList = [];
                while (y < this.containerHeight) {
                    var img = this.img[count++ % this.img.length];
                    var item = {
                        rect     :{
                            x:0,
                            y:y,
                            w:Math.floor(img.naturalWidth * scale),
                            h:Math.floor(img.naturalHeight * scale) - overlap
                            //h:Math.floor(Math.random() * ((img.naturalHeight * scale) - overlap)) + overlap
                        },
                        fillStyle:"rgb(" + (count * 10) + "," + (255 - (count * 10)) + ", 23)",
                        img      :img,
                        opacity  :Math.random()*0.2 + 0.5
                    };

                    this.carouselList.push(item);
                    y += item.rect.h;
                }
            }

        },

        draw:function () {
            if (!this.loaded) {
                return;
            }

            if (!this.invalidated) {
                return;
            }
            this.invalidated = false;


            this.drawCarousel();

        },

        drawCarousel:function () {

            var scrollTop = (this.containerHeight - this.canvas.height) * this.scrollRatio;
            var scrollBottom = scrollTop + this.canvas.height;


            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
            this.ctx.save();
            this.ctx.translate(0,-scrollTop);

            for (var i = 0; i < this.carouselList.length; i++) {

                var img = this.carouselList[i];

                var direction = Math.abs(scrollTop - (img.rect.y + img.rect.h)) > Math.abs(scrollBottom - img.rect.y) ? -1 : 1;
                var imgRatio = Math.min(Math.abs(scrollTop - (img.rect.y + img.rect.h)),Math.abs(scrollBottom - img.rect.y));
                imgRatio = 1 - Math.min(1,imgRatio / this.canvas.height);
                imgRatio = (-Math.pow(2, -10 * imgRatio) + 1)
                imgRatio *= direction;

                var top = img.rect.y + imgRatio * 100;
                var bottom = top + img.rect.h;

                //console.log(imgRatio, direction);
                if (!(bottom < scrollTop || top > scrollBottom)) {


                    this.ctx.globalAlpha = img.opacity;
                    this.ctx.drawImage(img.img,img.rect.x,top,img.rect.w,img.rect.h);

                    //  this.ctx.globalAlpha = 0.5;
                    //this.ctx.fillStyle = img.fillStyle;
                    // this.ctx.fillRect(img.rect.x, img.rect.y, img.rect.w, img.rect.h);
                    //this.ctx.fillRect(img.rect.x,top,img.rect.w,img.rect.h);
                }

            }

            this.ctx.restore();
        }



    });

})