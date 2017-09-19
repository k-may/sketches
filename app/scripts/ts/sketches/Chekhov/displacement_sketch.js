/**
 * Created by kev on 15-10-14.
 */


define(['rsvp',
        'ts/common/base_sketch',
        'ts/utils/canvas_utils',
        'ts/utils/anim_utils'],

    function (RSVP,
        BaseSketch,
        CanvasUtils,
        AnimationUtils) {

        return BaseSketch.extend({

            circles:null,
            buffer :null,
            mousePos : {
                x : 0,
                y : 0
            },

            initialize:function () {

                this.circles = [];
                this.buffer = CanvasUtils.CreateBuffer();
                this.el.appendChild(this.buffer.canvas);

                var _this = this;
                this.loadSVG('svg/svg_displacement.svg').then(function (svg) {

                    var children = svg.getElementsByTagName('circle');

                    for (var i = 0; i < children.length; i++) {
                        var child = children[i];
                        var circle = {
                            x     :parseInt(child.getAttribute("cx")) * 1.2,
                            y     :parseInt(child.getAttribute("cy")) * 1.2,
                            radius:parseInt(child.getAttribute('r')),
                            scale :1,
                            linked:[]
                        };
                        _this.circles.push(circle);
                    }

                    _this.loaded = true;

                }).catch(function (e) {
                    console.log("error : " + e.message);
                });

                this.el.onmousemove = _.bind(this.onMouseMove, this);
            },

            onMouseMove : function(e){
                this.mousePos = {
                    x :e.clientX,
                    y :e.clientY
                };
            },

            setLoaded:function () {

                for (var i = 0; i < this.circles; i++) {

                    var circle = this.circles[i];
                    var radius = circle.radius;

                    for (var j = 0; j < this.circles.length; j++) {
                        if (i !== j) {
                            var next = this.circles[j];
                            var distance = AnimationUtils.Distance(circle.x,next.x,circle.y,next.y);

                            if (distance < 500) {
                                circle.linked.push(next);
                            }

                        }
                    }
                }
            }
            ,

            resize:function (width,height) {
                this.buffer.resize(width,height);
            }
            ,

            draw:function () {

                if (!this.loaded) {
                    return;
                }
                this.buffer.clear();
                this.drawCircles();
            }
            ,

            getCurrent : function(){

            },

            drawCircles:function () {

                var circle;
                for (var i = 0; i < this.circles.length; i++) {

                    circle = this.circles[i];

                    /*if (this.current === circle) {
                        continue;
                    }*/

                    this.drawCircle(circle);
                }
            }
            ,

            drawCircle:function (circle) {

                this.buffer.ctx.fillStyle = "#000";
                this.buffer.ctx.beginPath();
                this.buffer.ctx.arc(circle.x,circle.y,circle.radius * circle.scale,0,Math.PI * 2);
                this.buffer.ctx.fill();

            }
            ,

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
