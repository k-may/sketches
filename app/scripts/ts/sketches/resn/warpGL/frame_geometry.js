/**
 * Created by kev on 16-03-03.
 */

define(['underscore',
        'three'],

    function (_,
        THREE) {

        var FrameGeometry = function () {
            THREE.Geometry.call(this);
            this.init();
        };
        FrameGeometry.prototype = Object.create(THREE.Geometry.prototype);
        FrameGeometry.prototype.constructor = THREE.Geometry;
        _.extend(FrameGeometry.prototype,{

            outer:null,
            inner:null,

            init  :function () {

                this.vertices = [];

                this.vertices.push(new THREE.Vector3(0.0,0.0,0.0));
                this.vertices.push(new THREE.Vector3(0.0,window.innerHeight,0.0));
                this.vertices.push(new THREE.Vector3(window.innerWidth * 0.2,window.innerHeight,0.0));
                this.vertices.push(new THREE.Vector3(window.innerWidth * 0.2,0.0,0.0));

                this.vertices.push(new THREE.Vector3(window.innerWidth * 0.2,0.0,0.0));
                this.vertices.push(new THREE.Vector3(window.innerWidth * 0.2,window.innerHeight * 0.2,0.0));
                this.vertices.push(new THREE.Vector3(window.innerWidth * 0.2 + window.innerWidth * 0.6,window.innerHeight * 0.2,0.0));
                this.vertices.push(new THREE.Vector3(window.innerWidth * 0.2 + window.innerWidth * 0.6,0.0,0.0));

                this.vertices.push(new THREE.Vector3(window.innerWidth - window.innerWidth * 0.2,0.0,0.0));
                this.vertices.push(new THREE.Vector3(window.innerWidth - window.innerWidth * 0.2,window.innerHeight,0.0));
                this.vertices.push(new THREE.Vector3(window.innerWidth,window.innerHeight,0.0));
                this.vertices.push(new THREE.Vector3(window.innerWidth,0.0,0.0));

                this.vertices.push(new THREE.Vector3(window.innerWidth * 0.2,window.innerHeight - window.innerHeight * 0.2,0.0));
                this.vertices.push(new THREE.Vector3(window.innerWidth * 0.2,window.innerHeight,0.0));
                this.vertices.push(new THREE.Vector3(window.innerWidth * 0.2 + window.innerWidth * 0.6,window.innerHeight,0.0));
                this.vertices.push(new THREE.Vector3(window.innerWidth * 0.2 + window.innerWidth * 0.6,window.innerHeight - window.innerHeight * 0.2,0.0));

                this.faces = [];
                this.faces.push(new THREE.Face3(0,1,2));
                this.faces.push(new THREE.Face3(0,2,3));
                this.faces.push(new THREE.Face3(4,5,6));
                this.faces.push(new THREE.Face3(4,6,7));
                this.faces.push(new THREE.Face3(8,9,10));
                this.faces.push(new THREE.Face3(8,10,11));
                this.faces.push(new THREE.Face3(12,13,14));
                this.faces.push(new THREE.Face3(12,14,15));

            },
            update:function (outer,inner, index) {

                this.outer = outer;
                this.inner = inner;

                this.vertices[0].set(this.outer[0].x,this.outer[0].y,index);
                this.vertices[1].set(this.outer[0].x,this.outer[3].y,index);
                this.vertices[2].set(this.inner[0].x,this.outer[3].y,index);
                this.vertices[3].set(this.inner[0].x,this.outer[0].y,index);

                this.vertices[4].set(this.inner[0].x,this.outer[0].y,index);
                this.vertices[5].set(this.inner[0].x,this.inner[1].y,index);
                this.vertices[6].set(this.inner[1].x,this.inner[1].y,index);
                this.vertices[7].set(this.inner[1].x,this.outer[0].y,index);

                this.vertices[8].set(this.inner[1].x,this.outer[0].y,index);
                this.vertices[9].set(this.inner[1].x,this.outer[2].y,index);
                this.vertices[10].set(this.outer[2].x,this.outer[2].y,index);
                this.vertices[11].set(this.outer[1].x,this.outer[1].y,index);

                this.vertices[12].set(this.inner[3].x,this.inner[3].y,index);
                this.vertices[13].set(this.inner[3].x,this.outer[3].y,index);
                this.vertices[14].set(this.inner[2].x,this.outer[3].y,index);
                this.vertices[15].set(this.inner[2].x,this.inner[2].y,index);

                this.verticesNeedUpdate = true;
            }

        });


        return FrameGeometry;

    });