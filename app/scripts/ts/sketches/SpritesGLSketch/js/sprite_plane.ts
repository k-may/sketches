import {SpriteData} from "./sprite_data";
/**
 * Created by kevin.mayo on 8/3/2017.
 */

export class SpritePlane {

  mesh: THREE.Mesh;
  texture: THREE.Texture;
  json: any;

  name: string;

  spriteData: SpriteData;

  //----------------------------------------------------------

  constructor(spriteData: SpriteData) {
    this.name = spriteData.name;
    this.spriteData = spriteData;

    this.json = this.spriteData.json;
    this.texture = this.spriteData.texture;

    this.texture = new THREE.TextureLoader().load(this.name + ".png");
    this.texture.wrapS = THREE.ClampToEdgeWrapping;
    this.texture.wrapT = THREE.ClampToEdgeWrapping;

    //scaling
    var sourceSize = this.json.frames[0].sourceSize;

    var plane = new THREE.PlaneGeometry(sourceSize.w, sourceSize.h);
    this.mesh = new THREE.Mesh(plane, this.spriteData.material);

    this.spriteData.material.uniforms["color"].value = new THREE.Color(Math.random(),Math.random(),Math.random());
  }

  //----------------------------------------------------------
}
