precision highp float;

varying vec2 vUv;

uniform float time;
uniform sampler2D uTexture1;

void main() {
  gl_FragColor = texture2D(uTexture1, vUv);//
}
