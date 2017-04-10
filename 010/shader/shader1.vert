/**
 * Multiply each vertex by the
 * model-view matrix and the
 * projection matrix (both provided
 * by Three.js) to get a final
 * vertex position
 */

uniform sampler2D texture1;
//varying vec4 vColor;

attribute float index1;
const float frag = 1.0 / 8.0;
const float texShift = 0.5 * frag;

void main() {

    float pu = fract(index1 * frag + texShift);
    float pv = floor(index1 * frag) * frag + texShift;
    vec3 tPosition = texture2D(texture1, vec2(pu, pv)).rgb * 2.0 - 1.0;

    gl_Position  = projectionMatrix * viewMatrix * vec4(tPosition, 1.0);
    gl_PointSize = 32.0;

}