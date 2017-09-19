precision highp float;

uniform sampler2D rTexture;
uniform vec4 uColor;
varying vec2 vUv;

void main() {
    vec4 color = texture2D(rTexture, vUv);
   color *= vec4(0.99);// *= vec4(1.0,1.0,1.0,0.9);

  //  if(color.a < 0.16)
  //    discard;

    gl_FragColor = color;
}
