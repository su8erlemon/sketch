#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
/**
 * Multiply each vertex by the
 * model-view matrix and the
 * projection matrix (both provided
 * by Three.js) to get a final
 * vertex position
 */

#define PI 3.1415;

uniform float time;

varying vec3 vNormal;
varying vec3 vPostion;

void main() {


  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);

  vPostion = vec4(modelViewMatrix * vec4(position,1.0)).xyz;
//  vPostion = vec3(modelViewMatrix * pos).xyz;

  vNormal = normalMatrix * normal;

}