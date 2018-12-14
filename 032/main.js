//=============================================================================
// import
//=============================================================================

const threeApp = require("./lib/createThree");
const { camera, scene, renderer, controls } = threeApp();

require("./lib/CopyShader");
require("./lib/EffectComposer");
require("./lib/RenderPass");
require("./lib/ShaderPass");
require("./lib/SSAARenderPass");
require("./lib/pass/Pass1");
require("./lib/pass/Pass2");
require("./lib/pass/Pass3");
require("./lib/OBJLoader.js");

const glsl = require("glslify");
const simpleFrag = glsl.file("./shader/shader.frag");
const simpleVert = glsl.file("./shader/shader.vert");

//=============================================================================
// stast
//=============================================================================
const Stats = require("stats-js");
var stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms
stats.domElement.style.position = "absolute";
stats.domElement.style.left = "0px";
stats.domElement.style.top = "0px";
document.body.appendChild(stats.domElement);

//=============================================================================
// dat gui setting
//=============================================================================

const dat = require("dat.gui");
var Params = function() {
  this.uRadius = 2.6;
  this.blur = 0.1;
  this.blurXY = 0.003;
};
var params = new Params();
var gui = new dat.GUI();
gui.add(params, "uRadius", -10, 10);
gui.add(params, "blur", 0, 1);
gui.add(params, "blurXY", 0, 0.1);

function lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t;
}

//=============================================================================
// make sample protted in semi sphere
//=============================================================================

var kernelSize = 25;
var kernelData = [];

Array(kernelSize)
  .fill(0)
  .map((item, i) => {
    const tmp = new THREE.Vector3(
      Math.random() * 2.0 - 1.0,
      Math.random() * 2.0 - 1.0,
      Math.random()
    );
    tmp.normalize();

    let scale = i / kernelSize;
    scale = lerp(0.1, 1.0, scale * scale);
    tmp.x *= scale;
    tmp.y *= scale;
    tmp.z *= scale;
    kernelData.push(tmp);
  });

// debug points
// var starsGeometry = new THREE.Geometry();
// for ( var i = 0; i < kernelData.length; i ++ ) {
// 	var star = new THREE.Vector3();
// 	star.x = kernelData[i].x;
// 	star.y = kernelData[i].y;
// 	star.z = kernelData[i].z;
// 	starsGeometry.vertices.push( star );
// }
// var starsMaterial = new THREE.PointsMaterial( { size:0.03, color: 0x888888 } );
// var starField = new THREE.Points( starsGeometry, starsMaterial );
// scene.add( starField );

//=============================================================================
// make noise data texture for rotate semi-sphere sample randomly
//=============================================================================

const noiseWidth = 16;
const noiseHeight = 16;
var noiseSize = noiseWidth * noiseHeight;
var noiseData = new Float32Array(3 * noiseSize);
noiseData.forEach((item, i) => {
  const noise = new THREE.Vector3(
    Math.random() * 2.0 - 1.0,
    Math.random() * 2.0 - 1.0,
    0.0
  );
  noise.normalize();

  var stride = i * 3;
  noiseData[stride + 0] = noise.x;
  noiseData[stride + 1] = noise.y;
  noiseData[stride + 2] = noise.z;
});

var inputData2 = new Uint8Array(noiseData.buffer);
var noiseSample = new THREE.DataTexture(
  inputData2,
  noiseWidth,
  noiseHeight,
  THREE.RGBAFormat,
  THREE.UnsignedByteType
);
noiseSample.wrapS = noiseSample.wrapT = THREE.RepeatWrapping;
noiseSample.needsUpdate = true;

// debug noise texture
// var geoBox1 = new THREE.BoxGeometry(1,1,1);
// var matBox1 = new THREE.MeshBasicMaterial({
//     // wireframe: true,
//     color: 0xffffff,
//     side: THREE.DoubleSide,
//     map:noiseSample
// })
// var boxMesh1 = new THREE.Mesh(geoBox1, matBox1);
// scene.add(boxMesh1);

//=============================================================================
// make FBO to store normal & depth of a scene
//=============================================================================

const target = new THREE.WebGLRenderTarget(
  window.innerWidth,
  window.innerHeight
);
target.depthBuffer = true;
target.depthTexture = new THREE.DepthTexture();

//=============================================================================
// add Mesh to scene
//=============================================================================

var uniforms = {
  tDepth: { type: "t", value: target.depthTexture },
  tNoise: { type: "t", value: noiseSample }
};

var shaderMaterial = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: simpleVert,
  fragmentShader: simpleFrag
});
const boxes = [];
Array(25)
  .fill(0)
  .map((item, index) => {
    var geo = new THREE.TeapotBufferGeometry(1);
    // var geo = new THREE.TorusKnotGeometry( 1,0.3,100,16 );
    var box1 = new THREE.Mesh(geo, shaderMaterial);
    box1.position.x = (index % 5) * 1.1 - (1.1 * 5) / 2;
    box1.position.z = (index / 5) * 1.1 - (1.1 * 5) / 2;
    box1.rotation.y = 45;
    box1.scale.x = 0.5;
    box1.scale.y = 0.5;
    box1.scale.z = 0.5;
    scene.add(box1);
    boxes.push(box1);
  });

// var loader = new THREE.OBJLoader();
// loader.load(
//     'stanford-dragon2.obj',
//     function ( object ) {
//         object.traverse( function ( child ) {
//             if ( child instanceof THREE.Mesh ) {
//                 child.material = shaderMaterial;
//             }
//         } );

//         scene.add( object );
//         object.scale.x = 1.5;
//         object.scale.y = 1.5;
//         object.scale.z = 1.5;
//         object.position.y = -0.5;
//     }
// );

// var geoFloor = new THREE.BoxGeometry(10,0.01,10);
// var meshFloor = new THREE.Mesh(geoFloor, shaderMaterial);
// meshFloor.position.y = -0.5;
// scene.add(meshFloor);

//=============================================================================
// setup effect composer
//=============================================================================

let width = $(window).width();
let height = $(window).height();
const SIZE = 1024;
var tex1 = new THREE.WebGLRenderTarget(SIZE, SIZE, {
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  format: THREE.RGBAFormat
});
var tex1Composer = new THREE.EffectComposer(renderer, tex1);

var pass1 = new THREE.ShaderPass(THREE.Pass1);
tex1Composer.addPass(pass1);

pass1.uniforms.tDepth.value = target.depthTexture;
pass1.uniforms.tDiffuse2.value = target.texture;
pass1.uniforms.kernels.value = kernelData;
pass1.uniforms.tNoise.value = noiseSample;

var pass2 = new THREE.ShaderPass(THREE.Pass2);
// tex1Composer.addPass(pass2);

// var copyShader = new THREE.ShaderPass(THREE.CopyShader);
// copyShader.renderToScreen = true;
// tex1Composer.addPass(copyShader);

var tex2 = new THREE.WebGLRenderTarget(SIZE, SIZE, {
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  format: THREE.RGBAFormat
});
var tex2Composer = new THREE.EffectComposer(renderer, tex2);

let ren2 = new THREE.RenderPass(scene, camera);
tex2Composer.addPass(ren2);
// var ssaaRenderPass3 = new THREE.SSAARenderPass( scene, camera );
// ssaaRenderPass3.sampleLevel = 2;
// ssaaRenderPass.renderToScreen = true;
// tex2Composer.addPass( ssaaRenderPass3 );

var pass3 = new THREE.ShaderPass(THREE.Pass3);
pass3.uniforms.tDiffuse2.value = target.texture;
tex2Composer.addPass(pass3);

var copyShader2 = new THREE.ShaderPass(THREE.CopyShader);
copyShader2.renderToScreen = true;
tex2Composer.addPass(copyShader2);

function gussian() {
  var weight = new Array(10);
  var t = 0.0;
  var d = params.blur * 50.0;
  for (var i = 0; i < weight.length; i++) {
    var r = 1.0 + 2.0 * i;
    var w = Math.exp((-0.5 * (r * r)) / d);
    weight[i] = w;
    if (i > 0) {
      w *= 2.0;
    }
    t += w;
  }
  for (i = 0; i < weight.length; i++) {
    weight[i] /= t;
  }
  return weight;
}

//=============================================================================
// resize
//=============================================================================

window.addEventListener("resize", resize);
resize();
function resize() {
  let width = $(window).width();
  let height = $(window).height();

  const dpr = Math.min(1.0, window.devicePixelRatio);
  tex1Composer.setSize(width * dpr, height * dpr);

  const hdpr = Math.min(1.0, window.devicePixelRatio);
  tex2Composer.setSize(width * hdpr, height * hdpr);

  pass1.uniforms.aspect.value = width / height;
  pass1.uniforms.ww.value = width;
}

console.log(camera);
//=============================================================================
// render
//=============================================================================

let rl = 0.0;
rl += 0.01;

render();

function render() {
  stats.begin();

  rl += 0.003;
  if (rl > 6.28) rl -= 6.28;

  boxes.forEach((item, index) => {
    item.rotation.x = 5 * Math.sin(rl * (1 + (index % 3)));
    item.rotation.y = 2 * Math.sin(rl * (1 + (index % 4)));
    item.rotation.z = 5 * Math.sin(rl * (1 + (index % 5)));
  });

  pass2.uniforms.weight.value = gussian();
  pass2.uniforms.blurXY.value = params.blurXY;

  pass3.uniforms.weight.value = gussian();
  pass3.uniforms.blurXY.value = params.blurXY;
  pass3.uniforms.tSSAO.value = tex1.texture;
  pass3.uniforms.time.value += 0.01;

  pass1.uniforms.time.value += 0.01;
  pass1.uniforms.uFov.value = camera.fov;
  pass1.uniforms.uFar.value = camera.focus;
  pass1.uniforms.uRadius.value = params.uRadius;
  pass1.uniforms.prjMat.value = camera.projectionMatrix;

  requestAnimationFrame(render);

  // render scene into target
  renderer.render(scene, camera, target);
  tex1Composer.render();
  tex2Composer.render();

  stats.end();
}
