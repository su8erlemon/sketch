#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
#pragma glslify: cnoise2 = require(glsl-noise/classic/2d)

precision mediump float;

uniform float opacity;
uniform sampler2D tDiffuse;
uniform sampler2D normalScene;
uniform sampler2D tex1;
uniform sampler2D tex2;

uniform float mouseX;
uniform float mouseY;
uniform float time;
uniform float v;
uniform float v1;

uniform float weight[10];

varying vec2 vUv;
varying vec3 vPos;

float rand(vec2 n) {
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main() {

  // vec4 spec = texture2D( tDiffuse, vUv);

  vec4 spec = texture2D( tex1, vUv);
  float d = clamp(spec.x-v1, 0.0,1.0);
   if(d > 0.5001){
        d = 2.5 * (1.0 - d);
    }else if(d > 0.4999){
        d = 1.0;
    }else{
        d *= 2.5;
    }
    
    d *= d;
    d *= d;
    d *= d;
    d *= d;

  

  float tFrag = v;// + (1.0-d) * 1.;
  vec2 fc = vUv;
  vec3 destColor = vec3(0.0);

  // destColor = texture2D( tDiffuse, vUv).xyz;

  destColor += texture2D(tDiffuse, (fc + vec2(0.0, -9.0) * tFrag )).rgb * weight[9];
  destColor += texture2D(tDiffuse, (fc + vec2(0.0, -8.0) * tFrag )).rgb * weight[8];
  destColor += texture2D(tDiffuse, (fc + vec2(0.0, -7.0) * tFrag )).rgb * weight[7];
  destColor += texture2D(tDiffuse, (fc + vec2(0.0, -6.0) * tFrag )).rgb * weight[6];
  destColor += texture2D(tDiffuse, (fc + vec2(0.0, -5.0) * tFrag )).rgb * weight[5];
  destColor += texture2D(tDiffuse, (fc + vec2(0.0, -4.0) * tFrag )).rgb * weight[4];
  destColor += texture2D(tDiffuse, (fc + vec2(0.0, -3.0) * tFrag )).rgb * weight[3];
  destColor += texture2D(tDiffuse, (fc + vec2(0.0, -2.0) * tFrag )).rgb * weight[2];
  destColor += texture2D(tDiffuse, (fc + vec2(0.0, -1.0) * tFrag )).rgb * weight[1];
  destColor += texture2D(tDiffuse, (fc + vec2(0.0,  0.0) * tFrag )).rgb * weight[0];
  destColor += texture2D(tDiffuse, (fc + vec2(0.0,  1.0) * tFrag )).rgb * weight[1];
  destColor += texture2D(tDiffuse, (fc + vec2(0.0,  2.0) * tFrag )).rgb * weight[2];
  destColor += texture2D(tDiffuse, (fc + vec2(0.0,  3.0) * tFrag )).rgb * weight[3];
  destColor += texture2D(tDiffuse, (fc + vec2(0.0,  4.0) * tFrag )).rgb * weight[4];
  destColor += texture2D(tDiffuse, (fc + vec2(0.0,  5.0) * tFrag )).rgb * weight[5];
  destColor += texture2D(tDiffuse, (fc + vec2(0.0,  6.0) * tFrag )).rgb * weight[6];
  destColor += texture2D(tDiffuse, (fc + vec2(0.0,  7.0) * tFrag )).rgb * weight[7];
  destColor += texture2D(tDiffuse, (fc + vec2(0.0,  8.0) * tFrag )).rgb * weight[8];
  destColor += texture2D(tDiffuse, (fc + vec2(0.0,  9.0) * tFrag )).rgb * weight[9];

//  destColor += texture2D(tDiffuse, (fc + vec2(-.326,-.406) * tFrag )).rgb * weight[9];
//   destColor += texture2D(tDiffuse, (fc + vec2(-1.840,-.074) * tFrag )).rgb * weight[8];
//   destColor += texture2D(tDiffuse, (fc + vec2(-.696, .457) * tFrag )).rgb * weight[7];
//   destColor += texture2D(tDiffuse, (fc + vec2(-1.203, .621) * tFrag )).rgb * weight[6];
//   destColor += texture2D(tDiffuse, (fc + vec2( .962,-.195) * tFrag )).rgb * weight[5];
//   destColor += texture2D(tDiffuse, (fc + vec2( .473,-.480) * tFrag )).rgb * weight[4];
//   destColor += texture2D(tDiffuse, (fc + vec2( 1.519, .767) * tFrag )).rgb * weight[3];
//   destColor += texture2D(tDiffuse, (fc + vec2( .185,-.893) * tFrag )).rgb * weight[2];
//   destColor += texture2D(tDiffuse, (fc + vec2( 1.507, .064) * tFrag )).rgb * weight[1];
//   destColor += texture2D(tDiffuse, (fc + vec2( .896, .412) * tFrag )).rgb * weight[0];
//   destColor += texture2D(tDiffuse, (fc + vec2(-.322,-.933) * tFrag )).rgb * weight[1];
//   destColor += texture2D(tDiffuse, (fc + vec2(-1.792,-.598) * tFrag )).rgb * weight[2];
//   destColor += texture2D(tDiffuse, (fc + vec2(-.326,-.406) * tFrag )).rgb * weight[3];
//   destColor += texture2D(tDiffuse, (fc + vec2(-.840,-.074) * tFrag )).rgb * weight[4];
//   destColor += texture2D(tDiffuse, (fc + vec2(-1.696, .457) * tFrag )).rgb * weight[5];
//   destColor += texture2D(tDiffuse, (fc + vec2(-.203, .621) * tFrag )).rgb * weight[6];
//   destColor += texture2D(tDiffuse, (fc + vec2( .962,-.195) * tFrag )).rgb * weight[7];
//   destColor += texture2D(tDiffuse, (fc + vec2( 1.507, .064) * tFrag )).rgb * weight[8];
//   destColor += texture2D(tDiffuse, (fc + vec2( .896, .412) * tFrag )).rgb * weight[9];


  
  // gl_FragColor = vec4( destColor, 1.0 );

    
    // if( d > 0.8 ) d = 1.0;
    // d *= ;
    // gl_FragColor = vec4(vec3(d),1.0);

  // vec2 vUv2 = vec2(vUv.x * destColor.x * 0.1, vUv.y);
  
  d = mix(0.0,1.0,d);
  vec4 normalScene1 = texture2D( normalScene, vUv );

  // d *= normalScene1.x * 10.0;

  gl_FragColor = vec4(vec3(normalScene1.xyz * d + destColor.xyz * (1.0-d) ),1.0);
  // gl_FragColor = gl_FragColor * gl_FragColor;
  
  // gl_FragColor.r *= 0.9;
  // gl_FragColor.b *= 1.2;
  // gl_FragColor.b *= 0.7;
  // gl_FragColor.r += rand(vUv+time)*0.2;
  // gl_FragColor.g += rand(vUv+time)*0.2;
  // gl_FragColor.b += rand(vUv+time)*0.2;

  // gl_FragColor = gl_FragColor * gl_FragColor;
  // gl_FragColor = vec4(vec3(d),1.0);
  // gl_FragColor = vec4(normalScene1.xyz,1.0);
  // gl_FragColor = vec4(normalScene1.xyz,1.0);

  // gl_FragColor = vec4( destColor, 1.0 );
}