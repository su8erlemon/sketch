/**
 * Set the colour to a lovely pink.
 * Note that the color is a 4D Float
 * Vector, R,G,B and A and each part
 * runs from 0.0 to 1.0
 */

varying float vIndex;
varying float vColor;
varying vec2 vUv;
uniform float drawuv;
uniform float drawTexture;
uniform float time;

uniform sampler2D lineTexture;

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
}

void main() {

  if ( drawuv == 1.0 ){
    gl_FragColor = vec4(vUv.x,
                      vUv.y,
                      0.0,
                      1.0); // A
  }else if(drawTexture == 1.0){
    gl_FragColor = texture2D(lineTexture, vUv+vec2(time,0.0));
  }else{
    gl_FragColor = vec4(220./255.,  // R
                      42./255.,  // G
                      41./255.,  // G
                      1.0); // A
  }

  // gl_FragColor = vec4(sin(vUv.y*3.14) * max(0.3,sin(vUv.x*2.0)),
  //                     0.0,
  //                     0.0,
  //                     1.0); // A


  // gl_FragColor = vec4(random(vec2(vIndex*0.9,vIndex*0.1)),  // R
  //                     random(vec2(vIndex*0.5,vIndex*0.3)),  // G
  //                     random(vec2(vIndex*0.1,vIndex*0.5)),  // B
  //                     1.0); // A

}