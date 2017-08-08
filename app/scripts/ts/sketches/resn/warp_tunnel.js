/**
 * Created by kev on 16-02-17.
 */
define(['util/utils',
        'base_sketch'],

    function (Utils,
        BaseSketch) {

        return BaseSketch.extend({


            buffer     :null,
            shapeBuffer:null,
            planes     :null,
            frame      :0,


            initialize:function () {

this.heightRatio = 1;
                this.planes = [];
                for (var i = 0; i < 2; i++) {
                    var buffer = Utils.CreateBuffer();
                    this.planes.push({
                        buffer:buffer,
                        pos   :{
                            x:0,
                            y:0,
                            z:(i / 2)
                        },
                        color :Utils.Color.Random()
                    });
                }


                this.buffer = Utils.CreateBuffer();
                this.el.appendChild(this.buffer.canvas);

            },

            resize:function (w,h) {
                this.buffer.resize(w,h);


                for (var i = 0; i < this.planes.length; i++) {
                    this.planes[i].buffer.resize(w,h);
                }
            },

            draw:function () {

                this.buffer.clear();

                //if(this.frame++ % 100 === 0){

                for (var i = 0; i < this.planes.length; i ++){
                    this.drawPlane(this.planes[i]);
                }

                //}


            },

            drawPlane:function (plane) {

                var buffer = plane.buffer;

                var midPt = {
                    x:buffer.width >> 1,
                    y:buffer.height >> 1
                };

                //fill entire rect
                buffer.clear();

                buffer.ctx.save();

                var z = plane.pos.z;
                

                buffer.ctx.translate(midPt.x,midPt.y);
                buffer.ctx.scale(z,z);
                buffer.ctx.translate(-midPt.x,-midPt.y);
                buffer.ctx.fillRect(0,0,buffer.width,buffer.height);
                 buffer.ctx.restore();
                 
                buffer.ctx.globalCompositeOperation = "source-out";

                buffer.fill(plane.color.toRGBString());

                this.buffer.ctx.drawImage(buffer.canvas,0,0);
               
            }


        })
    });