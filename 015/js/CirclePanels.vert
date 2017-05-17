#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
/**
 * Multiply each vertex by the
 * model-view matrix and the
 * projection matrix (both provided
 * by Three.js) to get a final
 * vertex position
 */

#define PI 3.1415;

uniform float time;
uniform float scrollPer;

varying vec2 vUv;

varying vec3 vNormal;
varying vec3 vPostion;
varying mat4 vModelViewMatrix;
varying mat3 vNormalMatrix;

vec3 sample(float t, float time) {
  float angle = t * time * 2.0 * PI;
  vec2 rot = vec2(cos(angle), sin(angle));
  float z = t * 2.0 - 1.0;
  return vec3(rot, z);
}

vec3 makeNose(vec3 pos){
//  return  (pos);
//  return  (pos) ;// + cnoise3(pos)*0.3;
//  if( pos.y >= scrollPer*2.0-1.0 )return pos;

//  vec3 aaa = (pos) + (cnoise3((pos)*1.0 + time*0.8 )*0.4);// - sample(sin(position.y), sin(time) )*0.3 - vec3(0.0, yy, 0.0)*0.2 ) * yy;;
//  if( aaa.y >= scrollPer*2.0-1.0 )return pos + ( normal * snoise3(pos + time*0.2 ) * 0.1);

  //float yy = (0.0-pos.y);

//  return pos + ( normal * 0.1);// * snoise3(pos + time*0.4) * 0.3);
  return pos;// + (snoise3(pos + time*0.1) * 0.3);
//  return pos - sample(cos(position.z)*2.0,sin(time));
//  return pos + ( normal * 2.0 * snoise3(pos * sin(time)) * 0.2) * (1.0 + sample(sin(position.z),sin(time)));
//  return pos + (sample(position.z,sin(time) + 2.0)-1.0)*2.0;
//  return pos + ( normal * 2.0 * snoise3(pos * (sin(time)+1.0)) * 0.2) - vec3(1.0,1.0,0.0) * sin(time*0.4)*2.0;// * (sample(position.z,sin(time) + 2.0)-1.0);

//  return aaa;
}

vec3 getNeighbour(vec3 orig, float offsetT, float offsetP){

//  // xyz -> Spherical coordinates
//  float r = sqrt(orig.x*orig.x + orig.y*orig.y + orig.z*orig.z);
//  float theta = acos(orig.z/r);
//  float sgn = (orig.y>=0.?1.:-1.);
//  float phi = sgn * acos(orig.x/sqrt(orig.x*orig.x + orig.y*orig.y));
//
//  // add offset
//  theta += offsetT;
//  phi += offsetP;
//
//  // Spherical coordinates -> xyz
//  float x = r * sin(theta) * cos(phi);
//  float y = r * sin(theta) * sin(phi);
//  float z = r * cos(theta);

  return vec3( orig.x + offsetT, orig.y + offsetP, orig.z );
  
}


void main() {

  vUv = uv;
//  vec3 pos = position + sample(position.z, sin(time) * 2.0) + position * snoise3(position * 0.5 + sin(time));
//  vec3 pos = position + sample(position.x, sin(time) * 2.0 * tan(time)) * position * snoise3(position * 0.5 + sin(time));
//  vec3 pos = position + sample(position.x, sin(time) ) * position * snoise3(position * 0.5 + sin(time)*0.1);

//  vec3 pos = position + sample(position.z, sin(time*0.4) ) * ( normal * snoise3(position*1.0 + time*0.08 ));// + sample(position.x, sin(time) ) * position * snoise3(position * 0.5 + sin(time)*0.1);
//  vec3 pos = position + ( normal * snoise3(position * vec3(1.01,1.01,1.01) + time*0.8 ) * 0.3);// + sample(position.z*position.x*position.y, sin(time) )*0.4;
//  vec3 pos = position + ( normal * snoise3(position * vec3(1.01,1.01,1.01) + time*0.8 ) * 0.3) + sample(position.z, 1.0 )*1.0;
//  vec3 pos = position + ( normal * snoise3(position * vec3(1.01,1.01,1.01) + time*0.8 ) * 0.3);
//  vec3 pos = position;// + ( normal * snoise3(position * vec3(1.01,1.01,1.01) + time*0.8 ) * 0.3);// + sample(position.z*position.x*position.y, sin(time) )*0.4;

  float dx = 0.001;
  vec3 pos = makeNose( position + vec3(dx) );


  // calculating two other positions with a small offset, then get the cross product.
  // ref.) https://www.opengl.org/discussion_boards/showthread.php/165885-Question-about-calculating-vertex-normals?p=1173292&viewfull=1#post1173292
  float gridOffset	= 0.1;
  vec3 neighbour1	= makeNose(getNeighbour(position+vec3(dx)/*for specfic point(0,0,0)*/, gridOffset, 0.        ));
  vec3 neighbour2	= makeNose(getNeighbour(position+vec3(dx)/*for specfic point(0,0,0)*/, 0.        , gridOffset));

  vec3 tangent	= neighbour1 - pos;
  vec3 bitangent= neighbour2 - pos;

  vec3 norm	= cross(normalize(tangent), normalize(bitangent));
	norm		= normalize(norm);
	norm		= normalMatrix * norm;



  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);

//  vPostion = vec4(modelViewMatrix * vec4(pos,1.0)).xyz;
  vPostion =  pos;

//  vNormal = norm;
  vNormal = normalMatrix*normal;
  vModelViewMatrix = modelViewMatrix;
  vNormalMatrix = normalMatrix;



}