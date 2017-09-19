import {Plane} from "./plane";
import {BaseSketch} from "../../common/base_sketch";
import {LoadUtils} from "../../utils/load_utils";

export class Sketch extends BaseSketch {

  planes: Plane[];

  windowWidth: number = 0;
  windowHeight: number = 0;

  counter: number = 0;

  renderTexture: THREE.WebGLRenderTarget;
  renderMaterial: THREE.RawShaderMaterial;
  renderScene: THREE.Scene;

  mesh: THREE.Mesh;
  material: THREE.RawShaderMaterial;
  scene: THREE.Scene;

  renderer: THREE.WebGLRenderer;

  camera: THREE.Camera;

  constructor() {
    super();

    LoadUtils.LoadShaders(["../../scripts/ts/sketches/TrianglesTransitionSketch/frag1.glsl",
      "../../scripts/ts/sketches/TrianglesTransitionSketch/frag2.glsl",
      "../../scripts/ts/sketches/TrianglesTransitionSketch/vert1.glsl",
      "../../scripts/ts/sketches/TrianglesTransitionSketch/vert2.glsl"]).then(src => {
      this.handleLoad(src);
    });
  }

  draw(time: number) {

    if (this.renderer) {
      this.renderer.clear();

      this.renderMaterial.uniforms["time"].value = time;

      this.updateBottomLine();

      this.renderer.render(this.renderScene, this.camera, this.renderTexture, true);

      this.material.uniforms["time"].value = time;

      this.renderer.render(this.scene, this.camera);
    }
  }

  updateBottomLine() {
    this.planes.forEach(plane => {
      plane.update();
    });
  }


  resize(windowWidth, windowHeight) {

    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;

    if (this.renderer) {
      this.renderer.setSize(windowWidth, windowHeight);
    }
    if (this.renderTexture)
      this.renderTexture.setSize(windowWidth, windowHeight);

  }

//------------------------------------------------------

  private handleLoad(src: string[]) {

    this.renderer = new THREE.WebGLRenderer({alpha: true});
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.el.appendChild(this.renderer.domElement);

    this.camera = new THREE.Camera();

    this.renderScene = new THREE.Scene();
    this.renderTexture = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat
    });

    this.renderMaterial = new THREE.RawShaderMaterial({
      uniforms: {time: {value: 0}},
      vertexShader: src[3],
      fragmentShader: src[1]
    });

    var count = 10;
    var distance = window.innerWidth / window.innerHeight * (2 / count);

    this.planes = [];
    for(var i = 0 ;i < count; i ++){
      var l = { x :  -1 + i * 2 / count, y : 1};
      var r = { x : l.x + 2 / count, y : 1};
      var plane = new Plane(l, r,distance);
      this.planes.push(plane);
      var mesh = new THREE.Mesh(plane.renderPlane, this.renderMaterial);

      this.renderScene.add(mesh);
    }
    //set up rendered scene...
    this.scene = new THREE.Scene();

    this.material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {value: 0},
        texture: {value: this.renderTexture.texture},
        resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)}
      },
      vertexShader: src[2],
      fragmentShader: src[0]
    });
    this.material.transparent = true;
    this.material.alphaTest = 0;
    this.material.depthWrite = false;

    var planeBuffer = new THREE.PlaneBufferGeometry(2, 2);
    this.mesh = new THREE.Mesh(planeBuffer, this.material);
    this.scene.add(this.mesh);

  }
}
