/**
 * Created by kev on 2016-05-18.
 */
///<reference path="../../../../typings/globals/es6-shim/index.d.ts"/>
    
class LoadUtils {
    public static LoadShaders(ids):Promise<string[]> {
        var promises = [];
        for (var i = 0; i < ids.length; i++) {
            promises.push(this.LoadShader(ids[i]));
        }
        return Promise.all(promises);
    }

    public static LoadShader(src):Promise<string> {
        return new Promise(function (resolve) {
            var xhr = new XMLHttpRequest();
            xhr.addEventListener('load', function (e:Event) {
                resolve((<XMLHttpRequest>e.currentTarget).responseText);
            });
            xhr.open('GET', src);
            xhr.send();
        }).catch(function (e) {
            console.log(e.stack);
        });
    }

    static LoadImagesBySrc(arr):Promise<any> {
        var promises = [];
        for (var i = 0; i < arr.length; i++) {
            promises.push(this.LoadImageBySrc(arr[i]));
        }
        return Promise.all(promises);
    }

    static LoadImageBySrc(src):Promise<any> {

        return new Promise(function (resolve, reject) {
            var img = new Image();
            if (img.naturalWidth) {
                resolve(img);
            } else {
                img.onload = function () {
                    img.onload = null;
                    resolve(img);
                };
                img.src = src;
            }
        }).catch(function (e) {
            console.log(e.stack);
        });
    }

    static LoadImages(arr):Promise<any> {
        var promises = [];
        for (var i = 0; i < arr.length; i++) {
            promises.push(this.LoadImage(arr[i]));
        }
        return Promise.all(promises);
    }

    static LoadImage(img):Promise<any> {
        return new Promise(function (resolve, reject) {
            if (img.naturalWidth) {
                resolve(img);
            } else {
                img.onload = function () {
                    img.onload = null;
                    resolve(img);
                };
            }
        }).catch(function (e) {
            console.log(e.stack);
        });
    }

    static LoadIFrame(el:HTMLElement):Promise<any> {
        return new Promise((resolve, reject) => {
            el.onload = function () {
                resolve();
            };
        }).catch(function (e) {
            console.log(e.stack);
        });
    }

    static LoadIFrames(els:HTMLElement[]):Promise<any> {
        var promises = els.map(el => {
            return LoadUtils.LoadIFrame(el);
        });
        return Promise.all(promises);
    }

    static LoadElements(el:HTMLElement[]):Promise<any> {
        var img = [];
        var iframes = [];

        el.forEach((el) => {
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
        return Promise.all(promises)
    }

    static CheckLoadable(el:HTMLElement):boolean {
        switch (el.nodeName) {
            case "iframe":
            case "IFRAME":
            case "img":
            case "IMG":
                return true;
            default:
                return false;
        }
    }

}
export = LoadUtils;