/**
 * Set the colour to a lovely pink.
 * Note that the color is a 4D Float
 * Vector, R,G,B and A and each part
 * runs from 0.0 to 1.0
 */

//varying vec4 vPosition;
varying vec3 vColor;

void main() {
//  gl_FragColor = vec4(1.0,  // R
//                      0.0,  // G
//                      1.0,  // B
//                      1.0); // A
  gl_FragColor = vec4(vColor,1.0);
}