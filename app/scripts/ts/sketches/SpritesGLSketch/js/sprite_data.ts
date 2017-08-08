import {LoadUtils} from "../../../utils/load_utils";
/**
 * Created by kevin.mayo on 8/4/2017.
 */
export class SpriteData {

  json: any;
  texture: THREE.Texture;
  name: string;
  material: THREE.RawShaderMaterial;
  promise: Promise<void>;
  frag: string;
  vert: string;

  frameCounter: number = 0;

  //----------------------------------------------------------

  constructor(name: string, frag: string, vert: string) {
    this.name = name;
    this.frag = frag;
    this.vert = vert;
  }

  //----------------------------------------------------------

  load(): Promise<SpriteData> {
    return new Promise<SpriteData>(resolve => {
      this.texture = new THREE.TextureLoader().load(this.name + ".png");

      this.promise = LoadUtils.LoadAJAX(this.name + ".json").then(json => {
        this.json = json;

        var sourceSize = this.json.frames[0].sourceSize;
        var imageSize = this.json.meta.size;
        var spriteSize = new THREE.Vector2(sourceSize.w / imageSize.w, sourceSize.h / imageSize.h);

        this.material = new THREE.RawShaderMaterial({
          fragmentShader: this.frag,
          vertexShader: this.vert,
          uniforms: {
            time: {value: 0},
            uvOffset: {value: new THREE.Vector2()},
            spriteSize: {value: spriteSize},
            texture: {value: this.texture},
            resolution: {
              value: new THREE.Vector2(sourceSize.w, sourceSize.h)
            },
            color : {
              value : new THREE.Color(0x000000)
            }
          },
          depthTest: false,
          transparent: true
        });

        resolve(this);
      });
    });
  }

  update(time:number){
    var frame = Math.floor(this.frameCounter++);
    var currentFrame = this.json.frames[frame % this.json.frames.length];
    this.material.uniforms["uvOffset"].value = new THREE.Vector2(currentFrame.frame.x / this.json.meta.size.w,
      1.0 - currentFrame.frame.y / this.json.meta.size.h);

    this.material.uniforms["time"].value = time;
  }
}
