/**
 * Set the colour to a lovely pink.
 * Note that the color is a 4D Float
 * Vector, R,G,B and A and each part
 * runs from 0.0 to 1.0
 */

uniform vec3 lightDirection;
uniform vec3 eyeDirection;
uniform float time;

varying vec3 vNormal;
varying vec3 vNormal2;
varying vec4 vPosition;
varying vec4 vPosition2;
varying vec4 vColor;

varying mat4 vInvMatrix;

vec3 mix3vec(vec3 value){
    return vec3(
      mix(-1.0, 1.0, value.x),
      mix(-1.0, 1.0, value.y),
      mix(-1.0, 1.0, value.z)
    );
  }
  
  
void main() {

  vec4 ambientColor = vec4(0.2,0.2,0.2,1.0);

  vec3  lightVec  = lightDirection - vPosition2.xyz;
  vec3  invLight  = normalize(vInvMatrix * vec4(lightVec, 0.0)).xyz;
  vec3  invEye    = normalize(vInvMatrix * vec4(eyeDirection, 0.0)).xyz;
  vec3  halfLE    = normalize(invLight + invEye);
  float diffuse   = clamp(dot(vNormal, invLight), 0.0, 1.0);
  float specular  = pow(clamp(dot(vNormal, halfLE), 0.0, 1.0), 50.0);
  vec4  destColor = vColor + vec4(vec3(diffuse), 1.0) + vec4(vec3(specular), 1.0) + ambientColor;

  // diffuse
  // gl_FragColor = vec4(vec3(diffuse-0.5) * 3.0, 1.0);
  

  // specular
  
  float specular2 = -1. * (specular-0.4);
  vec4 specularOut = vec4(vec3(min(1.0,specular2*10.0)), 1.0);
  gl_FragColor = specularOut;
  
  // depth
	// float depth = (vPosition.z / vPosition.w + 1.0) * 0.5;
  // gl_FragColor = vec4(vec3(depth), 1.0);

  // normal ( camera )
  vec4 normalOut = vec4(vec3(vNormal2.zzz) * 1.6, 1.0);
  // gl_FragColor = normalOut;
  gl_FragColor = vec4(
    normalOut.xyz * specularOut.xyz* vColor.xyz,
    1.0
  );

  // gl_FragColor = vec4( normalOut.x * specularOut.x,  // R
  //                       0.0,  // G
  //                       0.0,  // B
  //                       1.0); // A


  // gl_FragColor = vec4(1.0,  // R
  //                     1.0,  // G
  //                     1.0,  // B
  //                     1.0); // A

}