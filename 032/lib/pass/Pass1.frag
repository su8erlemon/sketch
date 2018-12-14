/**
 * Set the colour to a lovely pink.
 * Note that the color is a 4D Float
 * Vector, R,G,B and A and each part
 * runs from 0.0 to 1.0
 */
#include <packing>

#define KERNEL_SIZE 25

uniform sampler2D tDiffuse2;
uniform vec3 kernels[KERNEL_SIZE];
uniform sampler2D tNoise;
uniform float uRadius;
uniform float uFov;
uniform float uFar;
uniform float aspect;
uniform float ww;
uniform float time;

varying mat4 vProjectionMat;
varying mat4 invProj;

varying vec2 vUv;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}


vec3 getViewRay(vec2 tc) {
    float fov = uFov / 180. * 3.14159265;
		float hfar = 2.0 * tan(fov/2.0) * uFar;
		float wfar = hfar * aspect;    
		vec3 ray = vec3(wfar * (tc.x - 0.5), hfar * (tc.y - 0.5), -uFar);
		return ray;                      
}  


void main() {

  // make screen space position(origin) with depth + getViewRay()
  float depth = texture2D(tDiffuse2, vUv ).w;
  if (depth >=  0.99) {
      gl_FragColor = vec4(1.0);
      return;
  }

  vec3 origin = getViewRay(vUv) * depth; 

  // screen space normal
  vec3 normal = texture2D(tDiffuse2, vUv ).xyz;
  normal = normalize(normal);

  // make mat3 to rotate semi-sphere sample randomly
  vec3 rvec = texture2D(tNoise, vUv * ww/16.0 ).xyz * 2.0 -1.0; 
  vec3 tangent = normalize(rvec - normal * dot(rvec, normal));
  vec3 bitangent = cross(normal, tangent);
  mat3 tbn = mat3(tangent, bitangent, normal);

  // calc occlusion factor
  float occlusion = 0.0;
  for (int i = 0; i < KERNEL_SIZE; ++i) {

    // get sample position:
    vec3 sample = tbn * kernels[i]*1.0;
    sample = sample * uRadius * 1.0 + origin;
    
    // project sample position:
    vec4 offset = vec4(sample, 1.0);
    offset = vProjectionMat * offset;
    offset.xy /= offset.w;
    offset.xy = offset.xy * 0.5 + 0.5;
      
    // // get sample depth:
    float sampleDepth = texture2D(tDiffuse2, offset.xy).w;
    
    float zz = -sample.z / uFar;

    // range check & accumulate:
    // didn't understand this part
    // float rangeCheck= abs(-origin.z/5.0 - sampleDepth) < uRadius ? 1.0 : 0.0;
    // float rangeCheck = smoothstep(0.0, 1.0, uRadius / abs(origin.z - sampleDepth));
    occlusion += (sampleDepth >= zz? 1.0 : 0.0);// * rangeCheck;
  }
  
  gl_FragColor = vec4( vec3(occlusion/25.0 + 0.2), 1.0);
  
  
}