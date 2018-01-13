#pragma glslify: inverse = require(glsl-inverse)

uniform vec4 color;
varying vec3 vNormal;
varying vec3 vNormal2;
varying vec4 vPosition;
varying vec4 vPosition2;
varying vec4 vColor;

varying mat4 vInvMatrix;

void main() {

  vNormal     = normal;
  vNormal2     = normalMatrix * normal;

  vColor = color;
  vInvMatrix = inverse(modelMatrix);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  vPosition   = gl_Position;
  vPosition2  = modelMatrix * vec4(position,1.0);
}