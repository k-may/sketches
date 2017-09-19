import * as THREE from "three";
import {Plane} from "./plane";
import {BaseSketch} from "../../../common/base_sketch";
import {LoadUtils} from "../../../utils/load_utils";

/**
 * Created by kev on 16-02-08.
 */

export class Sketch extends BaseSketch {

  windowWidth: number = 0;
  windowHeight: number = 0;

  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  material: THREE.RawShaderMaterial;
  mesh: THREE.Mesh;

  planes: Plane[];

  divElement: HTMLElement;
  private loaded: boolean;
  private camera: THREE.Camera;

  constructor(div: HTMLElement) {
    super();

    LoadUtils.LoadShaders(['scripts/ts/sketches/BgTexturesSketch/frag.glsl',
      'scripts/ts/sketches/BgTexturesSketch/vert.glsl'])
      .then(src => {

        this.renderer = new THREE.WebGLRenderer({alpha: true});
        this.renderer.setClearColor(0x000000, 0);

        this.el.appendChild(this.renderer.domElement);

        this.camera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2,
          window.innerHeight / 2, -window.innerHeight / 2, -500, 1000);

        this.camera.updateMatrix();

        this.scene = new THREE.Scene();

        this.material = new THREE.RawShaderMaterial({
          fragmentShader: src[0],
          vertexShader: src[1],
          uniforms: {
            time: {value: 0},
            resolution: {
              value: new THREE.Vector2(window.innerWidth, window.innerHeight)
            }
          },
          depthTest: false,
          transparent: true
        });
        this.material.alphaTest = 0.5;

        this.planes = [];
        var planeCount = 250;
        for (var i = 0; i < planeCount; i++) {
          var plane = new Plane(this.material);
          this.scene.add(plane.mesh);
          this.planes.push(plane);
        }

        this.loaded = true;

        this.resize(window.innerWidth, window.innerHeight);
      });
  }

  draw(time: number) {
    if (this.loaded) {

      this.planes.forEach(plane => plane.update(time));

      this.material.uniforms["time"].value = time;

      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
    }
  }

  resize(windowWidth, windowHeight) {

    if (!this.loaded)
      return;

    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;

    this.renderer.setSize(windowWidth, windowHeight);

    this.material.uniforms["resolution"].value = new THREE.Vector2(windowWidth, windowHeight);
  }

}
