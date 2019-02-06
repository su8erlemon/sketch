/**
 * Multiply each vertex by the
 * model-view matrix and the
 * projection matrix (both provided
 * by Three.js) to get a final
 * vertex position
 */

varying float vIndex;
varying float vColor;
varying vec2 vUv;

uniform sampler2D posTexture;
uniform float texSize;
uniform float width;
uniform float time;

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
}

void main() {

  
  float thickness = width;

  float lineIndex = position.x;
  float isFront = (lineIndex == 1. || lineIndex == 3. || lineIndex == 5. ) ? 1.0 : 0.0;
  float isTop = (lineIndex == 0. || lineIndex == 1. || lineIndex == 5. ) ? 1.0 : 0.0;

  float index = position.z;
  vIndex = position.z;

  vec2 p00uv = vec2(
    fract((index-1.)/texSize),
    floor((index-1.)/texSize)/texSize
  );
  vec2 p00 = texture2D(posTexture, p00uv).xy;

  vec2 p0uv = vec2(
    fract(index/texSize),
    floor(index/texSize)/texSize
  );
  vec2 p0 = texture2D(posTexture, p0uv).xy;

  vec2 p1uv = vec2(
    fract((index+1.0)/texSize),
    floor((index+1.0)/texSize)/texSize
  );
  vec2 p1 = texture2D(posTexture, p1uv).xy;

  vec2 p2uv = vec2(
    fract((index+2.0)/texSize),
    floor((index+2.0)/texSize)/texSize
  );
  vec2 p2 = texture2D(posTexture, p2uv).xy;

  p00 = index == 0.0 ? p0 : p00;
  p1 = (index+1. >= texSize*texSize) ? p0 : p1;
  p2 = (index+2. >= texSize*texSize) ? p1 : p2;

  vec2 line = p0-p1;
  vec2 normal = normalize(vec2( -line.y, line.x));

  vec2 tangent;
  vec2 miter;
  float leng;

  if( isFront == 1.0 ){
    tangent = normalize(normalize(p1-p2)+normalize(p0-p1));
    miter = normalize(vec2( -tangent.y, tangent.x ));
    leng = thickness / dot( miter,  normal );
  }else{
    tangent = normalize(normalize(p0-p1)+normalize(p00-p0));
    miter = normalize(vec2( -tangent.y, tangent.x ));
    leng = thickness / dot( miter,  normal );
  }

  vec3 pos = vec3(
    vec2((isFront==1.0?p1:p0) + (isTop==1.0?1.0:-1.0) * miter * leng),
    0.0//(isFront==1.0?index+1.:index)*0.03
  );

  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(pos,1.0);

  vUv = vec2(
    isFront == 1.0?1.0:0.0,
    isTop == 1.0?1.0:0.0
  );
}