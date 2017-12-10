define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by kev on 2016-05-19.
     */
    var MenuView = /** @class */ (function () {
        function MenuView(sketches) {
            //create menu
            this.el = document.createElement("ul");
            this.el.setAttribute("class", "menu_cont");
            var button = document.createElement("button");
            this.el.appendChild(button);
            for (var key in sketches) {
                var item = document.createElement("li");
                item.setAttribute("id", key);
                item.innerHTML = key;
                this.el.appendChild(item);
            }
            this.el.onclick = function (e) {
                //console.log(e);
                location.hash = "#" + e.target.innerHTML;
            };
        }
        return MenuView;
    }());
    exports.MenuView = MenuView;
});
//# sourceMappingURL=MenuView.js.map