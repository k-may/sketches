/**
 * Created by kev on 15-10-09.
 */
define(['base_sketch',
        'utils/canvas_utils'],
    function (BaseSketch,
        CanvasUtils) {

        return BaseSketch.extend({

            circle:{
                x     :0,
                y     :0,
                radius:400
            },
            loaded : true,
            buffer:null,

            initialize:function () {

                this.buffer = CanvasUtils.CreateBuffer();
                this.el.appendChild(this.buffer.canvas);

            },

            resize : function(width, height){

                this.buffer.resize(width, height);

                this.circle.x = width >> 1;
                this.circle.y = height >> 1;
                this.circle.radius = Math.min(width - 100, height - 100) /2;
            },

            draw:function () {

                this.buffer.clear();

                this.buffer.ctx.filStyle = "#fff";
                this.buffer.ctx.arc(this.circle.x, this.circle.y, this.circle.radius, 0, Math.PI * 2);
                this.buffer.ctx.fill();

            }


        })

    })