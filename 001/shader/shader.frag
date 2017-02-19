//#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform vec2 resolution;
uniform float time;
uniform mat4 invMatrix;
uniform float colorContrast;

struct PointLight {
  vec3 position;
  vec3 color;
  float distance;
};
uniform PointLight pointLights[ NUM_POINT_LIGHTS ];

varying vec3 vPosition;
varying vec3 vColor;

void main()	{

    vec3 dx = dFdx(vPosition.xyz);
    vec3 dy = dFdy(vPosition.xyz);
    vec3 fnormal = normalize(cross(normalize(dx), normalize(dy)));

    vec3 lightPos = pointLights[0].position;
    vec3 lightDirection = normalize( vPosition - lightPos );

    vec3 invLight = normalize(invMatrix * vec4(lightDirection, 0.0)).xyz;
    float diffuse  = clamp(dot(fnormal, invLight), 0.0, 1.0);

    //float invColorContrast = 1.0 - colorContrast;
//    gl_FragColor   = vec4(invColorContrast,invColorContrast,invColorContrast,1.0) + vec4(vColor,1.0) * colorContrast *  vec4(vec3(diffuse), 1.0);
    gl_FragColor = vec4(vec3(diffuse), 1.0);

}