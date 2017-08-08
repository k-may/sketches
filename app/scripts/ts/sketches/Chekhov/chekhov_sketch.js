/**
 * Created by kev on 15-10-20.
 */

define(['sketches/simple_physics_sketch',
        'utils/load_utils',
        'utils/color_utils',
        'utils/geom_utils',
        'utils/animation_utils',
        'utils/canvas_utils'],

    function (SimplePhysicsSketch,
        LoadUtils,
        ColorUtils,
        GeomUtils,
        AnimUtils,
        CanvasUtils) {

        return SimplePhysicsSketch.extend({

            loadStarted:false,
            svg        :{
                width :0,
                height:0,
                scale :1,
                dX    :0,
                dY    :0
            },

            targetPanRatio:0,
            panRatio      :0,
            panSpeed      :0,
            panPos        :0,

            glassesBuffer:null,
            loaded       :false,

            createCircles:function () {

                if (this.loadStarted) {
                    return;
                }
                this.loadStarted = true;
                var self = this;

                LoadUtils.LoadImage('img/glasses.png').then(function (img) {
                    self.glassesBuffer = CanvasUtils.CreateBuffer();
                    self.glassesBuffer.resize(img.naturalWidth,img.naturalHeight);
                    self.glassesBuffer.ctx.drawImage(img,0,0);
                });

                this.glassesBuffer = CanvasUtils.CreateBuffer();
                LoadUtils.LoadSVG('svg/checkov_circles.svg').then(function (svg) {

                    var svg = svg.getElementsByTagName('svg')[0];
                    var viewbox = svg.viewBox.baseVal;
                    self.svg = {
                        width :viewbox.width,
                        height:viewbox.height,
                        scale :1
                    };

                    var circlesSVG = svg.getElementsByTagName('circle');
                    for (var i = 0; i < circlesSVG.length; i++) {
                        var circle = self.parseCircle(circlesSVG[i]);
                        self.circles.push(circle);
                    }

                    self.loaded = true;

                    //reset offsets
                    self.resize(self.buffer.width,self.buffer.height);
                });
            },

            resize:function (width,height) {

                SimplePhysicsSketch.prototype.resize.apply(this,arguments);

                if (this.loaded) {
                    var scale = Math.min(width / this.svg.width,height / this.svg.height);
                    this.svg.scale = scale;

                    this.setScrollRatio(this.scrollRatio);
                }
            },

            parseCircle:function (child) {
                var x = parseInt(child.getAttribute("cx"));
                var y = parseInt(child.getAttribute("cy"));
                var radius = parseInt(child.getAttribute("r"));
                var fill = child.getAttribute('fill');
                var color = ColorUtils.hexToRgb(fill);
                return new GeomUtils.Circle(x,y,radius,color);
            },

            updateMouse:function () {
                this.updateCurrentMouse();
                this.updatePan();
            },

            updateCurrentMouse:function () {
                var targetRadius = this.getTargetScale();
                var current = null;
                var circle,distance,targetScale,pos;

                for (var i = 0; i < this.circles.length; i++) {

                    circle = this.circles[i];
                    pos = this.getCirclePosWorld(circle);//circle.position.position;
                    distance = AnimUtils.Distance(pos.x,this.mousePos.x,pos.y,this.mousePos.y);
                    targetScale = targetRadius / (circle.radius);

                    if (distance < pos.radius) {
                        //more static selection
                        circle.scale = Math.max(1,targetScale);
                        circle.setActive(true);
                        current = circle;
                    } else {
                        circle.setActive(false);
                        circle.scale = 1;
                    }
                }
                this.current = current;
            },

            updatePan:function () {

                this.panSpeed = 0;
                if (this.getPanDifference()) {
                    if (this.mousePos.y < 200) {
                        var speed = 2 / 200;
                        this.panSpeed = 5 * ( 1 - speed);
                    } else if (this.mousePos.y > this.buffer.height - 200) {
                        var speed = (this.mousePos.y - (this.buffer.height - 200));
                        speed = speed / 200;
                        this.panSpeed = -5 * (speed);
                    }
                }
            },

            draw:function (time) {

                if (this.loaded) {
                    var difference = this.getPanDifference();
                    this.targetPanRatio = difference ? Math.max(-1,Math.min(1,(this.targetPanRatio * difference + this.panSpeed) / difference)) : 0;
                    this.panRatio += (this.targetPanRatio - this.panRatio) * 0.1;
                }

                SimplePhysicsSketch.prototype.draw.apply(this,arguments);

                if (this.glassesBuffer) {
                    var glassesPos = this.getGlassesPosWorld();
                    var scale = this.getWorldScale();
                    this.buffer.ctx.drawImage(this.glassesBuffer.canvas,
                        glassesPos.x,
                        glassesPos.y,
                        this.glassesBuffer.width * scale / 10,
                        this.glassesBuffer.height*scale / 10
                    );
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

                var cP = this.getCirclePosWorld(circle);

                ctx.arc(cP.x,cP.y,cP.radius,0,Math.PI * 2);
                ctx.fill();
            },

            getPanDifference:function () {
                //todo create variable, set only on resize
                var scale = this.getWorldScale();
                var svgWorldHeight = this.svg.height * scale;
                return svgWorldHeight - this.buffer.height;
            },

            getGlassesPosWorld:function () {

                var x = 0.08;
                var y = 0.45;
                var scale = this.getWorldScale();
                return {
                    x    :(this.svg.dX + this.svg.width* x)*scale ,
                    y    :(this.svg.dY + this.svg.height*y)*scale + this.panRatio * this.getPanDifference(),
                    scale:scale
                };
            },

            getCirclePosWorld:function (circle) {
                var scale = this.getWorldScale();
                return {
                    x     :(this.svg.dX + circle.position.position.x) * scale,
                    y     :(this.svg.dY + circle.position.position.y) * scale + this.panRatio * this.getPanDifference(),
                    radius:circle.radius * circle.currentScale * scale
                }
            },

            getTargetScale:function () {
                return 20;
            },

            getWorldScale:function () {
                return this.svg.scale + this.scrollRatio * 4;
            },

            setScrollRatio:function (value) {
                this.scrollRatio = value;

                var scale = this.getWorldScale();
                this.svg.dX = (this.buffer.width / scale - this.svg.width) / 2;
                this.svg.dY = (this.buffer.height / scale - this.svg.height) / 2;
            },

            //override
            toggle:function () {
                //do nothing
            },

        })

    })