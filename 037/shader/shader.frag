/**
 * Set the colour to a lovely pink.
 * Note that the color is a 4D Float
 * Vector, R,G,B and A and each part
 * runs from 0.0 to 1.0
 */

varying vec3 vNormal;
varying vec3 vPosition;
varying float dd;
void main() {
  gl_FragColor = vec4(0.0,//vPosition.y+0.5,  // R
                      0.0,  // G
                      0.5+dd*3.0,  // B
                      1.0); // A
   gl_FragColor = vec4(vNormal*0.4+0.6,  // B
                       1.0); // A
}