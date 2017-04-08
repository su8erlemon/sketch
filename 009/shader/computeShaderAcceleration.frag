// For PI declaration:
#include <common>

uniform float time;

uniform sampler2D texture1;
const float frag = 1.0 / 128.0;
const float texShift = 0.5 * frag;

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

//    vec3 acc = ((tmpPos.xyz - tmpVel.xyz) - tmpDan) * 0.001;
    vec3 acc = vec3(tmpAcc.xyz);
//    vec3 acc = vec3( 0.0000, -0.001, -0.001);
//    vec3 acc = vec3( 0.0, 0.0, 0.0);
//    vec3 acc = (-tmpDan - (tmpPos.xyz + tmpVel.xyz)) * 0.01;



    (tmpVel.w>10.)?tmpAcc.w = 0.0:tmpAcc.w += 1.0;


    // acc.w is the time of after particle born
    gl_FragColor = vec4( acc.xyz, tmpAcc.w );

}