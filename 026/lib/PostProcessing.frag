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

varying vec2 vUv;
varying vec3 vPos;

float rand(vec2 n) {
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}


// vec4 swirl(sampler2D tex, vec2 uv)
// {

//     float radius = 0.2;

//     vec4 tex2 = texture2D(tex, uv);

//     float angle = tex2.x * 0.01;

//     vec2 center = vec2(mouseX, mouseY);
//     vec2 tc = (uv * 1.0) - center;
//     float dist = length(tc);
// //    if( dist < radius )
// //    {
//         float percent = (radius - dist) / radius;
//         float theta = percent * percent * angle * 8.0;
//         float s = sin(theta);
//         float c = cos(theta);
//         tc = vec2(dot(tc, vec2(c, -s)), dot(tc, vec2(s, c)));
// //    }
//     tc += center;
//     return texture2D(tex, tc / 1.0);
// }

void main() {

//    vec2 tc = (vUv * 1.0) - vec2(mouseX, mouseY);
//    float dist = length(tc);

//    if( dist < 0.3 )
//    {
//      gl_FragColor = vec4(1.,0.0,0.0,1.0);
//    }else{
//      gl_FragColor = vec4(0.,1.0,0.0,1.0);
//    }
//  vec4 texel2 = swirl( tDiffuse, vUv );

  // vec2 vUv2 = vUv;
  // vUv2.x *= 0.09718136091;
  // vUv2.x *= 2.;
  // vec4 texel3 = texture2D( tDiffusePrev, vUv);
  
  
  // vec4 texel3 = texture2D( textTex, vUv * 2.4 + vec2(-0.7,-0.7) ) ;
  // vec2 dd = vec2(1.0-texel3.xy) * -cnoise2(vec2(vUv)) * 0.01;
  vec2 dd = vec2(0.0,0.0);
  float v = 0.004;
  // vec4 texel1 = texture2D( tDiffuse, vUv );
  vec2 vUv2 = vUv * 1.03;
  vec4 sum = vec4( 0.0 );
  sum += texture2D( tDiffuse, vec2( vUv2.x, vUv2.y - 4.0 * v ) ) * 0.051/2.;
  sum += texture2D( tDiffuse, vec2( vUv2.x, vUv2.y - 3.0 * v ) ) * 0.0918/2.;
  sum += texture2D( tDiffuse, vec2( vUv2.x, vUv2.y - 2.0 * v ) ) * 0.12245/2.;
  sum += texture2D( tDiffuse, vec2( vUv2.x, vUv2.y - 1.0 * v ) ) * 0.1531/2.;
  sum += texture2D( tDiffuse, vec2( vUv2.x, vUv2.y ) ) * 0.1633/2.;
  sum += texture2D( tDiffuse, vec2( vUv2.x, vUv2.y + 1.0 * v ) ) * 0.1531/2.;
  sum += texture2D( tDiffuse, vec2( vUv2.x, vUv2.y + 2.0 * v ) ) * 0.12245/2.;
  sum += texture2D( tDiffuse, vec2( vUv2.x, vUv2.y + 3.0 * v ) ) * 0.0918/2.;
  sum += texture2D( tDiffuse, vec2( vUv2.x, vUv2.y + 4.0 * v ) ) * 0.051/2.;

  sum += texture2D( tDiffuse, vec2( vUv2.x - 4.0 * v, vUv2.y ) ) * 0.051/2.;
  sum += texture2D( tDiffuse, vec2( vUv2.x - 3.0 * v, vUv2.y ) ) * 0.0918/2.;
  sum += texture2D( tDiffuse, vec2( vUv2.x - 2.0 * v, vUv2.y ) ) * 0.12245/2.;
  sum += texture2D( tDiffuse, vec2( vUv2.x - 1.0 * v, vUv2.y ) ) * 0.1531/2.;
  sum += texture2D( tDiffuse, vec2( vUv2.x, vUv2.y ) ) * 0.1633/2.;
  sum += texture2D( tDiffuse, vec2( vUv2.x + 1.0 * v , vUv2.y) ) * 0.1531/2.;
  sum += texture2D( tDiffuse, vec2( vUv2.x + 2.0 * v , vUv2.y) ) * 0.12245/2.;
  sum += texture2D( tDiffuse, vec2( vUv2.x + 3.0 * v , vUv2.y) ) * 0.0918/2.;
  sum += texture2D( tDiffuse, vec2( vUv2.x + 4.0 * v , vUv2.y) ) * 0.051/2.;
  
  vec4 texelC = texture2D( tDiffuse, (vUv) - vec2(0.002,0.002) ) ;    
  vec4 texelA = texture2D( tDiffuse, (vUv + cnoise2(vec2(vUv)* 40.0)* 0.002)) ;
  vec4 texelA1 = texture2D( tDiffuse, (vUv + cnoise2(vec2(vUv)* 40.0)* 0.004) * vec2(1.03,1.03) + vec2(0.004,0.002)  ) ;
  // vec4 texel3 = texture2D( tDiffuse, vUv + cnoise2(vec2(vUv)*-2.2)* 0.005 ) ;
  // vec4 texel2 = texture2D( tDiffuse, vec2(vUv.y, vUv.x) + dd) ;
  // vec4 texel4 = texture2D( tDiffuse, vUv * vec2(mix(0.0,1.0,cnoise2(vec2(vUv.x*3.0,vUv.y*3.0))) )) ;
  // vec4 texel2 = texture2D( tDiffuse, vec2(1.0-vUv.x,1.0-vUv.y) + vec2(0.0,0.3) ) ;
  // vec4 texel3 = texture2D( tDiffuse, vec2(vUv.x,vUv.y) + vec2(0.0,-0.3) ) ;
  // vec4 texel3 = texture2D( tDiffuse, vec2(vUv.x,vUv.y) + vec2(0.1,0.0) ) ;

//  vec4 texel = texture2D( tDiffuse, vUv + vec2(mouseX,mouseY) * cnoise2(vec2(vUv) * 2.0) );

  // "vec4 texel2 = texture2D( tDiffusePrev, vUv );",

//  vec2 vUv2 = vUv;
//  float dist = distance(vec2((mouseX*-1. + 5.0)/10.0,(mouseY + 5.0)/10.0), vUv);
//  dist /= v * 10.0;
//  vUv2 -= vec2(mouseX,mouseY);
//  if (dist < 0.5){
//     float percent = 1.0 + ((0.5 - dist) / 0.5) * 1.0;
//     vUv2 = vUv2 * percent;
//  }
//  vUv2 += vec2(mouseX,mouseY);
//  vec4 texel = texture2D( tDiffuse, vUv2);

//   gl_FragColor = opacity * (texel*0.5 + texel2*0.5);
//   gl_FragColor = (texel2*0.5 + texel3*0.5);
  // "gl_FragColor = texel + texel2*0.5;",
  // "gl_FragColor = texel + vec4(0.0,0.0,0.0,1.0);",
//   gl_FragColor = vec4(sin(time)+1.,0.0,0.0,1.0);
//   gl_FragColor = vec4(texel2.x, 0.0,0.0,1.0);
//  gl_FragColor = vec4(texel2.xyz,0.1);
//  gl_FragColor = texel2;

  // gl_FragColor += texel1 + vec4(vec3(rand(vUv*time)),1.0)*0.08;
  // gl_FragColor += texel2;
  // gl_FrnpmagColor += texel2;
  // gl_FragColor += texel4;

  // gl_FragColor = texel1;
  // float dd = 2.0;
  // gl_FragColor = vec4(
  //   vec3(
  //     cnoise3(vPos*dd+time)*0.5 + 0.5 ,
  //     cnoise3(vPos*dd+time)*0.5 + 0.5 , 
  //     0.5
  //     ),//cnoise3(vPos*dd+time)*0.5 + 0.5 ),
  //   1.0
  // );
  
  // gl_FragColor = vec4(vec3(cnoise3(vPos*10.0+time)),1.0);
  // gl_FragColor = vec4(vec3(cnoise2(vec2(vUv.x*20.0, vUv.y*20.0))),1.0);
  // gl_FragColor = vec4(vec3(smoothstep(0.0,0.5,vec3(dist))),1.0);
  //gl_FragColor = vec4(0.5,0.5,0.5 + smoothstep(0.0,0.5,dist),1.0);
  // gl_FragColor += vec4(0.0,0.0,smoothstep(0.0,1.0,dist*5.0)*.5 ,1.0);
  // gl_FragColor = vec4( vec3(smoothstep(0.0,1.0,dist*4.0)*.5) ,1.0 );
  // gl_FragColor = vec4(texel1 + texel2);
  // gl_FragColor = vec4(texel4);


  sum += vec4(vec3(
    rand(vUv * 2.2 + time)*1.7
  ),1.0);

  sum = vec4(
    normalize(vec3( sum.x * step(0.7,sum.x))),
    1.0
  );
  
  sum = vec4(
    vec3( sum.xyz - texelA1.xyz) * 0.4,
    1.0
  );
  
  vec4 texelB = vec4(
    vec3(1.0 -  max(0.0,sum.x)),
    1.0
  );

  gl_FragColor = vec4(0.3,0.3,0.38,1.0);

  vec4 nom = texture2D( tex2, vUv - 0.007);
  gl_FragColor += nom;

  // gl_FragColor = vec4(0.0,0.2,0.2,1.0);
  gl_FragColor -= nom * texelA * texelB;// * vec4(vec3(230./255., 185.4/255., 168./255.),1.0);

  // gl_FragColor += vec4(vec3(-1.*texelC.xyz),1.0);
  
  // gl_FragColor ;
  
  vec4 spec = texture2D( tex1, vUv);
  // gl_FragColor = spec;
  gl_FragColor += vec4(spec.xyz,1.0);

    
  // gl_FragColor = texelA;
  // gl_FragColor = texelB;
  // gl_FragColor = texelC;

  // gl_FragColor = texture2D( tex, vUv);


  // gl_FragColor = gl_FragColor*gl_FragColor;
  // gl_FragColor = vec4( (texel1 + texel1) + texel2  + texel3  );
  // gl_FragColor = ((gl_FragColor - 0.5) * 3.0) + 0.5;
  // gl_FragColor -= vec4(vec3(rand(vUv*(time))),1.0)*0.9;
  // gl_FragColor = vec4( 1.0,0.0,0.0,1.0 );

}