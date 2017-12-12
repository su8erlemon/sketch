precision highp float;

#pragma glslify: cnoise2 = require(glsl-noise/classic/2d)

/**
 * Set the colour to a lovely pink.
 * Note that the color is a 4D Float
 * Vector, R,G,B and A and each part
 * runs from 0.0 to 1.0
 */

uniform sampler2D texture1;

varying vec2 vUv;
uniform float time;

uniform sampler2D tMatCap;
uniform sampler2D tMatCap2;
uniform sampler2D mtex1;
uniform sampler2D mtex2;
varying vec3 vNormal;
varying vec3 vPostion;
varying mat4 vModelViewMatrix;
varying mat3 vNormalMatrix;
varying vec3 vViewPosition;

varying vec3 vWorldPosition;
uniform vec3 lightPosition1;
uniform vec3 lightPosition2;
uniform float height;
uniform float max1;
uniform float min1;

varying vec2 vN2;
varying vec3 e;
varying vec3 n;


float rand(vec2 co){
    return sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453;
}


vec2 parallaxMap( in vec3 V ) {

/*
//    float initialHeight = texture2D( tMatCap2, vUv ).r;
    float initialHeight = texture2D( mtex2, vUv ).r;

    // No Offset Limitting: messy, floating output at grazing angles.
    //"vec2 texCoordOffset = parallaxScale * V.xy / V.z * initialHeight;",

    // Offset Limiting
    vec2 texCoordOffset = c * V.xy * initialHeight;
    return vUv - texCoordOffset;
    */

    // Determine number of layers from angle between V and N
    float numLayers = mix( max1, min1, abs( dot( vec3( 0.0, 0.0, 1.0 ), V ) ) );

    float layerHeight = 1.0 / numLayers;
    float currentLayerHeight = 0.0;
    // Shift of texture coordinates for each iteration
    vec2 dtex = height * V.xy / V.z / numLayers;

    vec2 currentTextureCoords = vUv;

    float heightFromTexture = texture2D( tMatCap2, currentTextureCoords ).r;

    // while ( heightFromTexture > currentLayerHeight )
    // Infinite loops are not well supported. Do a "large" finite
    // loop, but not too large, as it slows down some compilers.
    for ( int i = 0; i < 30; i += 1 ) {
      if ( heightFromTexture <= currentLayerHeight ) {
        break;
      }
      currentLayerHeight += layerHeight;
      // Shift texture coordinates along vector V
      currentTextureCoords -= dtex;
      heightFromTexture = texture2D( tMatCap2, currentTextureCoords ).r;
    }

    return currentTextureCoords;

}


vec2 perturbUv( vec3 surfPosition, vec3 surfNormal, vec3 viewPosition ) {

    vec2 texDx = dFdx( vUv );
    vec2 texDy = dFdy( vUv );

    vec3 vSigmaX = dFdx( surfPosition );
    vec3 vSigmaY = dFdy( surfPosition );
    vec3 vR1 = cross( vSigmaY, surfNormal );
    vec3 vR2 = cross( surfNormal, vSigmaX );
    float fDet = dot( vSigmaX, vR1 );

    vec2 vProjVscr = ( 1.0 / fDet ) * vec2( dot( vR1, viewPosition ), dot( vR2, viewPosition ) );
    vec3 vProjVtex;
    vProjVtex.xy = texDx * vProjVscr.x + texDy * vProjVscr.y;
    vProjVtex.z = dot( surfNormal, viewPosition );

    return parallaxMap( vProjVtex );
}

void main() {

  vNormalMatrix;
  vNormal;
  vUv;


  vec3 vvv = vNormal;
  vec3 vNormal =  normalize((texture2D( mtex2, vUv ).rgb * 2.0 - 1.0)*.4 + vvv);

//  vec3 mNormal = (texture2D(mtex2, vUv) * 2.0 - 1.0).rgb;

//  float c = 0.35 + max(0.0, dot(vNormal, lightDirection)) * 0.4 * shadowMask.x;

  vec4 p = vec4( vPostion, 1. );
  vec3 e = normalize( vec3( vModelViewMatrix * p ) );
  vec3 n = normalize( vNormal );

//  float c = max(0.0, dot(n, lightDirection));
  vec3 c = vec3(0.0);
  c += max(0.0, dot(normalize(vNormal), normalize(lightPosition1))) * vec3(0.95,0.95,0.95) * 2.1;
  c += max(0.0, dot(normalize(vNormal), normalize(lightPosition2))) * 1.7;

//  c += max(0.0, dot(normalize(mNormal), normalize(lightPosition1))) * max(0.0, dot(normalize(vNormal), normalize(lightPosition1)));
//  c += max(0.0, dot(normalize(mNormal), normalize(lightPosition2))) * max(0.0, dot(normalize(vNormal), normalize(lightPosition2)));

//  c += max(0.0, dot(normalize(mNormal), normalize(lightPosition2)));

  vec3 r = reflect( e, n );
  float m = 2. * sqrt(
    pow( r.x, 2. ) +
    pow( r.y, 2. ) +
    pow( r.z + 1., 2. )
  );
  vec2 vN = r.xy / m + .5;

  vec3 base = texture2D( tMatCap, vN ).rgb;
//  vec3 base = texture2D( tMatCap, vUv ).rgb;
//  gl_FragColor = vec4( base , 1.0 );
//  gl_FragColor = vec4( vNormal , 1.0 );
//  gl_FragColor = vec4( c, 1.0 );

   vec2 mapUv = perturbUv( -vViewPosition, normalize( vNormal ), normalize( vViewPosition ) );
//  vec3 base2 = texture2D( tMatCap2, vUv ).rgb;
//  vec3 base22 = texture2D( tMatCap2, vUv - base2.r * 0.05 ).rgb;
//  vec3 base22 = texture2D( tMatCap2, mapUv ).rgb;
  vec3 base22 = texture2D( tMatCap2, vUv ).rgb;
  vec3 base22r = (1.0-texture2D( tMatCap2, vUv ).rgb);
//  vec3 base222 = texture2D( tMatCap2, mapUv ).rgb;
//  vec3 base223 = texture2D( mtex1, mapUv ).rgb;
//  gl_FragColor = vec4( base2, base2.r<0.2?1.0:0.0 );

//  gl_FragColor -= vec4( vec3(0.4,1.4,0.2) * base22, 0.0 );
  gl_FragColor += vec4( vec3(22./255.,22./255.,22./255.) * base22, 1.0 );
  gl_FragColor += vec4( vec3(232./255.,232./255.,232./255.) * base22r, 1.0 );
  gl_FragColor = base22r.r < 0.5?gl_FragColor:vec4(vec3(232./255., 202./255., 59./255.)*smoothstep(0.0,0.5,base22r), 1.0 );
//  gl_FragColor = base22r.r < 0.5?gl_FragColor:vec4(vec3(232./255., 202./255., 59./255.)*smoothstep(0.0,1.0,base22r), 1.0 );
//  gl_FragColor = base22r.r < 0.5?gl_FragColor:vec4(vec3(232./255., 202./255., 59./255.)*smoothstep(0.0,1.0,base22r), 1.0 );

//  gl_FragColor += vec4( vec3(32./255.,32./255.,32./255.) * base22*.5, 1.0 );

//  gl_FragColor += vec4( vec3(232./255.,132./255.,232./255.)* base22r , 1.0 );
//  gl_FragColor += vec4( vec3(1.0,1.0,1.0) * base223, 1.0 );
//  gl_FragColor += vec4( vec3(0.1,0.3,0.3), 1.0 );
//  gl_FragColor += vec4( vec3(1.0,1.0,1.0)*base22, 1.0 );
//  gl_FragColor += vec4( base22, 1.0 );



//  gl_FragColor *= vec4( vec3(sin(vUv.x*4000.0) + sin(vUv.y*4000.0)),1.0);


  float depth = gl_FragCoord.z / gl_FragCoord.w;
  float fogFactor = smoothstep( 5.0, .1, depth );


    gl_FragColor *= vec4( c*base22r * fogFactor, 1.0  );
//    gl_FragColor = vec4( c, 1.0 );

//


//  vec3 base3 = texture2D( tMatCap2, vUv ).rgb;
//  gl_FragColor = vec4( base3, 1.0 );
//  gl_FragColor = vec4( base3, 1.0 );

//  vec3 base44 = texture2D( mtex2, vUv ).rgb;
//  gl_FragColor = vec4( base44, 1.0 );

//  gl_FragColor *= vec4( 1.0 - base3, 1.0 );




//    gl_FragColor = vec4( vNormal, 1.0 );

//  vec3 base2 = texture2D( tMatCap2, vN ).rgb;
//  gl_FragColor = vec4( base2, 1.0 );



}