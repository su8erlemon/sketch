!function e(n,t,o){function i(a,c){if(!t[a]){if(!n[a]){var s="function"==typeof require&&require;if(!c&&s)return s(a,!0);if(r)return r(a,!0);var v=new Error("Cannot find module '"+a+"'");throw v.code="MODULE_NOT_FOUND",v}var l=t[a]={exports:{}};n[a][0].call(l.exports,function(e){var t=n[a][1][e];return i(t||e)},l,l.exports,e,n,t,o)}return t[a].exports}for(var r="function"==typeof require&&require,a=0;a<o.length;a++)i(o[a]);return i}({1:[function(e,n,t){"use strict";function o(){function e(){n=window.innerWidth,t=window.innerHeight,r&&(r.setSize(n,t),r.setViewport(0,0,n,t),c.aspect=n/t,c.updateProjectionMatrix())}var n,t;n=window.innerWidth,t=window.innerHeight;var o=Math.min(1.5,window.devicePixelRatio),r=new THREE.WebGLRenderer({canvas:document.getElementById("canvas"),antialias:!0,alpha:!0});r.setClearColor(13421772,0),r.setSize(n,t),r.setPixelRatio(o);var a=new THREE.Scene,c=new THREE.PerspectiveCamera(75,n/t,.01,1e3);c.position.set(0,0,-1),c.lookAt(new THREE.Vector3);var s=new i(c);return window.addEventListener("resize",e),{renderer:r,scene:a,controls:s,camera:c}}var i=e("three-orbit-controls")(THREE);n.exports=o},{"three-orbit-controls":4}],2:[function(e,n,t){"use strict";function o(){g.render(),P+=.04,P<6.28&&(P-=6.28),E.time.value+=1/60,x.uniforms.time.value+=1/60,requestAnimationFrame(o),s.render(c,a)}var i=e("./lib/createThree"),r=i(),a=r.camera,c=r.scene,s=r.renderer;r.controls;window.renderer=s,s.shadowMap.enabled=!0,s.shadowMap.type=THREE.PCFSoftShadowMap;var v=e("glslify"),l=v(["precision highp float;\n#define GLSLIFY 1\n\n/**\n * Set the colour to a lovely pink.\n * Note that the color is a 4D Float\n * Vector, R,G,B and A and each part\n * runs from 0.0 to 1.0\n */\n\nuniform sampler2D texture1;\n\nvarying vec2 vUv;\nuniform float time;\n\nuniform sampler2D tMatCap;\nuniform sampler2D tMatCap2;\nuniform sampler2D mtex1;\nuniform sampler2D mtex2;\nvarying vec3 vNormal;\nvarying vec3 vPostion;\nvarying mat4 vModelViewMatrix;\nvarying mat3 vNormalMatrix;\n\nvarying vec3 vWorldPosition;\nuniform vec3 lightPosition1;\nuniform vec3 lightPosition2;\n\nvarying vec2 vN2;\nvarying vec3 e;\nvarying vec3 n;\n\nvoid main() {\n\n  vNormalMatrix;\n  vNormal;\n  vUv;\n\n  vec3 mNormal    = (texture2D(mtex2, vUv) * 2.0 - 1.0).rgb;\n\n//  float c = 0.35 + max(0.0, dot(vNormal, lightDirection)) * 0.4 * shadowMask.x;\n\n  vec4 p = vec4( vPostion, 1. );\n  vec3 e = normalize( vec3( vModelViewMatrix * p ) );\n  vec3 n = normalize( vNormal );\n\n//  float c = max(0.0, dot(n, lightDirection));\n  vec3 c = vec3(0.0);\n//  c += max(0.0, dot(normalize(vNormal), normalize(lightPosition1))) * vec3(1.0,1.0,0.8);\n  c += max(0.0, dot(normalize(vNormal), normalize(lightPosition2)));\n\n//  c += max(0.0, dot(normalize(mNormal), normalize(lightPosition1))) * max(0.0, dot(normalize(vNormal), normalize(lightPosition1)));\n//  c += max(0.0, dot(normalize(mNormal), normalize(lightPosition2))) * max(0.0, dot(normalize(vNormal), normalize(lightPosition2)));\n\n//  c += max(0.0, dot(normalize(mNormal), normalize(lightPosition2)));\n\n  vec3 r = reflect( e, n );\n  float m = 2. * sqrt(\n    pow( r.x, 2. ) +\n    pow( r.y, 2. ) +\n    pow( r.z + 1., 2. )\n  );\n  vec2 vN = r.xy / m + .5;\n\n  vec3 base = texture2D( tMatCap, vN ).rgb;\n//  vec3 base = texture2D( tMatCap, vUv ).rgb;\n  gl_FragColor = vec4( base + c, 1.0 );\n//  gl_FragColor = vec4( vNormal , 1.0 );\n//  gl_FragColor = vec4( c, 1.0 );\n\n//  vec3 base2 = texture2D( tMatCap2, vUv ).rgb;\n//  gl_FragColor = vec4( base2, 1.0 );\n//\n//  vec3 base3 = texture2D( mtex2, vUv ).rgb;\n//  gl_FragColor = vec4( base3, 1.0 );\n\n//  gl_FragColor = vec4( mNormal, 1.0 );\n\n//  vec3 base2 = texture2D( tMatCap2, vN ).rgb;\n//  gl_FragColor = vec4( base2, 1.0 );\n\n}"]),u=v(['#define GLSLIFY 1\n//\n// Description : Array and textureless GLSL 2D/3D/4D simplex\n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//\n\nvec3 mod289_1(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289_1(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute_1(vec4 x) {\n     return mod289_1(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt_1(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat snoise(vec3 v)\n  {\n  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\n\n// First corner\n  vec3 i  = floor(v + dot(v, C.yyy) );\n  vec3 x0 =   v - i + dot(i, C.xxx) ;\n\n// Other corners\n  vec3 g = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g;\n  vec3 i1 = min( g.xyz, l.zxy );\n  vec3 i2 = max( g.xyz, l.zxy );\n\n  //   x0 = x0 - 0.0 + 0.0 * C.xxx;\n  //   x1 = x0 - i1  + 1.0 * C.xxx;\n  //   x2 = x0 - i2  + 2.0 * C.xxx;\n  //   x3 = x0 - 1.0 + 3.0 * C.xxx;\n  vec3 x1 = x0 - i1 + C.xxx;\n  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\n  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y\n\n// Permutations\n  i = mod289_1(i);\n  vec4 p = permute_1( permute_1( permute_1(\n             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))\n           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n\n// Gradients: 7x7 points over a square, mapped onto an octahedron.\n// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\n  float n_ = 0.142857142857; // 1.0/7.0\n  vec3  ns = n_ * D.wyz - D.xzx;\n\n  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)\n\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n\n  vec4 x = x_ *ns.x + ns.yyyy;\n  vec4 y = y_ *ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n\n  vec4 b0 = vec4( x.xy, y.xy );\n  vec4 b1 = vec4( x.zw, y.zw );\n\n  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\n  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\n  vec4 s0 = floor(b0)*2.0 + 1.0;\n  vec4 s1 = floor(b1)*2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n\n  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n\n  vec3 p0 = vec3(a0.xy,h.x);\n  vec3 p1 = vec3(a0.zw,h.y);\n  vec3 p2 = vec3(a1.xy,h.z);\n  vec3 p3 = vec3(a1.zw,h.w);\n\n//Normalise gradients\n  vec4 norm = taylorInvSqrt_1(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n\n// Mix final noise value\n  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n  m = m * m;\n  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),\n                                dot(p2,x2), dot(p3,x3) ) );\n  }\n\n//\n// GLSL textureless classic 3D noise "cnoise",\n// with an RSL-style periodic variant "pnoise".\n// Author:  Stefan Gustavson (stefan.gustavson@liu.se)\n// Version: 2011-10-11\n//\n// Many thanks to Ian McEwan of Ashima Arts for the\n// ideas for permutation and gradient selection.\n//\n// Copyright (c) 2011 Stefan Gustavson. All rights reserved.\n// Distributed under the MIT license. See LICENSE file.\n// https://github.com/ashima/webgl-noise\n//\n\nvec3 mod289_0(vec3 x)\n{\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289_0(vec4 x)\n{\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute_0(vec4 x)\n{\n  return mod289_0(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt_0(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nvec3 fade(vec3 t) {\n  return t*t*t*(t*(t*6.0-15.0)+10.0);\n}\n\n// Classic Perlin noise\nfloat cnoise(vec3 P)\n{\n  vec3 Pi0 = floor(P); // Integer part for indexing\n  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1\n  Pi0 = mod289_0(Pi0);\n  Pi1 = mod289_0(Pi1);\n  vec3 Pf0 = fract(P); // Fractional part for interpolation\n  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n  vec4 iy = vec4(Pi0.yy, Pi1.yy);\n  vec4 iz0 = Pi0.zzzz;\n  vec4 iz1 = Pi1.zzzz;\n\n  vec4 ixy = permute_0(permute_0(ix) + iy);\n  vec4 ixy0 = permute_0(ixy + iz0);\n  vec4 ixy1 = permute_0(ixy + iz1);\n\n  vec4 gx0 = ixy0 * (1.0 / 7.0);\n  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n  gx0 = fract(gx0);\n  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n  vec4 sz0 = step(gz0, vec4(0.0));\n  gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n  gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n\n  vec4 gx1 = ixy1 * (1.0 / 7.0);\n  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n  gx1 = fract(gx1);\n  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n  vec4 sz1 = step(gz1, vec4(0.0));\n  gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n  gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n\n  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);\n  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);\n  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);\n  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);\n  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);\n  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);\n  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);\n  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);\n\n  vec4 norm0 = taylorInvSqrt_0(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n  g000 *= norm0.x;\n  g010 *= norm0.y;\n  g100 *= norm0.z;\n  g110 *= norm0.w;\n  vec4 norm1 = taylorInvSqrt_0(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n  g001 *= norm1.x;\n  g011 *= norm1.y;\n  g101 *= norm1.z;\n  g111 *= norm1.w;\n\n  float n000 = dot(g000, Pf0);\n  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n  float n111 = dot(g111, Pf1);\n\n  vec3 fade_xyz = fade(Pf0);\n  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n  return 2.2 * n_xyz;\n}\n\n#define PI 3.1415;\n\nuniform float time;\nvarying vec2 vUv;\nuniform sampler2D tMatCap2;\nuniform sampler2D mtex2;\n\nvarying vec3 vNormal;\nvarying vec3 vPostion;\nvarying vec3 vWorldPosition;\nvarying mat4 vModelViewMatrix;\nvarying mat3 vNormalMatrix;\n\n// chunk(shadowmap_pars_vertex);\n\nvec3 makeNose(vec3 pos, vec2 uv2){\n//  return  (pos);\n//    return  (pos) + (normal * texture2D( mtex2, uv2 ).r) * 0.07;\n//    return  (pos) + (normal * texture2D( tMatCap2, uv2 ).r) * 0.03;\n    return  (pos) + (normal * texture2D( tMatCap2, uv2 ).r) * 0.2 + (normal * texture2D( mtex2, uv2 + time*.1 ).r) * 0.07 ;\n//    return  (pos) + (normal) * 0.1 - cnoise3(pos*2.0)*0.3;\n//  return  (pos) - cnoise3((pos))*0.3;\n//  return (pos) + (cnoise3((pos)*3.0 + time*0.8)*0.1) * normal;\n//  return (pos) + (cnoise3((pos)*10.0 + time*0.8)*0.1) * normal;\n}\n\nvec3 getNeighbour(vec3 orig, float offsetT, float offsetP){\n\n  // xyz -> Spherical coordinates\n  float r = sqrt(orig.x*orig.x + orig.y*orig.y + orig.z*orig.z);\n  float theta = acos(orig.z/r);\n  float sgn = (orig.y>=0.?1.:-1.);\n  float phi = sgn * acos(orig.x/sqrt(orig.x*orig.x + orig.y*orig.y));\n\n  // add offset\n  theta += offsetT;\n  phi += offsetP;\n\n  // Spherical coordinates -> xyz\n  float x = r * sin(theta) * cos(phi);\n  float y = r * sin(theta) * sin(phi);\n  float z = r * cos(theta);\n\n  return vec3( x, y, z );\n\n}\n\nvoid main() {\n\n  vUv = uv*.4;\n\n  vec3 pos = makeNose(position+vec3(0.001), vUv);\n\n  float gridOffset\t= 0.001;\n  vec3 neighbour1\t= makeNose(\n   getNeighbour(position+vec3(0.001)/*for specfic point(0,0,0)*/, gridOffset, 0.        ),\n   vec2(vUv.x + vUv.x * 0.01,vUv.y)\n  );\n\n  vec3 neighbour2\t= makeNose(\n   getNeighbour(position+vec3(0.001)/*for specfic point(0,0,0)*/,0.        , gridOffset),\n   vec2(vUv.x,vUv.y + vUv.y * 0.01)\n  );\n\n  vec3 tangent\t= neighbour1 - pos;\n  vec3 bitangent= neighbour2 - pos;\n\n  vec3 norm\t= cross(normalize(tangent), normalize(bitangent));\n//  norm = normalize(norm);\n//  norm = normalMatrix * norm;\n\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);\n\n  vPostion = pos;\n\n  vec4 worldPosition = modelMatrix * vec4(pos, 1.0);\n  // chunk(shadowmap_vertex);\n\n  // store the world position as varying for lighting\n  vWorldPosition = worldPosition.xyz;\n\n  vNormal = norm;\n  vModelViewMatrix = modelViewMatrix;\n  vNormalMatrix = normalMatrix;\n\n}']),m=v(['//#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)\n//\n// GLSL textureless classic 2D noise "cnoise",\n// with an RSL-style periodic variant "pnoise".\n// Author:  Stefan Gustavson (stefan.gustavson@liu.se)\n// Version: 2011-08-22\n//\n// Many thanks to Ian McEwan of Ashima Arts for the\n// ideas for permutation and gradient selection.\n//\n// Copyright (c) 2011 Stefan Gustavson. All rights reserved.\n// Distributed under the MIT license. See LICENSE file.\n// https://github.com/ashima/webgl-noise\n//\n\nvec4 mod289(vec4 x)\n{\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x)\n{\n  return mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nvec2 fade(vec2 t) {\n  return t*t*t*(t*(t*6.0-15.0)+10.0);\n}\n\n// Classic Perlin noise\nfloat cnoise(vec2 P)\n{\n  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);\n  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);\n  Pi = mod289(Pi); // To avoid truncation effects in permutation\n  vec4 ix = Pi.xzxz;\n  vec4 iy = Pi.yyww;\n  vec4 fx = Pf.xzxz;\n  vec4 fy = Pf.yyww;\n\n  vec4 i = permute(permute(ix) + iy);\n\n  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;\n  vec4 gy = abs(gx) - 0.5 ;\n  vec4 tx = floor(gx + 0.5);\n  gx = gx - tx;\n\n  vec2 g00 = vec2(gx.x,gy.x);\n  vec2 g10 = vec2(gx.y,gy.y);\n  vec2 g01 = vec2(gx.z,gy.z);\n  vec2 g11 = vec2(gx.w,gy.w);\n\n  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));\n  g00 *= norm.x;\n  g01 *= norm.y;\n  g10 *= norm.z;\n  g11 *= norm.w;\n\n  float n00 = dot(g00, vec2(fx.x, fy.x));\n  float n10 = dot(g10, vec2(fx.y, fy.y));\n  float n01 = dot(g01, vec2(fx.z, fy.z));\n  float n11 = dot(g11, vec2(fx.w, fy.w));\n\n  vec2 fade_xy = fade(Pf.xy);\n  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);\n  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);\n  return 2.3 * n_xy;\n}\n\n//#extension GL_OES_standard_derivatives : enable\n\nprecision mediump float;\n#define GLSLIFY 1\n\nuniform sampler2D tDiffuse;\nuniform float time;\nvarying vec2 vUv;\n\n//void main() {\n//\n//   vec2 m = vec2(.5 * 2.0 - 1.0, -.5 * 2.0 + 1.0);\n//   vec2 p = (vUv * 2.0 - 1.0) / min(.5, .5);\n//\n//  vec2 uv = vUv - 0.5;\n//\n//\tvec3 t = vec3 ( 0.0, 0.0, 0.0 );\n//\n////\tt += abs( 1.0 / (sin( uv.x + sin(uv.y+time)* 0.0 ) * 40.0) );\n//\n//\tt += abs( 1.0 / (sin( (uv.x + sin(uv.y*20.0) * 0.01)) * 200.0) );\n//\n//\n//\tuv -= 0.1;\n//\tt += abs( 1.0 / (sin( (uv.x + sin(uv.y*10.0) * 0.01)) * 200.0) );// * sin(uv.y*20.0+ time);\n//\n//\n//\tuv -= 0.3;\n//  t += abs( 1.0 / (sin( uv.x) * 200.0) );\n//\n//  uv += 0.8;\n//  t += abs( 1.0 / (sin( (uv.x )) * 200.0) );//* sin(uv.y*30.0+ time);\n//\n////\tt *= abs( 1.0 / (sin( uv.x + sin(uv.y+time)* 0.0 ) * 40.0) );\n//\n//    gl_FragColor = vec4(t , 1.0);\n////   gl_FragColor = vec4( sin(time),0.0,0.0,1.0);\n//\n//}\n\nconst vec2 resolution = vec2(512,512);\n\nfloat random (in vec2 st) {\n    return fract(sin(dot(st.xy,\n                         vec2(12.9898,78.233)))\n                 * 43758.5453123);\n}\n\nfloat checkRect(vec2 lt, vec2 dims, vec2 coord){\n\tvec2 rb = lt + dims;\n\tif ((coord.x>lt.x) && (coord.x < rb.x) && (coord.y>lt.y) && (coord.y < rb.y))\n\t\treturn 1.0;\n\telse\n\t\treturn 0.0;\n}\n\nvoid main( void ) {\n\n\tvec3 outputColor = vec3 ( 0.0, 0.0, 0.0 );\n\n  vec2 m = vec2(.5 * 2.0 - 1.0, -.5 * 2.0 + 1.0);\n  vec2 p = (vUv * 2.0 - 1.0) / min(.5, .5);\n  vec2 uv = vUv - 0.5;\n  uv *= vec2(1.0,2.0);\n\n//\tt += abs( 1.0 / (sin( uv.x + sin(uv.y+time)* 0.0 ) * 40.0) );\n\n//\toutputColor += abs( 1.0 / (sin( (uv.x + sin(uv.y*20.0) * 0.01)) * 200.0) );\n\toutputColor += sin(cnoise(uv*6.+time)*5.0) * 0.333\n\t               + (1.0+sin(cnoise(uv*3.+time) *5.0)) * 0.333\n\t               + (1.0+sin(cnoise(uv*4.+time) *5.0)) * 0.333;\n//\toutputColor += cnoise2(uv*3.+time);\n\n//\toutputColor += abs( 1.0 / (sin( (uv.x + sin(uv.y*10.0) * 0.01)) * 200.0) );// * sin(uv.y*20.0+ time);\n\n//\tuv += 0.35;\n//  outputColor += abs( 1.0 / (sin( uv.x+ sin(uv.y*40.0+time*10.0) * 0.01 ) * 200.0)) * .8;\n//\n//\n//\tuv -= 0.35;\n//  outputColor += vec3(abs( 3.0 * sin(time)*2.0 / (sin( uv.x) * 200.0) ),0.0,0.0);\n//\n//  uv -= 0.45;\n//  outputColor += abs( 3.0 / (sin( uv.x + (sin(time)+1.0)/2.0) * 200.0) ) * .8;\n//\n////  uv += 0.8;\n////  t += abs( 1.0 / (sin( (uv.x )) * 200.0) );//* sin(uv.y*30.0+ time);\n//\n////\tt *= abs( 1.0 / (sin( uv.x + sin(uv.y+time)* 0.0 ) * 40.0) );\n//\n//\n//\tvec2 posf = fract(vUv);\n//\n//  for(float i = 0.0; i < 20.0; i++){\n//\t  outputColor += vec3(checkRect(vec2(0.3,1.0 * i/20.0),vec2(.01,0.02),posf)) * .8;\n//  }\n//\n//  for(float i = 0.0; i < 3.0; i++){\n//  \t outputColor += vec3(checkRect(vec2(0.05,1.0 * i/3.0),vec2(.01,0.1),posf)) * .8;\n//  }\n//\n//  for(float i = 0.0; i < 14.0; i++){\n//\t  outputColor += vec3(checkRect(vec2(0.7,1.0 * i/14.0),vec2(.01+(i*0.003+sin(time)*0.1),0.02),posf)) * .8;\n//  }\n//\n//  for(float i = 0.0; i < 8.0; i++){\n//  \t outputColor += vec3(checkRect(vec2(0.85,1.0 * i/8.0),vec2(.01, 0.1),posf)) * .8;\n//  }\n//\n\n//\toutputColor += vec3(checkRect(\n//\t  vec2(0.3,0.0), // x,  y start points, bottom=0 top=1, left=0 right=1\n//\t  vec2(.01,0.7), // width, height\n//\tposf));\n\n//\toutputColor += vec3(checkRect(vec2(0.3,0.2),vec2(.01,1.),posf));\n\n\tgl_FragColor = vec4(vec3(outputColor.r>0.7?outputColor.r:outputColor.r),1.0);//vec3(random(position)), 1.0);\n\n}']),d=v(["#define GLSLIFY 1\nvarying vec2 vUv;\nvoid main() {\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}"]);THREE.Texture1={uniforms:{tDiffuse:{value:null},tDiffusePrev:{value:null},mouseX:{value:1},mouseY:{value:1},time:{value:1},opacity:{value:1}},vertexShader:d,fragmentShader:m};var p=new THREE.WebGLRenderTarget(1024,1024);p.texture.wrapS=THREE.MirroredRepeatWrapping,p.texture.wrapT=THREE.MirroredRepeatWrapping;var g=new THREE.EffectComposer(s,p),x=new THREE.ShaderPass(THREE.Texture1);g.addPass(x);var f=new THREE.SpotLight(16777215);f.position.set(1,-.5,.2),f.target.position.set(0,0,0);var h=(new THREE.SpotLightHelper(f),new THREE.SpotLight(16777215));h.position.set(-2,2,0),h.target.position.set(0,0,0);var y=(new THREE.SpotLightHelper(h),new THREE.MeshPhongMaterial({color:16777215})),b=(new THREE.MeshBasicMaterial({color:16711680}),new THREE.Mesh(new THREE.BoxGeometry(5,.1,5),y));b.castShadow=!0,b.receiveShadow=!0;var E={time:{type:"f",value:0},tMatCap:{type:"t",value:THREE.ImageUtils.loadTexture("img/matcap.jpg")},tMatCap2:{type:"t",value:p},mtex1:{type:"t",value:THREE.ImageUtils.loadTexture("img/download.jpg")},mtex2:{type:"t",value:THREE.ImageUtils.loadTexture("img/small_metal_debris_Displacement.jpg")},lightPosition1:{type:"v3",value:f.position},lightPosition2:{type:"v3",value:h.position}};console.log(),E.mtex2.value.wrapS=E.mtex2.value.wrapT=THREE.RepeatWrapping;var w=new THREE.ShaderMaterial({uniforms:E,vertexShader:u,fragmentShader:l,transparent:!0,side:THREE.DoubleSide});w.extensions.derivatives=!0,w.extensions.drawBuffers=!0;var z=new THREE.Mesh(new THREE.SphereGeometry(.4,512,512),w);c.add(z),o();var P=0;console.log("asasas")},{"./lib/createThree":1,glslify:3}],3:[function(e,n,t){n.exports=function(e){"string"==typeof e&&(e=[e]);for(var n=[].slice.call(arguments,1),t=[],o=0;o<e.length-1;o++)t.push(e[o],n[o]||"");return t.push(e[o]),t.join("")}},{}],4:[function(e,n,t){n.exports=function(e){function n(n,t){function o(){return 2*Math.PI/60/60*L.autoRotateSpeed}function i(){return Math.pow(.95,L.zoomSpeed)}function r(e){V.theta-=e}function a(e){V.phi-=e}function c(n){L.object instanceof e.PerspectiveCamera?Y/=n:L.object instanceof e.OrthographicCamera?(L.object.zoom=Math.max(L.minZoom,Math.min(L.maxZoom,L.object.zoom*n)),L.object.updateProjectionMatrix(),Z=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),L.enableZoom=!1)}function s(n){L.object instanceof e.PerspectiveCamera?Y*=n:L.object instanceof e.OrthographicCamera?(L.object.zoom=Math.max(L.minZoom,Math.min(L.maxZoom,L.object.zoom/n)),L.object.updateProjectionMatrix(),Z=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),L.enableZoom=!1)}function v(e){q.set(e.clientX,e.clientY)}function l(e){J.set(e.clientX,e.clientY)}function u(e){B.set(e.clientX,e.clientY)}function m(e){W.set(e.clientX,e.clientY),X.subVectors(W,q);var n=L.domElement===document?L.domElement.body:L.domElement;r(2*Math.PI*X.x/n.clientWidth*L.rotateSpeed),a(2*Math.PI*X.y/n.clientHeight*L.rotateSpeed),q.copy(W),L.update()}function d(e){$.set(e.clientX,e.clientY),ee.subVectors($,J),ee.y>0?c(i()):ee.y<0&&s(i()),J.copy($),L.update()}function p(e){K.set(e.clientX,e.clientY),Q.subVectors(K,B),oe(Q.x,Q.y),B.copy(K),L.update()}function g(e){}function x(e){e.deltaY<0?s(i()):e.deltaY>0&&c(i()),L.update()}function f(e){switch(e.keyCode){case L.keys.UP:oe(0,L.keyPanSpeed),L.update();break;case L.keys.BOTTOM:oe(0,-L.keyPanSpeed),L.update();break;case L.keys.LEFT:oe(L.keyPanSpeed,0),L.update();break;case L.keys.RIGHT:oe(-L.keyPanSpeed,0),L.update()}}function h(e){q.set(e.touches[0].pageX,e.touches[0].pageY)}function y(e){var n=e.touches[0].pageX-e.touches[1].pageX,t=e.touches[0].pageY-e.touches[1].pageY,o=Math.sqrt(n*n+t*t);J.set(0,o)}function b(e){B.set(e.touches[0].pageX,e.touches[0].pageY)}function E(e){W.set(e.touches[0].pageX,e.touches[0].pageY),X.subVectors(W,q);var n=L.domElement===document?L.domElement.body:L.domElement;r(2*Math.PI*X.x/n.clientWidth*L.rotateSpeed),a(2*Math.PI*X.y/n.clientHeight*L.rotateSpeed),q.copy(W),L.update()}function w(e){var n=e.touches[0].pageX-e.touches[1].pageX,t=e.touches[0].pageY-e.touches[1].pageY,o=Math.sqrt(n*n+t*t);$.set(0,o),ee.subVectors($,J),ee.y>0?s(i()):ee.y<0&&c(i()),J.copy($),L.update()}function z(e){K.set(e.touches[0].pageX,e.touches[0].pageY),Q.subVectors(K,B),oe(Q.x,Q.y),B.copy(K),L.update()}function P(e){}function C(e){if(!1!==L.enabled){if(e.preventDefault(),e.button===L.mouseButtons.ORBIT){if(!1===L.enableRotate)return;v(e),k=A.ROTATE}else if(e.button===L.mouseButtons.ZOOM){if(!1===L.enableZoom)return;l(e),k=A.DOLLY}else if(e.button===L.mouseButtons.PAN){if(!1===L.enablePan)return;u(e),k=A.PAN}k!==A.NONE&&(document.addEventListener("mousemove",T,!1),document.addEventListener("mouseup",M,!1),L.dispatchEvent(j))}}function T(e){if(!1!==L.enabled)if(e.preventDefault(),k===A.ROTATE){if(!1===L.enableRotate)return;m(e)}else if(k===A.DOLLY){if(!1===L.enableZoom)return;d(e)}else if(k===A.PAN){if(!1===L.enablePan)return;p(e)}}function M(e){!1!==L.enabled&&(g(e),document.removeEventListener("mousemove",T,!1),document.removeEventListener("mouseup",M,!1),L.dispatchEvent(U),k=A.NONE)}function R(e){!1===L.enabled||!1===L.enableZoom||k!==A.NONE&&k!==A.ROTATE||(e.preventDefault(),e.stopPropagation(),x(e),L.dispatchEvent(j),L.dispatchEvent(U))}function _(e){!1!==L.enabled&&!1!==L.enableKeys&&!1!==L.enablePan&&f(e)}function N(e){if(!1!==L.enabled){switch(e.touches.length){case 1:if(!1===L.enableRotate)return;h(e),k=A.TOUCH_ROTATE;break;case 2:if(!1===L.enableZoom)return;y(e),k=A.TOUCH_DOLLY;break;case 3:if(!1===L.enablePan)return;b(e),k=A.TOUCH_PAN;break;default:k=A.NONE}k!==A.NONE&&L.dispatchEvent(j)}}function O(e){if(!1!==L.enabled)switch(e.preventDefault(),e.stopPropagation(),e.touches.length){case 1:if(!1===L.enableRotate)return;if(k!==A.TOUCH_ROTATE)return;E(e);break;case 2:if(!1===L.enableZoom)return;if(k!==A.TOUCH_DOLLY)return;w(e);break;case 3:if(!1===L.enablePan)return;if(k!==A.TOUCH_PAN)return;z(e);break;default:k=A.NONE}}function S(e){!1!==L.enabled&&(P(e),L.dispatchEvent(U),k=A.NONE)}function D(e){e.preventDefault()}this.object=n,this.domElement=void 0!==t?t:document,this.enabled=!0,this.target=new e.Vector3,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.25,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.keyPanSpeed=7,this.autoRotate=!1,this.autoRotateSpeed=2,this.enableKeys=!0,this.keys={LEFT:37,UP:38,RIGHT:39,BOTTOM:40},this.mouseButtons={ORBIT:e.MOUSE.LEFT,ZOOM:e.MOUSE.MIDDLE,PAN:e.MOUSE.RIGHT},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this.getPolarAngle=function(){return F.phi},this.getAzimuthalAngle=function(){return F.theta},this.reset=function(){L.target.copy(L.target0),L.object.position.copy(L.position0),L.object.zoom=L.zoom0,L.object.updateProjectionMatrix(),L.dispatchEvent(H),L.update(),k=A.NONE},this.update=function(){var t=new e.Vector3,i=(new e.Quaternion).setFromUnitVectors(n.up,new e.Vector3(0,1,0)),a=i.clone().inverse(),c=new e.Vector3,s=new e.Quaternion;return function(){var e=L.object.position;return t.copy(e).sub(L.target),t.applyQuaternion(i),F.setFromVector3(t),L.autoRotate&&k===A.NONE&&r(o()),F.theta+=V.theta,F.phi+=V.phi,F.theta=Math.max(L.minAzimuthAngle,Math.min(L.maxAzimuthAngle,F.theta)),F.phi=Math.max(L.minPolarAngle,Math.min(L.maxPolarAngle,F.phi)),F.makeSafe(),F.radius*=Y,F.radius=Math.max(L.minDistance,Math.min(L.maxDistance,F.radius)),L.target.add(G),t.setFromSpherical(F),t.applyQuaternion(a),e.copy(L.target).add(t),L.object.lookAt(L.target),!0===L.enableDamping?(V.theta*=1-L.dampingFactor,V.phi*=1-L.dampingFactor):V.set(0,0,0),Y=1,G.set(0,0,0),!!(Z||c.distanceToSquared(L.object.position)>I||8*(1-s.dot(L.object.quaternion))>I)&&(L.dispatchEvent(H),c.copy(L.object.position),s.copy(L.object.quaternion),Z=!1,!0)}}(),this.dispose=function(){L.domElement.removeEventListener("contextmenu",D,!1),L.domElement.removeEventListener("mousedown",C,!1),L.domElement.removeEventListener("wheel",R,!1),L.domElement.removeEventListener("touchstart",N,!1),L.domElement.removeEventListener("touchend",S,!1),L.domElement.removeEventListener("touchmove",O,!1),document.removeEventListener("mousemove",T,!1),document.removeEventListener("mouseup",M,!1),window.removeEventListener("keydown",_,!1)};var L=this,H={type:"change"},j={type:"start"},U={type:"end"},A={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_DOLLY:4,TOUCH_PAN:5},k=A.NONE,I=1e-6,F=new e.Spherical,V=new e.Spherical,Y=1,G=new e.Vector3,Z=!1,q=new e.Vector2,W=new e.Vector2,X=new e.Vector2,B=new e.Vector2,K=new e.Vector2,Q=new e.Vector2,J=new e.Vector2,$=new e.Vector2,ee=new e.Vector2,ne=function(){var n=new e.Vector3;return function(e,t){n.setFromMatrixColumn(t,0),n.multiplyScalar(-e),G.add(n)}}(),te=function(){var n=new e.Vector3;return function(e,t){n.setFromMatrixColumn(t,1),n.multiplyScalar(e),G.add(n)}}(),oe=function(){var n=new e.Vector3;return function(t,o){var i=L.domElement===document?L.domElement.body:L.domElement;if(L.object instanceof e.PerspectiveCamera){var r=L.object.position;n.copy(r).sub(L.target);var a=n.length();a*=Math.tan(L.object.fov/2*Math.PI/180),ne(2*t*a/i.clientHeight,L.object.matrix),te(2*o*a/i.clientHeight,L.object.matrix)}else L.object instanceof e.OrthographicCamera?(ne(t*(L.object.right-L.object.left)/L.object.zoom/i.clientWidth,L.object.matrix),te(o*(L.object.top-L.object.bottom)/L.object.zoom/i.clientHeight,L.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),L.enablePan=!1)}}();L.domElement.addEventListener("contextmenu",D,!1),L.domElement.addEventListener("mousedown",C,!1),L.domElement.addEventListener("wheel",R,!1),L.domElement.addEventListener("touchstart",N,!1),L.domElement.addEventListener("touchend",S,!1),L.domElement.addEventListener("touchmove",O,!1),window.addEventListener("keydown",_,!1),this.update()}return n.prototype=Object.create(e.EventDispatcher.prototype),n.prototype.constructor=n,Object.defineProperties(n.prototype,{center:{get:function(){return console.warn("THREE.OrbitControls: .center has been renamed to .target"),this.target}},noZoom:{get:function(){return console.warn("THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead."),!this.enableZoom},set:function(e){console.warn("THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead."),this.enableZoom=!e}},noRotate:{get:function(){return console.warn("THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead."),!this.enableRotate},set:function(e){console.warn("THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead."),this.enableRotate=!e}},noPan:{get:function(){return console.warn("THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead."),!this.enablePan},set:function(e){console.warn("THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead."),this.enablePan=!e}},noKeys:{get:function(){return console.warn("THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead."),!this.enableKeys},set:function(e){console.warn("THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead."),this.enableKeys=!e}},staticMoving:{get:function(){return console.warn("THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead."),!this.enableDamping},set:function(e){console.warn("THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead."),this.enableDamping=!e}},dynamicDampingFactor:{get:function(){return console.warn("THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead."),this.dampingFactor},set:function(e){console.warn("THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead."),this.dampingFactor=e}}}),n}},{}]},{},[2]);