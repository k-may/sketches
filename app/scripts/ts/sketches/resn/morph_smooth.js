/**
 * Created by kev on 16-02-23.
 */

define(['util/utils',
        'base_sketch'],

    function (Utils,
        BaseSketch) {


        var MorphShape = (function () {
            var MorphShape = function (start,target) {
                if (start.length !== target.length) {
                    console.error("Morph not congruent");
                } else {
                    this.start = start;
                    this.target = target;
                    this.length = start.length;
                }
            };
            MorphShape.prototype = {
                start      :null,
                target     :null,
                length     :-1,
                interpolate:function (ratio) {
                    var pts = [];
                    for (var i = 0; i < this.length; i++) {
                        pts.push({
                            x : this.start[i].x + (this.target[i].x - this.start[i].x)*ratio,
                            y : this.start[i].y + (this.target[i].y - this.start[i].y)*ratio
                        });
                    }
                    return pts;
                }
            };
            return MorphShape;
        })();

        return BaseSketch.extend({

            buffer:null,

            drops:[],

            morphShape : null,

            loaded:false,

            initialize:function () {
                this.heightRatio = 1;

                this.buffer = Utils.CreateBuffer();
                this.el.appendChild(this.buffer.canvas);

                var self = this;
                Utils.LoadSVGPoints('img/circle.svg').then(function (pts) {
                    self.loaded = true;
                    self.drops = pts;

                    self.resize(self.buffer.width,self.buffer.height);
                }).catch(function(e){
                    console.log(e.stack);
                });
            },

            resize:function (w,h) {
                this.buffer.resize(w,h);

                this.mousePos = {
                    x:w >> 1,
                    y:h >> 1
                };

                if (!this.loaded) {
                    return;
                }

                this.morphShape = this.getMorphShape(this.getStartShape(), this.getTargetShape());
            },

            setMousePos:function (pos) {
                this.delta = Math.max(200,this.delta + Math.abs(pos.x - this.mousePos.x));
                this.mousePos = {x:pos.x - 100,y:pos.y - 100};
            },

            draw:function () {

                if (!this.loaded) {
                    return;
                }

                this.buffer.clear();
                this.buffer.ctx.beginPath();

                var ratio = (Math.sin(Date.now() * 0.001) + 1) / 2;
                var shape = this.morphShape.interpolate(ratio);//this.getMorphedShape(this.startShape,this.targetShape,ratio);

                this.buffer.ctx.beginPath();
                this.drawShape(this.buffer,shape,1);
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

            getMorphShape:function (start,target,ratio) {

                //todo define target/start here!
                var startNum = start.length;
                var targetNum = target.length;
                var count = Math.max(startNum,targetNum);
                var maps = [];
                for (var i = 0; i < count; i++) {
                    var sI = i;
                    var tI = Math.floor(i / (startNum / (targetNum - 1)));

                    if (tI === maps.length) {
                        maps.push({
                            t1:target[tI],
                            t2:target[(tI + 1) % targetNum],
                            t :[],
                            s :[]
                        });
                    }
                    maps[tI].s.push(start[sI]);
                }

                //generate interpolated target points
                for (var i = 0; i < maps.length; i++) {
                    var length = maps[i].s.length;
                    for (var j = 0; j < length; j++) {
                        var ratio = j / length;
                        maps[i].t.push(this.interpolateLine(maps[i].t1,maps[i].t2,ratio));
                    }
                }

                //at this point the map s and t arrays should all be the same length
                var s = [];
                var t = [];
                for (var i = 0; i < maps.length; i++) {
                    s = s.concat(maps[i].s);
                    t = t.concat(maps[i].t);
                }

                return new MorphShape(s,t);
            },

            interpolateLine:function (a,b,ratio) {
                return {
                    x:a.x + (b.x - a.x) * ratio,
                    y:a.y + (b.y - a.y) * ratio
                };
            },

            getStartShape:function () {

                var size = Math.min(this.buffer.width,this.buffer.height);
                var offsetX = (this.buffer.width - size) >> 1;
                var offsetY = (this.buffer.height - size) >> 1;
                var pts = [];
                for (var i = 0; i < this.drops.length; i++) {
                    pts.push({
                        x:offsetX + this.drops[i].x * size,
                        y:offsetY + this.drops[i].y * size
                    });
                }
                return pts;
            },

            getTargetShape:function () {
                return [
                    {x:this.buffer.width >> 1,y:0},
                    {x:this.buffer.width,y:0},
                    {x:this.buffer.width,y:this.buffer.height},
                    {x:0,y:this.buffer.height},
                    {x:0,y:0},
                    {x:this.buffer.width >> 1,y:0}
                ];
            }


        })
    });