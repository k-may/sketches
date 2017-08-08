/**
 * Created by kev on 16-02-22.
 */
define(['util/utils',
        'base_sketch'],

    function (Utils,
        BaseSketch) {

        return BaseSketch.extend({

            buffer:null,

            drops : [],

            startShape : [],
            targetShape : [],

            loaded : false,

            initialize:function () {
                this.heightRatio = 1;

                this.buffer = Utils.CreateBuffer();
                this.el.appendChild(this.buffer.canvas);

                var self= this;
                Utils.LoadSVGPoints('img/drop.svg').then(function (pts) {
                    self.loaded = true;
                    self.drops = pts;
                    self.resize(self.buffer.width, self.buffer.height);
                });
            },

            resize:function (w,h) {
                this.buffer.resize(w,h);

                this.mousePos = {
                    x:w >> 1,
                    y:h >> 1
                };

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
                this.buffer.ctx.beginPath();

                var ratio = (Math.sin(Date.now() * 0.001) + 1) / 2;
                var shape  = this.getMorphedShape(this.startShape, this.targetShape, ratio);

                this.buffer.ctx.beginPath();
                this.drawShape(this.buffer, shape, 1);
                this.buffer.ctx.stroke();

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
                return [
                    { x : this.buffer.width >> 1, y : 0},
                    { x : this.buffer.width, y : 0},
                    { x : this.buffer.width, y : this.buffer.height},
                    { x : 0, y : this.buffer.height},
                     { x : 0, y : 0},
                     { x : this.buffer.width >> 1, y : 0}
                ];
            }


        })
    });