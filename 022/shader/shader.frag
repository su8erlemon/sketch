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
uniform sampler2D mtex1;
uniform sampler2D mtex2;
varying vec3 vNormal;
varying vec3 vPostion;
varying mat4 vModelViewMatrix;
varying mat3 vNormalMatrix;

varying vec3 vWorldPosition;
uniform vec3 lightPosition1;
uniform vec3 lightPosition2;

varying vec2 vN2;
varying vec3 e;
varying vec3 n;


void main() {

  vNormalMatrix;
  vNormal;
  vUv;

  vec3 mNormal    = (texture2D(mtex2, vUv) * 2.0 - 1.0).rgb;

//  float c = 0.35 + max(0.0, dot(vNormal, lightDirection)) * 0.4 * shadowMask.x;

  vec4 p = vec4( vPostion, 1. );
  vec3 e = normalize( vec3( vModelViewMatrix * p ) );
  vec3 n = normalize( vNormal );

//  float c = max(0.0, dot(n, lightDirection));
  vec3 c = vec3(0.0);
//  c += max(0.0, dot(normalize(vNormal), normalize(lightPosition1))) * vec3(1.0,1.0,0.8);
  c += max(0.0, dot(normalize(vNormal), normalize(lightPosition2)));

//  c += max(0.0, dot(normalize(mNormal), normalize(lightPosition1))) * max(0.0, dot(normalize(vNormal), normalize(lightPosition1)));
//  c += max(0.0, dot(normalize(mNormal), normalize(lightPosition2))) * max(0.0, dot(normalize(vNormal), normalize(lightPosition2)));

//  c += max(0.0, dot(normalize(mNormal), normalize(lightPosition2)));

  vec3 r = reflect( e, n );
  float m = 2. * sqrt(
    pow( r.x, 2. ) +
    pow( r.y, 2. ) +
    pow( r.z + 1., 2. )
  );
  vec2 vN = r.xy / m + .5;

  vec3 base = texture2D( tMatCap, vN ).rgb;
//  vec3 base = texture2D( tMatCap, vUv ).rgb;
  gl_FragColor = vec4( base + c, 1.0 );
//  gl_FragColor = vec4( vNormal , 1.0 );
//  gl_FragColor = vec4( c, 1.0 );

//  vec3 base2 = texture2D( tMatCap2, vUv ).rgb;
//  gl_FragColor = vec4( base2, 1.0 );
//
//  vec3 base3 = texture2D( mtex2, vUv ).rgb;
//  gl_FragColor = vec4( base3, 1.0 );

//  gl_FragColor = vec4( mNormal, 1.0 );

//  vec3 base2 = texture2D( tMatCap2, vN ).rgb;
//  gl_FragColor = vec4( base2, 1.0 );



}