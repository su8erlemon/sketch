#include <common>

uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;
uniform float cameraConstant;
uniform float density;
varying vec4 vColor;
varying vec2 vUv;
uniform float radius;


//uniform sampler2D texture1;
////varying vec4 vColor;
//
//attribute float index2;
//const float frag = 1.0 / 128.0;
//const float texShift = 0.5 * frag;

void main() {

    vec4 posTemp = texture2D( texturePosition, uv );
    vec4 velTemp = texture2D( textureVelocity, uv );
    vec3 pos = posTemp.xyz;
//    vColor = vec4( 63.0/255.0, 81.0/255.0, 100.0/255.0,  0.7 );

    float zzz = pos.z/-2.0;
//    vColor = vec4( 1.0 - velTemp.xxx * 50.0, 0.8  - zzz * 0.8);
//    vColor = vec4( 63.0/255.0, 81.0/255.0, 100.0/255.0,  0.7  - zzz * 0.7 );
    vColor = vec4( 240./255.0, 240./255.0, 240./255.0,  0.7  - zzz * 0.7 );

    pos += position;

//    float pu = fract(index2 * frag + texShift);
//    float pv = floor(index2 * frag) * frag + texShift;
//    vec3 tPosition = texture2D(texture1, vec2(pu, pv)).rgb * 2.0 - 1.0;

//    pos = tPosition;

    // ポイントのサイズを決定
    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
    gl_PointSize = 1.0;//0.5 * cameraConstant / ( - mvPosition.z );

    // uv情報の引き渡し
    vUv = uv;

    // 変換して格納
    gl_Position = projectionMatrix * mvPosition;

}