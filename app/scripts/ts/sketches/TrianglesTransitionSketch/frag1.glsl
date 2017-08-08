
precision mediump float;

uniform sampler2D texture;
uniform vec2 resolution;

varying vec2 vUv;
varying vec3 vPosition;

uniform float time;

void main() {

    float value = (sin(time*0.0000000001) + 1.0 ) /2.0;

    float r= mod(floor(vPosition.y / 100.0), 2.0);
    vec4 tex = texture2D( texture, vUv );

    vec4 color =  vec4(r, 1.0, 1.0, 1.0 - tex.a);//texture2D( texture, vUv );

    gl_FragColor = color;
}
