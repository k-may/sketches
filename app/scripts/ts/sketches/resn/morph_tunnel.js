/**
 * Created by kev on 16-02-22.
 */
/**
 * Created by kev on 16-02-22.
 */
define(['util/utils',
        'base_sketch'],

    function (Utils,
        BaseSketch) {

        var MIN_DEPTH = 100;
        var MAX_DEPTH = 1000;

        return BaseSketch.extend({

            buffer:null,

            drops : [],

            startShape : [],
            targetShape : [],
            planes : [],

            loaded : false,

            initialize:function () {
                this.heightRatio = 1;

                this.buffer = Utils.CreateBuffer();
                this.el.appendChild(this.buffer.canvas);

                var self= this;
                Utils.LoadSVGPoints('img/circle.svg').then(function (pts) {
                    self.loaded = true;
                    self.drops = pts;
                    self.createPlanes();
                    self.resize(self.buffer.width, self.buffer.height);
                });
            },

            createPlanes : function(){

                this.planes = [];
                var num = 20;
                for (var i = 0; i < num; i++) {
                    this.planes.push({
                        pos  :{
                            x:0,
                            y:0,
                            z:(i / num) * MAX_DEPTH
                        },
                        color:Utils.Color.Random()
                    });
                }

              //  this.buffer = Utils.CreateBuffer();
               // this.el.appendChild(this.buffer.canvas);
            },

            resize:function (w,h) {
                this.buffer.resize(w,h);

                this.mousePos = {
                    x:w >> 1,
                    y:h >> 1
                };

                if(!this.loaded){
                    return;
                }

                for (var i = 0; i < this.planes.length; i++) {
                    this.planes[i].pos = {
                        x:this.mousePos.x,
                        y:this.mousePos.y,
                        z:MIN_DEPTH + (i / this.planes.length) * (MAX_DEPTH - MIN_DEPTH)
                    };
                }
                this.startShape = this.getStartShape();
                this.targetShape = this.getTargetShape();

            },

            setMousePos:function (pos) {
                this.delta = Math.max(200,this.delta + Math.abs(pos.x - this.mousePos.x));
                this.mousePos = {x:pos.x - 100,y:pos.y - 100};
            },

            draw:function () {

                if(!this.loaded){
                    return;
                }

                this.buffer.clear();

                var pos = {
                    x:this.mousePos.x,
                    y:this.mousePos.y
                };

                this.planes = this.planes.sort(function (planeA,planeB) {
                    return planeA.pos.z - planeB.pos.z;
                });

                this.planes[0].pos.x = pos.x;
                this.planes[0].pos.y = pos.y;
                var z =  this.planes[0].pos.z;

                //draw all but last!
                for (var i = 0; i < this.planes.length; i++) {

                    //draw inner (using previous plane)
                    var innerShape = this.interpolateShape(this.startShape,this.targetShape, i / this.planes.length);
                    this.translateShape(innerShape,{x:-pos.x,y:-pos.y});
                    this.scaleShape(innerShape,z);
                    this.translateShape(innerShape,pos);

                    var plane = this.planes[i];
                    plane.pos.x += (pos.x - plane.pos.x) * 0.1;
                    plane.pos.y += (pos.y - plane.pos.y) * 0.1;
                    plane.pos.z = (plane.pos.z + 1) % (MAX_DEPTH - MIN_DEPTH);

                    z = Math.pow((plane.pos.z + MIN_DEPTH) / MAX_DEPTH, 2);//Math.pow(plane.pos.z / (MAX_DEPTH - MIN_DEPTH),2);
                    var outerShape = this.interpolateShape(this.startShape,this.targetShape,z);
                    this.translateShape(outerShape,{x:-plane.pos.x,y:-plane.pos.y});
                    this.scaleShape(outerShape,z);
                    this.translateShape(outerShape,plane.pos);

                    //draw composited shape
                    if(i !== 0){
                    this.drawShapes(outerShape,innerShape,plane.color.toRGBString());
                    }

                    pos = plane.pos;
                }


            },

            drawMorph : function(){
                this.buffer.ctx.beginPath();

                var ratio = (Math.sin(Date.now() * 0.001) + 1) / 2;
                var shape  = this.getMorphedShape(this.startShape, this.targetShape, ratio);

                this.buffer.ctx.beginPath();
                this.drawShape(this.buffer, shape, 1);
                this.buffer.ctx.stroke();
            },

            drawShapes:function (outer,inner,color) {
                var buffer = this.buffer;
                //this.delta *= 0.999;

                //         console.log(outer, inner);
                buffer.ctx.fillStyle = color;

                //draw outer
                buffer.ctx.save();
                buffer.ctx.beginPath();

                this.drawShape(buffer,outer,1);
                buffer.ctx.closePath();
                buffer.ctx.clip();

                this.drawShape(buffer,inner,-1);
                buffer.ctx.closePath();
                buffer.ctx.fill();
                buffer.ctx.restore();

            },

            drawShape:function (buffer,shape,direction) {
                if (direction === -1) {
                    for (var i = 0; i < shape.length; i++) {
                        if (i === 0) {
                            buffer.ctx.moveTo(shape[i].x,shape[i].y);
                        } else {
                            buffer.ctx.lineTo(shape[i].x,shape[i].y);
                        }
                    }
                } else {
                    for (var i = shape.length - 1; i >= 0; i--) {
                        if (i === 3) {
                            buffer.ctx.moveTo(shape[i].x,shape[i].y);
                        } else {
                            buffer.ctx.lineTo(shape[i].x,shape[i].y);
                        }
                    }
                }
            },

            interpolateShape:function (start,target,ratio) {
                var pts = [];
                for (var i = 0; i < start.length; i++) {
                    var x = start[i].x + (target[i].x - start[i].x) * ratio;
                    var y = start[i].y + (target[i].y - start[i].y) * ratio;
                    pts.push({x:x,y:y});
                }
                return pts;
            },

            getMorphedShape : function(start, target, ratio){

                var startNum = start.length;
                var targetNum = target.length;
                var count = Math.max(startNum, targetNum);
                var shape = [];

                for(var i = 0; i < count; i ++){
                    var sI = i;
                    var tI = Math.floor(i / (startNum / targetNum));

                    shape.push({
                        x : start[sI].x + (target[tI].x - start[sI].x)*ratio,
                        y : start[sI].y + (target[tI].y - start[sI].y)*ratio
                    });
                }

                return shape;
            },

            getStartShape : function(){

                var size = Math.min(this.buffer.width, this.buffer.height);
                var offsetX= (this.buffer.width - size) >> 1;
                var offsetY= (this.buffer.height - size) >> 1;
                var pts = [];
                for(var i = 0 ;i < this.drops.length; i ++){
                    pts.push({
                        x : offsetX + this.drops[i].x * size,
                        y : offsetY + this.drops[i].y * size
                    });
                }
                return pts;
            },

            getTargetShape : function(){
                var shape = [
                    { x : this.buffer.width >> 1, y : 0},
                    { x : this.buffer.width, y : 0},
                    { x : this.buffer.width, y : this.buffer.height},
                    { x : 0, y : this.buffer.height},
                    { x : 0, y : 0},
                    { x : this.buffer.width >> 1, y : 0}
                ];
                return this.getMorphedShape(this.startShape, shape, 1);
            },

            scaleShape:function (shape,scale) {
                for (var i = 0; i < shape.length; i++) {
                    this.scalePt(shape[i],scale);
                }
            },

            translateShape:function (shape,pt) {
                for (var i = 0; i < shape.length; i++) {
                    this.translatePt(shape[i],pt);
                }
            },

            scalePt:function (pt,scale) {
                pt.x *= scale;
                pt.y *= scale;
            },

            translatePt:function (pt,tPt) {
                pt.x = pt.x + tPt.x;
                pt.y = pt.y + tPt.y;
            }


        })
    });