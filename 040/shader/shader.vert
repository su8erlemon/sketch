/**
 * Multiply each vertex by the
 * model-view matrix and the
 * projection matrix (both provided
 * by Three.js) to get a final
 * vertex position
 */
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position,1.0);
}