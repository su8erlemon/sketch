/**
 * Multiply each vertex by the
 * model-view matrix and the
 * projection matrix (both provided
 * by Three.js) to get a final
 * vertex position
 */


#define QUATERNION_IDENTITY vec4(0, 0, 0, 1)

#ifndef PI
#define PI 3.1415926
#endif

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
}








varying vec3 vNormal;
varying vec3 vPosition;
varying float dd;


uniform vec4 p;
uniform float time;
vec4 quat_from_axis_angle(vec3 axis, float angle)
{ 
  vec4 qr;
  float half_angle = (angle * 0.5) * 3.14159 / 180.0;
  qr.x = axis.x * sin(half_angle);
  qr.y = axis.y * sin(half_angle);
  qr.z = axis.z * sin(half_angle);
  qr.w = cos(half_angle);
  return qr;
}

vec4 RotationBetweenVectors(vec3 start, vec3 dest){
	start = normalize(start);
	dest = normalize(dest);

	float cosTheta = dot(start, dest);
	vec3 rotationAxis;

	// if (cosTheta < -1. + p.z){
	// 	rotationAxis = cross(vec3(0.0, 0.0, 1.0), start);
	// 	if (length(rotationAxis) < p.z )
	// 		rotationAxis = cross(vec3(1.0, 0.0, 0.0), start);

	// 	rotationAxis = normalize(rotationAxis);
	// 	return quat_from_axis_angle(rotationAxis,180.);
	// }

	rotationAxis = cross(start, dest);

	float s = sqrt( (1.+cosTheta)*2. );
	float invs = 1. / s;

	return vec4(
		rotationAxis.x * invs,
		rotationAxis.y * invs,
		rotationAxis.z * invs,
    s * 0.5
	);

}


vec3 getPos(float t){
  return vec3(
    sin(3.*t)*2.0,
    cos(3.*t)*2.0,
    sin(t)*3.0
    // 0.0
  );
}

vec4 quat_mult(vec4 q1, vec4 q2)
{ 
  vec4 qr;
  qr.x = (q1.w * q2.x) + (q1.x * q2.w) + (q1.y * q2.z) - (q1.z * q2.y);
  qr.y = (q1.w * q2.y) - (q1.x * q2.z) + (q1.y * q2.w) + (q1.z * q2.x);
  qr.z = (q1.w * q2.z) + (q1.x * q2.y) - (q1.y * q2.x) + (q1.z * q2.w);
  qr.w = (q1.w * q2.w) - (q1.x * q2.x) - (q1.y * q2.y) - (q1.z * q2.z);
  return qr;
}


vec4 RotateTowards(vec4 q1, vec4 q2, float maxAngle){

	if( maxAngle < 0.001 ){
		// No rotation allowed. Prevent dividing by 0 later.
		return q1;
	}

	float cosTheta = dot(q1, q2);

	if(cosTheta > 0.9999){
		return q2;
	}

	if (cosTheta < 0.){
	    q1 = q1*-1.0;
	    cosTheta *= -1.0;
	}

	float angle = acos(cosTheta);

	if (angle < maxAngle){
		return q2;
	}

	float fT = maxAngle / angle;
	angle = maxAngle;

	vec4 res = (sin((1.0 - fT) * angle) * q1 + sin(fT * angle) * q2) / sin(angle);
	res = normalize(res);
	return res;

}



vec3 rotate_vertex_position(vec3 position )
{ 
  vec3 currentDirection = normalize(getPos(time-p.x) - getPos(time));
  vec4 q1 = RotationBetweenVectors(vec3(0.0, 1.0, 0.0), currentDirection);
  
  vec3 direction = normalize(getPos(time+p.x) - getPos(time));
  vec4 q2 = RotationBetweenVectors(vec3(0.0, 1.0, 0.0), direction);  

  dd = length(dot(q1,q2));
  vec4 qf = RotateTowards(q1,q2,p.y*3.14);
  // vec4 qf = q2;//RotateTowards(q1,q2,p.y*3.14);


  // vec4 q11 = quat_from_axis_angle(vec3(0.0, 1.0, 0.0), time*360.0*p.w);  
  // qf = quat_mult(qf,q11);
  
  // qf.y = 0.0;
  // qf.x = 0.0;
  // qf.z = 0.0;
  // qf.q /= 2.0;

  vec3 v = position.xyz;
  return v + 2.0 * cross(qf.xyz, cross(qf.xyz, v) + qf.w * v);
}
vec3 qtransform( vec4 q, vec3 v ){ 
	return v + 2.0*cross(cross(v, q.xyz ) + q.w*v, q.xyz);
}

void main() {

  vNormal = normal;

  
  vec3 pos = position.xyz;

  // pos = qtransform(
  //   q_look_at(normalize(direction),vec3(0.0,1.0,0.0)),
  //   pos
  // );

  pos = rotate_vertex_position(
    pos
  );
  vPosition = position;
  pos += getPos(time);

  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(pos,1.0);
}