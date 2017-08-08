/**
 * Created by kev on 15-10-09.
 */

define(['underscore',
        'matter',
        'base_sketch',
        'utils/canvas_utils',
        'utils/geom_utils',
        'utils/color_utils'],

    function (_,
        Matter,
        BaseSketch,
        CanvasUtils,
        GeomUtils,
        ColorUtils) {

        var SCALE = 1.05;
        var INVERSE_SCALE = 1 / SCALE;

        return BaseSketch.extend({

            events:{
                'mousemove':'onMouseMove'
            },

            engine  :null,
            world   :null,
            bodies  :null,
            lastTime:0,

            buffer:null,

            mousePos:{
                x:0,
                y:0
            },

            current:null,

            circles:[],

            initialize:function () {

                this.buffer = CanvasUtils.CreateBuffer();
                this.el.appendChild(this.buffer.canvas);

                var controller = {
                    create:_.bind(this.create,this),
                    world :_.bind(this.world,this),
                    clear :_.bind(this.clear,this)
                };

                this.engine = Matter.Engine.create(({
                    render:{
                        controller:controller,
                        options   :{
                            width    :window.innerWidth,
                            height   :window.innerHeight,
                            hasBounds:true
                        }
                    }

                }));

                this.engine.world.gravity.x = 0;
                this.engine.world.gravity.y = 0;

                if (this.circles.length === 0) {
                    for (var i = 0; i < 10; i++) {

                        var pos = {
                            x:150 + (Math.random() * window.innerWidth - 300),
                            y:150 + (Math.random() * window.innerHeight - 300)
                        };
                        var radius = Math.floor(Math.random() * 50 + 225);
                        var circle = Matter.Bodies.circle(
                            pos.x,
                            pos.y,
                            radius,{
                                fillStyle:ColorUtils.RandomColor().toRGBString()
                            },
                            3);

                        circle.scale = 1;
                        circle.radius = radius;

                        Matter.World.add(this.engine.world,circle,{
                            'density'  :0.0001,
                            timeScale  :0.1,
                            friction   :0.001,
                            frictionAir:10
                        });

                        Matter.World.add(this.engine.world,Matter.Constraint.create({
                            pointA   :pos,//{ x : 300, y : 40},
                            bodyB    :circle,
                            stiffness:0.001
                        }));
                    }
                }


                Matter.Engine.run(this.engine);

                this.lastTime = Date.now();

                //   this.el.on("mousemove",_.bind(this.onMouseMove,this));

            },

            onMouseMove:function (e) {
                this.mousePos = {
                    x:e.clientX,
                    y:e.clientY
                };
            },

            resize:function (width,height) {
                this.buffer.resize(width,height);
                /*

                                this.engine.world.bounds.min = {
                                    x:0,
                                    y:0
                                };
                                this.engine.world.bounds.max = {
                                    x:width,
                                    y:height
                                };
                */

                /*this.engine.render.bounds.max = {
                    x:width,
                    y:height
                };*/


            },

            create:function (controller) {
                console.dir(controller);
                return controller;
            },

            world:function () {

                this.buffer.clear();

                var bodies = this.engine.world.bodies;

                if (this.current) {
                    if (this.current.scale < 1.5) {
                        this.current.scale *= SCALE;
                        Matter.Body.scale(this.current,SCALE,SCALE);
                    }
                }

                for (var i = 0; i < bodies.length; i++) {

                    var body = bodies[i];
                    var radius = body.radius;
                    var fillStyle = body.render.fillStyle;

                    if (body !== this.current) {
                        var distance = Math.sqrt(Math.pow(this.mousePos.x - body.position.x,2) + Math.pow(this.mousePos.y - body.position.y,2));
                        if (distance < radius) {
                            if (this.current) {
                                Matter.Body.scale(this.current,0.9,0.9);
                            }
                            this.current = body;
                        } else {
                            if (body.scale > 1) {
                                body.scale *= INVERSE_SCALE;
                                Matter.Body.scale(body,INVERSE_SCALE,INVERSE_SCALE);
                            }
                        }
                    }

                    var vertices = body.vertices;
                    this.buffer.ctx.beginPath();
                    this.buffer.ctx.fillStyle = fillStyle;
                    this.buffer.ctx.arc(body.position.x,body.position.y,body.radius*body.scale - 20,0,Math.PI * 2);

                    /*this.buffer.ctx.moveTo(vertices[0].x,vertices[0].y);
                    for (var j = 1; j < vertices.length; j++) {
                        this.buffer.ctx.lineTo(vertices[j].x,vertices[j].y);
                    }
                    this.buffer.ctx.lineTo(vertices[0].x,vertices[0].y);*/


                    this.buffer.ctx.fill();
                }
            }
            ,

            clear:function () {
                console.log("clear");

            }
            ,

            draw:function (time) {

                /*this.buffer.clear();

                var delta = time - this.lastTime;
                Matter.Engine.update(this.engine,delta,1.0);

                var bodies = this.engine.world.bodies;
                for (var i = 0; i < bodies.length; i++) {
                    var vertices = bodies[i].vertices;
                    this.buffer.ctx.beginPath();
                    this.buffer.ctx.moveTo(vertices[0].x,vertices[0].y);
                    for (var j = 1; i < vertices.length; i++) {
                        this.buffer.ctx.lineTo(vertices[j].x,vertices[j].y);
                    }
                    this.buffer.ctx.stroke();
                }

                this.lastTime = time;*/
            }

        })

    })