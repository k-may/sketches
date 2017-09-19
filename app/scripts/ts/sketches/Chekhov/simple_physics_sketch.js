/**
 * Created by kev on 15-10-09.
 */
define(['ts/sketches/Chekhov/base_sketch',
        'ts/utils/utils_shim'],

    function (BaseSketch,
        Utils) {


        return BaseSketch.extend({

            circles   :[],
            buffer    :null,
            mousePos  :{
                x:0,
                y:0
            },
            lastUpdate:-1,

            initialize:function () {
                this.buffer = Utils.CanvasUtils.CreateBuffer();
                this.el.appendChild(this.buffer.canvas);
                this.lastUpdate = Date.now();
                this.el.onmousemove = _.bind(this.onMouseMove,this);
            },

            onMouseMove:function (e) {
                this.mousePos = {
                    x:e.clientX,
                    y:e.clientY
                };
            },

            resize:function (width,height) {

                this.buffer.resize(width,height);

                if (this.circles.length === 0) {
                    this.createCircles();
                }
            },

            createCircles : function(){

                var width = this.buffer.width;
                var height = this.buffer.height;

                var attempts = 0;
                while (attempts++ < 1000 && this.circles.length < 100) {
                    var body = new GeomUtils.Circle(Math.floor(Math.random() * width)
                        ,Math.floor(Math.random() * height)
                        ,Math.floor(Math.random() * 100 + 50)
                        ,new ColorUtils.RandomColor());

                    var collides = false;
                    for (var i = 0,l = this.circles.length; i < l; i++) {
                        var other = this.circles[i];
                        var x = other.anchor.position.x - body.anchor.position.x;
                        var y = other.anchor.position.y - body.anchor.position.y;
                        var length = Math.sqrt(x * x + y * y);
                        if (length < other.radius + body.radius) {
                            collides = true;
                            break;
                        }
                    }
                    if (!collides) {
                        this.circles.push(body);
                    }
                }
            },

            draw:function (time) {

                this.buffer.clear();

                for (var i = 0; i < this.circles.length; i++) {
                    this.drawCircle(this.buffer.ctx,this.circles[i]);
                }

                this.updateMouse();
                this.updateCircles();

            },

            updateMouse:function () {

                var targetRadius = this.getTargetScale();
                var current = null;
                var circle,distance,targetScale,scale,pos,posScale;
                for (var i = 0; i < this.circles.length; i++) {

                    circle = this.circles[i];
                    pos = circle.position.position;
                    distance = Utils.AnimUtils.Distance(pos.x,this.mousePos.x,pos.y,this.mousePos.y);
                    targetScale = targetRadius / (circle.radius);

                    if (distance < circle.radius * circle.currentScale) {
                        //more static selection
                        circle.scale = targetScale;
                        current = circle;
                    } else {
                        circle.scale = 1;
                    }
                }

                this.current = current;
            },

            getTargetScale : function(){
              return 140;
            },

            updateCircles:function () {

                for (var i = 0; i < this.circles.length; i++) {
                    this.circles[i].constraint.resolve();
                }

                var length = this.circles.length;
                for (var i = 0; i < length; i++) {
                    for (var j = i + 1; j < length; j++) {
                        var pos1 = this.circles[i].position.position;
                        var pos2 = this.circles[j].position.position;
                        var rad1 = this.circles[i].radius * this.circles[i].currentScale;
                        var rad2 = this.circles[j].radius * this.circles[j].currentScale;
                        var target = (rad1 + rad2);

                        var distance = pos1.distance(pos2);

                        if (distance < target) {
                            var force = (distance - target) / distance;
                            pos1.x += (pos2.x - pos1.x) * force * 0.5;
                            pos1.y += (pos2.y - pos1.y) * force * 0.5;
                            pos2.x += (pos1.x - pos2.x) * force * 0.5;
                            pos2.y += (pos1.y - pos2.y) * force * 0.5;
                        }
                    }
                }
            },

            drawCircle:function (ctx,circle) {

                if (this.current) {
                    circle.currentScale += (circle.scale - circle.currentScale) * 0.1;
                } else {
                    circle.currentScale += (1 - circle.currentScale) * 0.1;
                }

                ctx.beginPath();
                ctx.fillStyle = circle.color.toRGBString();
                ctx.arc(circle.position.position.x,circle.position.position.y,Math.max(10,circle.radius * circle.currentScale - 20),0,Math.PI * 2);
                ctx.fill();
            }


        })

    })
