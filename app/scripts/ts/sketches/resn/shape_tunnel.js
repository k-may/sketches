/**
 * Created by kev on 16-02-17.
 */
/**
 * Created by kev on 16-02-17.
 */
define(['util/utils',
        'base_sketch'],

    function (Utils,
        BaseSketch) {

        var MAX_DEPTH = 1000;

        return BaseSketch.extend({

            buffer  :null,
            frame   :0,
            mousePos:null,

            startShape :[],
            targetShape:[],

            cornerAngles:[],

            delta:0,

            isMouseDown:false,
            startIndex :0,

            initialize:function () {

                this.heightRatio = 1;

                this.planes = [];
                var num = 50;
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

                this.buffer = Utils.CreateBuffer();
                this.el.appendChild(this.buffer.canvas);

                this.buffer.canvas.style.transform = "scale3d(1.2,1.2,1)";
            },

            resize:function (w,h) {
                this.buffer.resize(w,h);

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
            },

            setMousePos:function (pos) {
                this.delta = Math.max(200,this.delta + Math.abs(pos.x - this.mousePos.x));
                this.mousePos = pos;
            },

            mouseDown:function () {
                this.startTime = Date.now();
                this.startIndex = 0;
                this.isMouseDown = true;
            },

            mouseUp:function () {
                this.startIndex = 0;
                this.isMouseDown = false;
            },

            draw:function () {
                this.buffer.clear();
                if (this.isMouseDown) {
                    var elapsed = Date.now() - this.startTime;
                    this.startIndex = Math.min(this.planes.length,Math.floor(elapsed / (10)));// - 100 * Math.pow(this.startIndex / this.planes.length, 2))));
                } else {
                    return;
                }


                this.startShape = this.getStartShape();

                var time = Date.now();
                var pos = {
                    x:this.mousePos.x + Math.sin(time * 0.004) * 50,
                    y:this.mousePos.y + Math.cos(time * 0.004) * 50
                };

                this.planes = this.planes.sort(function (planeA,planeB) {
                    return planeA.pos.z - planeB.pos.z;
                });

                this.planes[0].pos.x = pos.x;
                this.planes[0].pos.y = pos.y;
                for (var i = 0; i < this.planes.length; i++) {
                    var plane = this.planes[i];
                    plane.pos.x += (pos.x - plane.pos.x) * 0.2;
                    plane.pos.y += (pos.y - plane.pos.y) * 0.2;
                    plane.pos.z = (plane.pos.z + 5) % MAX_DEPTH;
                    pos = plane.pos;
                }

                if (Math.floor(time / 2000) % 2) {
                    this.drawForward(pos);
                } else {
                    this.drawReversed(pos);
                }
            },

            drawForward:function (pos) {
                var z = 0;

                var previous = this.interpolateShape(this.startShape,this.targetShape,z);
                this.translateShape(previous,{x:-pos.x,y:-pos.y});
                this.scaleShape(previous,z);
                this.translateShape(previous,pos);

                for (var i = 0; i < this.planes.length; i++) {
                    var plane = this.planes[i];
                   /* plane.pos.x += (pos.x - plane.pos.x) * 0.2;
                    plane.pos.y += (pos.y - plane.pos.y) * 0.2;
                    plane.pos.z = (plane.pos.z + 5) % MAX_DEPTH;*/

                    z = Math.pow(plane.pos.z / MAX_DEPTH,2);
                    var outerShape = this.interpolateShape(this.startShape,this.targetShape,z);
                    this.translateShape(outerShape,{x:-plane.pos.x,y:-plane.pos.y});
                    this.scaleShape(outerShape,z);
                    this.translateShape(outerShape,plane.pos);

                    //draw composited shape
                    // if (this.planes.length - this.startIndex < i) {
                    this.drawShapes(outerShape,previous,plane.color.toRGBString());
                    // }

                    previous = outerShape;

                    //pos = plane.pos;
                }
            },

            drawReversed:function (pos) {
                var z = 0;

                var previous = this.interpolateShape(this.startShape,this.targetShape,z);
                this.translateShape(previous,{x:-pos.x,y:-pos.y});
                this.scaleShape(previous,z);
                this.translateShape(previous,pos);
                for (var i = this.planes.length - 1; i >= 0; i--) {
                    var plane = this.planes[i];
                   /* plane.pos.x += (pos.x - plane.pos.x) * 0.2;
                    plane.pos.y += (pos.y - plane.pos.y) * 0.2;
                    plane.pos.z = (plane.pos.z + 5) % MAX_DEPTH;*/

                    z = Math.pow(plane.pos.z / MAX_DEPTH,2);
                    var outerShape = this.interpolateShape(this.startShape,this.targetShape,z);
                    this.translateShape(outerShape,{x:-plane.pos.x,y:-plane.pos.y});
                    this.scaleShape(outerShape,z);
                    this.translateShape(outerShape,plane.pos);

                    //draw composited shape
                    if (this.planes.length - this.startIndex < i) {
                        this.drawShapes(outerShape,previous,plane.color.toRGBString(),true);
                    }

                    previous = outerShape;

                   // pos = plane.pos;
                }
            },

            drawShapes:function (outer,inner,color,reversed) {
                var buffer = this.buffer;

                buffer.ctx.fillStyle = color;

                //draw outer
                buffer.ctx.save();
                buffer.ctx.beginPath();

                if (!reversed) {
                    this.drawShape(buffer,outer,1);
                    buffer.ctx.closePath();
                    buffer.ctx.clip();
                }

                this.drawShape(buffer,inner,-1);
                buffer.ctx.closePath();
                buffer.ctx.fill();
                buffer.ctx.restore();
            },


            drawPlane:function (plane) {

                var buffer = this.buffer;

                var pos = plane.pos;

                this.delta *= 0.999;

                var shape = this.interpolateShape(this.startShape,this.targetShape);

                buffer.ctx.fillStyle = plane.color.toRGBString();

                //draw outer
                buffer.ctx.beginPath();
                buffer.ctx.moveTo(0,0);
                buffer.ctx.lineTo(this.buffer.width,0);
                buffer.ctx.lineTo(this.buffer.width,this.buffer.height);
                buffer.ctx.lineTo(0,this.buffer.height);
                buffer.ctx.closePath();


                //draw inner
                var z = Math.pow(plane.pos.z / MAX_DEPTH,2);
                var shape = this.interpolateShape(this.startShape,this.targetShape,z);
                shape = this.translateShape(shape,{x:-pos.x,y:-pos.y});
                shape = this.scaleShape(shape,z);
                shape = this.translateShape(shape,pos);

                for (var i = 0; i < shape.length; i++) {
                    if (i === 0) {
                        buffer.ctx.moveTo(shape[i].x,shape[i].y);
                    } else {
                        buffer.ctx.lineTo(shape[i].x,shape[i].y);
                    }
                }

                buffer.ctx.closePath();
                buffer.ctx.fill();
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

            getStartShape:function () {


                var shapeSize = Math.min(window.innerWidth,window.innerHeight);
                var rect = {
                    x:(window.innerWidth - shapeSize) >> 1,
                    y:(window.innerHeight - shapeSize) >> 1,
                    w:shapeSize,
                    h:shapeSize
                };
                var rotation = Math.PI / 4;

                /*
                                var centerPt = {
                                    x:rect.x + (shapeSize >> 1),
                                    y:rect.y + (shapeSize >> 1)
                                };
                                var x = centerPt.x + Math.sin(Math.PI / 2) * (shapeSize >> 1);
                                var y = centerPt.y + Math.cos(Math.PI / 2) * (shapeSize >> 1);

                                var pts = [];
                                var rotation = Math.sin(Date.now() * 0.001) * Math.PI * 0.1 + Math.PI * 0.25;
                                //  rotation *= this.delta/200;
                                var ratio;
                                for (var i = 0; i < 4; i++) {
                                    ratio = 0.5 + i / 4;
                                    pts.push({
                                        x:centerPt.x + Math.sin(Math.PI * 2 * ratio + rotation) * (shapeSize >> 1),
                                        y:centerPt.y + Math.cos(Math.PI * 2 * ratio + rotation) * (shapeSize >> 1)
                                    });
                                }
                                return pts;*/

                return [
                    {x:rect.x,y:rect.y},
                    {x:rect.x,y:rect.y + shapeSize},
                    {x:rect.x + shapeSize,y:rect.y + shapeSize},
                    {x:rect.x + shapeSize,y:rect.y}
                ];
            },

            getTargetShape:function () {
                var shapeSize = Math.min(window.innerWidth,window.innerHeight);
                var rect = {
                    x:(window.innerWidth - shapeSize) >> 1,
                    y:(window.innerHeight - shapeSize) >> 1,
                    w:shapeSize,
                    h:shapeSize
                };

                return [
                    {x:0,y:0},
                    {x:0,y:window.innerHeight},
                    {x:window.innerWidth,y:window.innerHeight},
                    {x:window.innerWidth,y:0}
                ];
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