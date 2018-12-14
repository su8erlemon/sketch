
#pragma glslify: inverse = require(glsl-inverse)

uniform mat4 prjMat;

// varying vec4 vPosition;
// varying vec4 vNormal;
varying vec2 vUv;

varying mat4 vProjectionMat;
varying mat4 invProj;
varying mat4 viewMatrixInv;

void main() {
  
  vUv = uv;
  // vNormal = vec4(normal,1.0);
  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position,1.0);
  vProjectionMat = prjMat;
  invProj = inverse(prjMat);
  viewMatrixInv = inverse(viewMatrix);
  // vPosition = gl_Position;
}