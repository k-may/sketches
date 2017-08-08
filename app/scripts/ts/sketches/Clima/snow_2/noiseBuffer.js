/**
 * Created by kev on 15-08-14.
 */

define(['base_sketch','noise'],function (BaseSketch,noise) {

    return BaseSketch.extend({

        noiseInc:0,
        angle   :15,
        noiseData       :[[]],

        initialize:function (options) {

            this.noiseBuffer = this.createBuffer();
            this.noiseBuffer.resize(options.w,options.h);
            //fill white
            this.noiseBuffer.ctx.fillStyle = "#fff";
            this.noiseBuffer.ctx.fillRect(0,0,this.noiseBuffer.width,this.noiseBuffer.height);

            this.renderNoise();
        },

        renderNoise:function () {

            var nW = this.noiseBuffer.width;
            var nH = this.noiseBuffer.height;
            var ctx = this.noiseBuffer.ctx;

            var imgData = ctx.getImageData(0,0,nW,nH);//.data;
            var pixelData = imgData.data;
            this.noiseInc += 0.1;
            var index = 0;
            for (var i = 0; i < nW; i++) {
                this.noiseData[i] = [];
                for (var j = 0; j < nH; j++) {
                    index = (i + j * nW) * 4 + 3;

                    var value = noise.simplex2((i + this.noiseInc) / 200,(j + this.noiseInc) / 200);
                    this.noiseData[i][j] = value;

                    var pixelValue = Math.floor((1 + value) * 125);
                    pixelData[index] = pixelValue;
                }
            }
            ctx.putImageData(imgData,0,0);


        },


        getNoiseByRatio:function (x,y) {
            x = Math.min(1,Math.max(x,0));
            y = Math.min(1,Math.max(y,0));
            var nX = Math.floor(x * (this.noiseBuffer.width-1));
            var nY = Math.floor(y * (this.noiseBuffer.height-1));
            return this.noiseData[nX][nY];
        }


    })


})