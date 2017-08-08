import {CanvasBuffer} from "../data/CanvasBuffer";
/**
 * Created by kev on 15-07-01.
 */

export class CanvasUtils {

    static canvas:HTMLCanvasElement = document.createElement("canvas");
    static ctx:CanvasRenderingContext2D = CanvasUtils.canvas.getContext("2d");

    static CreateImageData(w, h):ImageData {
        return CanvasUtils.ctx.createImageData(w, h);
    }

    static Convolute(pixels, weights, opaque):ImageData {
        var side = Math.round(Math.sqrt(weights.length));
        var halfSide = Math.floor(side / 2);
        var src = pixels.data;
        var sw = pixels.width;
        var sh = pixels.height;
        // pad output by the convolution matrix
        var w = sw;
        var h = sh;
        var output = CanvasUtils.CreateImageData(w, h);
        var dst = output.data;
        // go through the destination image pixels
        var alphaFac = opaque ? 1 : 0;
        for (var y = halfSide; y < h - halfSide; y++) {
            for (var x = halfSide; x < w - halfSide; x++) {
                var sy = y;
                var sx = x;
                var dstOff = (y * w + x) * 4;
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                var r = 0, g = 0, b = 0, a = 0;
                for (var cy = 0; cy < side; cy++) {
                    for (var cx = 0; cx < side; cx++) {
                        var scy = sy + cy - halfSide;
                        var scx = sx + cx - halfSide;
                        if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                            var srcOff = (scy * sw + scx) * 4;
                            var wt = weights[cy * side + cx];
                            r += src[srcOff] * wt;
                            g += src[srcOff + 1] * wt;
                            b += src[srcOff + 2] * wt;
                            a += src[srcOff + 3] * wt;
                        }
                    }
                }
                dst[dstOff] = r;
                dst[dstOff + 1] = g;
                dst[dstOff + 2] = b;
                dst[dstOff + 3] = a + alphaFac * (255 - a);
            }
        }
        return output;
    }


    public static GenerateTexture(buffer:CanvasBuffer):string {

        var ctx:CanvasRenderingContext2D = buffer.ctx;
        var canvas:HTMLCanvasElement = buffer.canvas;

        var imageData:ImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imageData.data;

        for (var i = 0; i < data.length; i += 4) {

            var randomTone = Math.random() * 55 + 80;
            data[i] = randomTone;
            data[i + 1] = randomTone;
            data[i + 2] = randomTone;
            data[i + 3] = 100;

        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL();

    }
}
