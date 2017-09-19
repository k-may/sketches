import {BaseSketch} from "../../../common/base_sketch";
import {SpriteData} from "./sprite_data";
import {SpritePlane} from "./sprite_plane";
import {LoadUtils} from "../../../utils/load_utils";
/**
 * Created by kev on 16-02-08.
 */

export class Sketch extends BaseSketch {

  windowWidth: number = 0;
  windowHeight: number = 0;

  divElement: HTMLElement;

  renderer: THREE.WebGLRenderer;
  material: THREE.RawShaderMaterial;
  camera: THREE.OrthographicCamera;
  scene: THREE.Scene;

  frameCounter: number = 0;

  spriteData: SpriteData[];
  spritePlanes: SpritePlane[];

  //------------------------------------------------------

  constructor(div: HTMLElement) {
    super();

    LoadUtils.LoadShaders(['scripts/ts/sketches/SpritesGLSketch/frag.glsl',
      'scripts/ts/sketches/SpritesGLSketch/vert.glsl'])
      .then(src => {
        this.setup(src);
      });
  }

  //------------------------------------------------------

  setup(src: string[]) {
    this.renderer = new THREE.WebGLRenderer({alpha: true});
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.el.appendChild(this.renderer.domElement);

    this.camera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2,
      window.innerHeight / 2, -window.innerHeight / 2, -500, 1000);
    this.camera.updateMatrix();

    this.scene = new THREE.Scene();

    this.setupSprites(src);

    this.resize(window.innerWidth, window.innerHeight);
  }

  setupSprites(src) {

    this.spritePlanes = [];
    var promises = [];

    //*note : its much much faster to share materials!
    var textures = ["scripts/ts/sketches/SpritesGLSketch/doodle1",
      "scripts/ts/sketches/SpritesGLSketch/doodle2",
      "scripts/ts/sketches/SpritesGLSketch/doodle3",
      "scripts/ts/sketches/SpritesGLSketch/doodle4"];

    textures.forEach(texture => {
      var data = new SpriteData(texture, src[0], src[1]);
      promises.push(data.load());
    });

    Promise.all(promises).then(spriteData => {

      this.spriteData = spriteData;

      for (var i = 0; i < 1000; i++) {
        var data = spriteData[i % spriteData.length];
        var plane = new SpritePlane(data);

        var mesh = plane.mesh;

        mesh.position.x = Math.random() * window.innerWidth - window.innerWidth / 2;
        mesh.position.y = Math.random() * window.innerHeight - window.innerHeight / 2;

        this.scene.add(plane.mesh);
        this.spritePlanes.push(plane);
      }
    });
  }

  draw(time: number) {

    if (this.renderer) {
      this.renderer.clear();

      if (this.spriteData)
        this.spriteData.forEach(sD => sD.update(time));

      this.renderer.render(this.scene, this.camera);
    }
  }

  resize(windowWidth, windowHeight) {
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
  }

}
