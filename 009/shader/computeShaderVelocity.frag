// For PI declaration:
#include <common>
#pragma glslify: snoise = require('glsl-noise/simplex/3d')

uniform float time;

float maxspeed = 5.0;
float maxforce = 0.5;

float speed = 1.;

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
    vec4 tmpAcc = texture2D( textureAcceleration, uv );

//    vec3 vel = vec3(tmpVel.xyz);
    vec3 vel = vec3(tmpVel.xyz);

    tmpPos.y<=0.0?(vel = vec3(vel.x*0.4,abs(vel.y)*0.4,vel.z*0.4)):vec3(0.0);
    (tmpPos.y<=0.001)?tmpVel.w += 1.0:tmpVel.w = 0.;

    vel += tmpAcc.xyz;
//    vel += vec3(0.0,0.0,0.0);

    //vel.y *= (tmpPos.w>0.0?1.0:-1.0);
    //abs(vel.y)<0.01?vel.y = 0.01*(vel.y>0.0?-1.0:1.0):0.;


//    float theta = snoise( tmpPos.xyz * (0.7) )*6.28;
    //vel -= vec3( cos(theta), sin(theta), 0.0 )*0.0001;

//    float theta = snoise( tmpPos.xyz * (0.3 + idParticle*0.0005 + cos(time)*0.1)  )*6.28;
//    vel += vec3( cos(theta), sin(theta), 0.0 ) * 0.01;

//    vel.z *= -0.;
//    vel.z -= 0.05;
//    vel.y += 5.;

    // vel.w is the life of the each particle
    gl_FragColor = vec4( vel.xyz, tmpVel.w );
}