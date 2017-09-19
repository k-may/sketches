/**
 * Created by kev on 15-10-09.
 */
define([], function () {

    var Constraint = (function () {
      function Constraint(position, anchor) {
        this.position = position;
        this.anchor = anchor;
        this.force = 0.09;
      }

      Constraint.prototype = {
        //apply gravity
        resolve: function () {
          var pos1 = this.position.position;
          var pos2 = this.anchor.position;
          pos1.x += (pos2.x - pos1.x) * this.force;
          pos1.y += (pos2.y - pos1.y) * this.force;
        }
      };
      return Constraint;
    })();

    var Circle = (function () {
      function Circle(x, y, radius) {
        this.scale = 1;
        this.currentScale = 1;
        this.position = new Point(x, y);
        this.anchor = new Point(x, y);
        this.radius = radius;
        this.constraint = new Constraint(this.position, this.anchor, this.radius)
      }

      Circle.prototype.intersecting = function (circle) {
        return Math.sqrt(Math.pow(this.x - circle.x, 2) + Math.Pow(this.y - circle.y)) <
          this.radius + circle.radius;
      };
      return Circle;
    })();


    var Point = (function () {
      function Point(x, y) {
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
        this.previous = new Vector(x, y);
      };
      Point.prototype.accelerate = function (vector) {
        this.acceleration.iadd(vector);
      };
      Point.prototype.correct = function (vector) {
        this.position.iadd(vector);
      };
      Point.prototype.simulate = function (delta) {
        this.acceleration.imul(delta * delta);

        var position = this.position
          .mul(2)
          .sub(this.previous)
          .add(this.acceleration);

        this.previous = this.position;
        this.position = position;
        this.acceleration.zero();
      };
      return Point
    })();


    var Vector = (function () {
      function Vector(x, y) {
        this.x = x;
        this.y = y;
      }

      Vector.prototype = {
        isub: function (other) {
          this.x -= other.x;
          this.y -= other.y;
          return this;
        },
        sub: function (other) {
          return new Vector(
            this.x - other.x,
            this.y - other.y
          );
        },
        iadd: function (other) {
          this.x += other.x;
          this.y += other.y;
          return this;
        },
        add: function (other) {
          return new Vector(
            this.x + other.x,
            this.y + other.y
          );
        },

        imul: function (scalar) {
          this.x *= scalar;
          this.y *= scalar;
          return this;
        },
        mul: function (scalar) {
          return new Vector(
            this.x * scalar,
            this.y * scalar
          )
        },
        idiv: function (scalar) {
          this.x /= scalar;
          this.y /= scalar;
          return this;
        },
        div: function (scalar) {
          return new Vector(
            this.x / scalar,
            this.y / scalar
          )
        },

        normalized: function () {
          var x = this.x, y = this.y;
          var length = Math.sqrt(x * x + y * y);
          if (length > 0) {
            return new Vector(x / length, y / length);
          }
          else {
            return new Vector(0, 0);
          }
        },
        normalize: function () {
          var x = this.x, y = this.y;
          var length = Math.sqrt(x * x + y * y);
          if (length > 0) {
            this.x = x / length;
            this.y = y / length;
          }
          return this;
        },

        length: function () {
          return Math.sqrt(this.x * this.x + this.y * this.y);
        },

        distance: function (other) {
          var x = this.x - other.x;
          var y = this.y - other.y;
          return Math.sqrt(x * x + y * y);
        },

        copy: function () {
          return new Vector(this.x, this.y);
        },
        zero: function () {
          this.x = 0;
          this.y = 0;
        }
      };
      return Vector;
    })();

    return {
      Constraint: Constraint,
      Point: Point,
      Vector: Vector,
      Circle: Circle,
      Distance: function (x1, x2, y1, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
      }

    };

  }
)
;
