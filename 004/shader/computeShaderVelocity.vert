// For PI declaration:
#include <common>
#pragma glslify: snoise = require('glsl-noise/simplex/3d')

uniform float time;

float maxspeed = 5.0;
float maxforce = 0.5;

float speed = 0.4;

float magSq(vec3 vec) {
  return (vec.x*vec.x + vec.y*vec.y + vec.z*vec.z);
}

vec3 limit(vec3 vec, float max) {
  if (magSq(vec) > max*max) {
    vec = normalize(vec);
    vec *= max;
  }
  return vec;
}

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    float idParticle = uv.y * resolution.x + uv.x;

    vec4 tmpVel = texture2D( textureVelocity, uv );
    vec4 tmpPos = texture2D( texturePosition, uv );

    gl_FragColor = vec4( tmpVel.xyz, tmpVel.w );
}