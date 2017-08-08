import {BaseSketch} from "../../common/BaseSketch";
import {ShadowMesh} from "./shadow_mesh";
import {LoadUtils} from "../../utils/load_utils";
/**
 * Created by kev on 16-02-08.
 */

export class Sketch extends BaseSketch {

  windowWidth: number = 0;
  windowHeight: number = 0;

  divElement: HTMLElement;

  renderer: THREE.WebGLRenderer;
  camera: THREE.OrthographicCamera;
  scene: THREE.Scene;

  material: THREE.Material;

  backPlane: THREE.PlaneGeometry;

  plane1: THREE.PlaneGeometry;
  mesh1: THREE.Mesh;
  planeShadow1: ShadowMesh;

  plane2 : THREE.PlaneGeometry;
  mesh2 : THREE.Mesh;
  planeShadow2: ShadowMesh;

  planeShadow3 : ShadowMesh;

  light: THREE.DirectionalLight;
  lightPosition: THREE.Vector4;

  constructor(div: HTMLElement) {
    super();

    LoadUtils.LoadShaders(['../../scripts/ts/sketches/OrthoPanelsGLSketch/vert.glsl',
      '../../scripts/ts/sketches/OrthoPanelsGLSketch/frag.glsl',
      "../../scripts/ts/sketches/OrthoPanelsGLSketch/shadow_frag.glsl"]).then(src => {

      this.renderer = new THREE.WebGLRenderer({alpha: true, antialias : true});
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      this.el.appendChild(this.renderer.domElement);

      this.camera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2,
        window.innerHeight / 2, -window.innerHeight / 2, -500, 1000);
      this.camera.updateMatrix();

      this.scene = new THREE.Scene();

      this.light = new THREE.DirectionalLight(0xffffff, 1);
      this.light.position.set(-2, 3, 4);
      this.light.lookAt(this.scene.position);

      this.scene.add(this.light);

      this.backPlane = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
      var mesh = new THREE.Mesh(this.backPlane, new THREE.MeshBasicMaterial({color: 0xff0000}));
        this.scene.add(mesh);

      var material = new THREE.RawShaderMaterial({
        fragmentShader: src[1],
        vertexShader: src[0],
        uniforms : {
          color : {value : new THREE.Color(0xffff00)}
        }
      });
      this.plane1 = new THREE.PlaneGeometry(200, 400);
      this.mesh1 = new THREE.Mesh(this.plane1, material);
      this.mesh1.position.set(-100, -100, 20);
      this.scene.add(this.mesh1);

      this.plane2 = new THREE.PlaneGeometry(400, 200);
      var material = material.clone();
      material.uniforms.color.value = new THREE.Color(0X00ff00);
      this.mesh2 = new THREE.Mesh(this.plane2, material.clone());
      this.mesh2.position.set(-40, 100, 30);
      this.scene.add(this.mesh2);

      var shadowMaterial = new THREE.RawShaderMaterial({
        fragmentShader : src[2],
        vertexShader : src[0],
        transparent : true,
        depthWrite : false
      });

      this.planeShadow1 = new ShadowMesh(this.mesh1 , shadowMaterial);
      this.scene.add(this.planeShadow1);

      this.planeShadow2 = new ShadowMesh(this.mesh2, shadowMaterial);
      this.scene.add(this.planeShadow2);

      this.planeShadow3 = new ShadowMesh(this.mesh2, shadowMaterial);
      this.scene.add(this.planeShadow3);

    });
  }

  draw(time: number) {

    if (this.renderer) {

      this.plane1.vertices[1].x += Math.sin(time * 0.001) * 1;
      this.plane1.verticesNeedUpdate = true;

      this.mesh2.position.setY(Math.sin(time * 0.001) * 20);
      this.mesh2.matrixWorldNeedsUpdate = true;
      this.renderer.clear();

      var normalVector = new THREE.Vector3(0, 0, 1);
      var planeConstant = 0.1; // this value must be slightly higher than the groundMesh's y position of 0.0
      var groundPlane = new THREE.Plane(normalVector, planeConstant);

      var position = new THREE.Vector4(this.light.position.x, this.light.position.y, this.light.position.z, 0.001);
      this.planeShadow1.update(groundPlane, position);

      this.planeShadow2.update(groundPlane, position);

      this.planeShadow3.update(new THREE.Plane(normalVector, 20.1), position);
      this.renderer.render(this.scene, this.camera);
    }
  }

  resize(windowWidth, windowHeight) {
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;

    if (this.renderer)
      this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

}
