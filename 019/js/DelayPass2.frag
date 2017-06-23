//#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
#pragma glslify: cnoise2 = require(glsl-noise/classic/2d)

precision mediump float;

uniform float opacity;
uniform sampler2D tDiffuse;
uniform sampler2D tDiffusePrev;

uniform float mouseX;
uniform float mouseY;
uniform float time;

varying vec2 vUv;

vec4 swirl(sampler2D tex, vec2 uv)
{

    float radius = 0.2;
    float angle = 0.5;

    vec2 center = vec2(mouseX, mouseY);
    vec2 tc = (uv * 1.0) - center;
    float dist = length(tc);
    if( dist < radius )
    {
        float percent = (radius - dist) / radius;
        float theta = percent * percent * angle * 8.0;
        float s = sin(theta);
        float c = cos(theta);
        tc = vec2(dot(tc, vec2(c, -s)), dot(tc, vec2(s, c)));
    }
    tc += center;
    return texture2D(tex, tc / 1.0);
}

void main() {

//    vec2 tc = (vUv * 1.0) - vec2(mouseX, mouseY);
//    float dist = length(tc);

//    if( dist < 0.3 )
//    {
//      gl_FragColor = vec4(1.,0.0,0.0,1.0);
//    }else{
//      gl_FragColor = vec4(0.,1.0,0.0,1.0);
//    }
//  vec4 texel = swirl( tDiffuse, vUv );

//  vec4 texel2 = texture2D( tDiffuse, vUv);
  vec4 texel2 = texture2D( tDiffusePrev, vUv);
//  vec4 texel = texture2D( tDiffuse, vUv + vec2(mouseX,mouseY) * cnoise2(vec2(vUv) * 2.0) );

  // "vec4 texel2 = texture2D( tDiffusePrev, vUv );",

//  vec2 vUv2 = vUv;
//  float dist = distance(vec2(mouseX,mouseY), vUv2);
//  vUv2 -= vec2(mouseX,mouseY);
//  if (dist < 0.5){
//     float percent = 1.0 + ((0.5 - dist) / 0.5) * 1.0;
//     vUv2 = vUv2 * percent;
//  }
//  vUv2 += vec2(mouseX,mouseY);
//  vec4 texel = texture2D( tDiffuse, vUv2);

//   gl_FragColor = opacity * (texel*0.5 + texel2*0.5);
//   gl_FragColor = opacity * (texel*0.5 + texel2*0.5);
  // "gl_FragColor = texel + texel2*0.5;",
  // "gl_FragColor = texel + vec4(0.0,0.0,0.0,1.0);",
//   gl_FragColor = vec4(sin(time)+1.,0.0,0.0,1.0);
   gl_FragColor = vec4(texel2.xyz,1.0);
//  gl_FragColor = vec4(texel2.xyz,0.1);
  // "gl_FragColor = opacity * texel;",
  // "gl_FragColor = vec4(1.0,0.0,0.0,0.5);",

}