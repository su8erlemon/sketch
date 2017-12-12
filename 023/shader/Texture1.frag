//#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
#pragma glslify: cnoise2 = require(glsl-noise/classic/2d)
//#extension GL_OES_standard_derivatives : enable

#define iterations 17
#define formuparam 0.53

#define volsteps 20
#define stepsize 0.15

#define zoom   0.800
#define tile   0.850
#define speed  0.010

#define brightness 0.0015
#define darkmatter 0.300
#define distfading 0.730
#define saturation 0.850

precision mediump float;

uniform sampler2D tDiffuse;
uniform sampler2D tex;
uniform sampler2D mtex1;
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

vec4 draw_ball(vec2 ball_center, vec3 ball_color, float ball_rad){
//	vec2 position = ( vUv.xy / vec2(1.,1.) );
//	vec2 center = ball_center;
//	vec2 curpos = position - center;
//
//	float length_ = dot(curpos, curpos);
//	float coly = 0.0;
//	float r2 = ball_rad * ball_rad;
//	coly = r2 / length_;

	vec2 m = ball_center;
  vec2 p = (vUv.xy) / vec2(1.0,1.0);

  // division
  float t = 1.1 - length(m - p);
  t = pow(t, 100.0)*ball_rad*ball_rad;

	return vec4(ball_color * t, 1.0);
}

void main( void ) {

	vec3 outputColor = vec3 (0.0, 0.0, 0.0);
//
  vec2 m = vec2(.5 * 2.0 - 1.0, -.5 * 2.0 + 1.0);
  vec2 p = (vUv * 2.0 - 1.0) / min(.5, .5);
  vec2 uv = vUv - 0.5;
//  uv *= vec2(1.0,2.0);

//  outputColor = texture2D(tex, vUv).rgb;

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

//	outputColor += cnoise2(uv*3.) * 1.0;
//	outputColor += cnoise2(uv*4.) * 2.01;
//	outputColor += cnoise2(uv*6.) * 3.02;

//	outputColor -= cnoise2(uv*23.) * 1.01;
//	outputColor += cnoise2(uv*200.) * 1.02;
//	outputColor += cnoise2(uv*400.) * 1.02;
//  outputColor += cnoise2(uv*200.) * 10.02;
//	outputColor += vec3((cnoise2(uv*40.)*10.0))  ;
//	outputColor -= cnoise2(uv*3.) * 100.01;
//	outputColor += cnoise2(uv*200.) * 10.02;
//	outputColor += cnoise2(uv*200.) * 10.02;
//	outputColor += cnoise2(uv*200.) * 10.02;
//	outputColor += (cnoise2(uv*300.)*.333 + cnoise2(uv*20.)*.333 + cnoise2(uv*4.)*.333 );
//	outputColor -= cnoise2(uv*7.) * 20.1;

//  for( float i = 0.; i < 30.; i++ ){
//    outputColor += (1.0-draw_ball(vec2(0.5 + i*0.1, 0.5), vec3(1.0, 1.0, 1.0), 0.05)).rgb;
//  }




//  for( float i = 0.; i < 5.; i++ ){
//    outputColor += cnoise2(uv*(3. + i * 5.)) * .4;
//    outputColor += (1.0-draw_ball(vec2(.5,.5), vec3(1.0, 1.0, 1.0), 0.1)*.5).rgb;
//    outputColor += (1.0-draw_ball(vec2(.6,.5), vec3(1.0, 1.0, 1.0), 0.02)*1.0).rgb;
//  }
//    outputColor += cnoise2(uv*5.)*.5 + cnoise2(uv*5.)*.5;
//     outputColor += cnoise2(uv*3.) * 4.5;
//    outputColor += abs(cnoise2(uv*5.) * 10.0);

//    outputColor += tan(cnoise2(vec2(uv.x,uv.y*2.0)*2.) * (1.0+cnoise2(uv)*60.0) )*.5;
//    outputColor += (sin(cnoise2(vec2(uv.x,uv.y*2.0)*3.)*4.0) * 2.0 - 1.0) * .3;
//    outputColor += (cos(cnoise2(vec2(uv.x,uv.y*2.0)*5.)*4.0) * 2.0 - 1.0) * .3;
//    outputColor += (cos(cnoise2(vec2(uv.x,uv.y*2.0)*20.)*4.0) * 2.0 - 1.0) * .3;
//    outputColor += cos(cnoise2(vec2(uv.x,uv.y*2.0)*10.)*10.0) * 2.0 - 1.0*.204;
//    outputColor += cos(cnoise2(vec2(uv.x,uv.y*2.0)*3.)*10.0) * 2.0 - 1.0*.202;
//    outputColor += cnoise2(vec2(uv.x,uv.y*2.0)*3.)*10.0*.203;
//    outputColor += min(cnoise2(vec2(uv.x,uv.y*2.0)*3.0)*5.0,1.0);
//    outputColor += sin(cnoise2(vec2(uv.x,uv.y*2.0)*7.0)*30. - cnoise2(vec2(uv.x,uv.y*1.0)*2.0)*100.)*.3;

//for( float i = 0.; i < 5.; i++ ){
//    outputColor += sin(
//        cnoise2(
//          vec2(uv.x,uv.y*2.0) * 9.// * vec2(uv.x,uv.y*2.)*1.0
//        )*(20.0 - i * 4.)
//      ) * 0.2;
//}

//      outputColor += sin(
//              cnoise2(
//                vec2(uv.x,uv.y*1.2) * 9.// * vec2(uv.x,uv.y*2.)*1.0
//              )*2.0
//            ) * 0.501;

    outputColor += max(sin(cnoise2(vec2(uv.x, uv.y*2.)*4.)*2.0)*.4,0.0);
//    outputColor += max(cnoise2(vec2(uv.x, uv.y*2.)*4.0)*0.7,0.0);
    outputColor += max(sin(cnoise2(vec2(uv.x*1.1, uv.y*3.0)*4.)*120.0)*.1,0.0);

//    outputColor *= max(cos(cnoise2(vec2(uv.x, uv.y*2.)*4.)*7.0)*.4,1.0);

//    outputColor += random(uv)*.2;

//    outputColor += random(uv*2.0)>0.1?1.0:0.0;


//    vec3 base3 = texture2D( mtex1, uv ).rgb;
//    outputColor *= base3.rrr;

//	outputColor -= cnoise2(uv*3.)*.7;

//	outputColor /= 10.;

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

  	vec3 dir=vec3(vUv*zoom,1.);
  	float rtime=time*speed+.25;
  	vec3 from=vec3(1.,.5,0.5);

  	//volumetric rendering
  	float s=0.1,fade=1.;
  	vec3 v=vec3(0.);
  	for (int r=0; r<volsteps; r++) {
  		vec3 p=from+s*dir*.5;
  		p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
  		float pa,a=pa=0.;
  		for (int i=0; i<iterations; i++) {
  			p=abs(p)/dot(p,p)-formuparam; // the magic formula
  			a+=abs(length(p)-pa); // absolute sum of average change
  			pa=length(p);
  		}
  		float dm=max(0.,darkmatter-a*a*.001); //dark matter
  		a*=a*a; // add contrast
  		//if (r>6) fade*=1.-dm; // dark matter, don't render near
  		//v+=vec3(dm,dm*.5,0.);
  		v+=fade;
  		v+=vec3(s*s,s*s,s*s )*a*brightness*fade; // coloring based on distance
  		fade=0.1; // distance fading
  		s+=stepsize;
  	}
  	v=mix(vec3(length(v)),v,1.0); //color adjust
//  	gl_FragColor = vec4(v*.01,1.);
    outputColor += v *.01;







	gl_FragColor = vec4(vec3(outputColor),1.0);//vec3(random(position)), 1.0);

}