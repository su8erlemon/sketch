// For PI declaration:
#include <common>
#pragma glslify: snoise = require('glsl-noise/simplex/3d')

uniform float time;
uniform float t1;
uniform float t2;

float maxspeed = 5.0;
float maxforce = 0.5;

float speed = 0.3;

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

//    speed += sin(time)*0.2;

    //vec3 vel = tmpVel.xyz * snoise(tmpPos.xyz)*1.0;

//    vec3 central = vec3( 0., 0., 0. );
//		vec3 dir = tmpPos.xyz - central;

    float theta = snoise( tmpPos.xyz * (0.019 + cos(time)*0.01) )*6.28;
    vel += vec3( cos(theta), sin(theta), 0.0 ) * speed;




//    if ( length( vel ) > 200.0 ) {
//				vel = normalize( vel ) * 100.0;
//		}

//    vec3 target = vec3( 100.*cos(t1*time+tmpVel.w*6.28), 100.*sin(t2*time+tmpVel.w*6.28), tmpPos.w*2.0-1.0);
//    vec3 target = vec3( 100.*cos(time+tmpVel.w*6.28), 100.*sin(time+tmpVel.w*6.28), tmpPos.w*0.2-0.1);

//    target += tmpVel.www * 0.00001;
//    maxspeed += tmpPos.w * tmpVel.w *0.002;
//    maxforce += tmpPos.w * tmpVel.w *0.1;

//    vec3 desired = target - tmpPos.xyz;
//    desired = normalize(desired) * maxspeed;
//    vec3 vel = desired - vec3(0.1,0.1,0.1);

//    vel *= 3.0;

//    vel -= normalize( dir )*0.1;
//        vel *= vec3(
//          snoise(tmpPos.xxx),
//          snoise(tmpPos.yyy),
//          snoise(tmpPos.zzz)
//        )*2.0;

//    vel = limit(vel, maxforce);



//    vel += vec3(
//      snoise(tmpPos.xxx),
//      snoise(tmpPos.yyy),
//      snoise(tmpPos.zzz)
//    )*1.0;

    gl_FragColor = vec4( vel.xyz, tmpVel.w );
}