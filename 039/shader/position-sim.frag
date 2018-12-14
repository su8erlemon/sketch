varying vec2 vUv;
uniform float time;

uniform sampler2D velTexture;
uniform sampler2D posTexture;

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
}

void main() {
  vec4 velTextureValue = texture2D(velTexture, vUv);
  vec3 vel = velTextureValue.xyz;
  float life = velTextureValue.w;

  vec4 posTextureValue = texture2D(posTexture, vUv);
  vec3 pos = posTextureValue.xyz;
  float mass = posTextureValue.w;

  pos.x += vel.x;
  pos.y += vel.y;
  pos.z += vel.z;
  
  if( pos.y < 0.0 ){
    // the paricle won't go under the floor
    pos.y = 0.0;
  }
  
  if( life == 1.0 ){
    // when life is zero, reset position
    pos.x = 0.0;
    pos.y = 10.0;
    pos.z = 0.0;
  }

  gl_FragColor = vec4(pos,mass);
}