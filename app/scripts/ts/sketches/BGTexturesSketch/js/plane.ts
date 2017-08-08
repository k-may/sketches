export class Plane {

  mesh: THREE.Mesh;
  geometry: THREE.Geometry;
  done: boolean = false;
  position : THREE.Vector2;
  verts : THREE.Vector3[];
  startVerts : THREE.Vector3[];

  offsetTime : number = Math.random() * 1000;
  scale : number;

  constructor(material: THREE.RawShaderMaterial) {

    this.scale = Math.random();

    var size = 50;
    var w = window.innerWidth;
    var h = window.innerHeight;
    this.geometry = new THREE.PlaneGeometry(size, size);

    var rX = Math.floor(window.innerWidth / size);
    var rY = Math.floor(window.innerHeight / size);

   // if (Math.random() > 0.5)
      this.geometry.rotateZ(Math.floor(Math.random() / .25) * 90 * Math.PI / 180.0);

    this.position = new THREE.Vector2(Math.floor(Math.random() * rX - rX / 2) * size,
      Math.floor(Math.random() * rY - rY / 2) * size);

    this.geometry.translate(this.position.x, this.position.y, 0);
    this.geometry.verticesNeedUpdate = true;

    this.verts = [];
    this.geometry.vertices.forEach(vert => this.verts.push(vert.clone()));

    var choice = Math.floor(Math.random() / 0.25);
    if(choice == 0 || choice == 1)
      this.method2();
    else
      this.method4();

    this.startVerts = [];
    this.geometry.vertices.forEach(vert => this.startVerts.push(vert.clone()));

    this.mesh = new THREE.Mesh(this.geometry, material);
  }

  update(time: number) {

    var value = (Math.sin(time*0.001 + this.offsetTime) + 1.0) / 2.0;// + 0.5;

    this.geometry.vertices.forEach((v, i) =>{
      v.x = this.startVerts[i].x + (this.verts[i].x - this.startVerts[i].x) * value;
      v.y = this.startVerts[i].y + (this.verts[i].y - this.startVerts[i].y)* value;
    });

    this.geometry.translate(-this.position.x, 0, 0);
    this.geometry.scale(0.999, 1, 1);
    this.geometry.translate(this.position.x, 0, 0);

    this.geometry.verticesNeedUpdate = true;
  }

  method1 (){
    this.geometry.vertices.forEach((v, i) =>{
      if(Math.floor(i / 2) == 0){
        v.x = this.geometry.vertices[i + 2].x;
        v.y = this.geometry.vertices[i + 2].y
      }
    });
  }

  method2 (){
    this.geometry.vertices.forEach((v, i) =>{
      if(Math.floor(i / 2) == 1){
        v.x = this.geometry.vertices[i - 2].x;
        v.y = this.geometry.vertices[i - 2].y
      }
    });
  }

  method3 (){
    this.geometry.vertices.forEach((v, i) =>{
      if(Math.floor(i % 2) == 0){
        v.x = this.geometry.vertices[i + 1].x;
        v.y = this.geometry.vertices[i + 1].y
      }
    });
  }
  method4 (){
    this.geometry.vertices.forEach((v, i) =>{
      if(Math.floor(i % 2) == 1){
        v.x = this.geometry.vertices[i - 1].x;
        v.y = this.geometry.vertices[i - 1].y
      }
    });
  }

  reset() {


  }


}
