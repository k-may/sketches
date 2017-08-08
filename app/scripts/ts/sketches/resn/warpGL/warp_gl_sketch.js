/**
 * Created by kev on 16-03-01.
 */

define(['three',
        'util/utils',
        'sketches/warpGL/warp_shader_data',
        'sketches/warpGL/frame_geometry',
        'base_sketch'],

    function (THREE,
        Utils,
        ShaderData,
        FrameGeometry,
        BaseSketch) {

        var MAX_DEPTH = 1000;
        var NUM_PLANES = 1000;

        return BaseSketch.extend({

            renderer     :null,
            canvas       :null,
            shaderData   :null,
            loaded       :false,
            frameGeometry:null,
            mousePos     :null,
            planes       :null,
            startShape   :[],
            targetShape  :[],

            initialize:function () {

                this.heightRatio = 1;

                this.el.style.backgroundColor = "red";

                this.renderer = new THREE.WebGLRenderer({alpha:true, anitalias : true});
                this.renderer.setClearColor(new THREE.Color(0x00ffffff),0);
                this.renderer.sortObjects = false;

                this.canvas = this.renderer.domElement;
                this.el.appendChild(this.canvas);

                this.shaderData = new ShaderData("background_01","vertex_normalize",this.frameGeometry);

                this.mousePos = {
                    x:window.innerWidth >> 1,
                    y:window.innerHeight >> 1
                };
                var _this = this;
                this.shaderData.start(NUM_PLANES).then(function () {
                    _this.loaded = true;
                    _this.createPlanes();
                    _this.resize(_this.width,_this.height);
                });
            },

            createPlanes:function () {
                this.planes = [];
                var num = NUM_PLANES + 1;
                for (var i = 0; i < num; i++) {
                    this.planes.push({
                        pos:{
                            x:0,
                            y:0,
                            z:(i / num) * MAX_DEPTH
                        }
                    });
                }
            },

            setMousePos:function (pos) {
                this.delta = Math.max(200,this.delta + Math.abs(pos.x - this.mousePos.x));
                this.mousePos = pos;
            },

            resize:function (w,h) {
                this.width = w;
                this.height = h;

                if (!this.loaded) {
                    return;
                }

                this.mousePos = {
                    x:w >> 1,
                    y:h >> 1
                };

                for (var i = 0; i < this.planes.length; i++) {
                    this.planes[i].pos = {
                        x:this.mousePos.x,
                        y:this.mousePos.y,
                        z:(i / this.planes.length) * MAX_DEPTH
                    };
                }

                this.targetShape = this.getTargetShape();
                this.renderer.setSize(w,h);
            },

            draw:function (time) {

                if (!this.loaded) {
                    return;
                }

                this.shaderData.update(this.width,this.height);
                //this.updatePlanes();
                this.drawPlanes();

                this.shaderData.render(this.renderer);

            },


            drawPlanes:function () {
                this.startShape = this.getStartShape();

                var pos = {
                    x:this.mousePos.x,
                    y:this.mousePos.y
                };

                this.planes = this.planes.sort(function (planeA,planeB) {
                    return planeA.pos.z - planeB.pos.z;
                });

                this.planes[0].pos.x = pos.x;
                this.planes[0].pos.y = pos.y;
                var z = 0;

                var previous = Utils.InterpolateShape(this.startShape,this.targetShape,z);
                Utils.TranslateShape(previous,{x:-pos.x,y:-pos.y});
                Utils.ScaleShape(previous,z);
                Utils.TranslateShape(previous,pos);

                //MAX_DEPTH = 1000;
                //draw all but last!
                var time = Date.now();
                var zOffset = 100 * (Math.sin(time * 0.001) + 1)/2;
                for (var i = 0; i < this.planes.length; i++) {

                    var plane = this.planes[i];
                    plane.pos.x += (pos.x - plane.pos.x) * 0.99;
                    plane.pos.y += (pos.y - plane.pos.y) * 0.99;
                    plane.pos.z = (plane.pos.z) % MAX_DEPTH;

                    z = Math.pow(plane.pos.z / MAX_DEPTH,2);
                    var outerShape = Utils.InterpolateShape(this.startShape,this.targetShape,z);
                    Utils.TranslateShape(outerShape,{x:-plane.pos.x,y:-plane.pos.y});
                    Utils.ScaleShape(outerShape,z);
                    Utils.TranslateShape(outerShape,plane.pos);

                    //draw composited shape
                    if(i < this.planes.length - 1){
                        //console.log(i,outerShape, previous);
                        this.shaderData.updateFrame(i, outerShape, previous, zOffset);
                    }

                    previous = outerShape;
                    pos = plane.pos;
                }
            },

            getStartShape:function () {
                var shapeSize = 0;//Math.min(window.innerWidth,window.innerHeight);
                var rect = {
                    x:(window.innerWidth - shapeSize) >> 1,
                    y:(window.innerHeight - shapeSize) >> 1,
                    w:shapeSize,
                    h:shapeSize
                };

                return [
                    {x:rect.x,y:rect.y},
                     {x:rect.x + shapeSize,y:rect.y},
                     {x:rect.x + shapeSize,y:rect.y + shapeSize},
                    {x:rect.x,y:rect.y + shapeSize}
                ];
            },

            getTargetShape:function () {
                var offset = 100;
                return [
                    {x:-offset,y:-offset},
                    {x:window.innerWidth + offset*2,y:-offset},
                     {x:window.innerWidth + offset * 2,y:window.innerHeight + offset*2},
                    {x:-offset,y:window.innerHeight + offset * 2},


                ];
            },

            createFrame:function () {


            }


        });

    });