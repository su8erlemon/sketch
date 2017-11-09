#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)

#define PI 3.1415;

uniform float time;
varying vec2 vUv;
uniform sampler2D tMatCap2;
uniform sampler2D mtex2;

varying vec3 vNormal;
varying vec3 vPostion;
varying vec3 vWorldPosition;
varying mat4 vModelViewMatrix;
varying mat3 vNormalMatrix;

// chunk(shadowmap_pars_vertex);

vec3 makeNose(vec3 pos, vec2 uv2){
//  return  (pos);
//    return  (pos) + (normal * texture2D( mtex2, uv2 ).r) * 0.07;
    return  (pos) - (normal * texture2D( tMatCap2, uv2 ).r) * 0.03;
//    return  (pos) + (normal * texture2D( tMatCap2, uv2 ).r) * 0.2 + (normal * texture2D( mtex2, uv2 + time*.1 ).r) * 0.07 ;
//    return  (pos) + (normal) * 0.1 - cnoise3(pos*2.0)*0.3;
//  return  (pos) - cnoise3((pos))*0.3;
//  return (pos) + (cnoise3((pos)*3.0 + time*0.8)*0.1) * normal;
//  return (pos) + (cnoise3((pos)*10.0 + time*0.8)*0.1) * normal;
}

vec3 getNeighbour(vec3 orig, float offsetT, float offsetP){

  // xyz -> Spherical coordinates
  float r = sqrt(orig.x*orig.x + orig.y*orig.y + orig.z*orig.z);
  float theta = acos(orig.z/r);
  float sgn = (orig.y>=0.?1.:-1.);
  float phi = sgn * acos(orig.x/sqrt(orig.x*orig.x + orig.y*orig.y));

  // add offset
  theta += offsetT;
  phi += offsetP;

  // Spherical coordinates -> xyz
  float x = r * sin(theta) * cos(phi);
  float y = r * sin(theta) * sin(phi);
  float z = r * cos(theta);

  return vec3( x, y, z );

}

void main() {

  vUv = uv;

//  vUv.x *= 2.0;
  vec3 pos = makeNose(position+vec3(0.001), vUv);

  float gridOffset	= 0.001;
  vec3 neighbour1	= makeNose(
   getNeighbour(position+vec3(0.001)/*for specfic point(0,0,0)*/, gridOffset, 0.        ),
   vec2(vUv.x + 0.001,vUv.y)
  );

  vec3 neighbour2	= makeNose(
   getNeighbour(position+vec3(0.001)/*for specfic point(0,0,0)*/,0.        , gridOffset),
   vec2(vUv.x,vUv.y + 0.001)
  );

  vec3 tangent	= neighbour1 - pos;
  vec3 bitangent= neighbour2 - pos;

  vec3 norm	= cross(normalize(tangent), normalize(bitangent));
//  norm = normalize(norm);
//  norm = normalMatrix * norm;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);

  vPostion = pos;

  vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
  // chunk(shadowmap_vertex);

  // store the world position as varying for lighting
  vWorldPosition = worldPosition.xyz;

  vNormal = norm;
  vModelViewMatrix = modelViewMatrix;
  vNormalMatrix = normalMatrix;

}