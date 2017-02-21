#include <common>

uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;
uniform float cameraConstant;
uniform mat4 invMatrix;
uniform float density;

varying vec3 vPosition;
varying vec4 vColor;
varying vec2 vUv;
uniform float radius;

void main() {

    vec3 velTemp = normalize(texture2D( textureVelocity, uv )).xyz;
    vec4 posTemp = texture2D( texturePosition, uv );

    vec3 pos = posTemp.xyz;
    vec3 newPosition = position;

    newPosition = mat3( modelMatrix ) * newPosition;

    // rotatoin
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
      0    , 1, 0     ,
      sinry, 0, cosry
    );
    mat3 matz =  mat3(
      cosrz , sinrz, 0,
      -sinrz, cosrz, 0,
      0     , 0    , 1
    );

    newPosition = maty * matz * newPosition;
    newPosition += pos;


//    pos += position;

    // ポイントのサイズを決定
    //vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
    //gl_PointSize = 16.0;//0.5 * cameraConstant / ( - mvPosition.z );

    // uv情報の引き渡し
    vUv = uv;

    // 変換して格納
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
    vPosition = newPosition;



    vColor = vec4( 247.0/255.0, 40.0/255.0, 92.0/255.0, 1.0 ) * posTemp.w +
             vec4( 52.0/255.0, 38.0/255.0, 91.0/255.0, 1.0 ) * (1.0 - posTemp.w);


}