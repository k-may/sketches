var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "../../common/BaseSketch", "./Item", "../../utils/anim_utils"], function (require, exports, BaseSketch_1, Item_1, anim_utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Carousel3D = (function (_super) {
        __extends(Carousel3D, _super);
        //-----------------------------------------------------
        function Carousel3D() {
            var _this = _super.call(this) || this;
            _this.windowWidth = 0;
            _this.windowHeight = 0;
            _this.itemAngle = 40;
            _this.currentAngle = 0;
            _this.targetAngle = 0;
            _this.loaded = false;
            var fileref = document.createElement("link");
            fileref.rel = "stylesheet";
            fileref.type = "text/css";
            fileref.href = "styles/carousel3d.css";
            document.getElementsByTagName("head")[0].appendChild(fileref);
            require(['text!ts/sketches/carousel3D/carousel3D.html'], function (html) {
                _this.el.innerHTML = html;
                _this.container = _this.el.getElementsByClassName('container')[0];
                _this.carousel = _this.el.getElementsByClassName('carousel')[0];
                _this.items = [];
                var itemEls = _this.el.getElementsByClassName('item');
                for (var i = 0; i < itemEls.length; i++) {
                    var item = new Item_1.Item(itemEls[i], i);
                    _this.items.push(item);
                }
                window.addEventListener("Swipe", function (evt) {
                    _this.onNext(evt);
                });
                _this.resize(window.innerWidth, window.innerHeight);
                _this.loaded = true;
            });
            return _this;
        }
        //-----------------------------------------------------
        Carousel3D.prototype.onNext = function (evt) {
            var direction = evt.detail.direction;
            //update angle here!
            this.targetAngle += this.itemAngle * -direction;
        };
        Carousel3D.prototype.draw = function () {
            if (!this.loaded)
                return;
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
            var transformMatrix = anim_utils_1.AnimUtils.GetTranslationMatrix(-this.itemWidth / 2, cYOffset, -z);
            var rotationMatrix = anim_utils_1.AnimUtils.GetRotationMatrix(3, 0, 0);
            anim_utils_1.AnimUtils.SetTransformMatrix(this.carousel, [rotationMatrix, transformMatrix]);
            //apply transform to each
            this.items.forEach(function (item) {
                var r = _this.itemAngle * item.index + _this.itemAngle / 2 + _this.currentAngle;
                var rotation = anim_utils_1.AnimUtils.GetRotationMatrix(0, r, 0);
                var translation = anim_utils_1.AnimUtils.GetTranslationMatrix(0, 0, -z);
                var rotation2 = anim_utils_1.AnimUtils.GetRotationMatrix(0, 0, cRot);
                anim_utils_1.AnimUtils.SetTransformMatrix(item.el, [rotation, translation, rotation2]);
                item.draw();
            });
        };
        Carousel3D.prototype.resize = function (windowWidth, windowHeight) {
            var _this = this;
            if (!this.loaded)
                return;
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
    }(BaseSketch_1.BaseSketch));
    exports.Carousel3D = Carousel3D;
});
//# sourceMappingURL=Carousel3D.js.map