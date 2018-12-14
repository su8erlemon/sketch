/**
 * Multiply each vertex by the
 * model-view matrix and the
 * projection matrix (both provided
 * by Three.js) to get a final
 * vertex position
 */

varying vec4 vPosition;
varying vec3 vNormal;
varying vec2 vUv;


void main() {
  
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  // vNormal = normalize(normalMatrix * normal);
  // vNormal = projectionMatrix * vec4(normal, 1.0);
  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position,1.0);
  // vPosition = gl_Position;
  // vPosition = modelViewMatrix * vec4(position, 1.0);
  // vPosition = vec4(position, 1.0);
}