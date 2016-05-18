define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Created by kev on 16-02-16.
     */
    var Col = (function () {
        function Col(size) {
            this.complete = false;
            this.ratio = 0;
            this.side = "left";
            this.size = 10;
            this.size = size;
            this.speed = 0.1; //0.5 + Math.random() * 0.2;
            this.init();
        }
        Col.prototype.init = function () {
            this.dest = {
                x: 0,
                y: 0
            };
            this.start = {
                x: 0,
                y: 0
            };
            var l = {
                x: 0, y: 0
            };
            var r = {
                x: this.size,
                y: 0
            };
            this.pts = [];
            this.pts.push({
                x: l.x,
                y: l.y
            });
            this.pts.push({
                x: r.x,
                y: r.y
            });
            this.pts.push({
                x: r.x,
                y: r.y
            });
            this.pts.push({
                x: l.x,
                y: l.y
            });
            this.complete = false;
            this.reset();
        };
        Col.prototype.update = function () {
            this.ratio += this.speed;
            if (this.ratio >= 1) {
                this.ratio = 0;
                this.reset();
            }
            else {
                this.start.x += (this.dest.x - this.start.x) * this.ratio;
                this.start.y += (this.dest.y - this.start.y) * this.ratio;
            }
        };
        Col.prototype.reset = function () {
            var type = this.getType();
            //reduce pts to three (triangle)
            this.pts = this.getLastThree();
            //get unique corner (left or right)
            var next = this.getCornerPoint();
            //get dest
            var dest = { x: 0, y: 0 };
            if (type === "A") {
                var distance = Math.random() < 0.5 ? this.size : this.size * 2;
                dest.x = next.x;
                dest.y = next.y + distance;
            }
            else {
                dest.x = next.x;
                dest.y = next.y + this.size;
            }
            this.pts.push(dest);
            //sort winding
            this.pts = this.sortWinding();
            this.dest.x = dest.x;
            this.dest.y = dest.y;
            //point start to dest and reset
            this.start = dest;
            this.start.x = next.x;
            this.start.y = next.y;
            //all done (hopefully)
        };
        Col.prototype.sortWinding = function () {
            var center = this.getCenter();
            var pts = this.pts.sort(function (a, b) {
                var a1 = Math.atan2(a.y - center.y, a.x - center.x);
                var a2 = Math.atan2(b.y - center.y, b.x - center.x);
                return a1 - a2;
            });
            return pts;
        };
        Col.prototype.getCenter = function () {
            var x = 0;
            var y = 0;
            for (var i = 0; i < this.pts.length; i++) {
                x += this.pts[i].x;
                y += this.pts[i].y;
            }
            return {
                x: x / this.pts.length,
                y: y / this.pts.length
            };
        };
        /**
         * Determine unique point on left or right
         */
        Col.prototype.getCornerPoint = function () {
            //filter side
            var pts = this.pts.concat();
            for (var i = 0; i < this.pts.length; i++) {
                var j = pts.length;
                while (j--) {
                    if (i !== j) {
                        if (this.pts[i].x === pts[j].x) {
                            //remove both
                            pts.splice(j, 1);
                            if (pts.length === 1) {
                                return pts[0];
                            }
                        }
                    }
                }
            }
        };
        Col.prototype.getLastThree = function () {
            var pts = this.pts.sort(function (a, b) {
                return a.y - b.y;
            });
            var temp = pts.concat();
            var i = pts.length;
            while (i-- && temp.length > 3) {
                var t = temp[i];
                var duplicated = false;
                for (var j = 0; j < temp.length; j++) {
                    if (j !== i) {
                        duplicated = duplicated || (t.x === temp[j].x && t.y === temp[j].y);
                    }
                }
                if (duplicated) {
                    temp.splice(i, 1);
                }
            }
            while (temp.length > 3) {
                temp.shift();
            }
            return temp;
        };
        Col.prototype.getType = function () {
            var pts = this.pts.sort(function (a, b) {
                return a.y - b.y;
            });
            var i = pts.length - 1;
            var max = pts[i--].y;
            if (pts[i].y < max) {
                return "A";
            }
            return "B";
        };
        Col.prototype.draw = function (buffer) {
            var complete = 0;
            for (var i = 0; i < this.pts.length; i++) {
                complete = this.pts[i].y > buffer.height ? complete + 1 : complete;
                if (i === 0) {
                    buffer.ctx.moveTo(this.pts[i].x, this.pts[i].y);
                }
                else {
                    buffer.ctx.lineTo(this.pts[i].x, this.pts[i].y);
                }
            }
            if (complete === this.pts.length) {
                this.complete = true;
            }
        };
        return Col;
    }());
    return Col;
});
//# sourceMappingURL=Col.js.map