/**
 * Multiply each vertex by the
 * model-view matrix and the
 * projection matrix (both provided
 * by Three.js) to get a final
 * vertex position
 */
// void main() {
//   gl_Position = projectionMatrix *
//                 modelViewMatrix *
//                 vec4(position,1.0);
// }

varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  vViewPosition = -mvPosition.xyz;
  vNormal = normalMatrix * normal;
}