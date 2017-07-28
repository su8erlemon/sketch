/**
 * Set the colour to a lovely pink.
 * Note that the color is a 4D Float
 * Vector, R,G,B and A and each part
 * runs from 0.0 to 1.0
 */
uniform sampler2D texture1;
uniform float time;
varying vec2 vUv;

void main() {

  vec4 color = texture2D( texture1, vUv );
    gl_FragColor = color.r > 0.0 ? vec4(0.5+color.rrr*0.5,1.0):vec4(0.0,0.0,0.4,1.0);

//  gl_FragColor = color;

//  gl_FragColor = vec4(1.0,  // R
//                      0.0,  // G
//                      1.0,  // B
//                      1.0); // A
}