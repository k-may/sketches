
precision mediump float;

varying vec2 vUv;

uniform float time;

void main() {

    float triValue = smoothstep(vUv.x, vUv.x + 0.001, vUv.y);
    gl_FragColor = vec4(vec3(0.9), triValue);
}
