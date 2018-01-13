/**
 * Multiply each vertex by the
 * model-view matrix and the
 * projection matrix (both provided
 * by Three.js) to get a final
 * vertex position
 */
#pragma glslify: inverse = require(glsl-inverse)

uniform float mouseX;
uniform float mouseY;

uniform float xx;
uniform float yy;
uniform float zz;

varying vec2 vUv;

uniform sampler2D texture1;

vec3 get3dPoint() {
 
  float x = mouseX;
  float y = mouseY;

  vec4 color = texture2D( texture1, vec2((x + 1.0)/2.0, (y + 1.0)/2.0));
  // gl_FragColor = color;

  vec3 point3D = vec3(x, y, color.x * color.x); 
  vec4 world = inverse(projectionMatrix * viewMatrix) * vec4((point3D),1.0);
  return world.xyz /world.w ;
  
}
 

void main() {
  vUv = uv;

  cameraPosition;
  vec3 mouse = get3dPoint();
  // mouse *= vec4(cameraPosition,0.0);
  vec3 pos = position;
  
  pos.x += mouse.x;
  pos.y += mouse.y;
  pos.z += mouse.z;

  // pos.x += xx;
  // pos.y += yy;
  // pos.z += zz;

  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(pos,1.0);

  // gl_Position = projectionMatrix *
  //               modelViewMatrix *
  //               vec4(position,1.0);
}

