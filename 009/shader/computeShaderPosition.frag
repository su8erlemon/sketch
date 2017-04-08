
#pragma glslify: snoise = require('glsl-noise/simplex/3d')

#define delta ( 1.0 / 60.0 )
#define area 2.0

//varying vec4 vColor;
uniform float time;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

uniform sampler2D texture1;

//attribute float index2;

const float frag = 1.0 / 128.0;
const float texShift = 0.5 * frag;

void main() {

  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec4 tmpPos = texture2D( texturePosition, uv );
  vec4 tmpVel = texture2D( textureVelocity, uv );
  vec4 tmpAcc = texture2D( textureAcceleration, uv );

  //vec4 tmpDan = textur  1e2D( textureDance, uv );
  float idParticle = uv.y * resolution.x + uv.x;

  //float index = uv.x * 128. * uv.y * 128.;
  //float index = rand(uv) * 5461. ;
  //float index = rand(uv) * 12200. ;



  // getting skkinned mesh position
  float index = tmpPos.w;
  float pu = fract(index * frag + texShift);
  float pv = floor(index * frag) * frag + texShift;
  vec3 tmpDan = texture2D( texture1, vec2(pu, pv)).rgb * 2.0 - 1.0;



  vec4 pos = tmpPos;
  vec3 vel = tmpVel.xyz;



//  float theta = snoise( tmpPos.xyz * (0.9) )*6.28;
//  vel += vec3( cos(theta), sin(theta), 0.0 )*0.03;

//  vel *= 0.00;
//  float theta = snoise( tmpPos.xyz * (0.3 + cos(time)*0.1)  )*6.28;
//  float theta = snoise( tmpPos.xyz * (1.0) )*6.28;
//  vel += vec3( cos(theta), sin(theta), -1.0 )*0.03;

//  vel.z += -0.0001;


//  (pos.y>0.0)?(pos += vec4(vel.xyz,0.0)):vec4(0.0);

  // Dynamics
  pos.xyz += vel.xyz;// * delta;


  //stop on a ground
//  (pos.y<=0.001)?(pos = vec4(pos.x,0,pos.z, pos.w )):vec4(0.0);

  (pos.y<=0.001)?(pos = vec4(pos.x, 0. ,pos.z, pos.w )):vec4(0.0);
  (tmpVel.w>10.)?(pos = vec4(tmpDan.x,tmpDan.y + rand(tmpDan.xy)*0.03,tmpDan.z, pos.w )):vec4(0.0);


//  pos += vec3(0.0,0.0,-0.1);
//   pos = tmpDan;
//  pos.x>area?pos=vec3(pos.x-area*2.0, pos.y         , pos.z         ):vec3(0.0);
//  pos.y>area?pos=vec3(pos.x         , pos.y-area*2.0, pos.z         ):vec3(0.0);
//  pos.z>area?pos=vec3(pos.x         , pos.y         , pos.z-area*2.0):vec3(0.0);
//
//  pos.x<-area?pos=vec3(pos.x+area*2.0, pos.y         , pos.z         ):vec3(0.0);
//  pos.y<-area?pos=vec3(pos.x         , pos.y+area*2.0, pos.z         ):vec3(0.0);
//  pos.z<-area?pos=vec3(pos.x         , pos.y         , pos.z+area*2.0):vec3(0.0);

//  pos.x>area?pos=vec3(pos.x-tmpDan.x , pos.y          , pos.z    ):vec3(0.0);
//  pos.y>area?pos=vec3(pos.x          , pos.y-tmpDan.y , pos.z    ):vec3(0.0);
//  pos.z>area?pos=vec3(pos.x          , pos.y          , pos.z-tmpDan.z ):vec3(0.0);
//
//  pos.x<-area?pos=vec3(pos.x+tmpDan.x, pos.y          , pos.z    ):vec3(0.0);
//  pos.y<-area?pos=vec3(pos.x         , pos.y+tmpDan.y , pos.z    ):vec3(0.0);
//  pos.z<-area?pos=vec3(pos.x         , pos.y          , pos.z+tmpDan.z ):vec3(0.0);

//  pos.x>area?pos=tmpDan:vec3(0.0);
//  pos.y>area?pos.xyz=tmpDan.xyz:vec3(0.0);
//  pos.z>area*2.0?pos=tmpDan:vec3(0.0);

//  pos.x<-area?pos=tmpDan:vec3(0.0);

//  pos.z<-area*2.0?pos=tmpDan:vec3(0.0);

//vel.y<0.0001?(vel.y>0.0?pos = vec4(tmpDan.xyz, pos.w ):vec4(0.0)):vec4(0.0);



  // pos.w is the index of the skkinned
  gl_FragColor = vec4( pos );

}