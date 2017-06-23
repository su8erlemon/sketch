precision highp float;

/**
 * Set the colour to a lovely pink.
 * Note that the color is a 4D Float
 * Vector, R,G,B and A and each part
 * runs from 0.0 to 1.0
 */

uniform float time;

uniform sampler2D tMatCap;
varying vec3 vNormal;
varying vec3 vPostion;

void main() {

  vec3 e = normalize( vPostion );
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

  gl_FragColor = vec4( base, 1.0 );

}