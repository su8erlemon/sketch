
#define delta ( 1.0 / 60.0 )
#define area 50.0

void main() {

  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 tmpPos = texture2D( texturePosition, uv );
  vec4 tmpVel = texture2D( textureVelocity, uv );

  vec3 pos = tmpPos.xyz;
  vec3 vel = tmpVel.xyz;

  // Dynamics
  pos += vel;// * delta;


  pos.x>area?pos=vec3(pos.x-area*2.0, pos.y         , pos.z         ):vec3(0.0);
  pos.y>area?pos=vec3(pos.x         , pos.y-area*2.0, pos.z         ):vec3(0.0);
  pos.z>area?pos=vec3(pos.x         , pos.y         , pos.z-area*2.0):vec3(0.0);

  pos.x<-area?pos=vec3(pos.x+area*2.0, pos.y         , pos.z         ):vec3(0.0);
  pos.y<-area?pos=vec3(pos.x         , pos.y+area*2.0, pos.z         ):vec3(0.0);
  pos.z<-area?pos=vec3(pos.x         , pos.y         , pos.z+area*2.0):vec3(0.0);

//  pos.x>area?pos=vec3(pos.x-area*1.0, pos.y         , pos.z     ):vec3(0.0);
//  pos.y>area?pos=vec3(pos.x         , pos.y-area*1.0, pos.z     ):vec3(0.0);
//  pos.z>area?pos=vec3(pos.x         , pos.y         , pos.z-area):vec3(0.0);
//
//  pos.x<-area?pos=vec3(pos.x+area*1.0, pos.y         , pos.z     ):vec3(0.0);
//  pos.y<-area?pos=vec3(pos.x         , pos.y+area*1.0, pos.z     ):vec3(0.0);
//  pos.z<-area?pos=vec3(pos.x         , pos.y         , pos.z+area*1.0):vec3(0.0);




  gl_FragColor = vec4( pos, tmpPos.w );

}