precision mediump float;

varying vec2 vUv;

uniform sampler2D texture;
uniform vec3 color;

void main() {

  float triValue = smoothstep(vUv.x, vUv.x + 0.001, vUv.y);

  vec4 tex = texture2D(texture, vUv);

  float intensity = tex.r + tex.g + tex.b;
  if(intensity > 2.)
  discard;

  gl_FragColor = vec4(color,1.0);
}
