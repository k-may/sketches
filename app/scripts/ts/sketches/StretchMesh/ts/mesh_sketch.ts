import {Sketch} from "./sketch";

class MeshTexture extends Sketch{

    renderer:THREE.WebGLRenderer;
    scene:THREE.Scene;
    camera:THREE.Camera;
    canvas:HTMLCanvasElement;
    material:THREE.Material;
    geometry:THREE.Geometry;
    mesh:THREE.Mesh;
    uniforms:any;

    constructor(canvas:HTMLCanvasElement, sketch:Sketch) {
        super();

        /* var self = this;
         LoadUtils.loadShaders(['vertex', 'fragment']).then(function (arr) {
         self.setLoaded(arr[0], arr[1]);
         });*/

        this.setLoaded("", "");
    }

    setLoaded(vertex:string, fragment:string):void {

        /*this.uniforms = {
         texture: {
         type: 't',
         value: THREE.ImageUtils.loadTexture('img/mesh_texture.png')
         }
         };*/

        this.renderer = new THREE.WebGLRenderer({alpha : true});
        this.renderer.setClearColor("#ffffff");
        this.canvas = this.renderer.domElement;

        this.camera = new THREE.Camera();
        this.camera.position.z = 1;


        this.scene = new THREE.Scene();


        //todo figure this out
        this.geometry = new THREE.Geometry();

        //add verts
        for (var i = 0; i < this.vertices.length; i++) {
            this.geometry.vertices.push(this.vertices[i]);
        }

        //create faces/uvs
        var index = 0;
        var uvWidth =  1 / ((this.vertices.length/ 2) - 1);
        for (var i = 0; i < this.vertices.length - 2; i += 2) {

            this.geometry.faces.push(new THREE.Face3(i + 0, i + 2, i + 1));
            this.geometry.faces.push(new THREE.Face3(i + 2, i + 3, i + 1));


            var left = uvWidth * i/2;
            this.geometry.faceVertexUvs[0].push([new THREE.Vector2(left, 0), new THREE.Vector2(left + uvWidth, 0), new THREE.Vector2(left, 1)]);
            this.geometry.faceVertexUvs[0].push([new THREE.Vector2(left+ uvWidth, 0), new THREE.Vector2(left + uvWidth, 1), new THREE.Vector2(left, 1)]);

        }

        this.geometry.computeFaceNormals();

         var map = THREE.ImageUtils.loadTexture("img/red_bar.png");
         map.minFilter = THREE.LinearFilter;

         this.material = new THREE.MeshBasicMaterial({
         map: map
         });
        this.material.transparent = true;
        this.material.depthWrite = false;
        this.material.alphaTest = 0.5;


        this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial({
            map: map
        }));
        this.scene.add(this.mesh);
    }


    resize(w:number, h:number):void {
        super.resize(w, h);
        this.renderer.setSize(w, h);
    }

    draw(time:number):void {
        super.draw(time);
        this.update(time);

        this.geometry.verticesNeedUpdate = true;
        this.renderer.render(this.scene, this.camera);
    }
}

export = MeshTexture;
