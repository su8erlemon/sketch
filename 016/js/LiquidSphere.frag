precision highp float;

/**
 * Set the colour to a lovely pink.
 * Note that the color is a 4D Float
 * Vector, R,G,B and A and each part
 * runs from 0.0 to 1.0
 */

uniform sampler2D texture1;

varying vec2 vUv;
uniform float time;

uniform sampler2D tMatCap;
uniform sampler2D tMatCap2;
varying vec3 vNormal;
varying vec3 vPostion;
varying mat4 vModelViewMatrix;
varying mat3 vNormalMatrix;

uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

uniform float scrollPer;

varying vec2 vN2;
varying vec3 e;
varying vec3 n;

void main() {



  vec2 vUv2 = vUv + vec2(time*0.3,time*0.3);
//  vec2 vUv2 = vUv + vec2(0.0,time*0.1);
//  vec2 vUv2 = vUv + vec2(time*0.3,time*0.3);
  vec4 color = texture2D( texture1, vUv2 );
//
  if( color.x <= 0.9 )discard;


  vNormalMatrix;
  vNormal;
  vUv;

  vec4 p = vec4( vPostion, 1. );
  vec3 e = normalize( vec3( vModelViewMatrix * p ) );


  vec3 n = normalize( vNormal );

  vec3 r = reflect( e, n );
  float m = 2. * sqrt(
    pow( r.x, 2. ) +
    pow( r.y, 2. ) +
    pow( r.z + 1., 2. )
  );
  vec2 vN = r.xy / m + .5;

  vec3 base;
  base = texture2D( tMatCap, vN ).rgb;

  gl_FragColor = vec4( base, 1. );

  float depth = gl_FragCoord.z / gl_FragCoord.w;
  float fogFactor = smoothstep( fogNear, fogFar, depth );
  gl_FragColor = mix( gl_FragColor, vec4( fogColor, 0.0 ), fogFactor );

}