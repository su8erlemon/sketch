
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
//  vec4 tmpDan = textur  1e2D( textureDance, uv );
  float idParticle = uv.y * resolution.x + uv.x;

//  float index = uv.x * 128. * uv.y * 128.;
//  float index = rand(uv) * 5461. ;
  //float index = rand(uv) * 12200. ;
  float index = tmpPos.w;

  float pu = fract(index * frag + texShift);
  float pv = floor(index * frag) * frag + texShift;
//
  vec3 tmpDan = texture2D( texture1, vec2(pu, pv)).rgb * 2.0 - 1.0;

  vec3 pos = tmpPos.xyz;
  vec3 vel = tmpVel.xyz;

//  float theta = snoise( tmpPos.xyz * (0.9) )*6.28;
//  vel += vec3( cos(theta), sin(theta), 0.0 )*0.03;

//  vel *= 0.00;
//  float theta = snoise( tmpPos.xyz * (0.3 + cos(time)*0.1)  )*6.28;
//  float theta = snoise( tmpPos.xyz * (1.0) )*6.28;
//  vel += vec3( cos(theta), sin(theta), -1.0 )*0.03;

//  vel.z += -0.0001;

  // Dynamics
  pos += vel;// * delta;


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

  pos.x>area?pos=tmpDan:vec3(0.0);
  pos.y>area?pos=tmpDan:vec3(0.0);
  pos.z>area*2.0?pos=tmpDan:vec3(0.0);

  pos.x<-area?pos=tmpDan:vec3(0.0);
  pos.y<-area?pos=tmpDan:vec3(0.0);
  pos.z<-area*2.0?pos=tmpDan:vec3(0.0);



  gl_FragColor = vec4( pos, tmpPos.w );

}