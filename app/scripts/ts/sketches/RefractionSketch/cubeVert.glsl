precision highp float;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vWorldPosition;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

uniform mat4 modelMatrix;
uniform float time;
uniform vec2 resolution;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition;

void main() {

  vUv = uv;
  vNormal = normal;

  vec3 transformed = vec3( position );
  vec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );
  vWorldPosition = worldPosition.xyz;

  vec4 pos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  vPosition = pos.xyz * vec3(resolution, 1.0);
  gl_Position = pos;

}
