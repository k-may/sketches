/**
 * Created by kev on 15-10-26.
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoadUtils = /** @class */ (function () {
        function LoadUtils() {
        }
        LoadUtils.LoadAJAX = function (url, type) {
            type = type || "json";
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: url,
                    dataType: type,
                    error: function () {
                        reject();
                    },
                    success: function (data) {
                        resolve(data);
                    }
                });
            });
        };
        LoadUtils.LoadShaders = function (ids) {
            var promises = [];
            for (var i = 0; i < ids.length; i++) {
                promises.push(this.LoadShader(ids[i]));
            }
            return Promise.all(promises);
        };
        LoadUtils.LoadShader = function (src) {
            return new Promise(function (resolve) {
                var xhr = new XMLHttpRequest();
                xhr.addEventListener('load', function (e) {
                    resolve(e.currentTarget.responseText);
                });
                xhr.open('GET', src);
                xhr.send();
            }).catch(function (e) {
                console.log(e.stack);
            });
        };
        LoadUtils.LoadImagesBySrc = function (arr) {
            var promises = [];
            for (var i = 0; i < arr.length; i++) {
                promises.push(this.LoadImageBySrc(arr[i]));
            }
            return Promise.all(promises);
        };
        LoadUtils.LoadImageBySrc = function (src) {
            return new Promise(function (resolve, reject) {
                var img = new Image();
                if (img.naturalWidth) {
                    resolve(img);
                }
                else {
                    img.onload = function () {
                        img.onload = null;
                        resolve(img);
                    };
                    img.src = src;
                }
            }).catch(function (e) {
                console.log(e.stack);
            });
        };
        LoadUtils.LoadImages = function (arr) {
            var promises = [];
            for (var i = 0; i < arr.length; i++) {
                promises.push(this.LoadImage(arr[i]));
            }
            return Promise.all(promises);
        };
        LoadUtils.LoadImage = function (img) {
            return new Promise(function (resolve, reject) {
                if (img.naturalWidth) {
                    resolve(img);
                }
                else {
                    img.onload = function () {
                        img.onload = null;
                        resolve(img);
                    };
                }
            }).catch(function (e) {
                console.log(e.stack);
            });
        };
        LoadUtils.LoadIFrame = function (el) {
            return new Promise(function (resolve, reject) {
                el.onload = function () {
                    resolve();
                };
            }).catch(function (e) {
                console.log(e.stack);
            });
        };
        LoadUtils.LoadIFrames = function (els) {
            var promises = els.map(function (el) {
                return LoadUtils.LoadIFrame(el);
            });
            return Promise.all(promises);
        };
        LoadUtils.LoadElements = function (el) {
            var img = [];
            var iframes = [];
            el.forEach(function (el) {
                switch (el.nodeName) {
                    case "iframe":
                    case "IFRAME":
                        iframes.push(el);
                        break;
                    case "img":
                    case "IMG":
                        img.push(el);
                        break;
                }
            });
            var promises = [];
            promises.push(LoadUtils.LoadImages(img));
            promises.push(LoadUtils.LoadIFrames(iframes));
            return Promise.all(promises);
        };
        LoadUtils.CheckLoadable = function (el) {
            switch (el.nodeName) {
                case "iframe":
                case "IFRAME":
                case "img":
                case "IMG":
                    return true;
                default:
                    return false;
            }
        };
        LoadUtils.LoadSVG = function (path) {
            return new Promise(function (resolve, reject) {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                        resolve(xhttp.responseXML);
                    }
                };
                xhttp.open("GET", path, true);
                xhttp.send();
            });
        };
        return LoadUtils;
    }());
    exports.LoadUtils = LoadUtils;
});
//# sourceMappingURL=load_utils.js.map