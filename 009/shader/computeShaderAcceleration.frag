// For PI declaration:
#include <common>

uniform float time;

uniform sampler2D texture1;
uniform sampler2D texture2;

const float frag = 1.0 / 128.0;
const float texShift = 0.5 * frag;

float rand1(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

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

    vec4 tmpVel = texture2D( textureVelocity,     uv );
    vec4 tmpPos = texture2D( texturePosition,     uv );
    vec4 tmpAcc = texture2D( textureAcceleration, uv );

    float index = tmpPos.w;
    float pu = fract(index * frag + texShift);
    float pv = floor(index * frag) * frag + texShift;
    vec3 tmpDan = texture2D( texture1, vec2(pu, pv)).rgb * 2.0 - 1.0;
    vec3 tmpDan2 = texture2D( texture2, vec2(pu, pv)).rgb * 2.0 - 1.0;

//    vec3 acc = ((tmpPos.xyz - tmpVel.xyz) - tmpDan) * 0.001;
//    vec3 acc = vec3(tmpAcc.xyz);
//    vec3 acc = vec3( 0.0000, -0.001, -0.001);
//    vec3 acc = vec3( 0.0, 0.0, 0.0);
//    vec3 acc = (-tmpDan - (tmpPos.xyz + tmpVel.xyz)) * 0.01;

//    vec3 acc = (tmpDan-tmpDan2 )*0.08 + vec3( 0.0000, -0.001, 0.000);


    vec3 acc = tmpAcc.xyz;
    vec3 dx = limit(tmpDan-tmpDan2,0.06);
    (tmpVel.w>10.)?(acc = (dx )*0.015 + vec3( 0.0000, -0.001-rand1(tmpDan.xz)*0.0005, 0.000)):vec3(0.0);
//    (tmpVel.w>10.)?(acc = (tmpDan-tmpDan2 )*0.001 + vec3( 0.0000, -0.0001-rand1(tmpDan.xz)*0.00005, -0.001)):vec3(0.0);



    (tmpVel.w>10.)?tmpAcc.w = 0.0:tmpAcc.w += 1.0;


    // acc.w is the time of after particle born
    gl_FragColor = vec4( acc.xyz, tmpAcc.w );

}