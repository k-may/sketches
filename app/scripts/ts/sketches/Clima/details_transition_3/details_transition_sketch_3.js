/**
 * Created by kev on 15-07-22.
 */

define(['jquery','base_sketch','utils/animation_utils'],function ($,BaseSketch,AnimationUtils) {


    var TRANSFORM_PREFIX = Modernizr.prefixed('transform');

    return BaseSketch.extend({

        startImg    :null,
        startElement:null,
        bgImg       :null,
        invalidated :false,
        text        :null,

        rect1:{
            x:0.3,y:0.3,w:0.4,h:0.2
        },
        rect2:{
            x:0.3,y:0.3,w:0.4,h:0.001
        },
        rect3:{
            x:0.3,y:0.3,w:1.1,h:1.1
        },

        initialize:function () {

            var count = 0;
            var _this = this;

            function loadHandler() {
                if (++count === 2) {
                    _this.loaded = true;
                    _this.resize(window.innerWidth,window.innerHeight);
                }
            }

            this.startImg = new Image();
            this.startImg.onload = loadHandler;
            this.startImg.src = "img/Background_Product_Section.png";

            this.bgImg = new Image();
            this.bgImg.onload = loadHandler;
            this.bgImg.src = "img/Background_Product_Section_BG.jpg";

            this.startElement = document.createElement("div");
            this.startElement.setAttribute("class","detailsTransitionTexture");
            this.el.appendChild(this.startElement);

            this.invalidated = true;
        },

        resize:function (w,h) {

            if (this.loaded) {
                this.startElement.style.backgroundImage = "url(" + this.startImg.src + ")";

                var elemWidth = window.innerWidth * 0.4;//$(this.startElement).width();
                var startImgAspect = this.startImg.naturalHeight / this.startImg.naturalWidth;
                var elemHeight = (elemWidth * startImgAspect);

                this.startElement.style.width = elemWidth + "px";
                this.startElement.style.height = elemHeight + "px";
                var hRatio = (0.4 * startImgAspect)

                this.rect1 = {
                    x:0.3,
                    y:0.3,
                    w:0.4,
                    h:hRatio
                };
                this.rect2 = {
                    x:0.3,
                    y:0.3,
                    w:1.2,
                    h:0.01
                };
            }

        },

        draw:function () {

            if (!this.loaded) {
                return;
            }

            if (!this.invalidated) {
                return;
            }
            this.invalidated = false;

            var ratio;
            if (this.scrollRatio <= 0.5) {
                ratio = this.scrollRatio / 0.5;
                this.drawElem(ratio);

                startRect = this.rect1;
                destRect = this.rect2;
            } else {
                ratio = (this.scrollRatio - 0.5) / 0.5;
                this.drawCanvas(ratio);
            }

        },

        drawElem:function (ratio) {
            var startRect = this.rect1;
            var destRect = this.rect2;

            var rect = {
                x:startRect.x + (destRect.x - startRect.x) * ratio,
                y:startRect.y + (destRect.y - startRect.y) * ratio,
                w:startRect.w + (destRect.w - startRect.w) * ratio,
                h:startRect.h + (destRect.h - startRect.h) * ratio,
            };

            var scaleW = (rect.w / this.rect1.w);
            var scaleH = (rect.h / this.rect1.h);

            var translateM = AnimationUtils.getTranslationMatrix(rect.x * window.innerWidth,rect.y * window.innerHeight,0);
            var scaleM = AnimationUtils.getScaleMatrix(scaleW,scaleH,1);
            var resultM = AnimationUtils.getResultMatrix([translateM,scaleM])
            var trnsString = AnimationUtils.getStringTransform3d(resultM);

            this.startElement.style[TRANSFORM_PREFIX] = trnsString;

        },

        drawCanvas:function (ratio) {
            var startRect = this.rect2;
            var destRect = this.rect3;
        }

    })


})