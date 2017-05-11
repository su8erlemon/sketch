#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
/**
 * Multiply each vertex by the
 * model-view matrix and the
 * projection matrix (both provided
 * by Three.js) to get a final
 * vertex position
 */

#define PI 3.1415;

uniform float time;
varying vec2 vUv;
varying float vNormal;

vec3 sample(float t, float time) {
  float angle = t * time * 2.0 * PI;
  vec2 rot = vec2(cos(angle), sin(angle));
  float z = t;// * 2.0 - 1.0;
  return vec3(rot, z);
}

void main() {

  vUv = uv;
//  vec3 pos = position + sample(position.z, sin(time) * 2.0) + position * snoise3(position * 0.5 + sin(time));
//  vec3 pos = position + sample(position.x, sin(time) * 2.0 * tan(time)) * position * snoise3(position * 0.5 + sin(time));
  //vec3 pos = position + sample(position.x, sin(time) ) * position * snoise3(position * 0.5 + sin(time)*0.1);

//  vec3 pos = position + sample(position.z, sin(time*0.4) ) * ( normal * snoise3(position*1.0 + time*0.08 ));// + sample(position.x, sin(time) ) * position * snoise3(position * 0.5 + sin(time)*0.1);
  //vec3 pos = position + ( normal * snoise3(position * vec3(1.01,1.01,1.01) + time*0.8 ) * 0.3);// + sample(position.z*position.x*position.y, sin(time) )*0.4;
  vec3 pos = position + ( normal * snoise3(position * vec3(1.01,1.01,1.01) + time*0.8 ) * 0.3) + sample(position.z, 1.0 )*1.0;
//  vec3 pos = position;// + ( normal * snoise3(position * vec3(1.01,1.01,1.01) + time*0.8 ) * 0.3);// + sample(position.z*position.x*position.y, sin(time) )*0.4;

  vNormal = length(normal-pos);

  vec4 pos1 = viewMatrix * vec4(pos,1.0);

  gl_Position = projectionMatrix * modelMatrix * pos1;

}