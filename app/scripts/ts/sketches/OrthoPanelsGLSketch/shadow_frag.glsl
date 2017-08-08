precision mediump float;
#define M_PI 3.1415926535897932384626433832795
varying vec2 vUv;

void main() {
    float alpha = 1.0 - cos(vUv.x * M_PI*2.);
    alpha *= 1.0 - cos(vUv.y * M_PI*2.);
    gl_FragColor = vec4(0.0,0.0,0.0,pow(alpha, 0.2) * 0.8);
}
