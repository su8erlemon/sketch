//#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
#pragma glslify: cnoise2 = require(glsl-noise/classic/2d)
//#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform sampler2D tDiffuse;
uniform sampler2D tex;
uniform float time;
uniform float id;
varying vec2 vUv;

const vec2 resolution = vec2(512,512);

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

float checkRect(vec2 lt, vec2 dims, vec2 coord){
	vec2 rb = lt + dims;
	if ((coord.x>lt.x) && (coord.x < rb.x) && (coord.y>lt.y) && (coord.y < rb.y))
		return 1.0;
	else
		return 0.0;
}

void main( void ) {


	vec3 outputColor = vec3 ( 0.0, 0.0, 0.0 );
//
  vec2 m = vec2(.5 * 2.0 - 1.0, -.5 * 2.0 + 1.0);
  vec2 p = (vUv * 2.0 - 1.0) / min(.5, .5);
  vec2 uv = vUv - 0.5;
//  uv *= vec2(1.0,2.0);

  outputColor = texture2D(tex, vUv).rgb*.83;

//  vec2 m1 = vec2(sin(time)*.4, cos(time)*.4);
//  vec2 p1 = (vUv.xy * 2.0 - 1.0) / 1.0;

  // one minus length
//  float t = 0.1 - length(m1 - p1);
//  t = pow(t, 5.0);

//  outputColor += t;

//	t += abs( 1.0 / (sin( uv.x + sin(uv.y+time)* 0.0 ) * 40.0) );

//	outputColor += abs( 1.0 / (sin( (uv.x + sin(uv.y*20.0) * 0.01)) * 200.0) );
//	outputColor -= vec3(0.1,0.1,0.1);
//	outputColor += sin(cnoise2(uv*6.+time)*5.0) * 0.333
//	               + (1.0+sin(cnoise2(uv*3.+time) *5.0)) * 0.333
//	               + (1.0+sin(cnoise2(uv*4.+time) *5.0)) * 0.333;
	outputColor += cnoise2(uv*5.+time);

//  outputColor -= vec3(0.001,0.001,0.001);
//  outputColor += sin(cnoise2(uv*6.+time)*5.0)*0.01;



//	outputColor += abs( 1.0 / (sin( (uv.x + sin(uv.y*10.0) * 0.01)) * 200.0) );// * sin(uv.y*20.0+ time);


//	uv += 0.35;
//  outputColor += abs( 1.0 / (sin( uv.x+ sin(uv.y*40.0+time*10.0) * 0.01 ) * 200.0)) * .8;
//
//
//	uv -= 0.35;
//  outputColor += vec3(abs( 3.0 * sin(time)*2.0 / (sin( uv.x) * 200.0) ),0.0,0.0);
//
//  uv -= 0.45;
//  outputColor += abs( 3.0 / (sin( uv.x + (sin(time)+1.0)/2.0) * 200.0) ) * .8;
//
////  uv += 0.8;
////  t += abs( 1.0 / (sin( (uv.x )) * 200.0) );//* sin(uv.y*30.0+ time);
//
////	t *= abs( 1.0 / (sin( uv.x + sin(uv.y+time)* 0.0 ) * 40.0) );
//
//
//	vec2 posf = fract(vUv);
//
//  for(float i = 0.0; i < 20.0; i++){
//	  outputColor += vec3(checkRect(vec2(0.3,1.0 * i/20.0),vec2(.01,0.02),posf)) * .8;
//  }
//
//  for(float i = 0.0; i < 3.0; i++){
//  	 outputColor += vec3(checkRect(vec2(0.05,1.0 * i/3.0),vec2(.01,0.1),posf)) * .8;
//  }
//
//  for(float i = 0.0; i < 14.0; i++){
//	  outputColor += vec3(checkRect(vec2(0.7,1.0 * i/14.0),vec2(.01+(i*0.003+sin(time)*0.1),0.02),posf)) * .8;
//  }
//
//  for(float i = 0.0; i < 8.0; i++){
//  	 outputColor += vec3(checkRect(vec2(0.85,1.0 * i/8.0),vec2(.01, 0.1),posf)) * .8;
//  }
//

//	outputColor += vec3(checkRect(
//	  vec2(0.3,0.0), // x,  y start points, bottom=0 top=1, left=0 right=1
//	  vec2(.01,0.7), // width, height
//	posf));


//	outputColor += vec3(checkRect(vec2(0.3,0.2),vec2(.01,1.),posf));

	gl_FragColor = vec4(vec3(outputColor),1.0);//vec3(random(position)), 1.0);

}