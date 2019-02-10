/**
 * Set the colour to a lovely pink.
 * Note that the color is a 4D Float
 * Vector, R,G,B and A and each part
 * runs from 0.0 to 1.0
 */

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

varying vec2 vUv;
uniform float time;

void main() {

  vec2 uv2 = vUv;

  uv2.x -= 0.5;
  uv2.y -= 0.5;

  float len = 0.5 - length(sqrt(uv2.x*uv2.x+uv2.y*uv2.y));
  len -= step(0.25,len);
  len = clamp(len,0.0,1.0);

  vec2 uv3 = vUv;
  uv3.x = snoise2(vUv*20.);
  uv3.y = snoise2(vUv*20.);
  uv3.x -= 0.5;
  uv3.y -= 0.5;
  float len3 = 0.5 - length(sqrt(uv3.x*uv3.x+uv3.y*uv3.y));
  len3 -= step(0.2,len3);
  len3 = clamp(len3,0.0,1.0);


  // float len2 = 0.5 - length(sqrt(uv2.x*uv2.x+uv2.y*uv2.y*snoise2(vUv.xy+time)));
  // len2 -= step(0.25,len2);
  // len2 = clamp(len2,0.0,1.0);

  gl_FragColor = vec4(len * len3 * 20.0,
                      0.0,  // G
                      0.0,  // B
                      1.0); // A
}