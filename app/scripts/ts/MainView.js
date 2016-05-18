/**
 * Created by kev on 2016-05-18.
 */
define(["require", "exports", 'jquery'], function (require, exports, $) {
    "use strict";
    var MainView = (function () {
        function MainView() {
            var _this = this;
            this.cachedViews = {};
            this.loaded = false;
            console.log("here we go again!");
            $.getJSON('data/config.json', function (data) {
                console.log(data);
                _this.loaded = true;
                _this.sketches = data.sketches;
                _this.start();
            });
        }
        MainView.prototype.start = function () {
            for (var key in this.sketches) {
                this.DEFAULT_SKETCH = key;
                break;
            }
            //create scroll expander
            this.expander = document.createElement("div");
            this.expander.setAttribute("class", "expander");
            document.body.appendChild(this.expander);
            window.onclick = this.onClick.bind(this);
            window.onresize = this.onResize.bind(this);
            window.onscroll = this.onScroll.bind(this);
            window.onhashchange = this.onHashChange.bind(this);
            window.onmousemove = this.onMouseMove.bind(this);
            this.onHashChange(null);
        };
        MainView.prototype.createMenu = function () {
        };
        MainView.prototype.onClick = function (e) {
        };
        MainView.prototype.onResize = function (e) {
        };
        MainView.prototype.onScroll = function (e) {
        };
        MainView.prototype.onHashChange = function (e) {
            var sketchId = location.hash.split("#")[1];
            var idValid = this.sketches.hasOwnProperty(sketchId);
            sketchId = idValid ? sketchId : this.DEFAULT_SKETCH;
            if (this.sketch) {
                if (this.sketch.id === sketchId) {
                    return;
                }
                $('HTML').removeClass(this.sketch.id);
                this.sketch.remove();
            }
            var View = this.sketches[sketchId].View;
            if (this.cachedViews.hasOwnProperty(sketchId)) {
                this.sketch = this.cachedViews[sketchId];
            }
            else {
                var Class = require("ts/sketches/" + View);
                this.sketch = new Class();
            }
            this.cachedViews[sketchId] = this.sketch;
            this.sketch.id = sketchId;
            $('HTML').addClass(sketchId);
            document.body.appendChild(this.sketch.el);
            location.hash = "#" + sketchId;
            //update menu
            $("li").removeClass("active");
            document.getElementById(sketchId).setAttribute("class", "active");
            this.onResize(null);
            this.onScroll(null);
        };
        MainView.prototype.onMouseMove = function (e) {
        };
        MainView.prototype.draw = function (time) {
            if (!this.loaded) {
                return;
            }
            if (this.sketch) {
                this.sketch.draw(time);
            }
        };
        return MainView;
    }());
    return MainView;
});
//# sourceMappingURL=MainView.js.map