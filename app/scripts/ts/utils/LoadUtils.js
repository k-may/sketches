/**
 * Created by kev on 2016-05-18.
 */
///<reference path="../../../../typings/globals/es6-shim/index.d.ts"/>
define(["require", "exports"], function (require, exports) {
    "use strict";
    var LoadUtils = (function () {
        function LoadUtils() {
        }
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
        return LoadUtils;
    }());
    return LoadUtils;
});
//# sourceMappingURL=LoadUtils.js.map