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
varying vec3 vNormal;
varying vec3 vPostion;
varying mat4 vModelViewMatrix;
varying mat3 vNormalMatrix;

varying vec2 vN2;
varying vec3 e;
varying vec3 n;

void main() {



//  vec2 vUv2 = vUv + vec2(time,0.0);
//  vec2 vUv2 = vUv + vec2(0.0,time*0.1);
//  vec2 vUv2 = vUv + vec2(time*0.1,time*0.1);
//  vec4 color = texture2D( texture1, vUv2 );
//  if( color.x <= 0.9 )discard;


  vNormalMatrix;
  vNormal;
  vUv;

//  gl_FragColor = vec4( vNormal, 1. );

  vec4 p = vec4( vPostion, 1. );
  vec3 e = normalize( vec3( vModelViewMatrix * p ) );



/*

  // calc in fragment shader -> it becomes only Flat shading

  vec3 dx = dFdx(p.xyz);
  vec3 dy = dFdy(p.xyz);
  vec3 fnormal = normalize(cross(normalize(dx), normalize(dy)));
  vec3 n = normalize( vNormalMatrix * fnormal );

*/

  vec3 n = normalize( vNormal );

  vec3 r = reflect( e, n );
  float m = 2. * sqrt(
    pow( r.x, 2. ) +
    pow( r.y, 2. ) +
    pow( r.z + 1., 2. )
  );
  vec2 vN = r.xy / m + .5;

  vec3 base = texture2D( tMatCap, vN ).rgb;
  gl_FragColor = vec4( base, 1. );


// debug
//  gl_FragColor = vec4(normalize(vNormal),1.0);
//  gl_FragColor = vec4(vNormalMatrix * fnormal,1.0);


//  gl_FragColor = color;
//  gl_FragColor = vec4(color.xyz + (1.-(vNormal*10.0)), 1.0);
//  gl_FragColor = vec4(vUv.x,  // R
//                      vUv.y,  // G
//                      0.8,  // B
//                      1.0); // A
}