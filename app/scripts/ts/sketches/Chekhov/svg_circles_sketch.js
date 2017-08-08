/**
 * Created by kev on 15-10-13.
 */


define(['base_sketch','rsvp','utils/canvas_utils','underscore','utils/animation_utils'],

    function (BaseSketch,RSVP,CanvasUtils,_,AnimUtils) {

        return BaseSketch.extend({

            circles :null,
            mousePos:{
                x:0,
                y:0
            },
            buffer  :null,

            current:null,

            initialize:function () {

                this.circles = [];
                this.buffer = CanvasUtils.CreateBuffer();

                this.el.appendChild(this.buffer.canvas);
                this.el.onmousemove = _.bind(this.onMouseMove,this);

                var _this = this;
                this.loadSVG('svg/svg_sketch.svg').then(function (svg) {

                    console.dir(svg);

                    var children = svg.getElementsByTagName('circle');

                    for (var i = 0; i < children.length; i++) {
                        var child = children[i];
                        var circle = {
                            x           :parseInt(child.getAttribute("cx")) * 1.5,
                            y           :parseInt(child.getAttribute("cy")) * 1.5,
                            radius      :parseInt(child.getAttribute('r')),
                            dX          :0,
                            dY          :0,
                            cDX         :0,
                            cDY         :0,
                            scale       :1,
                            currentScale:1
                        };
                        _this.circles.push(circle);

                    }


                    _this.setLoaded();
                });

            },

            onMouseMove:function (e) {

                this.mousePos = {
                    x:e.clientX,
                    y:e.clientY
                };
            },

            setLoaded:function () {
                this.loaded = true;
                this.current = this.circles[Math.floor(Math.random() * this.circles.length)];
            },

            resize:function (width,height) {
                this.buffer.resize(width,height);
            },

            draw:function () {

                if (!this.loaded) {
                    return;
                }

                this.current = this.update();

                this.buffer.clear();

                var circle;
                for (var i = 0; i < this.circles.length; i++) {

                    circle = this.circles[i];
                    if (circle !== this.current) {
                        this.drawCircle(circle,"#000");
                    }
                }

                //draw current last
                if (this.current) {
                    this.drawCircle(this.current,"#ff0000");
                }

            },

            drawCircle:function (circle,color) {

                circle.currentScale += (circle.scale - circle.currentScale) * 0.1;
                circle.cDX += (circle.dX - circle.cDX) * 0.1;
                circle.cDY += (circle.dY - circle.cDY) * 0.1;

                this.buffer.ctx.fillStyle = color;
                this.buffer.ctx.beginPath();
                this.buffer.ctx.arc(circle.x + circle.cDX,circle.y + circle.cDY,circle.radius * circle.currentScale,0,Math.PI * 2);
                this.buffer.ctx.fill();

            },


            update:function () {

                var targetRadius = 170;
                var current;

                for (var i = 0; i < this.circles.length; i++) {

                    var circle = this.circles[i];

                    var distance = AnimUtils.Distance(circle.x,this.mousePos.x,circle.y,this.mousePos.y);
                    var targetScale = targetRadius / circle.radius;

                    if (distance < 600) {

                        if (distance < circle.radius) {

                            //more static selection
                            //set current
                            circle.scale = targetScale;
                            current = circle;

                        } else {
                            var scale = Math.min(1,distance / 600);
                            var pos = scale;
                            scale = Math.cos(scale * Math.PI) * 0.5 + 0.5;
                            scale = AnimUtils.EaseInExpo(scale);

                            scale -= 0.15 * (0.5 - Math.cos(pos * Math.PI * 2) * 0.5);
                            circle.scale = 1 + (targetScale - 1) * (scale);
                        }

                        var posScale = distance / 600;
                        //posScale = Math.pow(posScale, 0.5);
                        posScale = Math.cos(posScale * Math.PI) * 0.5 + 0.5;
                        posScale = Math.pow(posScale,2);

                        var v = {x:circle.x - this.mousePos.x,y:circle.y - this.mousePos.y};

                        circle.dX = v.x * (posScale) * 0.6;
                        circle.dY = v.y * (posScale) * 0.6;

                    } else {
                        circle.scale = 1;
                        circle.dX = 0;
                        circle.dY = 0;
                    }

                    /*circle.currentScale += (circle.scale - circle.currentScale) * 0.1;
                    circle.dX += (dX - circle.dX) * 0.1;
                    circle.dY += (dY - circle.dY) * 0.1;*/

                }

                return current;
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