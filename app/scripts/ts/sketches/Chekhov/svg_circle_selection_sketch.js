/**
 * Created by kev on 15-10-14.
 */
/**
 * Created by kev on 15-10-13.
 */


define(['base_sketch',
        'rsvp',
        'utils/canvas_utils',
        'underscore',
        'utils/animation_utils',
        'utils/color_utils'],

    function (BaseSketch,RSVP,CanvasUtils,_,AnimUtils,ColorUtils) {

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
                this.buffer.canvas.style.pointerEvents = "none";

                this.el.appendChild(this.buffer.canvas);
                this.el.onmousemove = _.bind(this.onMouseMove,this);

                var _this = this;
                this.loadSVG('svg/svg_sketch.svg').then(function (svg) {

                    var children = svg.getElementsByTagName('circle');

                    for (var i = 0; i < children.length; i++) {
                        var child = children[i];
                        var circle = {
                            x           :parseInt(child.getAttribute("cx")) * 1.2,
                            y           :parseInt(child.getAttribute("cy")) * 1.2,
                            radius      :parseInt(child.getAttribute('r')),
                            dX          :0,
                            dY          :0,
                            cDX         :0,
                            cDY         :0,
                            scale       :1,
                            currentScale:1,
                            color       :ColorUtils.RandomGoogleColorHex(),
                            alpha       :0.5
                        };
                        _this.circles.push(circle);

                    }


                    _this.setLoaded();
                }).catch(function (e) {
                    console.log("error : " + e.message);
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

                this.update();

                this.buffer.clear();
                this.drawCircles();
            },

            drawCircles:function () {

                this.buffer.ctx.globalAlpha = 0.5;

                var circle;
                for (var i = 0; i < this.circles.length; i++) {

                    circle = this.circles[i];

                    if (this.current === circle) {
                        continue;
                    }

                    this.drawCircle(circle,circle.color);
                }

                //draw current last
                if (this.current) {
                    this.current.alpha += (1 - this.current.alpha)*0.1;
                    this.buffer.ctx.globalAlpha = this.current.alpha;
                    this.drawCircle(this.current,this.current.color);
                }
            },

            drawCircle:function (circle,color) {

                if (this.current) {
                    circle.currentScale += (circle.scale - circle.currentScale) * 0.1;
                    circle.cDX += (circle.dX - circle.cDX) * 0.1;
                    circle.cDY += (circle.dY - circle.cDY) * 0.1;
                } else {
                    circle.currentScale += (1 - circle.currentScale) * 0.1;
                    circle.cDX += (-circle.cDX) * 0.1;
                    circle.cDY += (-circle.cDY) * 0.1;
                }

                this.buffer.ctx.fillStyle = color;
                this.buffer.ctx.beginPath();
                this.buffer.ctx.arc(circle.x + circle.cDX,circle.y + circle.cDY,circle.radius * circle.currentScale,0,Math.PI * 2);
                this.buffer.ctx.fill();

            },

            update:function () {

                var targetRadius = 120;
                var current = null;
                var circle,distance,targetScale,scale,pos,posScale;
                for (var i = 0; i < this.circles.length; i++) {

                    circle = this.circles[i];
                    distance = AnimUtils.Distance(circle.x,this.mousePos.x,circle.y,this.mousePos.y);
                    targetScale = targetRadius / circle.radius;

                    if (distance < 600) {

                        if (distance < circle.radius) {
                            //more static selection
                            circle.scale = targetScale;
                            current = circle;
                        } else {
                            scale = Math.min(1,distance / 600);
                            pos = scale;
                            scale = Math.cos(scale * Math.PI) * 0.5 + 0.5;
                            scale = AnimUtils.EaseInExpo(scale);
                            scale -= 0.15 * (0.5 - Math.cos(pos * Math.PI * 2) * 0.5);
                            circle.scale = 1 + (targetScale - 1) * (scale);
                        }

                        posScale = distance / 600;
                        posScale = Math.cos(posScale * Math.PI) * 0.5 + 0.5;
                        posScale = Math.pow(posScale,2);

                        circle.dX = (circle.x - this.mousePos.x) * (posScale) * 0.6;
                        circle.dY = (circle.y - this.mousePos.y) * (posScale) * 0.6;
                    } else {
                        circle.scale = 1;
                        circle.dX = 0;
                        circle.dY = 0;
                    }

                }

                this.updateCurrent(current);
            },

            updateCurrent:function (current) {
                if (current !== this.current) {
                    //if changed...
                    if (this.current === null) {
                        this.el.style.cursor = "pointer";
                    } else {
                        this.current.alpha = 0.5;
                        this.el.style.cursor = "default";
                    }
                    this.current = current;
                }
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