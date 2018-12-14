varying vec2 vUv;
uniform float time;

uniform sampler2D velTexture;
uniform sampler2D posTexture;

#define UNIT_PIXEL 0.001

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
}

void main() {

  vec4 velTextureValue = texture2D(velTexture, vUv);
  vec3 vel = velTextureValue.xyz; 
  // use velocity texture .w value as particle life
  float life = velTextureValue.w; 

  vec4 posTextureValue = texture2D(posTexture, vUv);
  vec3 pos = posTextureValue.xyz;

  float mass = 1.0;
  vec3 acceleration = vec3(0.0,-9.81,0.0);
  vel *= 0.98;
  vel += acceleration * UNIT_PIXEL;
  
  if (pos.y <= 0.) {
    // when particle hit the floor, revese Y velocity
    vel.x *= 0.8;
    vel.y *= -0.4;
    vel.z *= 0.8;
  }

  life -= 0.005;
  if( life < 0. ){
    // when life is zero, randomize velocity and reset life
    vel.x = (random(vUv.xy)-0.5)*0.4;
    vel.y = (random(vUv.xy+vUv.yx)-0.5)*0.4;
    vel.z = (random(vUv.yx)-0.5)*0.4;
    life = 1.0;
  }
  
  gl_FragColor = vec4(vel, life);
}