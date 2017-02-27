// For PI declaration:
#include <common>
#pragma glslify: snoise = require('glsl-noise/simplex/3d')

uniform float time;

float maxspeed = 5.0;
float maxforce = 0.5;

float speed = 0.01;

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

    vec3 vel = vec3(tmpVel.zzw) * speed;

    float theta = snoise( tmpPos.xyz * (0.3 + idParticle*0.0005 + cos(time)*0.1)  )*6.28;
    vel += vec3( cos(theta), sin(theta), 0.0 ) * speed;

    vel.z *= -0.;
    vel.z += -0.020;
    vel.y += 0.005;


    gl_FragColor = vec4( vel.xyz, tmpVel.w );
}