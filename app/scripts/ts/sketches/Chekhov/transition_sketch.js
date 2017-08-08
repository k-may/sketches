/**
 * Created by kev on 15-10-14.
 */


define(['rsvp',
        'underscore',
        'base_sketch',
        'utils/canvas_utils',
        'TweenMax'],

    function (RSVP,
        _,
        BaseSketch,
        CanvasUtils,
        TweenMax) {

        return BaseSketch.extend({

            circles1:null,
            circles2:null,
            circles3:null,

            transition1:{
                alpha:0,
                scale:1
            },
            transition2:{
                alpha:0,
                scale:1
            },
            transition3:{
                alpha:0,
                scale:1
            },

            scaleTransition:{
                scale:1.5,
                dX   :0,
                dY   :0
            },

            buffer:null,
            svg   :{
                width :0,
                height:0,
                scale :1,
                dX    :0,
                dY    :0
            },

            initialize:function () {

                this.buffer = CanvasUtils.CreateBuffer();
                this.el.appendChild(this.buffer.canvas);

                var _this = this;
                this.loadSVG('svg/svg_transition.svg').then(function (svg) {

                    var svg = svg.getElementsByTagName('svg')[0];
                    var viewbox = svg.viewBox.baseVal;
                    _this.svg = {
                        width :viewbox.width,
                        height:viewbox.height,
                        scale :1
                    };

                    var layer1 = svg.getElementById("Layer_1");
                    var layer2 = svg.getElementById("Layer_3");
                    var layer3 = svg.getElementById("Layer_4");

                    _this.circles1 = _this.parseCircles(layer1.getElementsByTagName('circle'),_this.seedFunc2);
                    _this.circles2 = _this.parseCircles(layer2.getElementsByTagName('circle'),_this.seedFunc2);
                    _this.circles3 = _this.parseCircles(layer3.getElementsByTagName('circle'),_this.seedFunc1);

                    _this.setLoaded();
                    _this.resize(_this.buffer.width,_this.buffer.height);

                }).catch(function (e) {
                    console.log("error : " + e.message);
                });

            },

            seedFunc1:function () {
                return Math.random() * 0.8;
            },

            seedFunc2:function () {
                return Math.random() * 0.8 + 0.2;
            },


            parseCircles:function (elements,seedFunc) {
                var arr = [];
                for (var i = 0; i < elements.length; i++) {
                    var child = elements[i];
                    var circle = {
                        x     :parseInt(child.getAttribute("cx")) * 1.2,
                        y     :parseInt(child.getAttribute("cy")) * 1.2,
                        radius:parseInt(child.getAttribute('r')),
                        scale :1,
                        seed  :seedFunc(),//Math.random() * 0.8 + 0.2,
                        dX    :Math.random() * 2 - 1,
                        dY    :Math.random() * 2 - 1
                    };
                    arr.push(circle);
                }
                return arr;
            },


            resize:function (width,height) {
                this.buffer.resize(width,height);

                var scale = Math.max(width / this.svg.width,height / this.svg.height);
                this.svg.scale = scale;

            },

            setLoaded:function () {

                this.loaded = true;

                var speed = 10;

                this.transition3.alpha = 1;
                this.transition3.scale = 1;
                this.transition2.alpha = 1;
                this.transition2.scale = 1;

                this.scaleTransition.scale = 1;
            },

            setScrollRatio:function (ratio) {
                // console.log("ratio : " + ratio);

                this.scrollRatio = ratio;

                this.transition1.alpha = ratio;

                this.transition3.alpha = 0.6 - ratio;

                this.transition2.scale = this.transition3.scale = 1.2 - (ratio * 0.3);

                this.scaleTransition.scale = 0.2 + ratio * 1.1;
            },

            draw:function (time) {

                if (!this.loaded) {
                    return;
                }

                //this.scaleTransition.value = 1 +  Math.sin(time*0.001) * 0.5 + 0.5;
                this.buffer.clear();

                this.scaleTransition.dX = (this.buffer.width - ((this.svg.width / this.svg.scale) * this.scaleTransition.scale)) >> 1;
                this.scaleTransition.dY = (this.buffer.height - (this.svg.height / this.svg.scale) * this.scaleTransition.scale) >> 1;

                if (this.transition1.alpha) {
                    //   this.buffer.ctx.globalAlpha = this.transition1.alpha;
                    this.drawCircles(this.circles1,this.transition2.scale,this.transition1.alpha,this.transition1.alpha);
                }

                if (this.transition2.alpha) {
                    //   this.buffer.ctx.globalAlpha = this.transition2.alpha;
                    this.drawCircles(this.circles2,this.transition2.scale,this.transition2.alpha,0);
                }

                if (this.transition3.alpha) {
                    //  this.buffer.ctx.globalAlpha = this.transition3.alpha;
                    this.drawCircles(this.circles3,this.transition3.scale,this.transition3.alpha,0);
                }
            },

            drawCircles:function (arr,radiusScale,alpha,displacement) {

                alpha = alpha || 1;

                var circle;
                for (var i = 0; i < arr.length; i++) {
                    circle = arr[i];
                    this.drawCircle(circle,radiusScale,alpha,displacement);
                }
            },

            drawCircle:function (circle,radiusScale,ratio,displacement) {

                displacement = displacement !== undefined ? displacement : ratio;

                if (circle.seed > ratio) {
                    return;
                }

                var x = circle.x * this.svg.scale * this.scaleTransition.scale + this.scaleTransition.dX;
                var y = circle.y * this.svg.scale * this.scaleTransition.scale + this.scaleTransition.dY;
                var dX = circle.dX * 30 * displacement;
                var dY = circle.dY * 30 * displacement;
                var radius = circle.radius * this.svg.scale * this.scaleTransition.scale * radiusScale;

                this.buffer.ctx.fillStyle = "#000";
                this.buffer.ctx.beginPath();
                this.buffer.ctx.arc(x + dX,y + dY,radius,0,Math.PI * 2);
                this.buffer.ctx.fill();

            },

            invalidate:function () {

                this.setScrollRatio(this.scrollRatio);
            },

            loadSVG:function (path) {

                return new RSVP.Promise(function (resolve,reject) {

                    var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function () {
                        if (xhttp.readyState == 4 && xhttp.status == 200) {
                            resolve(xhttp.responseXML);
                        }
                    };
                    xhttp.open("GET",path,true);
                    xhttp.send();

                });

            }


        })

    })