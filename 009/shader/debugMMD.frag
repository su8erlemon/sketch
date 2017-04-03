/**
 * Set the colour to a lovely pink.
 * Note that the color is a 4D Float
 * Vector, R,G,B and A and each part
 * runs from 0.0 to 1.0
 */

uniform sampler2D texture1;

void main() {

//  gl_FragColor = texture2D( texture1, gl_PointCoord );
//  gl_FragColor = vec4(0.3,  // R
//                      0.1,  // G
//                      0.1,  // B
//                      0.3); // A
//      gl_FragColor = vec4( 63.0/255.0, 81.0/255.0, 100.0/255.0,  1.0 );
//      gl_FragColor = vec4( 1.0, 1.0, 1.0,  0.03 );
//    gl_FragColor = vec4( 1.0, 1.0, 1.0,  1.0 );
    gl_FragColor = vec4( 0.0, 1.0, 0.0,  .2 );

//    gl_FragColor = vColor;
}