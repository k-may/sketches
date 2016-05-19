define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Created by kev on 2016-05-19.
     */
    var MenuView = (function () {
        function MenuView(sketches) {
            //create menu
            this.el = document.createElement("ul");
            this.el.setAttribute("class", "menu_cont");
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
    return MenuView;
});
//# sourceMappingURL=MenuView.js.map