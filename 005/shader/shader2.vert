/**
 * Multiply each vertex by the
 * model-view matrix and the
 * projection matrix (both provided
 * by Three.js) to get a final
 * vertex position
 */

varying vec3 vColor;
attribute float index1;

const float frag = 1.0 / 128.;
const float texShift = 0.5 * frag;

void main() {

  vec4 pos1 = modelMatrix * vec4(position,1.0);
//  vec4 pos1 = vec4(position,1.0);
//  vColor = ((normalize(pos1) + 1.0) * 0.5).xyz;
  vColor = (1.0 + pos1.xyz) * 0.5;

  float pu = fract(index1 * frag) * 2.0 - 1.0;
  float pv = floor(index1 * frag) * frag * 2.0 - 1.0;
  gl_Position = vec4(pu + texShift, pv + texShift, 0.0, 1.0);
  gl_PointSize = 1.0;

}