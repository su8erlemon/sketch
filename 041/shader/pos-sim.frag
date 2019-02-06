varying vec2 vUv;
uniform float time;

uniform sampler2D posTexture;

#define UNIT_PIXEL 0.001

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
}

void main() {
  vec4 posTextureValue = texture2D(posTexture, vUv);
  vec3 pos = posTextureValue.xyz;

  pos.y += sin(posTextureValue.w*6.28+time*2.0)*0.5;

  gl_FragColor = vec4(pos,posTextureValue.w);
}