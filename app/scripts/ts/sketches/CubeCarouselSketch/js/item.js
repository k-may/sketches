/**
 * Created by kev on 16-01-06.
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Item = (function () {
        function Item(el, index) {
            this.el = el;
            this.$el = $(el);
            this.index = index;
        }
        Item.prototype.draw = function () {
        };
        Item.prototype.resize = function (windowWidth, windowHeight) {
            this.width = windowWidth;
            this.height = windowHeight;
            this.$el.width(windowWidth);
            this.$el.height(windowHeight);
        };
        return Item;
    }());
    exports.Item = Item;
});
//# sourceMappingURL=item.js.map