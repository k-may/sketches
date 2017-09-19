define(["require", "exports", "./views/MenuView"], function (require, exports, MenuView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MainView = (function () {
        function MainView() {
            var _this = this;
            this.sketches = {};
            this.cachedViews = {};
            this.loaded = false;
            $.getJSON('data/config.json', function (data) {
                console.log(data);
                _this.loaded = true;
                _this.sketches = data.sketches;
                _this.start();
            });
        }
        MainView.prototype.draw = function (time) {
            if (!this.loaded) {
                return;
            }
            if (this.sketch) {
                this.sketch.draw(time);
            }
        };
        //-------------------------------------------------------
        MainView.prototype.start = function () {
            this.menu = new MenuView_1.MenuView(this.sketches);
            document.body.appendChild(this.menu.el);
            for (var key in this.sketches) {
                this.DEFAULT_SKETCH = key;
                break;
            }
            this.setupScroll();
            this.setupWindow();
            this.onHashChange(null);
        };
        MainView.prototype.setupScroll = function () {
            //create scroll expander
            this.expander = document.createElement("div");
            this.expander.setAttribute("class", "expander");
            document.body.appendChild(this.expander);
        };
        MainView.prototype.setupWindow = function () {
            window.onclick = this.onClick.bind(this);
            window.onresize = this.onResize.bind(this);
            window.onscroll = this.onScroll.bind(this);
            window.onhashchange = this.onHashChange.bind(this);
            window.onmousemove = this.onMouseMove.bind(this);
        };
        MainView.prototype.onClick = function (e) {
            if (this.sketch && this.sketch.onClick)
                this.sketch.onClick(e);
        };
        MainView.prototype.onResize = function (e) {
            if (this.sketch) {
                this.sketch.resize(window.innerWidth, window.innerHeight);
            }
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
                if (this.sketch.remove)
                    this.sketch.remove();
                else
                    this.sketch.$el.detach();
            }
            var self = this;
            this.getClass(sketchId).then(function (sketch) {
                sketch.id = sketchId;
                self.addSketch(sketch);
            });
        };
        MainView.prototype.addSketch = function (sketch) {
            this.sketch = sketch;
            var sketchId = this.sketch.id;
            this.cachedViews[sketchId] = this.sketch;
            this.sketch.id = sketchId;
            $('HTML').addClass(sketchId);
            document.body.appendChild(this.sketch.el);
            location.hash = "#" + sketchId;
            //update menu
            if (this.menu) {
                $("li").removeClass("active");
                document.getElementById(sketchId).setAttribute("class", "active");
            }
            this.onResize(null);
            this.onScroll(null);
        };
        MainView.prototype.getClass = function (sketchId) {
            var self = this;
            return new Promise(function (resolve, reject) {
                var View = self.sketches[sketchId].View;
                if (self.cachedViews.hasOwnProperty(sketchId)) {
                    resolve(self.cachedViews[sketchId]);
                }
                else {
                    var path = "../../scripts/ts/sketches/" + View + ".js";
                    require([path], function (exports) {
                        var Class = exports;
                        //make it backwards compatible with old javascript sketches...
                        if (typeof Class != "function")
                            Class = exports.hasOwnProperty(sketchId) ? exports[sketchId] : exports['Sketch'];
                        var sketch = new Class();
                        resolve(sketch);
                    });
                }
            });
        };
        MainView.prototype.onMouseMove = function (e) {
            if (this.sketch && this.sketch.mouseMove)
                this.sketch.mouseMove(e);
        };
        return MainView;
    }());
    exports.MainView = MainView;
});
//# sourceMappingURL=MainView.js.map