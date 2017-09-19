precision highp float;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;

uniform float time;
uniform sampler2D uTexture2;
uniform vec3 cameraPosition;
uniform mat4 viewMatrix;

vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}

void main() {

  vec4 color = vec4(1.0,1.0,1.0,1.0);
  vec3 normal = normalize( vNormal );

  vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
  vec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );
  float refractionRatio = 0.5;
  vec3 reflectVec = refract( cameraToVertex, worldNormal, refractionRatio );

  gl_FragColor.rgb = mix(texture2D(uTexture2, vUv + reflectVec.xy*0.1), color, 0.5).rgb;
  gl_FragColor.a = 1.0;
}
