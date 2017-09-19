import {BaseSketch} from "../../common/base_sketch";
import {LoadUtils} from "../../utils/load_utils";
import PlaneGeometry = THREE.PlaneGeometry;
import {Color} from "../../utils/color_utils";
import Vector4 = THREE.Vector4;
/**
 * Created by kevin.mayo on 8/15/2017.
 */

class PingPongData {

  src: THREE.WebGLRenderTarget;
  dest: THREE.WebGLRenderTarget;

  mesh: THREE.Mesh;
  material: THREE.RawShaderMaterial;

  scene: THREE.Scene;
  color: THREE.Vector3;
  time: number;
  offset: number;
  constructor(fragmentShader: string, vertexShader: string) {

    this.time = Math.random();
    this.offset = Math.random();

    this.src = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat
    });
    this.src.depthBuffer = false;

    this.dest = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat
    });
    this.dest.depthBuffer = false;

    this.color = new THREE.Vector3(Math.random(), Math.random(), Math.random());
  /*  var val = this.color.dot(new THREE.Vector3(0.3, 0.4, 0.5));
    this.color = new THREE.Vector3(val, val, val);
*/
    this.material = new THREE.RawShaderMaterial({
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      uniforms: {
        rTexture: {
          type: "t",
          value: this.src.texture
        },
        uOffset: {
          value: Math.random() * 10000,
        }
      },
      transparent: true,
      depthTest: false
    });

    this.material.blending = THREE.CustomBlending;
    this.material.blendSrc = THREE.SrcAlphaFactor;
    this.material.blendDst = THREE.OneMinusDstColorFactor;
    this.material.blendEquation = THREE.MaxEquation;

    var plane = new THREE.PlaneGeometry(2, 2);
    this.mesh = new THREE.Mesh(plane, this.material);

    this.scene = new THREE.Scene();
    this.scene.add(this.mesh);

  }

  render(renderer: THREE.WebGLRenderer, camera: THREE.Camera, scene: THREE.Scene) {
    this.swap();
   // renderer.setClearColor(0xffffff, 0);
    renderer.clearTarget(this.dest, true, true, true);
    renderer.render(scene, camera, this.dest, false);
    renderer.render(this.scene, camera, this.dest, false);
  }

  resize(w: number, h: number) {
    this.src.setSize(w, h);
    this.dest.setSize(w, h);
  }

  swap() {
    var temp = this.dest;
    this.dest = this.src;
    this.src = temp;
    this.material.uniforms["rTexture"].value = this.src.texture;
  }
}

//======================================================

export class Sketch extends BaseSketch {

  pingPongs: PingPongData[];

  renderer: THREE.WebGLRenderer;

  scene: THREE.Scene;
  mesh: THREE.Mesh;

  circleScene: THREE.Scene;
  circleMesh: THREE.Mesh;

  material: THREE.RawShaderMaterial;
  camera: THREE.Camera;

  circleMaterial: THREE.RawShaderMaterial;

  renderMaterial: THREE.RawShaderMaterial;

  loaded: boolean = false;

  //------------------------------------------------------

  constructor() {
    super();
    this.initialize();
  }

  //------------------------------------------------------

  public draw(time?: number): any {
    super.draw(time);

    if (this.loaded) {

      this.renderer.clear();

      for (var i = 0; i < this.pingPongs.length; i++) {
        var pingPong = this.pingPongs[i];
        this.circleMaterial.uniforms["time"].value = pingPong.time += 30;
        this.circleMaterial.uniforms["uColor"].value = pingPong.color;
        this.circleMaterial.uniforms["uOffset"].value = pingPong.offset;
       // this.renderer.clearDepth();
        pingPong.render(this.renderer, this.camera, this.circleScene);
       this.renderer.clearDepth();
        this.renderMaterial.uniforms["uTexture"].value = pingPong.dest.texture;
        this.renderer.render(pingPong.scene, this.camera);
      }
    }
  }

  public resize(w: number, h: number): any {

    if (this.loaded) {
      for (var i = 0; i < this.pingPongs.length; i++) {
        this.pingPongs[i].resize(w, h);
      }
      this.renderer.setSize(w, h);
    }
    return super.resize(w, h);
  }

  //------------------------------------------------------

  private initialize() {
    LoadUtils.LoadShaders(['scripts/ts/sketches/PingPong/ppFrag.glsl',
      'scripts/ts/sketches/PingPong/vert.glsl',
      'scripts/ts/sketches/PingPong/circleFrag.glsl',
      'scripts/ts/sketches/PingPong/frag.glsl',]).then(src => {

      this.pingPongs = [];

      for (var i = 0; i < 500; i++) {
        var pingPong = new PingPongData(src[0], src[1]);
        this.pingPongs.push(pingPong);
      }

      this.renderer = new THREE.WebGLRenderer({alpha: true});
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setClearColor(0xffffff, 0);
      this.renderer.autoClear = false;
      var gl = this.renderer.getContext();
     // gl.disable(gl.BLEND);

      this.el.appendChild(this.renderer.domElement);

      this.camera = new THREE.Camera();

      this.setupCircleScene(src);
      this.setupRenderScene(src);

      this.loaded = true;
      this.resize(window.innerWidth, window.innerHeight);
    });
  }

  private setupRenderScene(src) {
    this.renderMaterial = new THREE.RawShaderMaterial({
      fragmentShader: src[3],
      vertexShader: src[1],
      uniforms: {
        uTexture: {
          type: 't',
          value: null
        }
      }
    });
    this.renderMaterial.depthWrite = false;
    this.renderMaterial.transparent = true;

    this.renderMaterial.blending = THREE.MultiplyBlending;
    this.renderMaterial.blending = THREE.NoBlending;
  /*  this.renderMaterial.blendSrc = THREE.SrcAlphaFactor;
    this.renderMaterial.blendDst = THREE.OneMinusDstColorFactor;
    this.renderMaterial.blendEquation = THREE.MinEquation;*/


    var pBG = new THREE.PlaneGeometry(2, 2);
    this.mesh = new THREE.Mesh(pBG, this.renderMaterial);

    this.scene = new THREE.Scene();
    this.scene.add(this.mesh);
  }

  private setupCircleScene(src) {
    this.circleScene = new THREE.Scene();
    this.circleMaterial = new THREE.RawShaderMaterial({
      fragmentShader: src[2],
      vertexShader: src[1],
      uniforms: {
        time: {
          value: 0
        },
        uColor: {
          value: new Vector4()
        },
        uOffset: {
          value: 1
        }
      },
      transparent: true
    });
    var plane = new THREE.PlaneGeometry(2, 2);
    this.circleMesh = new THREE.Mesh(plane, this.circleMaterial);
    this.circleScene.add(this.circleMesh);
  }


}
