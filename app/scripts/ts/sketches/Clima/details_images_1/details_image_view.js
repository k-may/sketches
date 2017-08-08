/**
 * Created by kev on 15-07-20.
 */


define(['backbone','rsvp'],function (Backbone,RSVP) {

    return Backbone.View.extend({

        img:null,
        rect          :{
            x:0,
            y:0,
            w:0,
            h:0
        },
        src           :"",
        parallaxHeight:300,

        initialize:function (options) {
            this.src = options.src;
        },

        load:function () {
            var _this = this;
            return new RSVP.Promise(function (resolve,reject) {
                _this.img = new Image();
                _this.img.onload = function () {
                    resolve();
                }
                _this.img.src = _this.src;
            })
        },

        draw:function (ctx) {


            var rect = this.getParallaxDim();
            if (rect.y < this.scrollTop + this.windowHeight || rect.y + rect.height > this.scrollTop) {

                //middle - this.rect.y) / (this.windowHeight >> 1);
                rect = this.getRect();
                ctx.drawImage(this.img, rect.x, rect.y, rect.w, rect.h);
                return true;
            }
            return false;
        },

        getParallaxDim:function () {

            return {
                x:this.rect.x,
                y:this.rect.y - this.parallaxHeight,
                w:this.rect.w,
                h:this.rect.h + this.parallaxHeight * 2
            };

        },

        getRect : function(){

            var rect = this.getParallaxDim();

            var wH = (this.windowHeight + this.parallaxHeight * 2);
            var wM = this.scrollTop + wH;

            var rM = rect.y + (rect.height >> 1);

            var ratio = (wM - rM) / wM;
            ratio = Math.pow(ratio, 4);

            return {
                x : this.rect.x,
                y : this.rect.y + this.parallaxHeight * ratio,
                w : this.rect.w,
                h : this.rect.h
            };
        }


    })


})