define(["require", "exports", 'tween', 'jquery'], function (require, exports, TWEEN, $) {
    "use strict";
    var BaseSketch = (function () {
        function BaseSketch() {
            this._scrollHeight = -1;
            this._windowWidth = -1;
            this._windowHeight = -1;
            this._scrollRatio = 0.0;
            this._invalidated = false;
            this._animDuration = 1000;
            this.el = document.createElement("div");
            this.$el = $(this.el);
        }
        BaseSketch.prototype.resize = function (w, h) {
            this._windowWidth = w;
            this._windowHeight = h;
            this._invalidated = true;
        };
        BaseSketch.prototype.invalidate = function () {
            this._invalidated = true;
        };
        BaseSketch.prototype.toggle = function () {
            if (this._scrollRatio < 0.5) {
                this.animateIn();
            }
            else {
                this.animateOut();
            }
        };
        BaseSketch.prototype.animateIn = function () {
            var _this = this;
            if (this._tween) {
                this._tween.stop();
            }
            this._tween = new TWEEN.Tween({ value: this._scrollRatio })
                .to({ value: 1 }, this._animDuration)
                .onUpdate(function (obj) {
                _this.setScrollRatio(obj.value);
            })
                .start();
        };
        BaseSketch.prototype.animateOut = function () {
            var _this = this;
            if (this._tween) {
                this._tween.stop();
            }
            this._tween = new TWEEN.Tween({ value: this._scrollRatio })
                .to({ value: 0 }, this._animDuration)
                .onUpdate(function (obj) {
                _this.setScrollRatio(obj.value);
            })
                .start();
        };
        BaseSketch.prototype.setScrollRatio = function (ratio) {
            this._scrollRatio = ratio;
            this.invalidate();
        };
        BaseSketch.prototype.draw = function (time) {
            if (this._invalidated) {
                this._invalidated = false;
                return true;
            }
            return false;
        };
        BaseSketch.prototype.remove = function () {
            this.$el.remove();
        };
        return BaseSketch;
    }());
    return BaseSketch;
});
//# sourceMappingURL=BaseSketch.js.map