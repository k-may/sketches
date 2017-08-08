import Vector2 = THREE.Vector2;
import {BaseSketch} from "../../common/BaseSketch";
import {CanvasBuffer2D} from "../../common/CanvasBuffer2D";

/**
 * Created by kev on 15-10-26.
 */

export class Sketch extends BaseSketch {

    headPos:THREE.Vector2;
    speed:THREE.Vector2;
    acceleration:THREE.Vector2;

    buffer : CanvasBuffer2D;

    body:THREE.Vector2[];
    triangles:any[];

    vertices:THREE.Vector3[];

    constructor() {

        super();

        this.buffer = new CanvasBuffer2D();
        this.buffer.resize(window.innerWidth, window.innerHeight);

        this.headPos = new THREE.Vector2(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
        this.body = [];
        this.body.push(this.headPos);

        this.vertices = [];
        var vertCount = 0;
        this.speed = new THREE.Vector2();
        var clone = this.headPos.clone();
        for (var i = 0; i < 50; i++) {
            this.body.push(this.headPos.clone());
            this.vertices.push(new THREE.Vector3());
            this.vertices.push(new THREE.Vector3());
        }

        this.acceleration = new THREE.Vector2();
        this.triangles = [];
    }

    checkCollisions():THREE.Vector2 {

        var desired:THREE.Vector2 = new THREE.Vector2();
        if (this.headPos.x <= 25) {
            desired.x = 20;
        } else if (this.headPos.x >= this.buffer.width - 25) {
            desired.x = -20;
        }

        if (this.headPos.y <= 0) {
            desired.y = 20;
        } else if (this.headPos.y >= this.buffer.height - 25) {
            desired.y = -20;
        }
        return desired;
    }

    draw(time:number) {
        this.update(time);
        this.drawVerts();
        return super.draw(time);
    }

    public update(time:number){
        this.updateHead(time);
        this.updateBody();
        this.updateVerts();
    }

    public updateHead(time:number){
        var desiredVelocity = this.checkCollisions().normalize();
        var noise = new THREE.Vector2(Math.sin(time * 0.0001), Math.cos(time * 0.0001)).multiplyScalar(0.001);
        this.acceleration = noise.add(desiredVelocity).multiplyScalar(5);
        //limit force
        this.limit(this.acceleration, 0.1);

        this.speed.add(this.acceleration);
        //limit speed
        this.limit(this.speed, 14);

        this.headPos.add(this.speed);
    }

    public updateBody():void{
        var previous = this.headPos;
        for (var i = 1; i < this.body.length; i++) {
            var node = this.body[i];

            var next = node.clone().lerp(previous, 0.1);
            var distance = next.clone().sub(node).length();

            if(distance > 20){
              this.body[i] = next.add(next.clone().normalize().multiplyScalar(20));
            }else
              this.body[i] = next;

            previous = this.body[i];
        }
    }

    public updateVerts():void {

        var width = 40;
        var perp;
        var a1, v;
        var vertCount = 0;

        for (var i = 0; i < this.body.length - 1; i++) {
            var node = this.body[i];
            var next = this.body[i + 1];

            perp = new THREE.Vector2(node.y - next.y, -(node.x - next.x));
            perp.normalize();

            //update verts
            a1 = new THREE.Vector2(node.x + perp.x * width, node.y + perp.y * width);
            v  = this.vertices[vertCount++];
            v.x = (a1.x / this.buffer.width) * 2 - 1;
            v.y = ( 1 - a1.y / this.buffer.height) * 2 -1;

            a1 =  new THREE.Vector2(node.x + perp.x * -width, node.y + perp.y * -width);
            v  = this.vertices[vertCount++];
            v.x = (a1.x / this.buffer.width) * 2 - 1;
            v.y = (1 - a1.y / this.buffer.height) * 2 - 1;
        }
    }

    drawVerts() {

        this.buffer.clear();
        this.buffer.ctx.strokeStyle = "#ff0000";
        this.buffer.ctx.beginPath();

        var width = 40;
        var a1, a2, b1, b2, triangle;
        var vertCount = 0;

        while(vertCount < this.vertices.length){

            a1 = b1 || this.vertices[vertCount++];
            a2 = b2 || this.vertices[vertCount++];
            b1 = this.vertices[vertCount++];
            b2 = this.vertices[vertCount++];

            triangle = [a1, a2, b2];
            this.drawTriangle(this.buffer.ctx, triangle);

            triangle = [a1, b2, b1];
            this.drawTriangle(this.buffer.ctx, triangle);

        }
        this.buffer.ctx.stroke();
    }


    drawTriangle(ctx:CanvasRenderingContext2D, triangle:any[]) {
        var first = true;
        var v;
        for (var j = 0; j < 3; j++) {
            v = triangle[j];
            if (first) {
                first = false;
                ctx.moveTo((v.x + 1) * 0.5 * this.buffer.width, (-v.y + 1) * 0.5 * this.buffer.height);
            } else {
                ctx.lineTo((v.x + 1) * 0.5 * this.buffer.width, (-v.y + 1) * 0.5 * this.buffer.height);
            }
        }
        v = triangle[0];
        ctx.lineTo((v.x + 1) * 0.5 * this.buffer.width, (-v.y + 1) * 0.5 * this.buffer.height);
    }

    limit(vector:THREE.Vector2, max:number) {
        if (vector.length() > max) {
            vector.normalize().multiplyScalar(max);
        }
    }
}
