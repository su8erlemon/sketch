uniform float time;
uniform sampler2D texture1;
attribute float indexes;

void main() {
  vec3 pos = position;
  vec2 uv2 = vec2(
    floor(indexes/64.)/64.,
    fract(indexes/64.)
  );
  pos += texture2D(texture1, uv2).xyz;
  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(pos,1.0);

  gl_PointSize = 8.;
}