/**
 * Set the colour to a lovely pink.
 * Note that the color is a 4D Float
 * Vector, R,G,B and A and each part
 * runs from 0.0 to 1.0
 */
uniform sampler2D texture1;
varying vec2 vUv;
varying float vNormal;
uniform float time;

void main() {


//  vec2 vUv2 = vUv + vec2(time,0.0);
//  vec2 vUv2 = vUv + vec2(0.0,time*0.1);
  vec2 vUv2 = vUv + vec2(time*0.1,time*0.1);

  vec4 color = texture2D( texture1, vUv2 );

  if( color.x <= 0.9 )discard;

//  gl_FragColor = color;

//  gl_FragColor = vec4(color.xyz + (1.-(vNormal*10.0)), 1.0);
  gl_FragColor = vec4(vUv.x,  // R
                      vUv.y,  // G
                      0.8,  // B
                      1.0); // A
}