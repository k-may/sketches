/**
 * Created by kev on 16-03-22.
 */
define(['svgmorph',
        'util/utils',
        'base_sketch'],

    function (MORPH,
        Utils,
        BaseSketch) {

        return BaseSketch.extend({

            index     :0,
            paths     :[
                'img/drop.svg',
                'img/circle.svg'
            ],
            morphPaths:null,
            morph : null,
            loaded    :false,

            buffer:null,

            initialize:function () {

                this.buffer = Utils.CreateBuffer();
                this.el.appendChild(this.buffer.canvas);


                var self = this;
                MORPH.LoadPaths(this.paths).then(function (paths) {
                    console.log(paths);
                    self.morphPaths = paths;
                    self.loaded = true;

                    self.morph = new MORPH.Morph(paths).start();
                });

            },

            resize : function(){

                this.buffer.resize(window.innerWidth, window.innerHeight);

            },

            draw:function () {

                if (!this.loaded) {
                    return;
                }

                this.buffer.clear();
                this.drawMorph(this.buffer);

                MORPH.update();
            },

            drawMorph:function (b) {

                var start = true;
                var shapes = this.morph.getShape();
                var segmentCollection = shapes.segmentCollection;

                b.ctx.strokeStyle = "#ff0000";
                b.ctx.lineWidth = 3;
                b.ctx.lineCap = "round";

                b.ctx.beginPath();

                for (var i = 0; i < segmentCollection.length; i++) {
                    var segment = segmentCollection[i];

                    if (start) {
                        start = false;
                        b.ctx.moveTo(segment.pt1.x, segment.pt1.y);
                    }

                    b.ctx.bezierCurveTo(segment.ctrl1.x, segment.ctrl1.y,
                        segment.ctrl2.x, segment.ctrl2.y,
                        segment.pt2.x, segment.pt2.y);
                }

                b.ctx.stroke();

            }


        })


    });