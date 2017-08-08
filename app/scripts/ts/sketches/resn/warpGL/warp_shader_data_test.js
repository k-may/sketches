/**
 * Created by kev on 16-03-01.
 */


define(['common/shader_data'],function (ShaderData) {

    var WrapShaderData = (function (SD) {

        SD.prototype.createMaterial = function () {

            var loader = new THREE.TextureLoader();


            this.texture = loader.load("img/AYCF_MDMA.jpg");
            this.uniforms.texture = {
                type :"t",
                value:this.texture
            };

            this.camera = new THREE.Camera();//PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);//new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight,0.1);//new THREE.Camera();
            this.camera.position.set(0,0,1);
            /* this.camera.position.z = 1;
             this.camera.position.x = 0;
             this.camera.position.y = 0;
             this.camera.position.z = 100;*/

            this.scene = new THREE.Scene();

            this.camera.lookAt(this.scene.position);
            /* this.camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 100);
             this.camera.position.set(0, 0, 10);
                 this.camera.lookAt(this.scene.position); */
//                scene.add(camera); 

            //this.camera.lookAt(new THREE.Vector3(5, 5, 0));


            this.material = new THREE.ShaderMaterial({
                uniforms      :this.uniforms,
                vertexShader  :this.vertexShader,
                fragmentShader:this.fragmentShader
            });

            this.material.neesUpdate = true;

            this.createGeometryShape();

            this.ready = true;

        };

        //http://www.johannes-raida.de/tutorials/three.js/tutorial02/tutorial02.htm
        SD.prototype.createGeometryShape = function () {
            var triangleGeometry = new THREE.Geometry();
            triangleGeometry.vertices.push(new THREE.Vector3(0.0,0.0,0.0));
            triangleGeometry.vertices.push(new THREE.Vector3(-1.0,-1.0,0.0));
            triangleGeometry.vertices.push(new THREE.Vector3(1.0,-1.0,0.0));
            triangleGeometry.faces.push(new THREE.Face3(0,1,2));

            var triangleMaterial = new THREE.MeshBasicMaterial({
                color:0xFFFFFF,
                side :THREE.DoubleSide
            });

            // Create a mesh and insert the geometry and the material. Translate the whole mesh
            // by -1.5 on the x axis and by 4 on the z axis. Finally add the mesh to the scene.
            var triangleMesh = new THREE.Mesh(triangleGeometry,triangleMaterial);
            // triangleMesh.position.set(-1.5,0.0,4.0);
            this.scene.add(triangleMesh);
        };

        //http://stackoverflow.com/questions/12656138/how-to-render-2d-shape-of-points-in-three-js
        SD.prototype.createShape = function () {
            var triangleShape = new THREE.Shape();
            triangleShape.moveTo(0,2);
            triangleShape.lineTo(4,1);
            triangleShape.lineTo(0,1);
            triangleShape.lineTo(0,2);

            var geometry = triangleShape.makeGeometry();

            var material = new THREE.MeshBasicMaterial({color:0xff0000});
            this.mesh = new THREE.Mesh(geometry,material);
            this.scene.add(this.mesh);
        };

        SD.prototype.createLineShape = function () {
            geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(1,0.5,0));
            geometry.vertices.push(new THREE.Vector3(1,0,0));
            geometry.vertices.push(new THREE.Vector3(2,0,0));
            geometry.vertices.push(new THREE.Vector3(1,0.5,0)); // close the loop

            var material = new THREE.LineBasicMaterial({color:0xffffff,linewidth:1});
            var line = new THREE.Line(geometry,material);
            this.scene.add(line)
        };

        SD.prototype.drawShape = function () {
            // create a basic shape
            var shape = new THREE.Shape();
            // startpoint
            shape.moveTo(10,10);
            // straight line upwards
            shape.lineTo(10,40);
            // the top of the figure, curve to the right
            shape.bezierCurveTo(15,25,25,25,30,40);
            // spline back down
            shape.splineThru(
                [new THREE.Vector2(32,30),
                    new THREE.Vector2(28,20),
                    new THREE.Vector2(30,10),
                ]);
            // curve at the bottom
            shape.quadraticCurveTo(20,15,10,10);
            // add 'eye' hole one
            var hole1 = new THREE.Path();
            hole1.absellipse(16,24,2,3,0,Math.PI * 2,true);
            shape.holes.push(hole1);
            // add 'eye hole 2'
            var hole2 = new THREE.Path();
            hole2.absellipse(23,24,2,3,0,Math.PI * 2,true);
            shape.holes.push(hole2);
            // add 'mouth'
            var hole3 = new THREE.Path();
            hole3.absarc(20,16,2,0,Math.PI,true);
            shape.holes.push(hole3);
            // return the shape
            return shape;
        };

        SD.prototype.createMesh = function (geom) {
            // assign two materials
            var meshMaterial = new THREE.MeshNormalMaterial();
            meshMaterial.side = THREE.DoubleSide;
            var wireFrameMat = new THREE.MeshBasicMaterial();
            wireFrameMat.wireframe = true;
            // create a multimaterial
            var mesh = THREE.SceneUtils.createMultiMaterialObject(geom,[meshMaterial,wireFrameMat]);
            return mesh;
        };

        return SD;

    })(ShaderData);

    return WrapShaderData;

})