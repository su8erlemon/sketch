#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
#pragma glslify: cnoise2 = require(glsl-noise/classic/2d)

precision mediump float;

uniform float opacity;
uniform sampler2D tDiffuse;
uniform sampler2D tDiffusePrev;
uniform sampler2D tex1;
uniform sampler2D tex2;

uniform float mouseX;
uniform float mouseY;
uniform float time;
uniform float v;

uniform float weight[10];

varying vec2 vUv;
varying vec3 vPos;

void main() {
  
  vec4 spec = texture2D( tDiffuse, vUv);

  float tFrag = v;
  vec2 fc = vUv;
  vec3 destColor = vec3(0.0);
  destColor = texture2D( tDiffuse, vUv).xyz;
  // destColor += texture2D(tDiffuse, (fc + vec2(-9.0, 0.0) * tFrag )).rgb * 0.5;//weight[9];
  destColor += texture2D(tDiffuse, (fc + vec2(-8.0, 0.0) * tFrag )).rgb * weight[8];
  // destColor += texture2D(tDiffuse, (fc + vec2(-7.0, 0.0) * tFrag )).rgb * weight[7];
  // destColor += texture2D(tDiffuse, (fc + vec2(-6.0, 0.0) * tFrag )).rgb * weight[6];
  // destColor += texture2D(tDiffuse, (fc + vec2(-5.0, 0.0) * tFrag )).rgb * weight[5];
  // destColor += texture2D(tDiffuse, (fc + vec2(-4.0, 0.0) * tFrag )).rgb * weight[4];
  // destColor += texture2D(tDiffuse, (fc + vec2(-3.0, 0.0) * tFrag )).rgb * weight[3];
  // destColor += texture2D(tDiffuse, (fc + vec2(-2.0, 0.0) * tFrag )).rgb * weight[2];
  // destColor += texture2D(tDiffuse, (fc + vec2(-1.0, 0.0) * tFrag )).rgb * weight[1];
  // destColor += texture2D(tDiffuse, (fc + vec2( 0.0, 0.0) * tFrag )).rgb * weight[0];
  // destColor += texture2D(tDiffuse, (fc + vec2( 1.0, 0.0) * tFrag )).rgb * weight[1];
  // destColor += texture2D(tDiffuse, (fc + vec2( 2.0, 0.0) * tFrag )).rgb * weight[2];
  // destColor += texture2D(tDiffuse, (fc + vec2( 3.0, 0.0) * tFrag )).rgb * weight[3];
  // destColor += texture2D(tDiffuse, (fc + vec2( 4.0, 0.0) * tFrag )).rgb * weight[4];
  // destColor += texture2D(tDiffuse, (fc + vec2( 5.0, 0.0) * tFrag )).rgb * weight[5];
  // destColor += texture2D(tDiffuse, (fc + vec2( 6.0, 0.0) * tFrag )).rgb * weight[6];
  // destColor += texture2D(tDiffuse, (fc + vec2( 7.0, 0.0) * tFrag )).rgb * weight[7];
  // destColor += texture2D(tDiffuse, (fc + vec2( 8.0, 0.0) * tFrag )).rgb * weight[8];
  // destColor += texture2D(tDiffuse, (fc + vec2( 9.0, 0.0) * tFrag )).rgb * weight[9];

  // destColor += texture2D(tDiffuse, (fc + vec2(-.326,-.406) * tFrag )).rgb * weight[9];
  // destColor += texture2D(tDiffuse, (fc + vec2(-.840,-.074) * tFrag )).rgb * weight[8];
  // destColor += texture2D(tDiffuse, (fc + vec2(-.696, .457) * tFrag )).rgb * weight[7];
  // destColor += texture2D(tDiffuse, (fc + vec2(-.203, .621) * tFrag )).rgb * weight[6];
  // destColor += texture2D(tDiffuse, (fc + vec2( .962,-.195) * tFrag )).rgb * weight[5];
  // destColor += texture2D(tDiffuse, (fc + vec2( .473,-.480) * tFrag )).rgb * weight[4];
  // destColor += texture2D(tDiffuse, (fc + vec2( .519, .767) * tFrag )).rgb * weight[3];
  // destColor += texture2D(tDiffuse, (fc + vec2( .185,-.893) * tFrag )).rgb * weight[2];
  // destColor += texture2D(tDiffuse, (fc + vec2( .507, .064) * tFrag )).rgb * weight[1];
  // destColor += texture2D(tDiffuse, (fc + vec2( .896, .412) * tFrag )).rgb * weight[0];
  // destColor += texture2D(tDiffuse, (fc + vec2(-.322,-.933) * tFrag )).rgb * weight[1];
  // destColor += texture2D(tDiffuse, (fc + vec2(-.792,-.598) * tFrag )).rgb * weight[2];
  // destColor += texture2D(tDiffuse, (fc + vec2(-.326,-.406) * tFrag )).rgb * weight[3];
  // destColor += texture2D(tDiffuse, (fc + vec2(-.840,-.074) * tFrag )).rgb * weight[4];
  // destColor += texture2D(tDiffuse, (fc + vec2(-.696, .457) * tFrag )).rgb * weight[5];
  // destColor += texture2D(tDiffuse, (fc + vec2(-.203, .621) * tFrag )).rgb * weight[6];
  // destColor += texture2D(tDiffuse, (fc + vec2( .962,-.195) * tFrag )).rgb * weight[7];
  // destColor += texture2D(tDiffuse, (fc + vec2( .507, .064) * tFrag )).rgb * weight[8];
  // destColor += texture2D(tDiffuse, (fc + vec2( .896, .412) * tFrag )).rgb * weight[9];


  gl_FragColor = vec4( destColor, 1.0 );

  // gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
  // gl_FragColor = spec;

}