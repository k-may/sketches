precision highp float;

uniform float time;
uniform vec3 uColor;
uniform float uOffset;

varying vec2 vUv;

void main() {


      float t = time * uOffset*0.5;
      float offset = 0.8;
      float x = 0.5 + sin(t * 0.0004 + uOffset*3.14)*0.534;
      float y =  mod(cos(t * 0.00004 + uOffset*3.14)+ cos(t * 0.0004 + uOffset*3.14)*0.3 + 1.0, 1.0);//mod(cos(time * 0.00004), 0.4) + floor(cos(time * 0.0004))*0.1;
      float radius = length(vec2(x, y)- vUv);
      float val = step(radius, 0.002);

      if(val == 0.)
          discard;

      vec4 color = vec4(uColor * val, 1.0);
      gl_FragColor = color;

}
