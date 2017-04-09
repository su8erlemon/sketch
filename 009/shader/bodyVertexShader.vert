#include <common>

uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;
uniform sampler2D textureAcceleration;
uniform float cameraConstant;
uniform float density;

varying vec3 vPosition;
varying vec4 vColor;
varying vec2 vUv;

uniform float radius;
//uniform int audioGain[ 4 ];


uniform sampler2D texture1;
//varying vec4 vColor;

attribute float bodyIndex;
attribute vec3 bodyRotation;

const float frag = 1.0 / 128.0;
const float texShift = 0.5 * frag;

float rand2(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {

    vec4 velTemp = texture2D( textureVelocity, uv );
//    vec4 accTemp = texture2D( textureAcceleration, uv );
    vec4 tmpPos = texture2D( texturePosition, uv );

//    vColor = vec4( 63.0/255.0, 81.0/255.0, 100.0/255.0,  0.7 );
//    vColor = vec4( 1.0 - velTemp.xxx * 50.0, 0.8  - zzz * 0.8);
//    vColor = vec4( 63.0/255.0, 81.0/255.0, 100.0/255.0,  0.7  - zzz * 0.7 );
//    vColor = vec4( 240./255.0, 240./255.0, 240./255.0, 1.0 );
//    vColor = vec4( .0, 240./255.0, .0,  0.3  - zzz * 0.3);



    float index = tmpPos.w*100.0;//rand(tmpPos.xy)*12200.;
    float pu = fract(index * frag + texShift);
    float pv = floor(index * frag) * frag + texShift;
    vec3 tmpDan = texture2D( texture1, vec2(pu, pv)).rgb * 2.0 - 1.0;







    //pos += position;

    // pos is the position of each box
//    vec3 pos = posTemp.xyz;

    // position is box's position. it has 6 faces
    vec3 newPosition = position;
//
    newPosition = mat3( modelMatrix ) * newPosition;
//
//    // rotatoin
    float aa = rand2(tmpPos.ww);
    velTemp = vec4(aa,aa,aa,0.0);
    velTemp.z *= -1.;
    float xz = length( velTemp.xz );
    float xyz = 1.;
    float x = sqrt( 1. - velTemp.y * velTemp.y );
    float cosry = velTemp.x / xz;
    float sinry = velTemp.z / xz;
    float cosrz = x / xyz;
    float sinrz = velTemp.y / xyz;
    mat3 maty =  mat3(
      cosry, 0, -sinry,
      0    , aa, 0  ,
      sinry, 0, cosry
    );
    mat3 matz =  mat3(
      cosrz , sinrz, 0,
      -sinrz, cosrz, 0,
      0     , 0    , 1
    );

    newPosition = maty * matz * newPosition;


//    newPosition += pos;



//    tmpDan.x += rand(tmpPos.yx)*0.025-0.0125;
//    tmpDan.y += rand(tmpPos.xz)*0.025-0.0125;
//    tmpDan.z += rand(tmpPos.xz)*0.025-0.0125;


    newPosition += tmpDan;

//    newPosition += vec3( audioGain[0] )*0.1;

    // ポイントのサイズを決定
//    vec4 mvPosition =
//    gl_PointSize = 2.0;//0.5 * cameraConstant / ( - mvPosition.z );

    // uv情報の引き渡し
    vUv = uv;

    // 変換して格納
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

    vPosition = newPosition;

    //vColor = vec4( 1.0, 1.0, 1.0 - accTemp.w * 0.03 , 1.0 );

//    vColor = vec4( 0.0/255.0, 250.0/255.0, 92.0/255.0, 1.0 );
//    vColor = vec4( 247.0/255.0, 40.0/255.0, 92.0/255.0, 1.0 );
    vColor = vec4( newPosition-bodyRotation*0.1, 1.0 );


}