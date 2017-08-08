/**
 * Created by kev on 16-02-29.
 */

define(['base_sketch','util/utils'],

    function (BaseSketch,
        Utils) {

        var MAX_DEPTH = 1000;

        return BaseSketch.extend({


            startShape :null,
            targetShape:null,

            tempBuffer : null,
            buffer   :null,
            img      :null,
            imgBuffer:null,

            width:  -1,
            height : -1,

            loaded : false,

            initialize:function () {

                this.heightRatio = 1;

                this.planes = [];
                var num = 10;
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

                //load image
                var self = this;
                Utils.LoadImageBySrc('img/AYCF_heroin.jpg').then(function(img){
                    self.img = img;
                    self.onLoad();
                }).catch(function(e){
                    console.error(e.stack);
                })

             },

            onLoad:function () {

                this.loaded = true;

                this.tempBuffer = Utils.CreateBuffer();

                this.buffer = Utils.CreateBuffer();
                this.el.appendChild(this.buffer.canvas);

                this.imgBuffer = Utils.CreateBuffer();

                this.resize(this.width, this.height);
            },

            resize:function (w,h) {

                this.width = w;
                this.height = h;

                if(!this.loaded){
                    return;
                }

                this.buffer.resize(w, h);
                this.tempBuffer.resize(w, h);
                this.imgBuffer.resize(w, h);
                this.renderImageBuffer();

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

            renderImageBuffer : function(){
                this.imgBuffer.clear();

                var scale = Math.min(this.img.naturalWidth / this.imgBuffer.width, this.img.naturalHeight / this.imgBuffer.height);

                var clipRect = {
                    x : ((this.img.naturalWidth - this.width*scale) >> 1)/scale,
                    y : ((this.img.naturalHeight - this.height*scale) >> 1)/scale,
                    w : this.imgBuffer.width*scale,
                    h : this.imgBuffer.height*scale
                };

                this.imgBuffer.ctx.drawImage(this.img, clipRect.x, clipRect.y, clipRect.w, clipRect.h,
                    0,0, this.imgBuffer.width, this.imgBuffer.height
                );

            },


            draw : function(){

                if(!this.loaded){
                    return;
                }

                this.buffer.clear();
               // this.buffer.ctx.drawImage(this.imgBuffer.canvas, 0, 0);

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

                //draw all but last!
                for (var i = 0; i < this.planes.length; i++) {


                    //draw inner (using previous plane)
                    var innerShape = this.interpolateShape(this.startShape,this.targetShape,z);
                    this.translateShape(innerShape,{x:-pos.x,y:-pos.y});
                    this.scaleShape(innerShape,z);
                    this.translateShape(innerShape,pos);

                    var plane = this.planes[i];
                    plane.pos.x += (pos.x - plane.pos.x) * 0.1;
                    plane.pos.y += (pos.y - plane.pos.y) * 0.1;
                    plane.pos.z = (plane.pos.z + 1) % MAX_DEPTH;

                    z = Math.pow(plane.pos.z / MAX_DEPTH,2);
                    var outerShape = this.interpolateShape(this.startShape,this.targetShape,z);
                    this.translateShape(outerShape,{x:-plane.pos.x,y:-plane.pos.y});
                    this.scaleShape(outerShape,z);
                    this.translateShape(outerShape,plane.pos);

                           // if(i % 2 === 0){


                    //draw composited shape
                    this.drawShapes(outerShape,innerShape, { x : pos.x, y : pos.y, z : z}, plane.color.toRGBString());
                        //    }
                    pos = plane.pos;
                }

            },

            drawShapes:function (outer,inner,pos, color) {
               var buffer = this.tempBuffer;
                buffer.clear();
                //this.delta *= 0.999;

//buffer.ctx.globalCompositeOperation  = "source-out";
  buffer.ctx.globalCompositeOperation  = "source-out";

                //         console.log(outer, inner);
                buffer.ctx.fillStyle = color;

                buffer.ctx.save();


                      //  buffer.ctx.save();
                buffer.ctx.translate(this.width >> 1, this.height >> 1);

                buffer.ctx.scale(Math.pow(pos.z, 2)* 2, Math.pow(pos.z, 2) * 2);// * 2);
               // console.log(pos.z);
                buffer.ctx.translate(-this.width >> 1, -this.height >> 1);
                
                //draw outer
                
                buffer.ctx.beginPath();

                this.drawShape(buffer,outer,1);
                buffer.ctx.closePath();
               
//buffer.ctx.globalCompositeOperation  = "source-in";
                var width = outer[2].x - outer[0].x; 
                var height = outer[2].y - outer[0].y
                var x = outer[0].x;
                var y = outer[0].y;
                buffer.ctx.drawImage(this.imgBuffer.canvas, 0,0);//x, y);//, width, height);//,
                //x, y, width, height);

 buffer.ctx.clip();
                this.drawShape(buffer,inner,-1);
                buffer.ctx.closePath();
                buffer.ctx.fill();
              
           //   buffer.ctx.restore();          
                 //       buffer.ctx.clip();
              
          //  buffer.ctx.save();

                

              /* buffer.ctx.beginPath();
buffer.ctx.fillStyle = "#ff0000";
               buffer.ctx.fillRect(0,0,200,200);
                buffer.ctx.fill();*/
                                   // buffer.ctx.save();
                
              //  buffer.ctx.globalCompositeOperation  = "source-in";

              // buffer.ctx.drawImage(this.imgBuffer.canvas, 0, 0);

               
                

             //   buffer.ctx.fill();

                
               // buffer.ctx.restore();
   buffer.ctx.restore();
                this.buffer.ctx.drawImage(buffer.canvas, 0, 0);

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
            },

            scaleRect:function (rect,scale) {
                return {
                    x     :rect.x * scale,
                    y     :rect.y * scale,
                    width :rect.width * scale,
                    height:rect.height * scale
                };
            },

            translateRect:function (rect,x,y) {
                return {
                    x     :rect.x + x,
                    y     :rect.y + y,
                    width :rect.width,
                    height:rect.height
                }
            },


            setMousePos:function (pos) {
                this.delta = Math.max(200,this.delta + Math.abs(pos.x - this.mousePos.x));
                this.mousePos = pos;
            },



        });


    });