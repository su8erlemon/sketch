/**
 * Set the colour to a lovely pink.
 * Note that the color is a 4D Float
 * Vector, R,G,B and A and each part
 * runs from 0.0 to 1.0
 */
uniform float mouseX;
uniform float mouseY;
uniform sampler2D texture1;

varying vec2 vUv;

void main() {
  gl_FragColor = vec4(1.0,  // R
                      0.0,  // G
                      1.0,  // B
                      1.0); // A

  // vec4 color = texture2D( texture1, vUv);
  // gl_FragColor = color;
}