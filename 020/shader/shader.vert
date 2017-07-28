
uniform sampler2D texture1;
uniform float time;
varying vec2 vUv;

void main() {

  vUv = uv;
  vec4 color = texture2D( texture1, uv );
  gl_Position = projectionMatrix *
                modelViewMatrix *
               vec4(position + vec3(0.0,0.0,color.y*0.02),1.0);
                // vec4(position + vec3(0.0,0.0,-color.y*1000.),1.0);
}