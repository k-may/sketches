/**
 * Created by kev on 15-07-17.
 */


define(['backbone', 'rsvp', 'TweenMax'],function (Backbone, RSVP, TweenMax) {

    return Backbone.View.extend({

        invalidated:false,
        className  :"sketch_cont",
        scrollRatio:0,
        mousePos   :{},
        animObj    :{
            value:0
        },
        scrollHeight : -1,

        initialize:function () {
            this.invalidate();
        },

        resize:function (w,h) {
            this.invalidated = true;
        },

        draw:function () {
            if (!this.invalidated) {
                return false;
            }
            this.invalidated = false;

            return true;
        },

        setScrollRatio:function (value) {
            TweenMax.killTweensOf(this.animObj);
            this.scrollRatio = value;
            this.invalidate();
        },

        setScrollHeight : function(value){
            this.scrollHeight = value;
            this.invalidate();
        },

        invalidate : function (){
          this.invalidated = true;
        },

        toggle        :function () {
            if (this.scrollRatio < 0.5) {
                this.animateIn();
            } else {
                this.animateOut();
            }
        },

        animateIn:function () {
            TweenMax.to(this.animObj,1.2,{
                value:1,onUpdate:_.bind(function () {
                    this.scrollRatio = this.animObj.value;
                    this.invalidate();
                },this),
                ease :'Expo.easeInOut'
            });
        },

        animateOut:function () {
            TweenMax.to(this.animObj,1.2,{
                value:0,onUpdate:_.bind(function () {
                    this.scrollRatio = this.animObj.value;
                    this.invalidate();
                },this),
                ease :'Expo.easeInOut'
            });
        },

/*
        loadImages : function(arr, callback){
            var promises = [];
            for (var i = 0; i < arr.length; i++) {
                promises.push(this.loadImage(arr[i]));
            }

            var _this = this;
            return RSVP.all(promises);
        },

        loadImage:function (src) {
            return new RSVP.Promise(function (resolve,reject) {
                var img = new Image();
                img.onload = function () {
                    resolve(img);
                };
                img.src = src;
            });
        },
*/

        drawImage:function (ctx,img,dest) {
            ctx.drawImage(img,dest.x,dest.y,dest.w,dest.h);
        }


    });

});