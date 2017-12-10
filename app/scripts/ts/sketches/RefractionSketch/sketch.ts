import {BaseSketch} from "../../common/base_sketch";
import {LoadUtils} from "../../utils/load_utils";
import "ts/sketches/RefractionSketch/OBJLoader";
import LoadingManager = THREE.LoadingManager;
import {Geometry} from "three";
import Material = THREE.Material;
/**
 * Created by kev on 16-02-08.
 */

declare class OBJLoader extends THREE.Loader {
  constructor(manager?: LoadingManager);

  manager: LoadingManager;
  withCredentials: boolean;

  load(url: string, onLoad?: (container: THREE.Object3D) => void, onProgress?: (event: ProgressEvent) => void, onError?: (event: ErrorEvent) => void): void;

  setTexturePath(value: string): void;

  parse(json: any, texturePath?: string): { geometry: Geometry; materials?: Material[] };
}


export class Sketch extends BaseSketch {

  windowWidth: number = 0;
  windowHeight: number = 0;

  divElement: HTMLElement;

  camera: THREE.Camera;

  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;

  planeScene: THREE.Scene;
  planeCamera: THREE.Camera;
  plane: THREE.PlaneGeometry;
  planeMaterial: THREE.RawShaderMaterial;
  planeMesh: THREE.Mesh;

  loaded: boolean = false;

  object: THREE.Object3D;

  mouseX: number = 0;
  mouseY: number = 0;

  renderTexture: THREE.WebGLRenderTarget;
  path: string = "scripts/ts/sketches/RefractionSketch/";

  //--------------------------------------------------

  constructor(div: HTMLElement) {
    super();
    this.divElement = div;
    this.initialize();
  }

  //--------------------------------------------------

  public mouseMove(event) {
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    this.mouseX = ( event.clientX - windowHalfX ) / 2;
    this.mouseY = ( event.clientY - windowHalfY ) / 2;
  }

  public draw(time: number) {

    if (this.loaded) {

      this.camera.position.x += ( this.mouseX - this.camera.position.x ) * .05;
      this.camera.position.y += ( -this.mouseY - this.camera.position.y ) * .05;
      this.camera.lookAt(this.object.position);

      this.renderer.clear();
      this.renderer.render(this.planeScene, this.planeCamera, this.renderTexture);
      this.renderer.render(this.planeScene, this.planeCamera);
      this.renderer.clearDepth();
      //this.scene.background = this.renderTexture.texture;
      this.renderer.render(this.scene, this.camera);

    }
  }

  public resize(windowWidth, windowHeight) {
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
  }

  //--------------------------------------------------

  private initialize() {
    this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.autoClear = false;

    this.el.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    this.scene = new THREE.Scene();

    var ambient = new THREE.AmbientLight(0x101030);
    this.scene.add(ambient);

    var directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.intensity = 0.1;
    directionalLight.position.set(0, 0, 1);
    this.scene.add(directionalLight);

    var imgLoader = new THREE.ImageLoader();
    imgLoader.load(this.path + 'textures/UV_Grid_Sm.jpg', (image) => {

      var texture = new THREE.Texture(image);
      texture.needsUpdate = true;

      this.loadPlane(texture).then(() => {
        this.loadObj();
      });
    });
  }

  private loadPlane(texture: THREE.Texture): Promise<void> {
    return new Promise<void>(resolve => {

      LoadUtils.LoadShaders([this.path + 'planeFrag.glsl', this.path + 'planeVert.glsl']).then(src => {

        this.planeScene = new THREE.Scene();

        var halfW = window.innerWidth / 2;
        var halfH = window.innerHeight / 2;
        this.planeCamera = new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, -100, 1000);
        this.planeCamera.updateMatrix();

        this.plane = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);

        this.planeMaterial = new THREE.RawShaderMaterial({
          uniforms: {
            uTexture1: {
              value: texture,
              type: 't'
            }
          },
          fragmentShader: src[0],
          vertexShader: src[1]
        });

        this.planeMesh = new THREE.Mesh(this.plane, this.planeMaterial);
        this.planeScene.add(this.planeMesh);

        this.renderTexture = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.NearestFilter,
          format: THREE.RGBAFormat
        });

        resolve();
      });
    });
  }

  private loadObj() {

    LoadUtils.LoadShaders([this.path + 'cubeFrag.glsl', this.path + 'cubeVert.glsl']).then(src => {

      var cubeMaterial = new THREE.RawShaderMaterial({
        uniforms: {
          "uTexture2": {
            value: this.renderTexture.texture,
            type: "t"
          }
        },
        fragmentShader: src[0],
        vertexShader: src[1],
        side: THREE.DoubleSide
      });

      var loader = new OBJLoader();
      loader.load(this.path + 'CubeUV.obj', (object) => {
        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            //var mat = <THREE.MeshPhongMaterial>child.material;
            child.material = cubeMaterial;
            child.geometry.center();
            child.geometry.computeVertexNormals();
          }
        });

        this.object = object;
        object.position.z = -1500;

        var helper = new THREE.VertexNormalsHelper(object, 2, 0x00ff00, 1);

        this.scene.add(object);
        this.scene.add(helper);

        this.loaded = true;
      });
    });
  }

}
