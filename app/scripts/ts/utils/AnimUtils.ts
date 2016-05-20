/**
 * Created by kev on 2016-05-19.
 */
///<reference path="../../../../typings/globals/modernizr/index.d.ts"/>
    
var $M = window.hasOwnProperty("$M") ? window["$M"] : {};

class AnimUtils {

    static TRANSFORM_PREFIX:any = Modernizr.prefixed('transform');
    static TRANSFORM_3D:any = Modernizr.csstransforms3d;

    static SetPosition(el:HTMLElement, pos:any) {

        if (!el) {
            return;
        }

        var cssTransformMatrix;

        if (AnimUtils.TRANSFORM_3D) {
            pos.z = pos.z || 0;
            var translationM = this.GetTranslationMatrix(pos.x, pos.y, pos.z);
            cssTransformMatrix = this.GetStringTransform3d(translationM);
        } else {
            cssTransformMatrix = this.GetStringTranslate2d(pos.x, pos.y);
        }

        el.style[AnimUtils.TRANSFORM_PREFIX] = cssTransformMatrix;

    }

    static SetTransformMatrix(el, listMatrix:any) {
        var cssTransformMatrix;

        if (!Array.isArray(listMatrix)) {
            listMatrix = [listMatrix];
        }

        if (AnimUtils.TRANSFORM_3D) {
            var translationM = this.GetResultMatrix(listMatrix);
            cssTransformMatrix = this.GetStringTransform3d(translationM);
        } else {
            //doto make this work...
            //cssTransformMatrix = this.GetStringTranslate2d(pos.x, pos.y);
        }

        el.style[AnimUtils.TRANSFORM_PREFIX] = cssTransformMatrix;
    }

    static SetMatrix(el:HTMLElement, rx, ry, rz, s, tx, ty, tz) {
        var matrix = this.GetMatrix(rx, ry, rz, s, tx, ty, tz);
        el.style[this.TRANSFORM_PREFIX] = matrix;
    }

    static GetScaleMatrix(scaleX, scaleY?, scaleZ?):void {
        var _scaleX = scaleX;
        var _scaleY = scaleY !== undefined ? scaleY : _scaleX;
        var _scaleZ = scaleZ !== undefined ? scaleZ : _scaleX;
        if (AnimUtils.TRANSFORM_3D) {
            return $M([[_scaleX, 0, 0, 0], [0, _scaleY, 0, 0], [0, 0, _scaleZ, 0], [0, 0, 0, 1]]);
        } else {
            //todo does this work?
            return $M([[_scaleX, 0, 0], [0, _scaleY, 0], [0, 0, 1]]);
        }
    }

    static GetRotationMatrix(rX, rY, rZ) {
        var deg2rad = Math.PI / 180; // Degrees to radians constant

        var rotationXMatrix, rotationYMatrix, rotationZMatrix;
        rotationXMatrix = $M([
            [1, 0, 0, 0],
            [0, Math.cos(rX * deg2rad), Math.sin(-rX * deg2rad), 0],
            [0, Math.sin(rX * deg2rad), Math.cos(rX * deg2rad), 0],
            [0, 0, 0, 1]]);

        rotationYMatrix = $M([
            [Math.cos(rY * deg2rad), 0, Math.sin(rY * deg2rad), 0],
            [0, 1, 0, 0],
            [Math.sin(-rY * deg2rad), 0, Math.cos(rY * deg2rad), 0],
            [0, 0, 0, 1]]);

        rotationZMatrix = $M([
            [Math.cos(rZ * deg2rad), Math.sin(-rZ * deg2rad), 0, 0],
            [Math.sin(rZ * deg2rad), Math.cos(rZ * deg2rad), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]]);

        return rotationXMatrix.x(rotationYMatrix).x(rotationZMatrix);
    }

    static GetStringResultMatrix(listMatrix) {
        var mat = this.GetResultMatrix(listMatrix);
        return this.GetStringTransform3d(mat);
    }

    static GetResultMatrix(listMatix) {
        if (listMatix.length === 1) {
            return listMatix[0];
        } else {
            var resultMatrix = $M([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]);
            for (var i = 0; i < listMatix.length; i++) {
                var nextMatrix = listMatix[i];
                resultMatrix = nextMatrix.x(resultMatrix);
            }
            return resultMatrix;
        }
    }


    static GetTranslationMatrix(translationX, translationY, translationZ?) {
        var _translationX = translationX !== undefined ? translationX : 0;
        var _translationY = translationY !== undefined ? translationY : 0;
        var _translationZ = translationZ !== undefined ? translationZ : 0;
        return $M([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [_translationX, _translationY, _translationZ, 1]
        ]);
    }

    static GetMatrix(rX, rY, rZ, scale, tX, tY, tZ) {

        var rotationMatrix, scaleMatrix, transformationMatrix, translationMatrix;

        scaleMatrix = AnimUtils.GetScaleMatrix(scale);
        rotationMatrix = AnimUtils.GetRotationMatrix(rX, rY, rZ);

        transformationMatrix = rotationMatrix.x(scaleMatrix);
        transformationMatrix = transformationMatrix.transpose();
        translationMatrix = $M([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [tX, tY, tZ, 1]]);
        transformationMatrix = transformationMatrix.x(translationMatrix); // Apply transformation matrix AFTER transposing rotation and scale

        return AnimUtils.GetStringTransform3d(transformationMatrix);

        /*var s = "matrix3d(";
         s += transformationMatrix.e(1, 1).toFixed(5) + "," + transformationMatrix.e(1, 2).toFixed(5) + "," + transformationMatrix.e(1, 3).toFixed(5) + "," + transformationMatrix.e(1, 4).toFixed(5) + ",";
         s += transformationMatrix.e(2, 1).toFixed(5) + "," + transformationMatrix.e(2, 2).toFixed(5) + "," + transformationMatrix.e(2, 3).toFixed(5) + "," + transformationMatrix.e(2, 4).toFixed(5) + ",";
         s += transformationMatrix.e(3, 1).toFixed(5) + "," + transformationMatrix.e(3, 2).toFixed(5) + "," + transformationMatrix.e(3, 3).toFixed(5) + "," + transformationMatrix.e(3, 4).toFixed(5) + ",";
         s += transformationMatrix.e(4, 1).toFixed(5) + "," + transformationMatrix.e(4, 2).toFixed(5) + "," + transformationMatrix.e(4, 3).toFixed(5) + "," + transformationMatrix.e(4, 4).toFixed(5);
         s += ")";

         return s;*/
    }


    static GetStringTransform3d(transformationMatrix) {
        var stringTransform = "matrix3d(";
        stringTransform += transformationMatrix.e(1, 1).toFixed(5) + "," + transformationMatrix.e(1, 2).toFixed(5) + "," + transformationMatrix.e(1, 3) + "," + transformationMatrix.e(1, 4).toFixed(5) + ",";
        stringTransform += transformationMatrix.e(2, 1).toFixed(5) + "," + transformationMatrix.e(2, 2).toFixed(5) + "," + transformationMatrix.e(2, 3) + "," + transformationMatrix.e(2, 4).toFixed(5) + ",";
        stringTransform += transformationMatrix.e(3, 1).toFixed(5) + "," + transformationMatrix.e(3, 2).toFixed(5) + "," + transformationMatrix.e(3, 3) + "," + transformationMatrix.e(3, 4).toFixed(5) + ",";
        stringTransform += transformationMatrix.e(4, 1).toFixed(5) + "," + transformationMatrix.e(4, 2).toFixed(5) + "," + transformationMatrix.e(4, 3) + "," + transformationMatrix.e(4, 4).toFixed(5);
        stringTransform += ")";
        return stringTransform;
    }

    static GetStringTranslate2d(x, y) {
        var stringTransform = "translate(";
        stringTransform += x + 'px,';
        stringTransform += y + 'px)';
        return stringTransform;
    }

}
export = AnimUtils