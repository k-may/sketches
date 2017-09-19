/**
 * Created by kev on 15-10-20.
 */

define(['ts/sketches/Chekhov/simple_physics_sketch',
        'ts/utils/canvas_utils',
        'ts/utils/anim_utils',
        'ts/utils/load_utils',
        'ts/utils/geom_utils',
        'ts/utils/color_utils'],

    function (SimplePhysicsSketch,
        CanvasUtils,
        AnimUtils,
        LoadUtils,
        GeomUtils,
        ColorUtils) {

        return SimplePhysicsSketch.extend({

            createCircles:function () {

                var self = this;
                LoadUtils.LoadImage('img/chekhov_face.jpg').then(function (img) {
              //  LoadUtils.LoadImage('img/chekhov_face_2.jpg').then(function (img) {
                    self.renderFace(img);
                }).catch(function (e) {
                    console.log(e.stack);
                });

                /**/
            },

            renderFace:function (img) {

                var scale = Math.min(this.buffer.width / img.naturalWidth, this.buffer.height / img.naturalHeight);
                var width = img.naturalWidth * scale;
                var height = img.naturalHeight * scale;

                var buffer = CanvasUtils.CreateBuffer();
                buffer.resize(img.naturalWidth,img.naturalHeight);
                buffer.ctx.drawImage(img,0,0);

                var imageData = buffer.ctx.getImageData(0,0,img.naturalWidth,img.naturalHeight);

                var attempts = 0;
                while (attempts++ < 10000 && this.circles.length < 1200) {

                    var x = Math.floor(Math.random() * width);
                    var y = Math.floor(Math.random() * height);

                    var radius = Math.floor(Math.random() * 10 + 10);

                    var sX = Math.floor(x/scale);
                    var sY = Math.floor(y/scale);
                    var index = sX * 4 + sY * 4 * img.naturalWidth;
                    var r = imageData.data[index];
                    var g = imageData.data[index + 1];
                    var b = imageData.data[index + 2];
                    var a = imageData.data[index + 3];

                    //no alpha!
                    if(a === 0){
                        break;
                    }

                    var collides = false;
                    for (var i = 0,l = this.circles.length; i < l; i++) {
                        var other = this.circles[i];
                        var dX = other.anchor.position.x - x;
                        var dY = other.anchor.position.y - y;
                        var length = Math.sqrt(dX * dX + dY * dY);
                        if (length < other.radius + radius) {
                            collides = true;
                            break;
                        }
                    }

                    if (!collides) {
                        var color = new ColorUtils.Color(r,g,b);
                        var body = new GeomUtils.Circle(x,y,radius,color);
                        /*if(y > 700) {
                            console.log(x,y, sX, sY, r, g, b);
                        }*/
                        this.circles.push(body);
                    }
                }

            },

            getTargetScale : function(){
              return 60;
            },

            drawCircle:function (ctx,circle) {

                if (this.current) {
                    circle.currentScale += (circle.scale - circle.currentScale) * 0.1;
                } else {
                    circle.currentScale += (1 - circle.currentScale) * 0.1;
                }

                ctx.beginPath();
                ctx.fillStyle = circle.color.toRGBString();
                ctx.arc(circle.position.position.x,circle.position.position.y,Math.max(10,circle.radius * circle.currentScale),0,Math.PI * 2);
                ctx.fill();
            }

        })


    })
