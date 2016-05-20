var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../../common/BaseSketch", "./Item", "../../utils/AnimUtils"], function (require, exports, BaseSketch, Item, AnimUtils) {
    "use strict";
    /**
     * Created by kev on 16-01-06.
     */
    ///<reference path="../../../../../typings/globals/require/index.d.ts"/>
    var Carousel3D = (function (_super) {
        __extends(Carousel3D, _super);
        function Carousel3D() {
            var _this = this;
            _super.call(this);
            this.windowWidth = 0;
            this.windowHeight = 0;
            this.currentRads = 0;
            this.itemAngle = 40;
            this.currentAngle = 0;
            this.targetAngle = 0;
            require(['text!ts/sketches/carousel3D/carousel3D.html'], function (html) {
                console.log(html);
            });
            this.container = document.getElementsByClassName('container')[0];
            this.carousel = document.getElementsByClassName('carousel')[0];
            this.items = [];
            var itemEls = document.getElementsByClassName('item');
            for (var i = 0; i < itemEls.length; i++) {
                var item = new Item(itemEls[i], i);
                this.items.push(item);
            }
            window.addEventListener("Swipe", function (evt) {
                _this.onNext(evt);
            });
        }
        Carousel3D.prototype.onNext = function (evt) {
            var direction = evt.detail.direction;
            //update angle here!
            this.targetAngle += this.itemAngle * -direction;
        };
        Carousel3D.prototype.draw = function () {
            var diff = this.targetAngle - this.currentAngle;
            this.currentAngle += diff * 0.1;
            this.drawCarousel();
        };
        Carousel3D.prototype.drawCarousel = function () {
            var _this = this;
            //determine angle between items
            var rads = this.itemAngle * (Math.PI / 180);
            //rotate the carousel
            var cRot = 10;
            var cYOffset = this.itemWidth * Math.tan(cRot * Math.PI / 180);
            //determine z for items
            var z = ((this.itemWidth + 100) / 2) / Math.tan(rads / 2);
            var transformMatrix = AnimUtils.GetTranslationMatrix(-this.itemWidth / 2, cYOffset, -z);
            var rotationMatrix = AnimUtils.GetRotationMatrix(3, 0, 0);
            AnimUtils.SetTransformMatrix(this.carousel, [rotationMatrix, transformMatrix]);
            //apply transform to each
            this.items.forEach(function (item) {
                var r = _this.itemAngle * item.index + _this.itemAngle / 2 + _this.currentAngle;
                var rotation = AnimUtils.GetRotationMatrix(0, r, 0);
                var translation = AnimUtils.GetTranslationMatrix(0, 0, -z);
                var rotation2 = AnimUtils.GetRotationMatrix(0, 0, cRot);
                AnimUtils.SetTransformMatrix(item.el, [rotation, translation, rotation2]);
                item.draw();
            });
        };
        Carousel3D.prototype.resize = function (windowWidth, windowHeight) {
            var _this = this;
            this.windowWidth = windowWidth;
            this.windowHeight = windowHeight;
            this.itemWidth = windowWidth - 400;
            this.itemHeight = windowHeight - 400;
            this.items.forEach(function (item) {
                item.resize(_this.itemWidth, _this.itemHeight); //windowWidth, windowHeight);
            });
        };
        Carousel3D.prototype.setCurrentItem = function (item) {
            if (this.currentItem) {
                this.currentItem.$el.removeClass("active");
            }
            this.currentItem = item;
            this.currentItem.$el.addClass("active");
        };
        return Carousel3D;
    }(BaseSketch));
    return Carousel3D;
});
//# sourceMappingURL=Carousel3D.js.map