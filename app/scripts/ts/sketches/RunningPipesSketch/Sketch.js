/**
 * Created by kev on 15-10-23.
 */

define([""], function () {

  var Buffer = (function(){

    function Buffer(){
      this.canvas = document.createElement("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.width = 0;
      this.height = 0;
    }
    Buffer.prototype = {

      clear : function(){
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
      },
      resize : function(w, h){
        if(this.canvas.width !== w || this.canvas.height !== h){
          this.canvas.width = this.width = w;
          this.canvas.height = this.height = h;
        }
      }

    };
    return Buffer;
  })();

  var TWO_PI = Math.PI * 2;
  var Crawler = (function () {
    function Crawler() {
      this.num = 5;
      this.res = 10;
      this.nodes = [];
      for (var i = 0; i < this.num; i++) {
        var node = {
          sX: 0,
          sY: 0,
          dX: 0,
          dY: 0
        }
        this.nodes.push(node);
      }
      this.location = new Location();
      this.reset({x: 1, y: 1}, -1);
    };
    Crawler.prototype = {
      checkCollisions: function (width, height) {
        var collision = this.location.checkCollisions(width, height);
        var complete = this.location.checkDistance();
        return (collision || complete);
      },
      draw: function (ctx) {

        var deltas = this.location.getDeltas();

        if (deltas.x > 1 || deltas.y > 1) {
          console.log("wtf!");
        }

        for (var i = 0; i < this.nodes.length; i++) {
          ctx.beginPath();
          var node = this.nodes[i];
          //interpolate node positions
          var x = this.location.pos.x + (node.sX + (node.dX - node.sX) * deltas.x) * this.res;
          var y = this.location.pos.y + (node.sY + (node.dY - node.sY) * deltas.y) * this.res;

          ctx.arc(x, y, 2, 0, TWO_PI);
          ctx.stroke();
        }
      },
      update: function () {
        this.location.updatePos();
      },
      reset: function (speed, distance) {

        this.location.reset(speed, distance);

        var avail = [-2, -1, 0, 1, 2];
        for (var i = 0; i < this.num; i++) {
          var next = avail.splice(Math.floor(Math.random() * avail.length), 1)[0];
          var node = this.nodes[i];

          node.sX = node.dX;
          node.sY = node.dY;
          node.dX = speed.x ? next : node.dX;
          node.dY = speed.y ? next : node.dY;
        }
      }
    };
    return Crawler;
  })();

  var Location = (function () {
    function Location() {
      this.pos = {
        x: Math.floor(Math.random() * window.innerWidth),
        y: Math.floor(Math.random() * window.innerHeight)
      };
      this.startPos = {x: this.pos.x, y: this.pos.y};
      this.speed = {x: 0, y: 0};
      this.distTravelled = -1;
      this.ratio = 0;
      this.distTotal = -1;
    };
    Location.prototype = {
      updatePos: function () {
        this.pos.x += this.speed.x;
        this.pos.y += this.speed.y;
      },
      checkCollisions: function (width, height) {
        var collision = (this.pos.x > width || this.pos.x < 0 || this.pos.y < 0 || this.pos.y > height );

        if (collision) {
          console.log("collision");
        }

        return collision;
      },
      checkDistance: function () {
        return (this.distTravelled -= Math.abs(this.speed.x + this.speed.y)) < 0;
      },
      reset: function (speed, distance) {
        this.speed = speed;
        this.distTravelled = this.distTotal = distance;
        this.startPos = {x: this.pos.x, y: this.pos.y};
      },
      getDeltas: function () {
        return {
          x: Math.abs((this.startPos.x - this.pos.x) / (this.distTotal / this.speed.x)),
          y: Math.abs((this.startPos.y - this.pos.y) / (this.distTotal / this.speed.y))
        };
      }
    };

    return Location;
  })();

  var Sketch = (function () {

    function Sketch() {
      this.el = document.createElement("div");
      this.el.setAttribute('class', 'sketch_cont');
      this.$el = $(this.el);

      this.buffer = new Buffer();
      this.canvas = this.buffer.canvas;
      this.el.appendChild(this.canvas);
      this.crawler = new Crawler();
    }

    Sketch.prototype = {

      draw: function () {
        //this.buffer.clear();

        var collision = this.crawler.checkCollisions(this.buffer.width, this.buffer.height);
        if (collision) {
          //resolve
          this.resetTarget(this.crawler, collision)
        }

        this.crawler.draw(this.buffer.ctx);
        this.crawler.update();
      },

      resize: function (w, h) {
        this.buffer.resize(w, h);
        this.resetTarget(this.crawler);
      },

      resetTarget: function (crawler, collision) {

        var location = crawler.location;
        var avail = ["left", "up", "right", "down"];
        var direction = "";
        var distance = 0;
        var attemps = 0;
        while (distance < 10 && attemps++ < 10) {
          direction = this.resetDirection(location, collision, ["left", "up", "right", "down"]);
          distance = this.resetDistance(location, direction);
        }

        var speed = {};
        switch (direction) {
          case "left":
            speed = {x: -1, y: 0};
            break;
          case "right":
            speed = {x: 1, y: 0};
            break;
          case "up":
            speed = {x: 0, y: -1};
            break;
          case "down":
            speed = {x: 0, y: 1};
            break;
        }
        crawler.reset(speed, distance);
      },

      resetDistance: function (location, direction) {
        var min = 10;
        var distance = 0;
        if (direction === "left") {
          distance = Math.random() * (location.pos.x - min);
        } else if (direction === "right")
          distance = Math.random() * (this.buffer.width - location.pos.x - min);
        else if (direction === "up")
          distance = Math.random() * (location.pos.y - min);
        else if (direction === "down")
          distance = Math.random() * (this.buffer.height - location.pos.y - min);

        if (direction === "down" && location.pos.y + distance >= this.buffer.height) {
          //console.log("wtf");
        }
        return distance;
      },

      resetDirection: function (location, collision, avail) {
        var previous;

        if (location.speed.x === -1) {
          previous = "left";
        } else if (location.speed.x === 1) {
          previous = "right";
        } else if (location.speed.y === -1) {
          previous = "up";
        } else {
          previous = "down";
        }
        var direction = "";

        //check collisions
        if (location.pos.x <= 0)
          direction = "right";
        else if (location.pos.x >= this.buffer.width)
          direction = "left";
        else if (location.pos.y >= this.buffer.height)
          direction = "up";
        else if (location.pos.y <= 0)
          direction = "down";

        if (!direction) {
          if (previous === "up" || previous === "down") {
            avail.splice(avail.indexOf("down"), 1);
            avail.splice(avail.indexOf("up"), 1);
          } else if (previous === "left" || previous === "right") {
            avail.splice(avail.indexOf("left"), 1);
            avail.splice(avail.indexOf("right"), 1);
          }
          direction = avail[Math.floor(Math.random() * avail.length)];

          avail.splice(avail.indexOf(direction), 1);
        }
        return direction;
      }


    };

    return Sketch;
  })();

  return Sketch;

});
