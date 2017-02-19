uniform float time;
uniform float gain;

varying vec3 vPosition;
varying vec3 vColor;

float stiffness = 0.1;
float damping = 0.9;
float velocity = 0.0;

vec3 displaceVertexFunc( vec3 pos, float phase, float frequency )
{
    vec3 new_pos;

    new_pos.x = pos.x;
    new_pos.y = pos.y;

    float dist = sqrt(pos.x*pos.x + pos.y*pos.y);
    new_pos.z = sin( frequency * dist + phase );

    return new_pos;
}

void main()	{

    vec3 pos2 = displaceVertexFunc( position, time*3.0, 0.04 ).xyz;
//    vec3 pos = position + vec3( 0.0, 0.0, position.z * pos2.z);

//    float force = stiffness * ( gain - position.z);
//    velocity = damping * (velocity + force);
    vec3 pos = position + vec3( 0.0, 0.0, position.z * gain * pos2.z);



    vColor = color;
    vPosition = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);

}