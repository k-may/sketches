precision mediump float;

varying vec2 vUv;
varying vec3 vPosition;

attribute vec3 position;
attribute vec2 uv;

uniform float time;
uniform vec2 resolution;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform vec2 uvOffset;
uniform vec2 spriteSize;

void main() {

  vUv = uv * spriteSize + uvOffset;
  vec4 pos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  vPosition = pos.xyz * vec3(resolution, 1.0);
  gl_Position = pos;

}