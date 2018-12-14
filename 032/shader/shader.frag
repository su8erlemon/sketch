/**
 * Set the colour to a lovely pink.
 * Note that the color is a 4D Float
 * Vector, R,G,B and A and each part
 * runs from 0.0 to 1.0
 */
#include <packing>

precision highp float;

uniform sampler2D tDepth;
uniform sampler2D kernelTexture;
uniform sampler2D noiseTexture;

varying vec4 vPosition;
varying vec3 vNormal;
uniform float uSampleKernelSize;

varying vec2 vUv;

float readDepth( sampler2D depthSampler, vec2 coord ) {
				float fragCoordZ = texture2D( depthSampler, coord ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, 1., 1000. );
				return viewZToOrthographicDepth( viewZ, 1., 1000. );
}


void main() {
  
  gl_FragColor = vec4(1.0,  // R
                      0.0,  // G
                      1.0,  // B
                      1.0); // A

  // vec3 origin = vPosition.zzz/vPosition.w;

  // vec3 normal = vNormal.xyz;
  // vec3 rvec = texture2D(noiseTexture, vUv).xyz;
  // vec3 tangent = normalize(rvec - normal * dot(rvec, normal));
  // vec3 bitangent = cross(normal, tangent);
  // mat3 tbn = mat3(tangent, bitangent, normal);

  // gl_FragColor = vec4(vec3(readDepth( tDepth, vUv )), 1.0);

  // float occlusion = 0.0;
  // for (int i = 0; i < 100; ++i) {
  // // get sample position:
  //   vec3 sample = tbn * texture2D(noiseTexture, vec2(i,i)).xyz;
  //   sample = sample * 1.0 + origin;
    
  // project sample position:
    // vec4 offset = vec4(sample, 1.0);
    // offset = uProjectionMat * offset;
    // offset.xy /= offset.w;
    // offset.xy = offset.xy * 0.5 + 0.5;
    
  // get sample depth:
    // float sampleDepth = texture(uTexLinearDepth, offset.xy).r;
    
  // range check & accumulate:
    // float rangeCheck= abs(origin.z - sampleDepth) < uRadius ? 1.0 : 0.0;
    // occlusion += (sampleDepth <= sample.z ? 1.0 : 0.0) * rangeCheck;
  // }
  
  // gl_FragColor = vec4( vPosition.zzz/vPosition.w, 1.0);

  // float ld = length(vPosition) / (10.0 - 1.0); //linearDepth is cam.far - cam.near
  // gl_FragColor = vec4( vNormal, mix(0.0, 1.0, gl_FragCoord.z)  );
  // gl_FragColor = vec4( vNormal, gl_FragCoord.z  );
  gl_FragColor = vec4( vNormal, gl_FragCoord.z  );
  // gl_FragColor = vec4( vPosition.xyz, 1.0 );

  // gl_FragColor = vec4( normalize(vNormal.xyz*2.0-1.0), 1.0);
  // gl_FragColor = vec4( 0.0,0.0, uNoise[0].y, 1.0);
}