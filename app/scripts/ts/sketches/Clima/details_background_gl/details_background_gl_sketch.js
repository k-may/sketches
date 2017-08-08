/**
 * Created by kev on 15-07-21.
 */

define(['base_sketch','rsvp'],function (BaseSketch,RSVP) {


    var TRANSFORM_PREFIX = Modernizr.prefixed('transform');

    return BaseSketch.extend({

        imgSrc         :['backgrounds1','backgrounds2','backgrounds3','backgrounds4'],
        img            :[],
        loaded         :false,
        invalidated    :false,
        containerHeight:10000,
        carouselList   :[],
        scrollContainerScale : 1,

        initialize:function () {

            var promises = [];
            for (var i = 0; i < this.imgSrc.length; i++) {
                promises.push(this.loadImage("img/backgrounds/" + this.imgSrc[i] + ".jpg"));
            }

            var _this = this;
            RSVP.all(promises).then(function (imgs) {

                //create image elements and append to dom
                for (var i = 0; i < imgs.length; i++) {
                    var img = document.createElement("div");
                    img.style.backgroundImage = "url(" + imgs[i].src + ")";
                    img.setAttribute("class","details_transition_image_cont");
                    _this.img.push({
                        imgElement:img,
                        img       :imgs[i]
                    });
                }

                _this.loaded = true;
                _this.resize(window.innerWidth,window.innerHeight);
            });

            this.invalidated = true;
        },

        resize:function (w,h) {

            this.invalidated = true;

            this.scrollContainerScale = this.containerHeight / $(document.body).height();

            if (this.img.length) {

                var overlap = 100;
                var y = 0;
                var count = 0;
                this.carouselList = [];
                while (y < this.containerHeight) {
                    var imgObj = this.img[count++ % this.img.length];
                    var imgElement = imgObj.imgElement.cloneNode();
                    var img = imgObj.img;
                    var scale = w / img.naturalWidth;
                    var item = {
                        rect      :{
                            x:0,
                            y:y,
                            w:Math.floor(img.naturalWidth * scale),
                            //  h:Math.floor(Math.random() * ((img.naturalHeight * scale) - overlap)) + overlap
                            h:Math.floor(img.naturalHeight * scale)
                        },
                        imgElement:imgElement,
                        img       :img,
                        opacity   :Math.random()
                    };

                    imgElement.style.width = item.rect.w + "px";
                    imgElement.style.height = item.rect.h + "px";

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

            var windowHeight = window.innerHeight;
            var scrollTop = (this.containerHeight - windowHeight) * this.scrollRatio;
            var scrollBottom = scrollTop + windowHeight * this.scrollContainerScale;

            for (var i = 0; i < this.carouselList.length; i++) {

                var img = this.carouselList[i];

               /* var direction = Math.abs(scrollTop - (img.rect.y + img.rect.h)) > Math.abs(scrollBottom - img.rect.y) ? -1 : 1;
                var imgRatio = Math.min(Math.abs(scrollTop - (img.rect.y + img.rect.h)),Math.abs(scrollBottom - img.rect.y));
                imgRatio = 1 - Math.min(1,imgRatio / windowHeight);
                imgRatio = (-Math.pow(2, -10 * imgRatio) + 1)
                imgRatio *= direction;*/

                var top = img.rect.y;// + imgRatio * 100;
                var bottom = top + img.rect.h;

                if (!(bottom < scrollTop || top > scrollBottom)) {

                    if(!img.imgElement.parentElement){
                        this.el.appendChild(img.imgElement);
                    }

                    var t = top - scrollTop;
                    this.setPosition(img.imgElement,{x:0,y:t});
                }else{

                    if(img.imgElement.parentElement){
                        this.el.removeChild(img.imgElement);
                    }

                }

            }
        },

        setPosition:function (elem,pos) {
            pos.z = pos.z || 0;
            elem.style[TRANSFORM_PREFIX] = "translate3d(" + pos.x + "px, " + pos.y + "px," + pos.z + ")";
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


    });

})