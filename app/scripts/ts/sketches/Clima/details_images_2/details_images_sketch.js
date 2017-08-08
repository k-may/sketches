/**
 * Created by kev on 15-07-29.
 */

define(['base_sketch','rsvp','details_images_2/details_image_view'],function (BaseSketch,RSVP,DetailsImageView) {

    return BaseSketch.extend({


        canvas         :{},
        ctx            :{},
        imgSrc         :["SHOT_32_054","SHOT_32_069","SHOT_32_100","SHOT_33_021","SHOT_34_005",
            "SHOT_34_034","SHOT_35_017","SHOT_35_029","SHOT_35_042","SHOT_35_044","SHOT_36_009",
            "SHOT_38_033","SHOT_38_047","SHOT_38_096","SHOT_38_142","SHOT_38_149"],
        imgViews       :[],
        loaded         :false,
        invalidated    :false,
        heightRatio    :10,
        containerHeight:5000,
        scrollTop      :0,

        initialize:function () {

            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext("2d");
            this.el.appendChild(this.canvas);

            var promises = [];
            for (var i = 0; i < this.imgSrc.length; i++) {
                var src = "img/jessica/" + this.imgSrc[i] + ".jpg";
                var imgView = new DetailsImageView({src:src});
                this.imgViews.push(imgView);
                promises.push(imgView.load());
            }

            var _this = this;
            RSVP.all(promises).then(function () {
                _this.loaded = true;
                _this.resize(_this.canvas.width,_this.canvas.height);
            }).catch(function (e) {
                console.error(e);
            });

        },


        resize:function (w,h) {
            //this causes redraw!
            if (this.canvas.width !== w && this.canvas.height !== h) {
                this.canvas.width = w;
                this.canvas.height = h;
            }

            var containerHeight = this.containerHeight;

            function generateRandomRect(width,height) {
                width = width >> 1;
                height = height >> 1;
                var x = Math.floor(Math.random() * (w - width));
                var y = Math.floor(Math.random() * (containerHeight - h));

                return {
                    x:x,
                    y:y,
                    w:width,
                    h:height
                };
            }

            for (var i = 0; i < this.imgViews.length; i++) {
                this.imgViews[i].windowHeight = h;
                this.imgViews[i].rect = generateRandomRect(this.imgViews[i].img.naturalWidth,this.imgViews[i].img.naturalHeight);
                this.imgViews[i].parallaxHeight = 300 + Math.floor(Math.random() * 1000);
                this.imgViews[i].resize(w,h);
            }

            this.invalidated = true;
        },


        draw:function () {

            if (!this.loaded) {
                return;
            }

            if (!this.invalidated) {
                return;
            }
            this.invalidated = false;

            this.drawCanvas();
        },


        setScrollRatio:function (ratio) {

            this.scrollTop = (this.containerHeight - this.canvas.height) * ratio;
            for (var i = 0; i < this.imgViews.length; i++) {
                this.imgViews[i].scrollTop = this.scrollTop;
            }

            this.invalidated = true;
        },

        drawCanvas:function () {

            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
            this.ctx.save();
            this.ctx.translate(0,-this.scrollTop);
            var rendered = [];
            for (var i = 0; i < this.imgViews.length; i++) {
                if (this.imgViews[i].draw(this.ctx)) {
                    rendered.push(this.imgViews[i]);
                }
            }

            this.ctx.fillStyle = "#ff0000";

            // http://gamedev.stackexchange.com/questions/586/what-is-the-fastest-way-to-work-out-2d-bounding-box-intersection
            function checkIntersection(rect1,rect2) {
                return (Math.abs(rect1.x - rect2.x) * 2 < (rect1.w + rect2.w)) &&
                    (Math.abs(rect1.y - rect2.y) * 2 < (rect1.h + rect2.h));
            }

            this.ctx.save();
            this.ctx.globalAlpha = 0.5;
            //check overlaps
            var iR,jR;
            for (var i = 0; i < rendered.length; i++) {
                var ii = rendered[i];
                for (var j = 0; j < rendered.length; j++) {
                    if (j == i) {
                        continue;
                    }
                    var jj = rendered[j];

                    iR = ii.getParallaxDim();
                    jR = jj.getParallaxDim();

                    if (checkIntersection(iR,jR)) {
                        bX = Math.max(iR.x,jR.x);
                        bY = Math.max(iR.y,jR.y);
                        bW = Math.min(Math.abs(bX - (iR.x + iR.w)),Math.abs(bX - (jR.x + jR.w)));
                        bH = Math.min(Math.abs(bY - (iR.y + iR.h)),Math.abs(bY - (jR.y + jR.h)));
                        this.ctx.fillRect(bX,bY,bW,bH);
                    }
                }
            }

            this.ctx.restore();

            this.ctx.restore();

        }

    })


})