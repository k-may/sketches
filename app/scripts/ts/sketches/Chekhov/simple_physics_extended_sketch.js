/**
 * Created by kev on 15-10-20.
 */
define(["sketches/simple_physics_sketch",
        "utils/animation_utils"],

    function (SimplePhysicsSketch,
        AnimUtils) {

        return SimplePhysicsSketch.extend({

            updateMouse:function () {

                var targetRadius = 180;
                var current = null;
                var circle,distance,targetScale,scale,pos,posScale;
                for (var i = 0; i < this.circles.length; i++) {

                    circle = this.circles[i];
                    pos = circle.position.position;
                    distance = AnimUtils.Distance(pos.x,this.mousePos.x,pos.y,this.mousePos.y);
                    targetScale = targetRadius / (circle.radius);

                    if (distance < 600) {

                        if (distance < circle.radius * circle.currentScale) {
                            //more static selection
                            circle.scale = targetScale;
                            current = circle;
                        } else {
                            scale = Math.min(1,distance / 600);
                            pos = scale;
                            scale = Math.cos(scale * Math.PI) * 0.5 + 0.5;
                            scale = AnimUtils.EaseInExpo(scale);
                            scale -= 0.15 * (0.5 - Math.cos(pos * Math.PI * 2) * 0.5);
                            circle.scale = 1 + (targetScale - 1) * (scale);
                        }

                    } else {
                        circle.scale = 1;
                    }
                }

                this.current = current;
            },


            drawCircle:function (ctx,circle) {

                //if (this.current) {
                    circle.currentScale += (circle.scale - circle.currentScale) * 0.1;
                /*} else {
                    circle.currentScale += (1 - circle.currentScale) * 0.1;
                }*/

                ctx.beginPath();
                ctx.fillStyle = circle.color.toRGBString();
                ctx.arc(circle.position.position.x,circle.position.position.y,Math.max(10,circle.radius * circle.currentScale - 20),0,Math.PI * 2);
                ctx.fill();
            }

        })

    }
);