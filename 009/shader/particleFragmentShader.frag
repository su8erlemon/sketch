precision highp float;

struct PointLight {
  vec3 position;
  vec3 color;
  float distance;
};

uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
uniform mat4 invMatrix;

// VertexShaderから受け取った色を格納するだけ。
varying vec3 vPosition;
varying vec4 vColor;
varying vec2 vUv;

void main() {

    // 丸い形に色をぬるための計算
//    float f = length( gl_PointCoord - vec2( 0.5, 0.5 ) );
//    if ( f > 0.1 ) {
//        discard;
//    }

    vec3 dx = dFdx(vPosition.xyz);
    vec3 dy = dFdy(vPosition.xyz);
    vec3 fnormal = normalize(cross(normalize(dx), normalize(dy)));

    vec3 lightPos = pointLights[0].position;
    vec3 lightDirection = normalize( vPosition - lightPos );

    vec3 invLight = normalize(invMatrix * vec4(lightDirection, 0.0)).xyz;
    float diffuse  = clamp(dot(fnormal, invLight), 0.5, 1.0);

    vUv;
    vColor;
    vPosition;

//    gl_FragColor = vColor;
    gl_FragColor = vColor * vec4(vec3(diffuse), 1.0);

}
