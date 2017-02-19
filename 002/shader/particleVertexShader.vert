#include <common>

uniform sampler2D texturePosition;
uniform float cameraConstant;
uniform float density;
varying vec4 vColor;
varying vec2 vUv;
uniform float radius;

void main() {

    vec4 posTemp = texture2D( texturePosition, uv );
    vec3 pos = posTemp.xyz;
    vColor = vec4( 63.0/255.0, 81.0/255.0, 100.0/255.0, 0.7 );

    pos += position;

    // ポイントのサイズを決定
    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
    //gl_PointSize = 16.0;//0.5 * cameraConstant / ( - mvPosition.z );

    // uv情報の引き渡し
    vUv = uv;

    // 変換して格納
    gl_Position = projectionMatrix * mvPosition;

}