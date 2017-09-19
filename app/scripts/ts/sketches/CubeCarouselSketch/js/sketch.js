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
define(["require", "exports", "./item", "../../../common/base_sketch", "../../../utils/anim_utils"], function (require, exports, item_1, base_sketch_1, anim_utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by kev on 16-01-06.
     */
    var Sketch = (function (_super) {
        __extends(Sketch, _super);
        function Sketch() {
            var _this = _super.call(this) || this;
            _this.windowWidth = 0;
            _this.windowHeight = 0;
            _this.currentRads = 0;
            _this.itemWidth = 500;
            _this.itemAngle = 90;
            _this.currentAngle = 0;
            _this.targetAngle = 0;
            _this.loaded = false;
            var fileref = document.createElement("link");
            fileref.rel = "stylesheet";
            fileref.type = "text/css";
            fileref.href = "styles/carousel3d.css";
            document.getElementsByTagName("head")[0].appendChild(fileref);
            require(['text!ts/sketches/CubeCarouselSketch/carousel.html'], function (html) {
                _this.el.innerHTML = html;
                _this.container = _this.el.getElementsByClassName('container')[0];
                _this.carousel = _this.el.getElementsByClassName('carousel')[0];
                _this.items = [];
                var itemEls = _this.el.getElementsByClassName('item');
                for (var i = 0; i < itemEls.length; i++) {
                    var item = new item_1.Item(itemEls[i], i);
                    _this.items.push(item);
                }
                window.addEventListener("Swipe", function (evt) {
                    _this.onNext(evt);
                });
                window.addEventListener("keydown", function (evt) {
                    if (evt.key == "ArrowLeft")
                        _this.targetAngle += _this.itemAngle * -1;
                    else if (evt.key == "ArrowRight")
                        _this.targetAngle += _this.itemAngle;
                });
                _this.loaded = true;
            });
            return _this;
        }
        Sketch.prototype.onNext = function (evt) {
            var direction = evt.detail.direction;
            //update angle here!
            this.targetAngle += this.itemAngle * -direction;
        };
        Sketch.prototype.draw = function () {
            if (!this.loaded)
                return;
            var diff = this.targetAngle - this.currentAngle;
            this.currentAngle += diff * 0.1;
            this.drawCarousel();
        };
        Sketch.prototype.drawCarousel = function () {
            var _this = this;
            //determine angle between items
            var rads = this.itemAngle * (Math.PI / 180);
            //rotate the carousel
            var cRot = 10;
            var cYOffset = 0;
            //determine z for items
            var z = window.innerWidth / Math.tan(rads / 2);
            var transformMatrix = anim_utils_1.AnimUtils.GetTranslationMatrix(-window.innerWidth / 2, 0, -z); //cYOffset, -z);
            var rotationMatrix = anim_utils_1.AnimUtils.GetRotationMatrix(0, 0, 0);
            anim_utils_1.AnimUtils.SetTransformMatrix(this.carousel, [rotationMatrix, transformMatrix]);
            //apply transform to each
            this.items.forEach(function (item) {
                var r = _this.itemAngle * item.index + _this.currentAngle;
                var rotation = anim_utils_1.AnimUtils.GetRotationMatrix(0, r, 0);
                var translation = anim_utils_1.AnimUtils.GetTranslationMatrix(0, 0, -z);
                anim_utils_1.AnimUtils.SetTransformMatrix(item.el, [rotation, translation]);
                item.draw();
            });
        };
        Sketch.prototype.resize = function (windowWidth, windowHeight) {
            this.windowWidth = windowWidth;
            this.windowHeight = windowHeight;
        };
        Sketch.prototype.setCurrentItem = function (item) {
            if (this.currentItem) {
                this.currentItem.$el.removeClass("active");
            }
            this.currentItem = item;
            this.currentItem.$el.addClass("active");
        };
        return Sketch;
    }(base_sketch_1.BaseSketch));
    exports.Sketch = Sketch;
});
//# sourceMappingURL=sketch.js.map